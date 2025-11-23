import {
  ChartItemDto,
  ChartQueryDto,
  SummaryQueryDto,
  SummaryResponseDto,
  TopSoldItemDto,
} from '@/dto'

import { api } from './base'

export const reportApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSummary: builder.query<SummaryResponseDto, SummaryQueryDto>({
      query: (params) => ({
        url: 'reports/summary',
        params,
      }),
    }),
    getChart: builder.query<ChartItemDto[], ChartQueryDto>({
      query: (params) => ({
        url: 'reports/chart',
        params,
      }),
    }),
    getTopSold: builder.query<TopSoldItemDto[], SummaryQueryDto>({
      query: (params) => ({
        url: 'reports/top-sold',
        params,
      }),
    }),
  }),
  overrideExisting: false,
})

export const { useGetSummaryQuery, useGetChartQuery, useGetTopSoldQuery } =
  reportApi
