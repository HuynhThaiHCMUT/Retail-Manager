import DataWrapper from '@/components/DataWrapper'
import { useRouter } from 'expo-router'
import { FlatList, RefreshControl } from 'react-native'
import React, { useState, useMemo } from 'react'
import { SearchBar } from '@/components/SearchBar'
import { FilterModal } from '@/components/FilterModal'
import { useGetUsersQuery } from '@/utils/api.service'
import { UserItem } from '@/components/UserItem'
import { FAB } from '@/components/FAB'

const normalize = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()

export default function Staffs() {
  const router = useRouter()
  const { data, isFetching, error, refetch } = useGetUsersQuery()

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

  const onAddStaff = () => router.push('/(tabs)/setting/staffs/new')

  return (
    <DataWrapper isLoading={isFetching} error={error} refetch={refetch}>
      <SearchBar mb="$2" value={searchQuery} onChange={setSearchQuery} />
      <FlatList
        data={filteredData}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={refetch} />
        }
        renderItem={({ item }) => <UserItem item={item} key={item.id} />}
      />
      <FAB theme="blue" onPress={onAddStaff} />
    </DataWrapper>
  )
}
