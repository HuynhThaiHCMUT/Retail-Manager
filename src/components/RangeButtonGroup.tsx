import React from 'react'

import { Button, StackProps, Text, XStack, styled } from 'tamagui'

import { RangeType } from '@/dto'

interface MetricToggleProps extends StackProps {
  value: RangeType
  onChange: (v: RangeType) => void
  defaultValue?: RangeType
}

export function RangeButtonGroup({
  value,
  onChange,
  defaultValue = 'day',
  ...rest
}: MetricToggleProps) {
  const [internal, setInternal] = React.useState<RangeType>(defaultValue)
  const selected = value ?? internal

  return (
    <Container {...rest}>
      <OptionButton
        isSelected={selected === 'day'}
        onPress={() => onChange('day')}
      >
        <Text fontSize={14} fontWeight="600">
          Ngày
        </Text>
      </OptionButton>

      <OptionButton
        isSelected={selected === 'week'}
        onPress={() => onChange('week')}
      >
        <Text fontSize={14} fontWeight="600">
          Tuần
        </Text>
      </OptionButton>

      <OptionButton
        isSelected={selected === 'month'}
        onPress={() => onChange('month')}
      >
        <Text fontSize={14} fontWeight="600">
          Tháng
        </Text>
      </OptionButton>
    </Container>
  )
}

const Container = styled(XStack, {
  rounded: '$10',
  items: 'center',
  bg: '$color7',
  p: '$1',
})

function OptionButton({
  children,
  isSelected,
  onPress,
}: {
  children: React.ReactNode
  isSelected: boolean
  onPress?: () => void
}) {
  return (
    <Button
      onPress={onPress}
      rounded="$10"
      size="$2"
      width="$8"
      justify="center"
      borderWidth={2}
      variant={isSelected ? undefined : 'outlined'}
    >
      {children}
    </Button>
  )
}
