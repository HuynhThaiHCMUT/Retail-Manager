import DataWrapper from '@/components/DataWrapper'
import { ProductItem } from '@/components/ProductItem'
import { useGetProductsQuery } from '@/utils/api.service'
import { ActivityIndicator, FlatList, RefreshControl } from 'react-native'
import { View, Button, XStack } from 'tamagui'
import React, { useState } from 'react'
import { SearchBar } from '@/components/SearchBar'
import { FilterModal } from '@/components/FilterModal'
import { SortSelect } from '@/components/SortSelect'
import { ProductDto } from '@/dto/product.dto'
import { BASE_PRODUCT_QUERY, SORT_OPTIONS } from '@/constants'
import { Filter } from '@tamagui/lucide-icons'

interface ProductListProps {
  onProductPress?: (product: ProductDto) => void
  showFAB?: React.ReactNode
}

export function ProductList({ onProductPress, showFAB }: ProductListProps) {
  const [filterVisible, setFilterVisible] = useState(false)
  const [params, setParams] = useState(BASE_PRODUCT_QUERY)

  const { data, isLoading, isFetching, error, refetch } =
    useGetProductsQuery(params)

  const onEndReached = () => {
    if (
      !isFetching &&
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
    <DataWrapper isLoading={isLoading} error={error} refetch={refetch}>
      <SearchBar value={params.name ?? ''} onChange={(name) => setParams((prev) => ({ ...prev, name, offset: 0 }))} />
      <XStack my="$2">
        <View flex={1}>
          <SortSelect
            width={160}
            options={SORT_OPTIONS}
            value={params.sortBy ?? ''}
            onChange={(sortBy) => setParams((prev) => ({ ...prev, sortBy, offset: 0 }))}
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
          <RefreshControl refreshing={false} onRefresh={refetch} />
        }
        renderItem={({ item }) => (
          <ProductItem
            product={item}
            key={Date.now()}
            onPress={onProductPress ? () => onProductPress(item) : undefined}
          />
        )}
        onEndReached={onEndReached}
        onEndReachedThreshold={5}
        ListFooterComponent={
          (isFetching && data?.items && data?.items.length > 0 ? (
            <View p="$4">
              <ActivityIndicator />
            </View>
          ) : null)
        }
      />
      {showFAB}
      <FilterModal
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
