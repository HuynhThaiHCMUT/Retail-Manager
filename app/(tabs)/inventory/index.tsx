import { useRouter } from 'expo-router'
import { FAB } from '@/components/FAB'
import { ProductList } from '@/components/ProductList'
import React from 'react'

export default function Inventory() {
  const router = useRouter()
  const onAddProduct = () => router.push('/(tabs)/inventory/new')

  return <ProductList showFAB={<FAB theme="blue" onPress={onAddProduct} />} />
}
