import { z } from 'zod'

import { booleanSchema, integerSchema, requiredStringSchema } from '@/utils'

export const UnitDtoSchema = z
  .object({
    name: requiredStringSchema('tên đơn vị'),
    price: integerSchema('Giá'),
    enabled: booleanSchema('Trạng thái'),
    weight: integerSchema('Trọng số').nullish(),
    fractionalWeight: integerSchema('Trọng số phân số').nullish(),
  })
  .refine(
    (data) => data.weight !== undefined || data.fractionalWeight !== undefined,
    {
      message: 'Phải nhập ít nhất một trong hai trọng số',
      path: ['weight', 'fractionalWeight'],
    }
  )

export type UnitDto = z.infer<typeof UnitDtoSchema>
