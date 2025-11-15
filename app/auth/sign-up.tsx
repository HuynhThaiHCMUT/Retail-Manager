import { SignUpDto, SignUpDtoSchema } from '@/dto/auth.dto'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Stack, Text, Button, Spinner, Image } from 'tamagui'
import { useSignUpMutation } from '@/utils/api.service'
import { useAppDispatch } from '@/hooks/useAppHooks'
import { setUser } from '@/store/auth.slice'
import { useRouter } from 'expo-router'
import handleError from '@/utils/error-handler'
import { openDialog } from '@/store/dialog.slice'
import { PasswordInput } from '@/components/PasswordInput'
import { Role } from '@/utils/enum'
import { ScreenContainer } from '@/components/ScreenContainer'
import { FormInput } from '@/components/FormInput'

export default function SignUp() {
  const dispatch = useAppDispatch()
  const router = useRouter()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpDto>({
    resolver: zodResolver(SignUpDtoSchema),
  })

  const [signUp, { isLoading }] = useSignUpMutation()

  const onSubmit = async (data: SignUpDto) => {
    const result = await signUp({ ...data, role: Role.CUSTOMER })
    if (result.error) {
      dispatch(
        openDialog({
          variant: 'error',
          title: 'Đăng ký thất bại',
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

        <Stack py="$4" gap="$4" width="$20" overflow="scroll" maxH="100%">
          <FormInput
            control={control}
            name="name"
            label="Họ và tên:"
            placeholder="Họ và tên"
            errors={errors}
          />

          <FormInput
            control={control}
            name="phone"
            label="Số điện thoại:"
            placeholder="Số điện thoại"
            errors={errors}
          />

          <FormInput
            control={control}
            name="email"
            label="Email:"
            placeholder="Email"
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

          <FormInput
            control={control}
            name="confirmPassword"
            label="Nhập lại mật khẩu:"
            placeholder="Nhập lại mật khẩu"
            errors={errors}
            secureTextEntry
            InputComponent={PasswordInput}
          />

          <Button
            onPress={handleSubmit(onSubmit)}
            width="100%"
            disabled={isLoading}
            theme="blue"
            variant="outlined"
          >
            {isLoading ? <Spinner /> : 'Đăng ký'}
          </Button>

          <Text text="center" fontSize="$2">
            Bạn đã có tài khoản?{' '}
            <Text
              theme="blue"
              hoverStyle={{
                textDecorationLine: 'underline',
                cursor: 'pointer',
              }}
              onPress={() => router.push('/auth/sign-in')}
            >
              Đăng nhập
            </Text>
          </Text>
        </Stack>
      </Stack>
    </ScreenContainer>
  )
}
