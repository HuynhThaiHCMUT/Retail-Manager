import { UnitDto } from '@/dto/unit.dto'
import { ArrowLeftRight, Trash } from '@tamagui/lucide-icons'
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { Pressable } from 'react-native'
import { XStack, YStack, Button, Input, Text } from 'tamagui'
import { SwipeableRow, SwipeableRowRef } from './SwipableRow'

// Internal representation keeps an id for list rendering and editing
type InternalUnit = UnitDto & { id: string }

type Props = {
  baseUnitName: string
  units: UnitDto[]
}

const UnitsEditor = forwardRef(
  ({ baseUnitName, units: initial }: Props, ref) => {
    const [units, setUnits] = useState<InternalUnit[]>(
      (initial || []).map((unit, i) => ({
        id: `u_${i}_${Math.random().toString(36).slice(2, 7)}`,
        ...unit,
      }))
    )

    const openRowIdRef = useRef<string | null>(null)
    const rowRefs = useRef(new Map<string, UnitItemRef | null>())

    const handleRowOpen = (id: string) => {
      const prevId = openRowIdRef.current
      if (prevId && prevId !== id) {
        const prevRef = rowRefs.current.get(prevId)
        prevRef?.close()
      }
      openRowIdRef.current = id
    }

    const handleOutsidePress = () => {
      if (openRowIdRef.current) {
        const prevRef = rowRefs.current.get(openRowIdRef.current)
        prevRef?.close()
        openRowIdRef.current = null
      }
    }

    useEffect(() => {
      setUnits(
        (initial || []).map((unit, i) => ({
          id: `u_${i}_${Math.random().toString(36).slice(2, 7)}`,
          ...unit,
        }))
      )
    }, [initial])

    const addUnit = () => {
      const unit: InternalUnit = {
        id: Math.random().toString(36).slice(2, 9),
        name: '',
        price: 0,
        enabled: true,
        weight: 1,
        fractionalWeight: undefined,
      }
      setUnits([...units, unit])
    }

    const removeUnit = (id: string) => {
      setUnits(units.filter((unit) => unit.id !== id))
    }

    const updateUnit = (id: string, patch: Partial<UnitDto>) => {
      setUnits((prev) =>
        prev.map((unit) => {
          if (unit.id !== id) return unit
          const merged: InternalUnit = { ...unit, ...patch }
          return merged
        })
      )
      rowRefs.current.get(id)?.setError(null)
    }

    useImperativeHandle(ref, () => ({
      validateAndSave: () => {
        console.log('Validating units...', units)
        for (const unit of units) {
          if (!unit.name || unit.name.trim() === '') {
            rowRefs.current
              .get(unit.id)
              ?.setError('Tên đơn vị không được để trống')
            return null
          }
          if (
            unit.price === undefined ||
            unit.price === null ||
            isNaN(unit.price) ||
            unit.price < 0
          ) {
            rowRefs.current
              .get(unit.id)
              ?.setError('Giá đơn vị phải là số nguyên không âm')
            return null
          }
          if (
            (unit.weight === undefined ||
              unit.weight === null ||
              isNaN(unit.weight) ||
              unit.weight < 0) &&
            (unit.fractionalWeight === undefined ||
              unit.fractionalWeight === null ||
              isNaN(unit.fractionalWeight) ||
              unit.fractionalWeight < 0)
          ) {
            rowRefs.current
              .get(unit.id)
              ?.setError(
                'Phải nhập ít nhất một trong hai trọng số cho đơn vị ' +
                  unit.name
              )
            return null
          }
        }
        return units.map(({ id, ...rest }) => rest)
      },
    }))

    return (
      <Pressable onPress={handleOutsidePress}>
        <YStack gap="$3">
          <XStack px="$4" items="center" justify="space-between">
            <Text fontWeight="800">Đơn vị (Đơn vị cơ bản: {baseUnitName})</Text>
            <Button size="$2" onPress={addUnit}>
              + Thêm đơn vị
            </Button>
          </XStack>
          {units.length === 0 ? (
            <Text px="$4" color="$color10">
              Chưa có đơn vị nào được thêm.
            </Text>
          ) : (
            <XStack px="$4" items="center">
              <Text flex={3} fontWeight="600">
                Tên đơn vị
              </Text>
              <Text flex={1} fontWeight="600">
                Giá
              </Text>
              <Text flex={1} fontWeight="600">
                Quy đổi
              </Text>
            </XStack>
          )}
          {units.map((item) => {
            const setRef = (r: UnitItemRef | null) => {
              if (r) rowRefs.current.set(item.id, r)
              else rowRefs.current.delete(item.id)
            }

            return (
              <UnitItem
                key={item.id}
                ref={setRef}
                baseUnitName={baseUnitName}
                unit={item}
                updateUnit={updateUnit}
                removeUnit={removeUnit}
                onOpen={() => handleRowOpen(item.id)}
                onDelete={() => {
                  const ref = rowRefs.current.get(item.id)
                  ref?.close()
                  if (openRowIdRef.current === item.id)
                    openRowIdRef.current = null
                }}
              />
            )
          })}
        </YStack>
      </Pressable>
    )
  }
)

type UnitProps = {
  baseUnitName: string
  unit: InternalUnit
  updateUnit: (id: string, patch: Partial<UnitDto>) => void
  removeUnit: (id: string) => void
  onOpen?: (id: string) => void
  onDelete?: (id: string) => void
}

type UnitItemRef = {
  close: () => void
  setError: (msg: string | null) => void
}

const UnitItem = forwardRef<UnitItemRef, UnitProps>(
  ({ baseUnitName, unit, updateUnit, removeUnit, onOpen, onDelete }, ref) => {
    const [isFractional, setIsFractional] = useState(!!unit.fractionalWeight)
    const [error, setError] = useState<string | null>(null)

    // wrapper ref to control swipe close
    const swipeRef = useRef<SwipeableRowRef | null>(null)

    // expose combined imperative handle: close (delegates to swipe) + setError
    useImperativeHandle(ref, () => ({
      close: () => {
        swipeRef.current?.close()
      },
      setError: (msg: string | null) => {
        setError(msg)
      },
    }))

    const changeMode = (toFractional: boolean) => {
      setIsFractional(toFractional)
      updateUnit(
        unit.id,
        toFractional
          ? { fractionalWeight: unit.weight ?? 1, weight: undefined }
          : { weight: unit.fractionalWeight ?? 1, fractionalWeight: undefined }
      )
      if (error) setError(null)
    }

    return (
      <SwipeableRow
        ref={swipeRef}
        id={unit.id}
        onOpen={onOpen}
        threshold={-40}
        action={
          <XStack
            position="absolute"
            r={0}
            t={0}
            b={0}
            items="center"
            justify="center"
            theme="red"
            onPress={() => {
              removeUnit(unit.id)
              onDelete?.(unit.id)
            }}
          >
            <Trash color="$red10" mr="$4" />
          </XStack>
        }
      >
        <YStack items="center" px="$4" bg="$background">
          <XStack items="center" gap="$2" mb="$2">
            <Input
              value={unit.name}
              placeholder="Tên đơn vị"
              onChangeText={(t) => updateUnit(unit.id, { name: t })}
              flex={3}
            />
            <Input
              value={String(unit.price ?? '')}
              placeholder="Giá"
              keyboardType="numeric"
              onChangeText={(t) =>
                updateUnit(unit.id, { price: t === '' ? 0 : Number(t) })
              }
              flex={1}
            />
            <Input
              value={String(
                isFractional
                  ? (unit.fractionalWeight ?? '')
                  : (unit.weight ?? '')
              )}
              onChangeText={(t) => {
                if (t === '')
                  return updateUnit(unit.id, {
                    weight: undefined,
                    fractionalWeight: undefined,
                  })
                const n = Number(t)
                if (isNaN(n) || n <= 0)
                  return updateUnit(unit.id, { weight: 0 })
                updateUnit(
                  unit.id,
                  isFractional
                    ? { fractionalWeight: n, weight: undefined }
                    : { weight: n, fractionalWeight: undefined }
                )
              }}
              flex={1}
            />
          </XStack>
          <XStack self="flex-end" items="center">
            <Text mr="$2">
              {isFractional ? (
                <>
                  1 {baseUnitName} ={' '}
                  <Text fontWeight="bold" textDecorationLine="underline">
                    {unit.fractionalWeight ?? '-'}
                  </Text>{' '}
                  {unit.name || 'đơn vị'}
                </>
              ) : (
                <>
                  1 {unit.name || 'đơn vị'} ={' '}
                  <Text fontWeight="bold" textDecorationLine="underline">
                    {unit.weight ?? '-'}
                  </Text>{' '}
                  {baseUnitName}
                </>
              )}
            </Text>
            <Button size="$2" onPress={() => changeMode(!isFractional)}>
              <ArrowLeftRight size={12} />
            </Button>
          </XStack>
          {error && (
            <XStack width="100%" mb="$2" px="$2" theme="red">
              <Text>{error}</Text>
            </XStack>
          )}
        </YStack>
      </SwipeableRow>
    )
  }
)

export default UnitsEditor
