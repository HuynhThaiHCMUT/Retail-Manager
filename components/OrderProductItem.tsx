import { useGetProductQuery } from '@/utils/api.service'
import getImageUrl from '@/utils/get-image'
import { useAppDispatch } from '@/hooks/useAppHooks'
import {
  OrderProductItemDto,
  removeItem,
  updateQuantity,
  updateUnit,
} from '@/store/order.slice'
import { Minus, Plus, Trash } from '@tamagui/lucide-icons'
import { XStack, Text, Image, Stack, Button } from 'tamagui'
import { Select } from './Select'
import { forwardRef } from 'react'
import { SwipeableRow } from './SwipableRow'

export interface OrderProductItemProps {
  item: OrderProductItemDto
  editable?: boolean
  onOpen?: (id: string) => void
  onDelete?: (id: string) => void // optional delete callback
}

export interface OrderProductItemRef {
  close: () => void
}

export const OrderProductItem = forwardRef<
  OrderProductItemRef,
  OrderProductItemProps
>(({ item, editable = true, onOpen, onDelete }, ref) => {
  const dispatch = useAppDispatch()
  const { data: product } = useGetProductQuery(item.id)

  const setUnit = (unit: string) => {
    if (product) {
      let unitPrice = product.price
      if (product.baseUnit !== unit) {
        const foundUnit = product.units?.find((u) => u.name === unit)
        if (foundUnit) {
          unitPrice = foundUnit.price
        }
      }
      if (unitPrice !== item.price || unit !== item.unit) {
        dispatch(
          updateUnit({
            id: item.id,
            oldUnit: item.unit,
            newUnit: unit,
            price: unitPrice,
          })
        )
      }
    }
  }

  return (
    product && (
      <SwipeableRow
        ref={ref}
        id={item.id}
        onOpen={onOpen}
        enabled={editable}
        action={
          <XStack
            position="absolute"
            r={0}
            t={0}
            b={0}
            items="center"
            justify="center"
            onPress={() => {
              dispatch(removeItem({ id: item.id, unit: item.unit }))
              onDelete?.(item.id)
            }}
          >
            <Trash color="$red10" />
          </XStack>
        }
      >
        <XStack p="$2" items="center" bg="$background">
          {product.pictures && product.pictures?.length > 0 && (
            <Image
              source={{ uri: getImageUrl(product.pictures[0]) }}
              width="$4"
              height="$4"
              alt="Product Image"
              mr="$4"
            />
          )}
          <Stack flex={1}>
            <XStack flex={1}>
              <Text flex={1} flexWrap="wrap">
                {product.name}
              </Text>
              <Text ml="$4">{item.total} đ</Text>
            </XStack>
            <XStack gap="$4" items="center">
              <Text width="25%">{item.price} đ</Text>
              {editable ? (
                <>
                  {product.baseUnit &&
                    (product.units && product.units.length > 0 ? (
                      <Select
                        flex={1}
                        size="$2"
                        options={[
                          product.baseUnit,
                          ...product.units?.map((unit) => unit.name),
                        ]}
                        value={item.unit}
                        onChange={setUnit}
                      />
                    ) : (
                      <Text flex={1}>{product.baseUnit}</Text>
                    ))}
                  <Button
                    size="$2"
                    onPress={() =>
                      dispatch(
                        updateQuantity({
                          id: item.id,
                          unit: item.unit,
                          delta: -1,
                        })
                      )
                    }
                  >
                    <Minus size={12} />
                  </Button>
                  <Text>{item.quantity}</Text>
                  <Button
                    size="$2"
                    onPress={() =>
                      dispatch(
                        updateQuantity({
                          id: item.id,
                          unit: item.unit,
                          delta: 1,
                        })
                      )
                    }
                  >
                    <Plus size={12} />
                  </Button>
                </>
              ) : (
                <></>
              )}
            </XStack>
          </Stack>
        </XStack>
      </SwipeableRow>
    )
  )
})
