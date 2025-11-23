import { z } from 'zod'

import { dateSchema, requiredStringSchema } from '@/utils'

export const AuditLogDtoSchema = z.object({
  id: requiredStringSchema('id'),
  module: requiredStringSchema('bảng ghi'),
  recordId: requiredStringSchema('id dữ liệu'),
  fieldName: requiredStringSchema('trường dữ liệu'),
  oldValue: requiredStringSchema('giá trị cũ'),
  newValue: requiredStringSchema('giá trị mới'),
  changedBy: requiredStringSchema('tên người thay đổi'),
  changedAt: dateSchema('Ngày thay đổi'),
})

export type AuditLogDto = z.infer<typeof AuditLogDtoSchema>
