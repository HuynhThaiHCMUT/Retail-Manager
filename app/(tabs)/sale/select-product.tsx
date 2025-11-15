import { ProductList } from '@/components/ProductList'
import { useRouter } from 'expo-router'
import { useAppDispatch } from '@/hooks/useAppHooks'
import { addItem } from '@/store/order.slice'
import { ProductDto } from '@/dto/product.dto'
import React from 'react'

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
        unit: product.baseUnit ?? undefined,
        total: product.price * 1,
      })
    )
    router.back()
  }

  return <ProductList onProductPress={onAddItem} />
}
