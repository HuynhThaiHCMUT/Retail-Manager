import '../tamagui-web.css'

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
  useTheme as useNavigationTheme,
} from '@react-navigation/native'
import { Stack } from 'expo-router'
import { Platform, useColorScheme } from 'react-native'
import { TamaguiProvider, View } from 'tamagui'
import { StatusBar } from 'expo-status-bar'
import { tamaguiConfig } from '../tamagui.config'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Provider } from 'react-redux'
import { store } from '@/store'
import { useEffect } from 'react'
import { useAppDispatch } from '@/hooks/useAppHooks'
import { AuthDto } from '@/dto/auth.dto'
import { setUser } from '@/store/auth.slice'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as SecureStore from 'expo-secure-store'
import { GlobalDialog } from '@/components/GlobalDialog'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

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
