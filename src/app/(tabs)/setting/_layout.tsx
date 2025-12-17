import { Stack } from 'expo-router'

export default function SaleLayout() {
  return (
    <Stack initialRouteName="index">
      <Stack.Screen name="index" options={{ title: 'Cài đặt' }} />
      <Stack.Screen
        name="staffs/[id]"
        options={{ title: 'Thông tin người dùng' }}
      />
      <Stack.Screen
        name="staffs/index"
        options={{ title: 'Quản lý nhân viên' }}
      />
      <Stack.Screen
        name="audit-logs"
        options={{ title: 'Nhật kí hoạt động' }}
      />
    </Stack>
  )
}
