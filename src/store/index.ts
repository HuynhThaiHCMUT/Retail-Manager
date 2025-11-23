import { configureStore } from '@reduxjs/toolkit'

import { api } from '@/api'

import authReducer from './auth'
import dialogReducer from './dialog'
import orderReducer from './order'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dialog: dialogReducer,
    order: orderReducer,
    api: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export * from './auth'
export * from './dialog'
export * from './order'
