import { ChevronRight, History, User } from '@tamagui/lucide-icons'
import { Href, useRouter } from 'expo-router'
import { Pressable } from 'react-native'
import { Button, Stack, Text, XStack } from 'tamagui'

import { useGetUserQuery } from '@/api'
import { DataWrapper, Divider } from '@/components'
import { useAppDispatch, useAppSelector } from '@/hooks/useAppHooks'
import { removeUser } from '@/store'

export default function Setting() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const logOut = () => {
    dispatch(removeUser())
  }

  const user = useAppSelector((state) => state.auth.user)
  const { data: userData, isLoading, error } = useGetUserQuery(user.id ?? '')

  return (
    <Stack p="$4" flex={1}>
      <DataWrapper p="$0" flex={0} isLoading={isLoading} error={error}>
        <XStack
          px="$4"
          onPress={() => router.push(`/(tabs)/setting/staffs/${user.id}`)}
        >
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
          <Stack>
            <Text fontSize="$6" fontWeight="bold">
              {userData?.name}
            </Text>
            <Text fontSize="$6">{userData?.email}</Text>
          </Stack>
        </XStack>
      </DataWrapper>
      <Divider thickness={6} my="$4" mx="$-4" fullBleed />
      <Stack flex={1} px="$4">
        {user.role === 'MANAGER' && (
          <>
            <SettingItem
              title="Quản lý nhân viên"
              icon={<User />}
              route="/(tabs)/setting/staffs"
            />
            <SettingItem
              title="Xem nhật kí hoạt động"
              icon={<History />}
              route="/(tabs)/setting/audit-logs"
            />
          </>
        )}
      </Stack>
      <Button
        variant="outlined"
        theme="red"
        width="100%"
        onPress={() => logOut()}
      >
        Đăng xuất
      </Button>
    </Stack>
  )
}

type SettingItemProps = {
  title: string
  icon: React.ReactNode
  route: Href
}

function SettingItem({ title, icon, route }: SettingItemProps) {
  const router = useRouter()
  return (
    <Pressable onPress={() => router.push(route)}>
      <XStack items="center" my="$3">
        {icon}
        <Text flex={1} mx="$4" fontSize="$6">
          {title}
        </Text>
        <ChevronRight />
      </XStack>
    </Pressable>
  )
}
