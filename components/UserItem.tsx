import { ProductDto } from '@/dto/product.dto'
import { UserDto } from '@/dto/user.dto'
import getImageUrl from '@/utils/get-image'
import { User } from '@tamagui/lucide-icons'
import { useRouter } from 'expo-router'
import { XStack, Text, Image, Stack } from 'tamagui'

export interface UserItemProps {
  item: UserDto
  onPress?: () => void
}

export function UserItem({ item, onPress }: UserItemProps) {
  const router = useRouter()

  const handlePress = () => {
    if (onPress) {
      onPress()
    } else {
      router.push(`/(tabs)/setting/staffs/${item.id}`)
    }
  }
  return (
    <XStack p="$2" onPress={handlePress}>
      {item.picture ? (
        <Image
          source={{ uri: getImageUrl(item.picture) }}
          width="$4"
          height="$4"
          rounded="$10"
          alt="User Image"
          mr="$4"
        />
      ) : (
        <Stack
          rounded="$10"
          width={48}
          height={48}
          borderWidth={1}
          borderColor="$borderColor"
          justify="center"
          items="center"
          mr="$4"
        >
          <User size={32} />
        </Stack>
      )}
      <Stack flex={1}>
        <Text>{item.name}</Text>
        <Text>{item.email}</Text>
      </Stack>
    </XStack>
  )
}
