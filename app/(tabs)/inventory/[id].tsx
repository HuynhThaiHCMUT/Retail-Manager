import { CategoryInput } from '@/components/CategoryInput'
import { FormInput } from '@/components/FormInput'
import { ScreenContainer } from '@/components/ScreenContainer'
import { CreateProductDto, CreateProductDtoSchema } from '@/dto/product.dto'
import {
  useCreateProductMutation,
  useUpdateProductMutation,
  useGetProductQuery,
  useUploadProductImagesMutation,
  useDeleteProductMutation,
} from '@/utils/api.service'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router'
import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button, Image, Stack, Text, XStack } from 'tamagui'
import { useEffect } from 'react'
import { openDialog, registerDialogCallback } from '@/utils/dialog.slice'
import { useAppDispatch } from '@/hooks/useAppHooks'
import handleError from '@/utils/error-handler'
import { skipToken } from '@reduxjs/toolkit/query'
import { ImagePickerAsset } from 'expo-image-picker'
import { pickImage } from '@/utils/image-picker'
import { Image as ImageIcon, Trash2 } from '@tamagui/lucide-icons'
import getImageUrl from '@/utils/get-image'
import { Divider } from '@/components/Divider'
import UnitsEditor from '@/components/UnitsEditor'
import { UnitDto } from '@/dto/unit.dto'
import { useConfirmAction } from '@/hooks/useConfirmAction'

export default function ProductDetail() {
  const navigation = useNavigation()
  const router = useRouter()
  const dispatch = useAppDispatch()

  const { id: idParam } = useLocalSearchParams()
  const id = idParam instanceof Array ? idParam[0] : idParam
  const isNew = id === 'new'

  const { data, isLoading } = useGetProductQuery(
    !isNew ? (id as string) : skipToken
  )

  const [createProduct, { isLoading: creating }] = useCreateProductMutation()
  const [updateProduct, { isLoading: updating }] = useUpdateProductMutation()
  const [deleteProduct, { isLoading: deleting }] = useDeleteProductMutation()
  const [uploadProductImages] = useUploadProductImagesMutation()
  const [images, setImages] = useState<ImagePickerAsset[]>([])
  const unitEditorRef = useRef<{ validateAndSave: () => UnitDto[] | null }>()

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    watch,
    formState: { errors },
  } = useForm<CreateProductDto>({
    resolver: zodResolver(CreateProductDtoSchema),
    defaultValues: {
      categories: [],
      units: [],
    },
  })

  useEffect(() => {
    if (data && !isNew) {
      reset({
        ...data,
        quantity: data.quantity?.toString() as unknown as number,
        price: data.price?.toString() as unknown as number,
        basePrice: data.basePrice?.toString() as unknown as number,
      })
    }
  }, [data, isNew, reset])

  const onSubmit = async (formData: CreateProductDto) => {
    try {
      const units = unitEditorRef.current?.validateAndSave()
      if (!units) return

      const parsedData = {
        ...formData,
        quantity: parseInt(formData.quantity as unknown as string),
        price: parseInt(formData.price as unknown as string),
        basePrice: parseInt(formData.basePrice as unknown as string),
        units: units ?? [],
      }

      const result = isNew
        ? await createProduct(parsedData)
        : await updateProduct({ id, ...parsedData })

      if ('error' in result) {
        dispatch(
          openDialog({
            variant: 'error',
            title: isNew ? 'Thêm sản phẩm thất bại' : 'Cập nhật thất bại',
            message: handleError(result.error),
          })
        )
        return
      }

      if (images.length > 0) {
        const uploadResult = await uploadProductImages({
          id: isNew ? result.data.id : id,
          files: images,
        })

        console.log(uploadResult)

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
          title: isNew ? 'Thêm sản phẩm thành công' : 'Cập nhật thành công',
        })
      )

      router.back()
    } catch (err) {
      dispatch(
        openDialog({
          variant: 'error',
          title: 'Lỗi không xác định',
          message: 'Vui lòng thử lại',
        })
      )
    }
  }

  const onPickImages = async () => {
    const img = await pickImage()
    if (img) setImages([...images, ...img])
  }

  const { askConfirm } = useConfirmAction({
    confirmTitle: 'Xoá sản phẩm',
    confirmMessage: 'Bạn có chắc chắn muốn xoá sản phẩm này?',
    successTitle: 'Xoá sản phẩm thành công',
    errorTitle: 'Xoá sản phẩm thất bại',
  })

  const onDelete = useCallback(() => {
    askConfirm(
      async () => {
        const result = await deleteProduct(id)
        return result
      },
      { onSuccess: () => router.back() }
    )
  }, [askConfirm, deleteProduct, id, router])

  useLayoutEffect(() => {
    navigation.setOptions({
      title: isNew ? 'Thêm sản phẩm' : 'Chi tiết sản phẩm',
      headerRight: () =>
        !isNew && (
          <Button size="$2" theme="red" disabled={isLoading} onPress={onDelete}>
            <Trash2 size={12} />
            Xoá
          </Button>
        ),
    })
  }, [id, navigation])

  return (
    <>
      <ScreenContainer>
        <Stack px="$4" flex={1} gap="$2">
          <FormInput
            control={control}
            name="name"
            label="Tên sản phẩm:"
            placeholder="Nhập tên sản phẩm"
            errors={errors}
          />
          <FormInput
            control={control}
            name="description"
            label="Mô tả:"
            placeholder="Nhập mô tả sản phẩm"
            errors={errors}
          />
          <FormInput
            control={control}
            name="categories"
            label="Danh mục:"
            placeholder="Nhập danh mục sản phẩm"
            defaultValue={[]}
            errors={errors}
            InputComponent={CategoryInput}
          />
          <FormInput
            control={control}
            name="quantity"
            label="Số lượng:"
            placeholder="Nhập số lượng sản phẩm"
            errors={errors}
          />
          <FormInput
            control={control}
            name="baseUnit"
            label="Đơn vị cơ bản:"
            placeholder="Nhập đơn vị cơ bản (ví dụ: cái, hộp, kg...)"
            errors={errors}
          />
          <XStack gap="$2">
            <FormInput
              control={control}
              name="price"
              label="Giá bán:"
              placeholder="Nhập giá bán"
              errors={errors}
              containerProps={{ flex: 1 }}
            />
            <FormInput
              control={control}
              name="basePrice"
              label="Giá vốn:"
              placeholder="Nhập giá vốn"
              errors={errors}
              containerProps={{ flex: 1 }}
            />
          </XStack>
          <Divider thickness={6} my="$2" mx="$-4" fullBleed />
          <Text fontWeight="bold">Ảnh sản phẩm:</Text>
          <XStack flexWrap="wrap" gap="$2" width="100%" items="center">
            <Stack
              onPress={onPickImages}
              width="$8"
              height="$6"
              items="center"
              justify="center"
              rounded="$2"
              borderWidth={2}
              borderColor="$borderColor"
            >
              <ImageIcon size="$4" />
            </Stack>
            {images.length > 0 &&
              images.map((image, index) => (
                <Image
                  key={index}
                  source={{ uri: image.uri }}
                  width="$6"
                  height="$6"
                  alt="Ảnh sản phẩm"
                />
              ))}
            {data?.pictures &&
              data.pictures.map((picture, index) => (
                <Image
                  key={index}
                  source={{ uri: getImageUrl(picture) }}
                  width="$6"
                  height="$6"
                  alt="Ảnh sản phẩm"
                />
              ))}
          </XStack>
          <Divider thickness={6} my="$2" mx="$-4" fullBleed />
        </Stack>
        {watch('baseUnit') && (
          <UnitsEditor
            ref={unitEditorRef}
            baseUnitName={getValues('baseUnit') ?? ''}
            units={data?.units ?? []}
          />
        )}
        <Divider thickness={6} my="$2" />
      </ScreenContainer>
      <Button
        onPress={handleSubmit(onSubmit)}
        theme="blue"
        mx="$4"
        my="$2"
        disabled={creating || updating}
      >
        {isNew ? 'Thêm sản phẩm' : 'Cập nhật sản phẩm'}
      </Button>
    </>
  )
}
