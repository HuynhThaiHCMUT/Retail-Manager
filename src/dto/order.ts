import { z } from 'zod'

import {
  OrderStatus,
  dateSchema,
  emailSchema,
  integerSchema,
  orderStatusSchema,
  phoneSchema,
  requiredStringSchema,
} from '@/utils'

import {
  CreateOrderProductDtoSchema,
  OrderProductDtoSchema,
  UpdateOrderProductDtoSchema,
} from './order-product'

export const CreatePOSOrderDtoSchema = z.object({
  products: z.array(CreateOrderProductDtoSchema),
})

export type CreatePOSOrderDto = z.infer<typeof CreatePOSOrderDtoSchema>

export const CreateOnlineOrderDtoSchema = CreatePOSOrderDtoSchema.extend({
  customerId: z.string().nullish(),
  address: z.string().nullish(),
  phone: phoneSchema.nullish(),
  email: emailSchema.nullish(),
  customerName: z.string().nullish(),
})

export type CreateOnlineOrderDto = z.infer<typeof CreateOnlineOrderDtoSchema>

export const UpdateOrderDtoSchema = z.object({
  id: requiredStringSchema('id'),
  status: orderStatusSchema.nullish(),
  address: z.string().nullish(),
  phone: phoneSchema.nullish(),
  email: emailSchema.nullish(),
  customerName: z.string().nullish(),
  products: z
    .array(z.union([CreateOrderProductDtoSchema, UpdateOrderProductDtoSchema]))
    .nullish(),
})

export type UpdateOrderDto = z.infer<typeof UpdateOrderDtoSchema>

export const OrderDtoSchema = z.object({
  id: requiredStringSchema('id'),
  name: requiredStringSchema('Tên đơn hàng'),
  status: orderStatusSchema,
  total: integerSchema('Tổng tiền'),
  createdAt: dateSchema('Ngày tạo'),
  updatedAt: dateSchema('Ngày cập nhật'),
  staffId: z.string().nullish(),
  products: z.array(OrderProductDtoSchema),
  customerId: z.string().nullish(),
  address: z.string().nullish(),
  phone: phoneSchema.nullish(),
  email: emailSchema.nullish(),
  customerName: z.string().nullish(),
})

export type OrderDto = z.infer<typeof OrderDtoSchema>

export const GetOrdersQueryDtoSchema = z.object({
  offset: z.number().int().default(0).nullish(),
  limit: z.number().int().default(10).nullish(),
  sortBy: z.string().nullish(),
  totalFrom: z.number().int().nullish(),
  totalTo: z.number().int().nullish(),
  status: z.nativeEnum(OrderStatus).nullish(),
})

export type GetOrdersQueryDto = z.infer<typeof GetOrdersQueryDtoSchema>
