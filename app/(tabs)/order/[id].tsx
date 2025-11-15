import DataWrapper from '@/components/DataWrapper'
import { Divider } from '@/components/Divider'
import { OrderProductItem } from '@/components/OrderProductItem'
import {
  ORDER_STATUS_COLORS,
  ORDER_STATUS,
  BASE_PRODUCT_QUERY,
} from '@/constants'
import {
  useDeleteOrderMutation,
  useGetOrderQuery,
  useGetProductsQuery,
} from '@/utils/api.service'
import { OrderProductItemDto } from '@/store/order.slice'
import { Trash2 } from '@tamagui/lucide-icons'
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router'
import { useCallback, useLayoutEffect } from 'react'
import { FlatList } from 'react-native'
import { Stack, XStack, Text, Button } from 'tamagui'
import { useConfirmAction } from '@/hooks/useConfirmAction'

export default function Order() {
  const navigation = useNavigation()
  const router = useRouter()

  const { id: idParam } = useLocalSearchParams()
  const id = idParam instanceof Array ? idParam[0] : idParam
  const { data, isLoading, error, refetch } = useGetOrderQuery(id as string)
  const { data: products } = useGetProductsQuery(BASE_PRODUCT_QUERY)

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

  const { askConfirm } = useConfirmAction({
    confirmTitle: 'Xoá đơn hàng',
    confirmMessage: 'Bạn có chắc chắn muốn xoá đơn hàng này?',
    successTitle: 'Xoá đơn hàng thành công',
    errorTitle: 'Xoá đơn hàng thất bại',
  })

  const onDelete = useCallback(() => {
    askConfirm(
      async () => {
        const result = await deleteOrder(id)
        return result
      },
      { onSuccess: () => router.back() }
    )
  }, [askConfirm, deleteOrder, id, router])

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button size="$2" theme="red" onPress={onDelete}>
          <Trash2 size={12} />
          Xoá
        </Button>
      ),
    })
  }, [id, navigation])

  return (
    <DataWrapper p="$0" isLoading={isLoading} error={error} refetch={refetch}>
      <Stack p="$4" gap="$4">
        <Text fontWeight="bold" fontSize="$4">
          Mã đơn hàng: #{data?.name}
        </Text>
        <Text>
          Ngày tạo: {data && new Date(data.createdAt).toLocaleString('vi-VN')}
        </Text>
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
      <Stack p="$4" gap="$2">
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
    </DataWrapper>
  )
}
