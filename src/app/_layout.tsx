import { useEffect } from 'react'

import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
  useTheme as useNavigationTheme,
} from '@react-navigation/native'
import { Stack } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import { StatusBar } from 'expo-status-bar'
import { Platform, useColorScheme } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Provider } from 'react-redux'
import { TamaguiProvider, View } from 'tamagui'

import { GlobalDialog } from '@/components'
import { AuthDto } from '@/dto'
import { useAppDispatch } from '@/hooks/useAppHooks'
import { setUser, store } from '@/store'

import '../../tamagui-web.css'
import { tamaguiConfig } from '../../tamagui.config'

function App() {
  const dispatch = useAppDispatch()
  const getData = async () => {
    let user: AuthDto | null = null
    if (Platform.OS == 'ios' || Platform.OS == 'android') {
      user = JSON.parse((await SecureStore.getItemAsync('user')) ?? '{}')
    } else {
      user = JSON.parse((await AsyncStorage.getItem('user')) ?? '{}')
    }
    if (user?.token) dispatch(setUser(user))
  }

  useEffect(() => {
    getData()
  }, [])

  const { colors } = useNavigationTheme()
  colors.background = 'transparent'

  return (
    <View bg="$background" flex={1}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </View>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const colorScheme = useColorScheme()

  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <TamaguiProvider config={tamaguiConfig} defaultTheme={colorScheme!}>
            <StatusBar style="auto" backgroundColor="" />
            <ThemeProvider
              value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
            >
              <GlobalDialog />
              <App />
            </ThemeProvider>
          </TamaguiProvider>
        </GestureHandlerRootView>
      </Provider>
    </SafeAreaProvider>
  )
}

export const unstable_settings = {
  initialRouteName: 'index',
}
