import { closeDialog, runDialogCallback } from '@/store/dialog.slice'
import { useAppDispatch, useAppSelector } from '@/hooks/useAppHooks'
import { IconDialog } from './IconDialog'
import { RootState } from '@/store'
import { ConfirmDialog } from './ConfirmDialog'

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
