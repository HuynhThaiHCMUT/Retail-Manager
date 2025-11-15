import { useGetCategoriesQuery } from '@/utils/api.service'
import { Check } from '@tamagui/lucide-icons'
import { useEffect, useState } from 'react'
import {
  Dialog,
  Button,
  YStack,
  XStack,
  Paragraph,
  Input,
  ScrollView,
  Label,
} from 'tamagui'
import { Divider } from './Divider'
import { CategoryDto } from '@/dto/product.dto'

interface FilterModalProps {
  visible: boolean
  initialCategories: string[]
  initialPriceRange: [number, number]
  onApply: (categories: string[], priceRange: [number, number]) => void
  onClose: () => void
}

export function FilterModal({
  visible,
  initialCategories,
  initialPriceRange,
  onApply,
  onClose,
}: FilterModalProps) {
  const { data: availableCategories } = useGetCategoriesQuery()

  const [categories, setCategories] = useState<string[]>(initialCategories)
  const [minPrice, setMinPrice] = useState(initialPriceRange[0])
  const [maxPrice, setMaxPrice] = useState(initialPriceRange[1])

  // Reset when dialog opens with new props
  useEffect(() => {
    if (visible) {
      setCategories(initialCategories)
      setMinPrice(initialPriceRange[0])
      setMaxPrice(initialPriceRange[1])
    }
  }, [visible, initialCategories, initialPriceRange])

  const toggleCategory = (cat: string) => {
    setCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    )
  }

  const handleApply = () => {
    onApply(categories, [minPrice, maxPrice])
    onClose()
  }

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

          {/* Categories */}
          <YStack gap="$2">
            <Paragraph fontWeight="600">Phân loại</Paragraph>
            <ScrollView maxH={150}>
              <YStack gap="$2">
                {availableCategories
                  ?.reduce((rows, cat, i) => {
                    // group categories 3 per row
                    if (i % 3 === 0) rows.push([])
                    rows[rows.length - 1].push(cat)
                    return rows
                  }, [] as CategoryDto[][])
                  .map((row, rowIndex) => (
                    <XStack key={rowIndex} gap="$2">
                      {row.map((cat) => {
                        const isActive = categories.includes(cat.name)
                        return (
                          <Button
                            key={cat.id}
                            flex={1}
                            size="$3"
                            variant={isActive ? undefined : 'outlined'}
                            onPress={() => toggleCategory(cat.name)}
                          >
                            {isActive && <Check size={12} />}
                            {cat.name}
                          </Button>
                        )
                      })}
                    </XStack>
                  ))}
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
