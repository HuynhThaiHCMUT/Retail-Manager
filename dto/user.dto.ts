import { z } from 'zod'
import {
  dateSchema,
  emailSchema,
  passwordSchema,
  phoneSchema,
  requiredStringSchema,
  roleSchema,
} from '@/utils/schema'

export interface FileUploadDto {
  file: any
}

export const CreateUserDtoSchema = z.object({
  name: requiredStringSchema('tên người dùng'),
  password: passwordSchema,
  email: emailSchema.nullish(),
  phone: phoneSchema,
  role: roleSchema.nullish(),
  picture: z.string().nullish(),
})

export type CreateUserDto = z.infer<typeof CreateUserDtoSchema>

export const UpdateUserDtoSchema = z.object({
  id: requiredStringSchema('id'),
  name: z.string().nullish(),
  password: passwordSchema.nullish(),
  email: emailSchema.nullish(),
  phone: phoneSchema.nullish(),
  role: roleSchema.nullish(),
  picture: z.string().nullish(),
})

export type UpdateUserDto = z.infer<typeof UpdateUserDtoSchema>

export const UserDtoSchema = z.object({
  id: requiredStringSchema('id'),
  name: requiredStringSchema('tên người dùng'),
  email: emailSchema.nullish(),
  phone: phoneSchema,
  role: roleSchema,
  picture: z.string().nullish(),
  createdAt: dateSchema('Ngày tạo'),
  updatedAt: dateSchema('Ngày cập nhật'),
})

export type UserDto = z.infer<typeof UserDtoSchema>
