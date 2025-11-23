import React, { useState } from 'react'

import { Filter } from '@tamagui/lucide-icons'
import { ActivityIndicator, FlatList, RefreshControl } from 'react-native'
import { Button, View, XStack } from 'tamagui'

import { useGetOrdersQuery } from '@/api'
import {
  DataWrapper,
  OrderFilterModal,
  OrderItem,
  SortSelect,
} from '@/components'
import { BASE_ORDER_QUERY, SORT_OPTIONS } from '@/utils'

export default function OrderList() {
  const [filterVisible, setFilterVisible] = useState(false)
  const [params, setParams] = useState(BASE_ORDER_QUERY)

  const { data, isLoading, isFetching, error } = useGetOrdersQuery(params)

  const onRefresh = () => {
    setParams(BASE_ORDER_QUERY)
  }

  const onEndReached = () => {
    if (!isFetching && data && data.items.length < data.totalCount) {
      const nextOffset = (params.offset ?? 0) + (params.limit ?? 0)
      setParams((prev) => ({
        ...prev,
        offset: nextOffset,
      }))
    }
  }

  return (
    <DataWrapper isLoading={isLoading} error={error} refetch={onRefresh}>
      <XStack my="$2">
        <View flex={1}>
          <SortSelect
            width={160}
            options={SORT_OPTIONS}
            value={params.sortBy ?? undefined}
            onChange={(value) =>
              setParams((prev) => ({ ...prev, sortBy: value }))
            }
          />
        </View>
        <Button size="$3" onPress={() => setFilterVisible(true)}>
          <Filter size={16} />
          Bộ lọc
        </Button>
      </XStack>
      <FlatList
        data={data?.items}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={onRefresh} />
        }
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <OrderItem item={item} />}
        onEndReached={onEndReached}
        onEndReachedThreshold={5}
        ListFooterComponent={
          isFetching && data?.items && data?.items.length > 0 ? (
            <View p="$4">
              <ActivityIndicator />
            </View>
          ) : null
        }
      />
      <OrderFilterModal
        visible={filterVisible}
        initialPriceRange={[0, 10000000]}
        onApply={(status, pr) => {
          setParams((prev) => ({
            ...prev,
            status: status,
            totalFrom: pr[0],
            totalTo: pr[1],
          }))
        }}
        onClose={() => setFilterVisible(false)}
      />
    </DataWrapper>
  )
}
