import { useEffect } from 'react'

import { useRouter } from 'expo-router'
import { Spinner, XStack } from 'tamagui'

import { useGetProductsQuery } from '@/api'
import { useAppDispatch, useAppSelector } from '@/hooks/useAppHooks'
import { restoreUser } from '@/store'
import { BASE_PRODUCT_QUERY } from '@/utils'

export default function SplashScreen() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const auth = useAppSelector((state) => state.auth)
  const _ = useGetProductsQuery(BASE_PRODUCT_QUERY)
  const getData = async () => {
    //const onboarding = await AsyncStorage.getItem('onboarding')
    dispatch(restoreUser())
    await new Promise((resolve) => setTimeout(resolve, 1000))
    if (auth?.user.token) {
      router.navigate('/(tabs)/home')
    } else {
      router.navigate('/auth')
    }
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <XStack py="$2" flex={1} justify="center" items="center">
      <Spinner />
    </XStack>
  )
}
