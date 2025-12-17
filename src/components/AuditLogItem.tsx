import { ArrowRight } from '@tamagui/lucide-icons'
import { useRouter } from 'expo-router'
import { Stack, Text, XStack } from 'tamagui'

import { AuditLogDto } from '@/dto'
import { MODULE_NAMES } from '@/utils'

export interface AuditLogItemProps {
  item: AuditLogDto
}

export function AuditLogItem({ item }: AuditLogItemProps) {
  const router = useRouter()

  return (
    <Stack p="$2">
      <XStack justify="space-between">
        <Text fontWeight="bold">{MODULE_NAMES[item.module]}</Text>
        <Text fontSize="$2">{new Date(item.changedAt).toLocaleString()}</Text>
      </XStack>
      <XStack justify="space-between">
        <Text fontWeight="bold">{item.currentRecord?.name}</Text>
        <Text fontSize="$2">Thay đổi bởi: {item.changedBy}</Text>
      </XStack>
      <Text fontWeight="bold">{item.fieldName}</Text>
      <XStack justify="space-between">
        <Text flex={3}>{item.oldValue ?? '<Không có>'}</Text>
        <Stack flex={1} items="center">
          <ArrowRight />
        </Stack>
        <Stack flex={3} items="flex-end">
          <Text>{item.newValue ?? '<Không có>'}</Text>
        </Stack>
      </XStack>
    </Stack>
  )
}
