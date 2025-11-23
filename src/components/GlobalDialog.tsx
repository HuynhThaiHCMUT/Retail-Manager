import { useAppDispatch, useAppSelector } from '@/hooks/useAppHooks'
import { RootState, closeDialog, runDialogCallback } from '@/store'

import { ConfirmDialog } from './ConfirmDialog'
import { IconDialog } from './IconDialog'

export function GlobalDialog() {
  const dispatch = useAppDispatch()
  const dialogState = useAppSelector((state: RootState) => state.dialog)

  const close = () => {
    dispatch(closeDialog())
    runDialogCallback('onDialogClose')
  }

  const confirm = () => {
    runDialogCallback('onDialogConfirm')
    close()
  }

  if (dialogState.type == 'confirm') {
    return (
      <ConfirmDialog {...dialogState} onClose={close} onConfirm={confirm} />
    )
  }

  return <IconDialog {...dialogState} onClose={close} />
}
