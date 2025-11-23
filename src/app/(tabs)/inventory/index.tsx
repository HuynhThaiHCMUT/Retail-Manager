import React from 'react'

import { useRouter } from 'expo-router'

import { FAB, ProductList } from '@/components'

export default function Inventory() {
  const router = useRouter()
  const onAddProduct = () => router.push('/(tabs)/inventory/new')

  return <ProductList showFAB={<FAB theme="blue" onPress={onAddProduct} />} />
}
