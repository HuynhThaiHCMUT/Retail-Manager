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
  currentRecord: z.any().nullish(),
})

export type AuditLogDto = z.infer<typeof AuditLogDtoSchema>

export const GetAuditLogsByEntityQuerySchema = z.object({
  offset: z.number().int().default(0).nullish(),
  limit: z.number().int().default(10).nullish(),
  module: z.string(),
  id: z.string(),
})

export type GetAuditLogsByEntityQueryDto = z.infer<
  typeof GetAuditLogsByEntityQuerySchema
>

export const GetAuditLogsQuerySchema = z.object({
  offset: z.number().int().default(0).nullish(),
  limit: z.number().int().default(10).nullish(),
  module: z.string().nullish(),
})

export type GetAuditLogsQueryDto = z.infer<typeof GetAuditLogsQuerySchema>
