import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AuthDto, NewTokenDto } from '../dto/auth.dto'
import * as SecureStore from 'expo-secure-store'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Platform } from 'react-native'

type Nullable<T> = {
  [K in keyof T]: T[K] | null
}

interface AuthState {
  user: Nullable<AuthDto>
  isLoading: boolean
}

const initialState: AuthState = {
  user: {
    id: null,
    name: null,
    role: null,
    phone: null,
    token: null,
    refreshToken: null,
    email: null,
  },
  isLoading: true,
}

async function getSavedUser() {
  let userString = null
  if (Platform.OS == 'ios' || Platform.OS == 'android') {
    userString = await SecureStore.getItemAsync('user')
  } else {
    userString = await AsyncStorage.getItem('user')
  }
  if (userString) {
    return JSON.parse(userString)
  } else {
    return {
      id: null,
      name: null,
      role: null,
      phone: null,
      token: null,
      refreshToken: null,
      email: null,
    }
  }
}

async function updateSavedUser(user: Nullable<AuthDto>) {
  if (Platform.OS == 'ios' || Platform.OS == 'android') {
    await SecureStore.setItemAsync('user', JSON.stringify(user))
  } else {
    await AsyncStorage.setItem('user', JSON.stringify(user))
  }
}

async function removeSavedUser() {
  if (Platform.OS == 'ios' || Platform.OS == 'android') {
    await SecureStore.deleteItemAsync('user')
  } else {
    await AsyncStorage.removeItem('user')
  }
}

export const restoreUser = createAsyncThunk('auth/restoreUser', async () => {
  return await getSavedUser()
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    restoreUser: (state) => {
      getSavedUser().then((user) => {
        state.user = user
        state.isLoading = false
      })
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setUser: (state, action: PayloadAction<AuthDto>) => {
      state.user = action.payload
      if (state.user?.token) {
        updateSavedUser(state.user)
      }
    },
    setToken: (state, action: PayloadAction<NewTokenDto>) => {
      state.user.token = action.payload.token
      state.user.refreshToken = action.payload.refreshToken
      updateSavedUser(state.user)
    },
    removeUser: (state) => {
      state.user = {
        id: null,
        name: null,
        role: null,
        phone: null,
        token: null,
        refreshToken: null,
        email: null,
      }
      removeSavedUser()
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(restoreUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(restoreUser.fulfilled, (state, action) => {
        state.user = action.payload
        state.isLoading = false
      })
      .addCase(restoreUser.rejected, (state) => {
        state.user = {
          id: null,
          name: null,
          role: null,
          phone: null,
          token: null,
          refreshToken: null,
          email: null,
        }
        state.isLoading = false
      })
  },
})

export const { setLoading, setUser, setToken, removeUser } = authSlice.actions

export default authSlice.reducer
