import { useEffect, useState } from 'react'

import { Check } from '@tamagui/lucide-icons'
import {
  Button,
  Dialog,
  Input,
  Paragraph,
  ScrollView,
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
          maxH="90%"
        >
          <Dialog.Title>Bộ lọc</Dialog.Title>

          {/* Status */}
          <YStack gap="$2">
            <Paragraph fontWeight="600">Trạng thái đơn hàng</Paragraph>
            <ScrollView maxH={150}>
              <YStack gap="$2">
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
          </YStack>

          <Divider />

          {/* Price Range */}
          <YStack gap="$2">
            <Paragraph fontWeight="600">Khoảng giá</Paragraph>
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
          <XStack justify="flex-end" gap="$2" mt="$4">
            <Button onPress={onClose}>Huỷ</Button>
            <Button theme="blue" onPress={handleApply}>
              Áp dụng
            </Button>
          </XStack>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  )
}
