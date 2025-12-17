import { zodResolver } from '@hookform/resolvers/zod'
import { Redirect, useRouter } from 'expo-router'
import { useForm } from 'react-hook-form'
import { Button, Image, Spinner, Stack } from 'tamagui'

import { useSignInMutation } from '@/api'
import { FormInput, PasswordInput, ScreenContainer } from '@/components'
import { SignInDto, SignInDtoSchema } from '@/dto'
import { useAppDispatch, useAppSelector } from '@/hooks/useAppHooks'
import { openDialog, setUser } from '@/store'
import { handleError } from '@/utils'

export default function SignIn() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const auth = useAppSelector((state) => state.auth)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInDto>({
    resolver: zodResolver(SignInDtoSchema),
  })

  const [signIn, { isLoading }] = useSignInMutation()

  const onSubmit = async (data: SignInDto) => {
    const result = await signIn(data)
    if (result.error) {
      dispatch(
        openDialog({
          variant: 'error',
          title: 'Đăng nhập thất bại',
          message: handleError(result.error),
        })
      )
    } else {
      dispatch(setUser(result.data))
      router.navigate('/(tabs)/home')
    }
  }

  if (auth.user.token) return <Redirect href="/(tabs)/home" />

  return (
    <ScreenContainer>
      <Stack flex={1} justify="center" items="center">
        <Image
          source={require('@/assets/images/Logo.png')}
          width="60%"
          objectFit="contain"
          alt="Logo"
          mt="$4"
        />
        <Stack py="$4" gap="$4" width="$20">
          <FormInput
            control={control}
            name="phone"
            label="Số điện thoại:"
            placeholder="Số điện thoại"
            errors={errors}
          />

          <FormInput
            control={control}
            name="password"
            label="Mật khẩu:"
            placeholder="Mật khẩu"
            errors={errors}
            secureTextEntry
            InputComponent={PasswordInput}
          />

          <Button
            onPress={handleSubmit(onSubmit)}
            width="100%"
            disabled={isLoading}
            theme="blue"
          >
            {isLoading ? <Spinner /> : 'Đăng nhập'}
          </Button>
        </Stack>
      </Stack>
    </ScreenContainer>
  )
}
