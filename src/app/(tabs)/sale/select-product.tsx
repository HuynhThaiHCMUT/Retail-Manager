import React from 'react'

import { useRouter } from 'expo-router'

import { ProductList } from '@/components'
import { ProductDto } from '@/dto'
import { useAppDispatch } from '@/hooks/useAppHooks'
import { addItem } from '@/store'

export default function SelectProduct() {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const onAddItem = (product: ProductDto) => {
    dispatch(
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        unit: product.baseUnit ?? '',
        total: product.price * 1,
      })
    )
    router.back()
  }

  return <ProductList onProductPress={onAddItem} />
}
