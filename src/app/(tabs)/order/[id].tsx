import { useCallback, useLayoutEffect, useState } from 'react'

import { Trash2 } from '@tamagui/lucide-icons'
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router'
import { FlatList } from 'react-native'
import { Button, Stack, Text, XStack } from 'tamagui'

import {
  useCloseOrderMutation,
  useDeleteOrderMutation,
  useGetOrderQuery,
  useGetProductsQuery,
  useUpdateOrderMutation,
} from '@/api'
import { DataWrapper, Divider, OrderProductItem } from '@/components'
import { useConfirmAction } from '@/hooks/useConfirmAction'
import { OrderProductItemDto } from '@/store'
import {
  BASE_PRODUCT_QUERY,
  ORDER_STATUS,
  ORDER_STATUS_COLORS,
  OrderStatus,
} from '@/utils'

const actions = {
  [OrderStatus.CONFIRMED]: {
    confirmTitle: 'Xác nhận đơn hàng',
    confirmMessage: 'Bạn có chắc chắn muốn xác nhận đơn hàng này?',
    successTitle: 'Xác nhận đơn hàng thành công',
    errorTitle: 'Xác nhận đơn hàng thất bại',
  },
  [OrderStatus.DONE]: {
    confirmTitle: 'Hoàn thành đơn hàng',
    confirmMessage: 'Bạn có chắc chắn muốn hoàn thành đơn hàng này?',
    successTitle: 'Hoàn thành đơn hàng thành công',
    errorTitle: 'Hoàn thành đơn hàng thất bại',
  },
  [OrderStatus.CANCELLED]: {
    confirmTitle: 'Huỷ đơn hàng',
    confirmMessage: 'Bạn có chắc chắn muốn huỷ đơn hàng này?',
    successTitle: 'Huỷ đơn hàng thành công',
    errorTitle: 'Huỷ đơn hàng thất bại',
  },
  [OrderStatus.PENDING]: {
    confirmTitle: 'Xoá đơn hàng',
    confirmMessage: 'Bạn có chắc chắn muốn xoá đơn hàng này?',
    successTitle: 'Xoá đơn hàng thành công',
    errorTitle: 'Xoá đơn hàng thất bại',
  },
}

export default function Order() {
  const navigation = useNavigation()
  const router = useRouter()

  const { id: idParam } = useLocalSearchParams()
  const id = idParam instanceof Array ? idParam[0] : idParam
  const { data, isLoading, error, refetch } = useGetOrderQuery(id as string)
  const { data: products } = useGetProductsQuery(BASE_PRODUCT_QUERY)

  const [updateOrder, { isLoading: updating }] = useUpdateOrderMutation()
  const [closeOrder, { isLoading: closing }] = useCloseOrderMutation()
  const [deleteOrder, { isLoading: deleting }] = useDeleteOrderMutation()

  const orderProducts = data?.products.map((orderProduct) => {
    const product = products?.items.find((p) => p.id === orderProduct.productId)
    return {
      id: orderProduct.productId,
      name: product?.name || 'Unknown Product',
      quantity: orderProduct.quantity,
      unit: orderProduct.unitName,
      price: orderProduct.price,
      total: orderProduct.price * orderProduct.quantity,
    } as OrderProductItemDto
  })

  const { askConfirm: askConfirmDelete } = useConfirmAction(actions.PENDING)
  const { askConfirm: askConfirmConfirm } = useConfirmAction(actions.CONFIRMED)
  const { askConfirm: askConfirmDone } = useConfirmAction(actions.DONE)
  const { askConfirm: askConfirmCancel } = useConfirmAction(actions.CANCELLED)

  const onConfirmOrder = useCallback(() => {
    askConfirmConfirm(() =>
      updateOrder({ id: id as string, status: OrderStatus.CONFIRMED })
    )
  }, [askConfirmConfirm, id, updateOrder])

  const onCancelOrder = useCallback(() => {
    askConfirmCancel(() =>
      updateOrder({ id: id as string, status: OrderStatus.CANCELLED })
    )
  }, [askConfirmCancel, id, updateOrder])

  const onDoneOrder = useCallback(() => {
    askConfirmDone(() => closeOrder(id as string))
  }, [askConfirmDone, id, closeOrder])

  const onDelete = useCallback(() => {
    askConfirmDelete(
      async () => {
        const result = await deleteOrder(id)
        return result
      },
      { onSuccess: () => router.back() }
    )
  }, [askConfirmDelete, deleteOrder, id, router])

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          size="$2"
          theme="red"
          disabled={isLoading || deleting}
          onPress={onDelete}
        >
          <Trash2 size={12} />
          Xoá
        </Button>
      ),
    })
  }, [id, navigation, isLoading, deleting, onDelete])

  return (
    <DataWrapper p="$0" isLoading={isLoading} error={error} refetch={refetch}>
      <Stack p="$4" gap="$4">
        <Text fontWeight="bold" fontSize="$4">
          Mã đơn hàng: #{data?.name}
        </Text>
        <Text>
          Ngày tạo: {data && new Date(data.createdAt).toLocaleString('vi-VN')}
        </Text>
        {data?.customerId && (
          <>
            <Text>Tên khách hàng: {data?.customerName}</Text>
            <Text>Số điện thoại: {data?.phone}</Text>
            <Text>Địa chỉ: {data?.address}</Text>
          </>
        )}
        <XStack>
          <Text>Trạng thái: </Text>
          <Text
            theme={ORDER_STATUS_COLORS[data?.status ?? 'PENDING']}
            bg="$color6"
            color="$color12"
            px="$2"
            rounded="$6"
          >
            {ORDER_STATUS[data?.status ?? 'PENDING']}
          </Text>
        </XStack>
      </Stack>
      <Divider thickness={4} />
      <Stack p="$4" gap="$2" flex={1}>
        <Text fontSize="$6" fontWeight="bold">
          Sản phẩm
        </Text>
        <FlatList
          data={orderProducts ?? []}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <OrderProductItem item={item} editable={false} />
          )}
        />
      </Stack>
      {data?.status === OrderStatus.PENDING && (
        <XStack width="100%" items="center" gap="$2" mt="$2" p="$4">
          <Button size="$3" flex={1} theme="green" onPress={onConfirmOrder}>
            <Text>Xác nhận</Text>
          </Button>
          <Button size="$3" flex={1} theme="red" onPress={onCancelOrder}>
            <Text>Huỷ đơn</Text>
          </Button>
        </XStack>
      )}
      {data?.status === OrderStatus.CONFIRMED && (
        <XStack width="100%" items="center" gap="$2" mt="$2" p="$4">
          <Button size="$3" flex={1} theme="green" onPress={onDoneOrder}>
            <Text>Hoàn thành</Text>
          </Button>
        </XStack>
      )}
    </DataWrapper>
  )
}
