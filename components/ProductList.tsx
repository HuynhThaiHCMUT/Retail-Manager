import DataWrapper from '@/components/DataWrapper'
import { ProductItem } from '@/components/ProductItem'
import { useGetProductsQuery } from '@/utils/api.service'
import { FlatList, RefreshControl } from 'react-native'
import { View, Button, XStack } from 'tamagui'
import React, { useState, useMemo } from 'react'
import { SearchBar } from '@/components/SearchBar'
import { FilterModal } from '@/components/FilterModal'
import { SortSelect } from '@/components/SortSelect'
import { ProductDto } from '@/dto/product.dto'
import { BASE_PRODUCT_QUERY, SORT_OPTIONS } from '@/constants'
import { Filter } from '@tamagui/lucide-icons'

const normalize = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()

interface ProductListProps {
  onProductPress?: (product: ProductDto) => void
  showFAB?: React.ReactNode
}

export function ProductList({ onProductPress, showFAB }: ProductListProps) {
  const { data, isFetching, error, refetch } =
    useGetProductsQuery(BASE_PRODUCT_QUERY)

  const [searchQuery, setSearchQuery] = useState('')
  const [filterVisible, setFilterVisible] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000])
  const [sortByLocal, setSortByLocal] = useState('time')

  const filteredData = useMemo(() => {
    if (!data) return []
    return data
      .filter((item) => normalize(item.name).includes(normalize(searchQuery)))
      .filter(
        (item) =>
          item.categories &&
          (selectedCategories.length === 0 ||
            selectedCategories.includes(item.categories[0]))
      )
      .filter(
        (item) => item.price >= priceRange[0] && item.price <= priceRange[1]
      )
      .sort((a, b) => {
        if (sortByLocal === 'price-asc') return a.price - b.price
        if (sortByLocal === 'price-desc') return b.price - a.price
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      })
  }, [data, searchQuery, selectedCategories, priceRange, sortByLocal])

  return (
    <DataWrapper isLoading={isFetching} error={error} refetch={refetch}>
      <SearchBar value={searchQuery} onChange={setSearchQuery} />
      <XStack my="$2">
        <View flex={1}>
          <SortSelect
            width={160}
            options={SORT_OPTIONS}
            value={sortByLocal}
            onChange={setSortByLocal}
          />
        </View>
        <Button size="$3" onPress={() => setFilterVisible(true)}>
          <Filter size={16} />
          Bộ lọc
        </Button>
      </XStack>
      <FlatList
        data={filteredData}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={refetch} />
        }
        renderItem={({ item }) => (
          <ProductItem
            product={item}
            key={item.id}
            onPress={onProductPress ? () => onProductPress(item) : undefined}
          />
        )}
      />
      {showFAB}
      <FilterModal
        visible={filterVisible}
        initialCategories={selectedCategories}
        initialPriceRange={priceRange}
        onApply={(cats, pr) => {
          setSelectedCategories(cats)
          setPriceRange(pr)
        }}
        onClose={() => setFilterVisible(false)}
      />
    </DataWrapper>
  )
}
