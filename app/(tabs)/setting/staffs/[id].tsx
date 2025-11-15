import { Button, Stack, Text, XStack, Image } from 'tamagui'
import {
  useCreateUserMutation,
  useDeleteUserMutation,
  useGetUserQuery,
  useUpdateUserMutation,
  useUploadUserImageMutation,
} from '@/utils/api.service'
import { User } from '@tamagui/lucide-icons'
import DataWrapper from '@/components/DataWrapper'
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router'
import { useAppDispatch } from '@/hooks/useAppHooks'
import { skipToken } from '@reduxjs/toolkit/query'
import { useForm, UseFormReturn } from 'react-hook-form'
import {
  CreateUserDto,
  CreateUserDtoSchema,
  UpdateUserDto,
  UpdateUserDtoSchema,
} from '@/dto/user.dto'
import { zodResolver } from '@hookform/resolvers/zod'
import { ImagePickerAsset } from 'expo-image-picker'
import { useEffect, useMemo, useState } from 'react'
import { openDialog } from '@/store/dialog.slice'
import handleError from '@/utils/error-handler'
import { ScreenContainer } from '@/components/ScreenContainer'
import { FormInput } from '@/components/FormInput'
import { Select } from '@/components/Select'
import { Role } from '@/utils/enum'
import { pickImage } from '@/utils/image-picker'
import getImageUrl from '@/utils/get-image'
import { PasswordInput } from '@/components/PasswordInput'

export default function UserInfo() {
  const navigation = useNavigation()
  const router = useRouter()
  const dispatch = useAppDispatch()

  const { id: idParam } = useLocalSearchParams()
  const id = idParam instanceof Array ? idParam[0] : idParam
  const isNew = id === 'new'
  const {
    data: userData,
    isLoading,
    error,
    refetch,
  } = useGetUserQuery(!isNew ? (id as string) : skipToken)

  const createForm = useForm<CreateUserDto>({
    resolver: zodResolver(CreateUserDtoSchema),
  })
  const updateForm = useForm<UpdateUserDto>({
    resolver: zodResolver(UpdateUserDtoSchema),
  })
  const form = (isNew ? createForm : updateForm) as UseFormReturn<
    CreateUserDto & UpdateUserDto
  >

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = form

  useEffect(() => {
    if (userData && !isNew) {
      reset(userData)
    }
  }, [userData, isNew, reset])

  const [createUser, { isLoading: creating }] = useCreateUserMutation()
  const [updateUser, { isLoading: updating }] = useUpdateUserMutation()
  const [deleteUser, { isLoading: deleting }] = useDeleteUserMutation()
  const [uploadUserImage] = useUploadUserImageMutation()
  const [image, setImage] = useState<ImagePickerAsset>()

  const picture = useMemo(() => {
    if (image) return image.uri
    if (userData?.picture) return getImageUrl(userData.picture)
    return null
  }, [image, userData])

  const onPickImages = async () => {
    const img = await pickImage()
    if (img) setImage(img[0])
  }

  const onSubmit = async (data: CreateUserDto | UpdateUserDto) => {
    const result = isNew
      ? await createUser(data as CreateUserDto)
      : await updateUser({ id, ...data })

    if ('error' in result) {
      dispatch(
        openDialog({
          variant: 'error',
          title: isNew ? 'Thêm người dùng thất bại' : 'Cập nhật thất bại',
          message: handleError(result.error),
        })
      )
      return
    }

    if (image) {
      const uploadResult = await uploadUserImage({
        id: isNew ? result.data.id : id,
        file: image,
      })

      if ('error' in uploadResult) {
        dispatch(
          openDialog({
            variant: 'error',
            title: 'Tải ảnh lên thất bại',
            message: handleError(uploadResult.error),
          })
        )
        return
      }
    }

    dispatch(
      openDialog({
        variant: 'success',
        title: isNew ? 'Thêm người dùng thành công' : 'Cập nhật thành công',
      })
    )

    router.back()
  }

  return (
    <DataWrapper isLoading={isLoading} error={error} refetch={refetch}>
      <ScreenContainer>
        <Stack gap="$4">
          <Stack
            rounded="$10"
            width={64}
            height={64}
            borderWidth={1}
            borderColor="$borderColor"
            justify="center"
            items="center"
            self="center"
            mr="$4"
            mb="$4"
            onPress={onPickImages}
          >
            {picture ? (
              <Image
                source={{ uri: picture }}
                width="$6"
                height="$6"
                rounded="$12"
                alt="Ảnh sản phẩm"
              />
            ) : (
              <User size={48} />
            )}
          </Stack>
          <FormInput
            control={control}
            name="name"
            label="Tên người dùng:"
            placeholder="Nhập tên người dùng"
            errors={errors}
          />
          <FormInput
            control={control}
            name="password"
            label="Mật khẩu:"
            placeholder={
              isNew
                ? 'Nhập mật khẩu mặc định'
                : 'Để trống nếu không đổi mật khẩu'
            }
            errors={errors}
            InputComponent={PasswordInput}
          />
          <FormInput
            control={control}
            name="phone"
            label="Số điện thoại:"
            placeholder="Nhập số điện thoại người dùng"
            errors={errors}
          />
          <FormInput
            control={control}
            name="email"
            label="E-mail:"
            placeholder="Nhập email người dùng"
            defaultValue={[]}
            errors={errors}
          />
          <XStack items="center">
            <Text mb="$2" flex={1}>
              Phân quyền
            </Text>
            <Select
              width="$10"
              placeholder={
                userData?.role === Role.MANAGER ? 'Quản lý' : 'Nhân viên'
              }
              options={['Quản lý', 'Nhân viên']}
              onChange={(value) =>
                setValue(
                  'role',
                  value === 'Quản lý' ? Role.MANAGER : Role.EMPLOYEE
                )
              }
            />
          </XStack>
        </Stack>
      </ScreenContainer>
      <Button
        onPress={handleSubmit(onSubmit)}
        theme="blue"
        mx="$4"
        my="$2"
        disabled={creating || updating}
      >
        {isNew ? 'Thêm người dùng' : 'Cập nhật người dùng'}
      </Button>
    </DataWrapper>
  )
}
