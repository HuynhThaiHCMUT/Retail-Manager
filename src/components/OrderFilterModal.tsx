import { useEffect, useState } from 'react'

import { Check } from '@tamagui/lucide-icons'
import {
  Button,
  Dialog,
  Input,
  ScrollView,
  Text,
  XStack,
  YStack,
} from 'tamagui'

import { ORDER_STATUS, OrderStatus } from '@/utils'

import { Divider } from './Divider'

interface ProductFilterModalProps {
  visible: boolean
  initialPriceRange: [number, number]
  onApply: (
    status: OrderStatus | undefined,
    priceRange: [number, number]
  ) => void
  onClose: () => void
}

export function OrderFilterModal({
  visible,
  initialPriceRange,
  onApply,
  onClose,
}: ProductFilterModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>()
  const [minPrice, setMinPrice] = useState(initialPriceRange[0])
  const [maxPrice, setMaxPrice] = useState(initialPriceRange[1])

  useEffect(() => {
    if (visible) {
      setMinPrice(initialPriceRange[0])
      setMaxPrice(initialPriceRange[1])
    }
  }, [initialPriceRange])

  const handleClear = () => {
    setSelectedStatus(undefined)
    setMinPrice(initialPriceRange[0])
    setMaxPrice(initialPriceRange[1])
  }

  const handleApply = () => {
    onApply(selectedStatus, [minPrice, maxPrice])
    onClose()
  }

  const renderStatusButton = (status: OrderStatus) => (
    <Button
      flex={1}
      size="$3"
      variant={status === selectedStatus ? undefined : 'outlined'}
      onPress={() =>
        setSelectedStatus((prev) => (prev === status ? undefined : status))
      }
    >
      {status === selectedStatus && <Check size={12} />}
      {ORDER_STATUS[status]}
    </Button>
  )

  return (
    <Dialog modal open={visible} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay
          key="overlay"
          animation="quick"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
          opacity={0.5}
          bg="black"
        />
        <Dialog.Content
          key="content"
          bordered
          elevate
          animation="quick"
          enterStyle={{ opacity: 0, scale: 0.95 }}
          exitStyle={{ opacity: 0, scale: 0.95 }}
          gap="$4"
          p="$4"
          width="80%"
          maxH={380}
          flex={1}
        >
          <Text fontWeight="600" fontSize="$8">
            Bộ lọc
          </Text>

          {/* Status */}
          <Text fontWeight="600">Trạng thái đơn hàng</Text>
          <ScrollView maxH={80} flex={1}>
            <YStack gap="$2" flex={1}>
              <XStack gap="$2">
                {renderStatusButton(OrderStatus.PENDING)}
                {renderStatusButton(OrderStatus.CONFIRMED)}
              </XStack>
              <XStack gap="$2">
                {renderStatusButton(OrderStatus.DONE)}
                {renderStatusButton(OrderStatus.CANCELLED)}
              </XStack>
            </YStack>
          </ScrollView>

          <Divider />

          {/* Price Range */}
          <YStack gap="$2">
            <Text fontWeight="600">Khoảng giá</Text>
            <XStack gap="$2">
              <Input
                flex={1}
                keyboardType="numeric"
                value={String(minPrice)}
                onChangeText={(text) =>
                  setMinPrice(Number(text) || initialPriceRange[0])
                }
              />
              <Input
                flex={1}
                keyboardType="numeric"
                value={String(maxPrice)}
                onChangeText={(text) =>
                  setMaxPrice(Number(text) || initialPriceRange[1])
                }
              />
            </XStack>
          </YStack>

          {/* Actions */}
          <XStack justify="flex-end" gap="$2">
            <Button onPress={onClose}>Huỷ</Button>
            <Button theme="red" onPress={handleClear}>
              Xoá
            </Button>
            <Button theme="blue" onPress={handleApply}>
              Áp dụng
            </Button>
          </XStack>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  )
}
