import { ThemeName } from 'tamagui'

import { GetOrdersQueryDto, GetProductsQueryDto } from '@/dto'

export const SORT_OPTIONS = [
  { label: 'Mới nhất', value: 'time' },
  { label: 'Giá: Thấp đến cao', value: 'price-asc' },
  { label: 'Giá: Cao đến thấp', value: 'price-desc' },
]

export const ORDER_STATUS = {
  PENDING: 'Chờ xác nhận',
  CONFIRMED: 'Đã xác nhận',
  CANCELLED: 'Đã hủy',
  DONE: 'Hoàn thành',
}

export const ORDER_STATUS_COLORS: Record<string, ThemeName> = {
  PENDING: 'yellow',
  CONFIRMED: 'blue',
  CANCELLED: 'red',
  DONE: 'green',
}

export const BASE_PRODUCT_QUERY: Readonly<GetProductsQueryDto> = {
  name: undefined,
  categories: undefined,
  offset: 0,
  limit: 10,
  sortBy: 'time',
  priceFrom: undefined,
  priceTo: undefined,
}

export const BASE_ORDER_QUERY: Readonly<GetOrdersQueryDto> = {
  status: undefined,
  offset: 0,
  limit: 10,
  sortBy: 'time',
  totalFrom: undefined,
  totalTo: undefined,
}
