import React, { useMemo, useState } from 'react'

import { useRouter } from 'expo-router'
import { FlatList, RefreshControl } from 'react-native'

import { useGetUsersQuery } from '@/api'
import { DataWrapper, FAB, SearchBar, UserItem } from '@/components'

const normalize = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()

export default function Staffs() {
  const router = useRouter()
  const { data, isFetching, error, refetch } = useGetUsersQuery()

  const [searchQuery, setSearchQuery] = useState('')

  const filteredData = useMemo(() => {
    if (!data) return []
    return data.filter((item) =>
      normalize(item.name).includes(normalize(searchQuery))
    )
  }, [data, searchQuery])

  const onAddStaff = () => router.push('/(tabs)/setting/staffs/new')

  return (
    <DataWrapper isLoading={isFetching} error={error} refetch={refetch}>
      <SearchBar mb="$2" value={searchQuery} onChange={setSearchQuery} />
      <FlatList
        data={filteredData}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={refetch} />
        }
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <UserItem item={item} />}
      />
      <FAB theme="blue" onPress={onAddStaff} />
    </DataWrapper>
  )
}
