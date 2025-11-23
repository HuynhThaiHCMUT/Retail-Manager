import { z } from 'zod'

import {
  emailSchema,
  passwordSchema,
  phoneSchema,
  requiredStringSchema,
  roleSchema,
} from '@/utils'

export const SignInDtoSchema = z.object({
  phone: phoneSchema,
  password: passwordSchema,
})

export type SignInDto = z.infer<typeof SignInDtoSchema>

export const SignUpDtoSchema = z
  .object({
    name: requiredStringSchema('tên'),
    password: passwordSchema,
    confirmPassword: passwordSchema,
    email: emailSchema.nullish(),
    phone: phoneSchema,
    role: roleSchema.nullish(),
  })
  .superRefine((data, ctx) => {
    if (data.confirmPassword !== data.password) {
      ctx.addIssue({
        code: 'custom',
        message: 'Mật khẩu không khớp',
        path: ['confirmPassword'],
      })
    }
  })

export type SignUpDto = z.infer<typeof SignUpDtoSchema>

export const AuthDtoSchema = z.object({
  id: requiredStringSchema('id'),
  name: requiredStringSchema('tên'),
  role: roleSchema,
  phone: phoneSchema,
  email: emailSchema.nullish(),
  token: requiredStringSchema('token'),
  refreshToken: requiredStringSchema('refresh token'),
})

export type AuthDto = z.infer<typeof AuthDtoSchema>

export const RefreshTokenDtoSchema = z.object({
  token: requiredStringSchema('token'),
  userId: requiredStringSchema('userId'),
})

export type RefreshTokenDto = z.infer<typeof RefreshTokenDtoSchema>

export const NewTokenDtoSchema = z.object({
  token: requiredStringSchema('token'),
  refreshToken: requiredStringSchema('refreshToken'),
})

export type NewTokenDto = z.infer<typeof NewTokenDtoSchema>
