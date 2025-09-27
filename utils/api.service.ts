import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react'
import { Mutex } from 'async-mutex'
import { Platform } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as SecureStore from 'expo-secure-store'
import { RootState } from './store'
import { removeUser, setUser } from './auth.slice'
import { AuthDto, AuthDtoSchema, SignInDto, SignUpDto } from '../dto/auth.dto'
import { ApiError } from '../dto/error.dto'
import {
  CreateUserDto,
  UpdateUserDto,
  UserDto,
  UserDtoSchema,
} from '../dto/user.dto'
import {
  CreateProductDto,
  GetProductsQueryDto,
  ProductDto,
  ProductDtoSchema,
  UpdateProductDto,
} from '../dto/product.dto'
import {
  CreateOnlineOrderDto,
  CreatePOSOrderDto,
  OrderDto,
  UpdateOrderDto,
} from '../dto/order.dto'
import { ZodObject } from 'zod'
import { ImagePickerAsset } from 'expo-image-picker'
import {
  ChartQueryDto,
  ChartItemDto,
  SummaryQueryDto,
  SummaryResponseDto,
  TopSoldItemDto,
} from '@/dto/report.dto'

const mutex = new Mutex()

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.EXPO_PUBLIC_SERVER_HOST,
  timeout: 20000,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.user.token
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
    headers.set('Content-Type', 'application/json')
    headers.set('Accept', 'application/json')
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
        api.dispatch(setUser(result.data as AuthDto))
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

const api = createApi({
  reducerPath: 'api',
  baseQuery: customQuery,

  tagTypes: ['User', 'Product', 'Order'],
  endpoints: (builder) => ({
    signIn: builder.mutation<AuthDto, SignInDto>({
      query: (body) => ({
        url: 'auth/sign-in',
        method: 'POST',
        body,
      }),
      extraOptions: {
        responseSchema: AuthDtoSchema,
      },
    }),
    signUp: builder.mutation<AuthDto, SignUpDto>({
      query: (body) => ({
        url: 'auth/sign-up',
        method: 'POST',
        body,
      }),
      extraOptions: {
        responseSchema: AuthDtoSchema,
      },
    }),
    getUsers: builder.query<UserDto[], void>({
      query: () => 'users',
      providesTags: ['User'],
      extraOptions: {
        responseSchema: UserDtoSchema,
      },
    }),
    getUser: builder.query<UserDto, string>({
      query: (id) => `users/${id}`,
      providesTags: ['User'],
      extraOptions: {
        responseSchema: UserDtoSchema,
      },
    }),
    createUser: builder.mutation<UserDto, CreateUserDto>({
      query: (body) => ({
        url: 'users',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User'],
      extraOptions: {
        responseSchema: UserDtoSchema,
      },
    }),
    updateUser: builder.mutation<UserDto, UpdateUserDto>({
      query: (body) => ({
        url: `users/${body.id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['User'],
      extraOptions: {
        responseSchema: UserDtoSchema,
      },
    }),
    deleteUser: builder.mutation<void, string>({
      query: (id) => ({
        url: `users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
    getProducts: builder.query<ProductDto[], GetProductsQueryDto>({
      query: (params) => ({
        url: 'products',
        params: params,
      }),
      providesTags: ['Product'],
      extraOptions: {
        responseSchema: ProductDtoSchema,
      },
    }),
    getProduct: builder.query<ProductDto, string>({
      query: (id) => `products/${id}`,
      providesTags: ['Product'],
      extraOptions: {
        responseSchema: ProductDtoSchema,
      },
    }),
    createProduct: builder.mutation<ProductDto, CreateProductDto>({
      query: (body) => ({
        url: 'products',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Product'],
      extraOptions: {
        responseSchema: ProductDtoSchema,
      },
    }),
    updateProduct: builder.mutation<ProductDto, UpdateProductDto>({
      query: (body) => ({
        url: `products/${body.id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Product'],
      extraOptions: {
        responseSchema: ProductDtoSchema,
      },
    }),
    deleteProduct: builder.mutation<void, string>({
      query: (id) => ({
        url: `products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product'],
    }),
    uploadProductImages: builder.mutation<
      string[],
      { id: string; files: ImagePickerAsset[] }
    >({
      query: ({ id, files }) => {
        const formData = new FormData()

        files.forEach((file, idx) => {
          formData.append('files', {
            uri: file.uri,
            name: file.fileName,
            type: file.mimeType,
          } as any)
        })

        return {
          url: `/products/${id}/pictures`,
          method: 'POST',
          body: formData,
        }
      },
    }),
    getCategories: builder.query<string[], void>({
      query: () => 'categories',
      providesTags: ['Product'],
    }),
    getOrders: builder.query<OrderDto[], void>({
      query: () => 'orders',
      providesTags: ['Order'],
    }),
    getOrder: builder.query<OrderDto, string>({
      query: (id) => `orders/${id}`,
      providesTags: ['Order'],
    }),
    createOnlineOrder: builder.mutation<OrderDto, CreateOnlineOrderDto>({
      query: (body) => ({
        url: 'orders/online',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Order'],
    }),
    createPOSOrder: builder.mutation<OrderDto, CreatePOSOrderDto>({
      query: (body) => ({
        url: 'orders/pos',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Order'],
    }),
    updateOrder: builder.mutation<OrderDto, UpdateOrderDto>({
      query: (body) => ({
        url: `orders/${body.id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Order'],
    }),
    deleteOrder: builder.mutation<void, string>({
      query: (id) => ({
        url: `orders/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Order'],
    }),
    getSummary: builder.query<SummaryResponseDto, SummaryQueryDto>({
      query: (params) => ({
        url: 'reports/summary',
        params,
      }),
    }),
    getChart: builder.query<ChartItemDto[], ChartQueryDto>({
      query: (params) => ({
        url: 'reports/chart',
        params,
      }),
    }),
    getTopSold: builder.query<TopSoldItemDto[], SummaryQueryDto>({
      query: (params) => ({
        url: 'reports/top-sold',
        params,
      }),
    }),
  }),
})

export const {
  useSignInMutation,
  useSignUpMutation,
  useGetUsersQuery,
  useGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUploadProductImagesMutation,
  useGetCategoriesQuery,
  useGetOrdersQuery,
  useGetOrderQuery,
  useCreateOnlineOrderMutation,
  useCreatePOSOrderMutation,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
  useGetSummaryQuery,
  useGetChartQuery,
  useGetTopSoldQuery,
} = api
export default api
