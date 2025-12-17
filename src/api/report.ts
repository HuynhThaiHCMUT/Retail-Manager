import {
  AuditLogDto,
  ChartItemDto,
  ChartQueryDto,
  GetAuditLogsByEntityQueryDto,
  GetAuditLogsQueryDto,
  SummaryQueryDto,
  SummaryResponseDto,
  TopSoldItemDto,
} from '@/dto'
import { PartialList } from '@/utils'

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
    getLogs: builder.query<PartialList<AuditLogDto>, GetAuditLogsQueryDto>({
      query: (params) => ({
        url: `audit-logs`,
        params,
      }),
      serializeQueryArgs: ({ endpointName, queryArgs }) =>
        endpointName +
        JSON.stringify({
          sortBy: queryArgs.module,
        }),
      merge: (currentCache, data, { arg }) => {
        if (arg.offset === 0) {
          currentCache.items = data.items ?? []
        } else if (
          data.items &&
          !currentCache.items.find((item) => item.id === data.items?.[0]?.id)
        ) {
          currentCache.items.push(...(data.items ?? []))
        }
        currentCache.totalCount = data.totalCount
      },
      forceRefetch({ currentArg, previousArg }) {
        if (!previousArg) return true
        const resetChanged =
          currentArg?.limit !== previousArg?.limit ||
          currentArg?.module !== previousArg?.module

        const offsetChanged = currentArg?.offset !== previousArg?.offset

        return resetChanged || offsetChanged
      },
    }),
    getLogsByEntity: builder.query<
      PartialList<AuditLogDto>,
      GetAuditLogsByEntityQueryDto
    >({
      query: ({ module, id }) => ({
        url: `audit-logs/${module}/${id}`,
      }),
      serializeQueryArgs: ({ endpointName, queryArgs }) =>
        endpointName +
        JSON.stringify({
          sortBy: queryArgs.module,
        }),
      merge: (currentCache, data, { arg }) => {
        if (arg.offset === 0) {
          currentCache.items = data.items ?? []
        } else if (
          data.items &&
          !currentCache.items.find((item) => item.id === data.items?.[0]?.id)
        ) {
          currentCache.items.push(...(data.items ?? []))
        }
        currentCache.totalCount = data.totalCount
      },
      forceRefetch({ currentArg, previousArg }) {
        if (!previousArg) return true
        const resetChanged =
          currentArg?.limit !== previousArg?.limit ||
          currentArg?.module !== previousArg?.module

        const offsetChanged = currentArg?.offset !== previousArg?.offset

        return resetChanged || offsetChanged
      },
    }),
  }),
  overrideExisting: false,
})

export const {
  useGetSummaryQuery,
  useGetChartQuery,
  useGetTopSoldQuery,
  useGetLogsQuery,
  useGetLogsByEntityQuery,
} = reportApi
