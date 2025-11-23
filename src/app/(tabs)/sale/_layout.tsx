import { Stack } from 'expo-router'

export default function SaleLayout() {
  return (
    <Stack initialRouteName="index">
      <Stack.Screen name="index" options={{ title: 'Bán hàng' }} />
      <Stack.Screen
        name="select-product"
        options={{ title: 'Chọn sản phẩm' }}
      />
    </Stack>
  )
}
