import React, { useEffect, useState } from 'react'

import { useIsFocused } from '@react-navigation/native'
import { Filter } from '@tamagui/lucide-icons'
import {
  ActivityIndicator,
  FlatList,
  InteractionManager,
  RefreshControl,
} from 'react-native'
import { Button, View, XStack } from 'tamagui'

import { useGetLogsQuery } from '@/api'
import { AuditLogItem, DataWrapper, OrderFilterModal } from '@/components'
import { BASE_LOG_QUERY } from '@/utils'

export default function OrderList() {
  const [filterVisible, setFilterVisible] = useState(false)
  const [params, setParams] = useState(BASE_LOG_QUERY)

  const { data, isLoading, isFetching, error, refetch } =
    useGetLogsQuery(params)
  const isFocused = useIsFocused()

  useEffect(() => {
    if (isFocused) {
      InteractionManager.runAfterInteractions(onRefresh)
    }
  }, [isFocused])

  const onRefresh = () => {
    if (params === BASE_LOG_QUERY) {
      refetch()
    } else {
      setParams(BASE_LOG_QUERY)
    }
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
      <FlatList
        data={data?.items}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={onRefresh} />
        }
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <AuditLogItem item={item} />}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
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
