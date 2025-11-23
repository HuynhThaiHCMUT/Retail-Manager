import { Stack } from 'expo-router'

export default function OrderLayout() {
  return (
    <Stack initialRouteName="index">
      <Stack.Screen name="index" options={{ title: 'Đơn hàng' }} />
      <Stack.Screen name="[id]" options={{ title: 'Chi tiết đơn hàng' }} />
    </Stack>
  )
}
