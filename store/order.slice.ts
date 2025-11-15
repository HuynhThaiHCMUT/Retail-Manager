import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface OrderProductItemDto {
  id: string
  name: string
  quantity: number
  unit: string
  price: number
  total: number
}

interface OrderState {
  items: OrderProductItemDto[]
  total: number
}

const initialState: OrderState = {
  items: [],
  total: 0,
}

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<OrderProductItemDto>) => {
      const existing = state.items.find(
        (i) => i.id === action.payload.id && i.unit === action.payload.unit
      )
      if (existing) {
        existing.quantity += action.payload.quantity
      } else {
        state.items.push(action.payload)
      }
      state.total = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      )
    },
    removeItem: (
      state,
      action: PayloadAction<{ id: string; unit: string }>
    ) => {
      state.items = state.items.filter(
        (i) => !(i.id === action.payload.id && i.unit === action.payload.unit)
      )
      state.total = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      )
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ id: string; unit?: string; delta: number }>
    ) => {
      const item = state.items.find(
        (i) => i.id === action.payload.id && i.unit === action.payload.unit
      )
      if (item) {
        item.quantity = Math.max(1, item.quantity + action.payload.delta)
        item.total = item.price * item.quantity
        // Update total price of the order
        state.total = state.items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        )
      }
    },
    updateUnit: (
      state,
      action: PayloadAction<{
        id: string
        oldUnit: string
        newUnit: string
        price: number
      }>
    ) => {
      const item = state.items.find(
        (i) => i.id === action.payload.id && i.unit === action.payload.oldUnit
      )
      if (item) {
        item.unit = action.payload.newUnit
        item.price = action.payload.price
        item.total = item.price * item.quantity
        // Update total price of the order
        state.total = state.items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        )
      }
    },
    clearOrder: (state) => {
      state.items = []
      state.total = 0
    },
  },
})

export const { addItem, removeItem, updateQuantity, updateUnit, clearOrder } =
  orderSlice.actions
export default orderSlice.reducer
