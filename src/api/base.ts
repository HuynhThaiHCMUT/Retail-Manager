import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react'
import { Mutex } from 'async-mutex'
import * as SecureStore from 'expo-secure-store'
import { Platform } from 'react-native'
import { ZodObject } from 'zod'

import { ApiError, AuthDto } from '@/dto'
import type { RootState } from '@/store'
import { removeUser, setToken } from '@/store/auth'

const mutex = new Mutex()

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.EXPO_PUBLIC_SERVER_HOST,
  timeout: 20000,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.user.token
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
    return headers
  },
})

const customQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError,
  { responseSchema?: ZodObject<any, any, any> }
> = async (args, api, extraOptions) => {
  await mutex.waitForUnlock()
  let result = await baseQuery(args, api, extraOptions)
  // Handle token expiration
  if (
    result.error &&
    result.error.status === 401 &&
    (result.error.data as ApiError).code === 'EXPIRED_TOKEN'
  ) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire()
      result = await baseQuery(
        {
          url: 'auth/refresh',
          method: 'POST',
          body: {
            token: (api.getState() as RootState).auth.user.refreshToken,
            userId: (api.getState() as RootState).auth.user.id,
          },
        },
        api,
        extraOptions
      )
      if (result.data) {
        api.dispatch(setToken(result.data as AuthDto))
        release()
        return await baseQuery(args, api, extraOptions)
      } else {
        release()
        setTimeout(async () => {
          if (Platform.OS == 'ios' || Platform.OS == 'android') {
            await SecureStore.deleteItemAsync('token')
            await SecureStore.deleteItemAsync('refreshToken')
          } else {
            await AsyncStorage.removeItem('token')
            await AsyncStorage.removeItem('refreshToken')
          }
          api.dispatch(removeUser())
        }, 3000)
      }
    } else {
      await mutex.waitForUnlock()
      return await baseQuery(args, api, extraOptions)
    }
  }
  if (extraOptions?.responseSchema) {
    const { responseSchema } = extraOptions
    if (result.data) {
      try {
        if (Array.isArray(result.data)) {
          result.data = result.data.map((item) => responseSchema.parse(item))
        } else {
          result.data = responseSchema.parse(result.data)
        }
      } catch (error) {
        console.error('Validation error:', error)
        return {
          error: {
            status: 500,
            data: {
              code: 'INVALID_DATA',
              message: 'Dữ liệu không hợp lệ',
            },
          },
        }
      }
    }
  }
  return result
}

export const api = createApi({
  reducerPath: 'api',
  baseQuery: customQuery,

  tagTypes: ['User', 'Product', 'Order'],
  endpoints: () => ({}),
})
