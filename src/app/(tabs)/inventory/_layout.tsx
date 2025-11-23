import { Stack } from 'expo-router'

export default function InventoryLayout() {
  return (
    <Stack initialRouteName="index">
      <Stack.Screen name="index" options={{ title: 'Kho hàng' }} />
      <Stack.Screen name="[id]" options={{ title: 'Sản phẩm' }} />
    </Stack>
  )
}
