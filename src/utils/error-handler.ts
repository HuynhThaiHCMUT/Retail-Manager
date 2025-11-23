import { SerializedError } from '@reduxjs/toolkit'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'

import { ApiError } from '@/dto'

export const handleError = (
  error: FetchBaseQueryError | SerializedError | undefined
): string => {
  if (!error) return ''
  console.error(error)
  if ('name' in error) {
    if (error.name == 'AbortError') {
      return 'Không thể kết nối đến máy chủ, vui lòng thử lại sau'
    }
  }
  if (
    'status' in error &&
    'data' in error &&
    typeof error.data === 'object' &&
    'message' in (error.data as ApiError)
  ) {
    return (error.data as ApiError).message
  }
  return 'Đã xảy ra lỗi, vui lòng thử lại sau'
}
