import { ProductDto } from '@/dto/product.dto'
import getImageUrl from '@/utils/get-image'
import { useRouter } from 'expo-router'
import { XStack, Text, Image, Stack } from 'tamagui'

export interface ProductItemProps {
  product: ProductDto
  onPress?: () => void
}

export function ProductItem({ product, onPress }: ProductItemProps) {
  const router = useRouter()

  const handlePress = () => {
    if (onPress) {
      onPress()
    } else {
      router.push(`/(tabs)/inventory/${product.id}`)
    }
  }
  return (
    <XStack p="$2" onPress={handlePress}>
      {product.pictures && product.pictures?.length > 0 && (
        <Image
          source={{ uri: getImageUrl(product.pictures[0]) }}
          width="$4"
          height="$4"
          alt="Product Image"
          mr="$4"
        />
      )}
      <Stack flex={1}>
        <Text>{product.name}</Text>
        <Text>{product.price} đ</Text>
      </Stack>
      <Text>{product.quantity}</Text>
    </XStack>
  )
}
