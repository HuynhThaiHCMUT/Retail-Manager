import { SignInDto, SignInDtoSchema } from '@/dto/auth.dto'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Stack, Button, Spinner, Image } from 'tamagui'
import { useSignInMutation } from '@/utils/api.service'
import { useAppDispatch } from '@/hooks/useAppHooks'
import { setUser } from '@/utils/auth.slice'
import { useRouter } from 'expo-router'
import handleError from '@/utils/error-handler'
import { openDialog } from '@/utils/dialog.slice'
import { PasswordInput } from '@/components/PasswordInput'
import { ScreenContainer } from '@/components/ScreenContainer'
import { FormInput } from '@/components/FormInput'

export default function SignIn() {
  const dispatch = useAppDispatch()
  const router = useRouter()

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

          {/* <Text
            text="center"
            fontSize="$2"
          >
            Bạn chưa có tài khoản?{' '}
            <Text
              theme="blue"
              hoverStyle={{ textDecorationLine: 'underline', cursor: 'pointer' }}
              onPress={() => router.push('/auth/sign-up')}
            >
              Đăng ký
            </Text>
          </Text> */}
        </Stack>
      </Stack>
    </ScreenContainer>
  )
}
