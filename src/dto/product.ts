import { z } from 'zod'

import {
  dateSchema,
  integerSchema,
  parseIntegerSchema,
  requiredStringSchema,
} from '@/utils'

import { UnitDtoSchema } from './unit'

export interface FilesUploadDto {
  files: never[]
}

export const CategoryDtoSchema = z.object({
  id: requiredStringSchema('id'),
  name: requiredStringSchema('tên danh mục'),
  picture: requiredStringSchema('ảnh đại diện').nullish(),
  productCount: z.number().int().default(0),
})

export type CategoryDto = z.infer<typeof CategoryDtoSchema>

export const CreateProductDtoSchema = z.object({
  name: requiredStringSchema('tên sản phẩm'),
  description: z.string().nullish(),
  categories: z.array(z.string()).nullish().default([]),
  units: z.array(UnitDtoSchema).nullish(),
  price: parseIntegerSchema('Giá'),
  basePrice: parseIntegerSchema('Giá gốc').nullish(),
  quantity: parseIntegerSchema('Số lượng').nullish(),
  barcode: z.string().nullish(),
  baseUnit: z.string().nullish(),
})

export type CreateProductDto = z.infer<typeof CreateProductDtoSchema>

export const UpdateProductDtoSchema = z.object({
  id: requiredStringSchema('id'),
  name: z.string().nullish(),
  description: z.string().nullish(),
  categories: z.array(z.string()).nullish(),
  units: z.array(UnitDtoSchema).nullish(),
  price: parseIntegerSchema('Giá').nullish(),
  basePrice: parseIntegerSchema('Giá gốc').nullish(),
  quantity: parseIntegerSchema('Số lượng').nullish(),
  barcode: z.string().nullish(),
  baseUnit: z.string().nullish(),
  enabled: z.boolean().nullish(),
})

export type UpdateProductDto = z.infer<typeof UpdateProductDtoSchema>

export const ProductDtoSchema = z.object({
  id: requiredStringSchema('id'),
  name: requiredStringSchema('tên sản phẩm'),
  description: z.string().nullish(),
  categories: z.array(z.string()).nullish(),
  units: z.array(UnitDtoSchema).nullish(),
  price: integerSchema('Giá'),
  basePrice: integerSchema('Giá gốc').nullish(),
  quantity: integerSchema('Số lượng').nullish(),
  barcode: z.string().nullish(),
  baseUnit: z.string().nullish(),
  enabled: z.boolean(),
  pictures: z.array(z.string()).nullish(),
  createdAt: dateSchema('Ngày tạo'),
  updatedAt: dateSchema('Ngày cập nhật'),
})

export type ProductDto = z.infer<typeof ProductDtoSchema>

export const GetProductsQueryDtoSchema = z.object({
  offset: z.number().int().default(0).nullish(),
  limit: z.number().int().default(10).nullish(),
  sortBy: z.string().nullish(),
  name: z.string().nullish(),
  priceFrom: z.number().int().nullish(),
  priceTo: z.number().int().nullish(),
  categories: z.string().nullish(),
})

export type GetProductsQueryDto = z.infer<typeof GetProductsQueryDtoSchema>
