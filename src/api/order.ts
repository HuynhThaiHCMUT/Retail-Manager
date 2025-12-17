import {
  CreateOnlineOrderDto,
  CreatePOSOrderDto,
  GetOrdersQueryDto,
  OrderDto,
  UpdateOrderDto,
} from '@/dto'
import { PartialList } from '@/utils'

import { api } from './base'

export const ordersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query<PartialList<OrderDto>, GetOrdersQueryDto>({
      query: (params) => ({
        url: 'orders',
        params,
      }),
      providesTags: ['Order'],
      serializeQueryArgs: ({ endpointName, queryArgs }) =>
        endpointName +
        JSON.stringify({
          sortBy: queryArgs.sortBy,
          totalFrom: queryArgs.totalFrom,
          totalTo: queryArgs.totalTo,
          status: queryArgs.status,
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
          currentArg?.sortBy !== previousArg?.sortBy ||
          currentArg?.totalFrom !== previousArg?.totalFrom ||
          currentArg?.totalTo !== previousArg?.totalTo ||
          currentArg?.status !== previousArg?.status

        const offsetChanged = currentArg?.offset !== previousArg?.offset

        return resetChanged || offsetChanged
      },
    }),
    getOrder: builder.query<OrderDto, string>({
      query: (id) => `orders/${id}`,
      providesTags: ['Order'],
    }),
    createOnlineOrder: builder.mutation<OrderDto, CreateOnlineOrderDto>({
      query: (body) => ({
        url: 'orders/online',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Order'],
    }),
    createPOSOrder: builder.mutation<OrderDto, CreatePOSOrderDto>({
      query: (body) => ({
        url: 'orders/pos',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Order'],
    }),
    updateOrder: builder.mutation<OrderDto, UpdateOrderDto>({
      query: (body) => ({
        url: `orders/${body.id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Order'],
    }),
    closeOrder: builder.mutation<OrderDto, string>({
      query: (param) => ({
        url: `orders/${param}/close`,
        method: 'PUT',
      }),
      invalidatesTags: ['Order'],
    }),
    deleteOrder: builder.mutation<void, string>({
      query: (id) => ({
        url: `orders/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Order'],
    }),
  }),
  overrideExisting: false,
})

export const {
  useGetOrdersQuery,
  useGetOrderQuery,
  useCreateOnlineOrderMutation,
  useCreatePOSOrderMutation,
  useUpdateOrderMutation,
  useCloseOrderMutation,
  useDeleteOrderMutation,
} = ordersApi
