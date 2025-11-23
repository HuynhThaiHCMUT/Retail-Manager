import { useRef } from 'react'

import { useRouter } from 'expo-router'
import { FlatList, Pressable } from 'react-native'
import { Button, Stack, Text, XStack } from 'tamagui'

import { useCreatePOSOrderMutation } from '@/api'
import { OrderProductItem, OrderProductItemRef } from '@/components'
import { useAppDispatch, useAppSelector } from '@/hooks/useAppHooks'
import {
  OrderProductItemDto,
  clearOrder,
  openDialog,
  registerDialogCallback,
} from '@/store'
import { handleError } from '@/utils'

export default function SaleScreen() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const items = useAppSelector((state) => state.order.items)
  const total = useAppSelector((state) => state.order.total)

  const openRowIdRef = useRef<string | null>(null)
  const rowRefs = useRef(new Map<string, OrderProductItemRef | null>())

  const handleRowOpen = (id: string) => {
    const prevId = openRowIdRef.current
    if (prevId && prevId !== id) {
      const prevRef = rowRefs.current.get(prevId)
      prevRef?.close()
    }
    openRowIdRef.current = id
  }

  const handleOutsidePress = () => {
    if (openRowIdRef.current) {
      const prevRef = rowRefs.current.get(openRowIdRef.current)
      prevRef?.close()
      openRowIdRef.current = null
    }
  }

  const renderItem = ({ item }: { item: OrderProductItemDto }) => {
    const setRef = (r: OrderProductItemRef | null) => {
      if (r) rowRefs.current.set(item.id, r)
      else rowRefs.current.delete(item.id)
    }

    return (
      <OrderProductItem
        ref={setRef}
        item={item}
        editable
        onOpen={() => handleRowOpen(item.id)}
        onDelete={() => {
          const ref = rowRefs.current.get(item.id)
          ref?.close()
          if (openRowIdRef.current === item.id) openRowIdRef.current = null
        }}
      />
    )
  }

  const [createOrder, { isLoading: isCreatingOrder }] =
    useCreatePOSOrderMutation()

  const onClearOrder = () => {
    registerDialogCallback('onDialogConfirm', () => {
      dispatch(clearOrder())
    })
    dispatch(
      openDialog({
        type: 'confirm',
        variant: 'warning',
        title: 'Xoá đơn hàng',
        message: 'Bạn có chắc chắn muốn xoá đơn hàng này?',
      })
    )
  }

  const onCheckOut = async () => {
    if (items.length === 0) {
      dispatch(
        openDialog({
          type: 'icon',
          variant: 'warning',
          title: 'Không có sản phẩm',
          message: 'Vui lòng thêm sản phẩm vào đơn hàng trước khi thanh toán.',
        })
      )
      return
    }
    const result = await createOrder({
      products: items.map((item: OrderProductItemDto) => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
        unitName: item.unit,
      })),
    })
    if (result.error) {
      dispatch(
        openDialog({
          type: 'icon',
          variant: 'error',
          title: 'Lỗi thanh toán',
          message:
            handleError(result.error) ||
            'Đã xảy ra lỗi khi thanh toán. Vui lòng thử lại sau.',
        })
      )
      return
    }
    dispatch(
      openDialog({
        type: 'icon',
        variant: 'success',
        title: 'Thanh toán thành công',
        message: `Đơn hàng đã được thanh toán thành công.`,
      })
    )
    dispatch(clearOrder())
  }

  return (
    <Pressable style={{ flex: 1 }} onPress={handleOutsidePress}>
      <XStack justify="space-between" items="center" px="$4" py="$2">
        <Text fontSize="$5" ml="$4" fontWeight="bold">
          Đơn hàng
        </Text>
        <Button
          size="$3"
          theme="blue"
          onPress={() => router.push('/(tabs)/sale/select-product')}
        >
          Thêm sản phẩm
        </Button>
      </XStack>
      <Stack flex={1} px="$4">
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(i) => i.id + 'sale'}
          onScrollBeginDrag={handleOutsidePress}
        />
      </Stack>
      <Stack px="$4" py="$2" bg="$background">
        <Text fontSize="$5" fontWeight="bold">
          Tổng tiền: {total} đ
        </Text>
        <XStack width="100%" items="center" gap="$2" mt="$2">
          <Button size="$3" flex={1} theme="green" onPress={onCheckOut}>
            <Text>Thanh toán</Text>
          </Button>
          <Button size="$3" flex={1} theme="red" onPress={onClearOrder}>
            <Text>Xoá đơn</Text>
          </Button>
        </XStack>
      </Stack>
    </Pressable>
  )
}
