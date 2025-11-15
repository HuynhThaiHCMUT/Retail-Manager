// hooks/useConfirmAction.tsx
import { useCallback } from 'react'
import { useAppDispatch } from '@/hooks/useAppHooks'
import { registerDialogCallback, openDialog } from '@/store/dialog.slice'
import handleError from '@/utils/error-handler'

type UseConfirmActionOptions = {
  confirmTitle?: string
  confirmMessage?: string
  confirmVariant?: 'warning' | 'info' | 'danger' | 'primary'
  successTitle?: string
  errorTitle?: string
}

/**
 * useConfirmAction:
 * - execute: async fn that performs the action (e.g. delete)
 * - options: dialog titles/messages
 *
 * returns: askConfirm(execute) -> triggers confirm dialog and registers callback
 */
export function useConfirmAction(options?: UseConfirmActionOptions) {
  const dispatch = useAppDispatch()

  const askConfirm = useCallback(
    (execute: () => Promise<any>, callbacks?: { onSuccess?: () => void }) => {
      // register the dialog confirm callback
      registerDialogCallback('onDialogConfirm', async () => {
        try {
          const result = await execute()
          if ('error' in result) {
            dispatch(
              openDialog({
                variant: 'error',
                title: options?.errorTitle ?? 'Thao tác thất bại',
                message: handleError(result.error),
              })
            )
            return
          }

          dispatch(
            openDialog({
              variant: 'success',
              title: options?.successTitle ?? 'Thao tác thành công',
            })
          )

          if (callbacks?.onSuccess) callbacks.onSuccess()
        } catch (err) {
          dispatch(
            openDialog({
              variant: 'error',
              title: options?.errorTitle ?? 'Lỗi không xác định',
              message: 'Vui lòng thử lại',
            })
          )
        }
      })

      // open confirm dialog
      dispatch(
        openDialog({
          type: 'confirm',
          variant: (options?.confirmVariant as any) ?? 'warning',
          title: options?.confirmTitle ?? 'Xác nhận',
          message:
            options?.confirmMessage ??
            'Bạn có chắc chắn muốn thực hiện thao tác này?',
        })
      )
    },
    [dispatch, options]
  )

  return { askConfirm }
}
