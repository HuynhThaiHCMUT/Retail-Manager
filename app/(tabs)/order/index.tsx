import DataWrapper from '@/components/DataWrapper'
import { useRouter } from 'expo-router'
import { FlatList, RefreshControl } from 'react-native'
import { Stack, View, Button, Text, XStack } from 'tamagui'
import React, { useState, useMemo } from 'react'
import { SearchBar } from '@/components/SearchBar'
import { FilterModal } from '@/components/FilterModal'
import { SortSelect } from '@/components/SortSelect'
import { useGetOrdersQuery } from '@/utils/api.service'
import { OrderItem } from '@/components/OrderItem'
import { SORT_OPTIONS } from '@/constants'
import { Filter } from '@tamagui/lucide-icons'

const normalize = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()

export default function OrderList() {
  const router = useRouter()
  const { data, isFetching, error, refetch } = useGetOrdersQuery()

  const [searchQuery, setSearchQuery] = useState('')
  const [filterVisible, setFilterVisible] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000])
  const [sortByLocal, setSortByLocal] = useState('time')

  const filteredData = useMemo(() => {
    if (!data) return []
    return data.filter((item) =>
      normalize(item.name).includes(normalize(searchQuery))
    )
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
        data={data}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={refetch} />
        }
        renderItem={({ item }) => <OrderItem item={item} key={item.id} />}
      />
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
