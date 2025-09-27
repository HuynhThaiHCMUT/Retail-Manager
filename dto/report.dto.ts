export type RangeType = 'day' | 'week' | 'month'
export type MetricType = 'revenue' | 'profit' | 'orders' | 'products'

export type SummaryQueryDto = {
  range: RangeType
  date?: string
}

export type ChartQueryDto = {
  metric: MetricType
  range: RangeType
  date?: string
}

export type SummaryResponseDto = {
  revenue: number
  profit: number
  ordersCount: number
  productsCount: number
}

export type ChartItemDto = {
  label: string
  value: number
}

export type TopSoldItemDto = {
  productId: string
  productName: string
  amountSold: number
}
