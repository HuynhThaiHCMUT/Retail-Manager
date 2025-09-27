import { ORDER_STATUS, ORDER_STATUS_COLORS } from '@/constants'
import { OrderDto } from '@/dto/order.dto'
import { Globe, ShoppingCart } from '@tamagui/lucide-icons'
import { useRouter } from 'expo-router'
import { XStack, Text, Stack } from 'tamagui'

export interface OrderItemProps {
  item: OrderDto
}

export function OrderItem({ item }: OrderItemProps) {
  const router = useRouter()
  const onPress = () => router.push(`/(tabs)/order/${item.id}`)

  return (
    <XStack p="$2" onPress={onPress}>
      <Stack flex={1}>
        <XStack gap="$2" items="center">
          {item.customerId ? <Globe size={16} /> : <ShoppingCart size={16} />}
          <Text flex={1} flexWrap="wrap" fontWeight="bold">
            #{item.name}
          </Text>
          <Text ml="$4">{item.total} đ</Text>
        </XStack>
        <XStack>
          <Text flex={1}>
            {new Date(item.createdAt).toLocaleString('vi-VN')}
          </Text>
          <Text
            theme={ORDER_STATUS_COLORS[item.status]}
            bg="$color6"
            color="$color12"
            px="$2"
            rounded="$6"
          >
            {ORDER_STATUS[item.status]}
          </Text>
        </XStack>
      </Stack>
    </XStack>
  )
}
