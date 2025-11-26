import React, { useState } from 'react'

import { Filter } from '@tamagui/lucide-icons'
import { ActivityIndicator, FlatList, RefreshControl } from 'react-native'
import { Button, View, XStack } from 'tamagui'

import { useGetProductsQuery } from '@/api'
import { ProductDto } from '@/dto'
import { BASE_PRODUCT_QUERY, SORT_OPTIONS } from '@/utils'

import { DataWrapper } from './DataWrapper'
import { ProductFilterModal } from './ProductFilterModal'
import { ProductItem } from './ProductItem'
import { SearchBar } from './SearchBar'
import { SortSelect } from './SortSelect'

interface ProductListProps {
  onProductPress?: (product: ProductDto) => void
  showFAB?: React.ReactNode
}

export function ProductList({ onProductPress, showFAB }: ProductListProps) {
  const [filterVisible, setFilterVisible] = useState(false)
  const [params, setParams] = useState(BASE_PRODUCT_QUERY)

  const { data, isLoading, isFetching, error } = useGetProductsQuery(params)

  const onRefresh = () => {
    setParams(BASE_PRODUCT_QUERY)
  }

  const onEndReached = () => {
    if (
      !isFetching &&
      !isLoading &&
      data &&
      data.items.length < data.totalCount
    ) {
      const nextOffset = (params.offset ?? 0) + (params.limit ?? 0)
      setParams((prev) => ({
        ...prev,
        offset: nextOffset,
      }))
    }
  }

  return (
    <DataWrapper isLoading={isLoading} error={error} refetch={onRefresh}>
      <SearchBar
        value={params.name ?? ''}
        onChange={(name) => setParams((prev) => ({ ...prev, name, offset: 0 }))}
      />
      <XStack my="$2">
        <View flex={1}>
          <SortSelect
            width={160}
            options={SORT_OPTIONS}
            value={params.sortBy ?? ''}
            onChange={(sortBy) =>
              setParams((prev) => ({ ...prev, sortBy, offset: 0 }))
            }
          />
        </View>
        <Button size="$3" onPress={() => setFilterVisible(true)}>
          <Filter size={16} />
          Bộ lọc
        </Button>
      </XStack>
      <FlatList
        data={data?.items ?? []}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={onRefresh} />
        }
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProductItem
            product={item}
            onPress={onProductPress ? () => onProductPress(item) : undefined}
          />
        )}
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
      {showFAB}
      <ProductFilterModal
        visible={filterVisible}
        initialCategories={params.categories?.split(',') ?? []}
        initialPriceRange={[params.priceFrom ?? 0, params.priceTo ?? 0]}
        onApply={(cats, pr) => {
          setParams((prev) => ({
            ...prev,
            categories: cats.join(','),
            priceFrom: pr[0],
            priceTo: pr[1],
            offset: 0,
          }))
        }}
        onClose={() => setFilterVisible(false)}
      />
    </DataWrapper>
  )
}
