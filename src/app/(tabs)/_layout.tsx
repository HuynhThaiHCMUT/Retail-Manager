import {
  Cog,
  FileText,
  Home,
  Package,
  ShoppingCart,
} from '@tamagui/lucide-icons'
import { Redirect, Tabs } from 'expo-router'

import { useAppSelector } from '@/hooks/useAppHooks'

export default function TabLayout() {
  const auth = useAppSelector((state) => state.auth)
  if (!auth.user.token) return <Redirect href="/auth" />
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarHideOnKeyboard: true }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Trang chủ',
          tabBarIcon: (props) => (
            <Home size={props.size} color={props.color as any} />
          ),
        }}
      />
      <Tabs.Screen
        name="inventory"
        options={{
          title: 'Kho hàng',
          tabBarIcon: (props) => (
            <Package size={props.size} color={props.color as any} />
          ),
        }}
      />
      <Tabs.Screen
        name="sale"
        options={{
          title: 'Bán hàng',
          tabBarIcon: (props) => (
            <ShoppingCart size={props.size} color={props.color as any} />
          ),
        }}
      />
      <Tabs.Screen
        name="order"
        options={{
          title: 'Đơn hàng',
          tabBarIcon: (props) => (
            <FileText size={props.size} color={props.color as any} />
          ),
        }}
      />
      <Tabs.Screen
        name="setting"
        options={{
          title: 'Cài đặt',
          tabBarIcon: (props) => (
            <Cog size={props.size} color={props.color as any} />
          ),
        }}
      />
    </Tabs>
  )
}
