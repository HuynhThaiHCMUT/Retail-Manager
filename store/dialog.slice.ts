import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type DialogType = 'icon' | 'confirm'
export type DialogVariant = 'error' | 'info' | 'warning' | 'success'

export interface DialogState {
  open: boolean
  type?: DialogType
  variant?: DialogVariant
  title?: string
  message?: string
  confirmLabel?: string
  cancelLabel?: string
}

export interface DialogProps extends DialogState {
  onConfirm?: () => void
  onClose?: () => void
}

const callbackRegistry: Record<string, () => void> = {}

export const registerDialogCallback = (key: string, callback: () => void) => {
  callbackRegistry[key] = callback
}

export const runDialogCallback = (key: string) => {
  callbackRegistry[key]?.()
  delete callbackRegistry[key]
}

const initialState: DialogState = { open: false }

const dialogSlice = createSlice({
  name: 'dialog',
  initialState,
  reducers: {
    openDialog: (state, action: PayloadAction<Omit<DialogState, 'open'>>) => {
      state.open = true
      state.type = action.payload.type || 'icon'
      state.variant = action.payload.variant || 'info'
      state.title = action.payload.title
      state.message = action.payload.message
      state.confirmLabel = action.payload.confirmLabel || 'Xác nhận'
      state.cancelLabel = action.payload.cancelLabel || 'Huỷ'
    },
    closeDialog: (state) => {
      state.open = false
      state.type = undefined
      state.variant = undefined
      state.title = undefined
      state.message = undefined
      state.confirmLabel = undefined
      state.cancelLabel = undefined
    },
  },
})

export const { openDialog, closeDialog } = dialogSlice.actions
export default dialogSlice.reducer
