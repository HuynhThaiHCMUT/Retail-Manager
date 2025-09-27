import React from 'react'
import { Dimensions } from 'react-native'
import { GetThemeValueForKey, Stack } from 'tamagui'

type DividerProps = {
  type?: 'horizontal' | 'vertical'
  thickness?: number | GetThemeValueForKey<'width'> // number => pixels, or a Tamagui token like '$1'
  color?: GetThemeValueForKey<'backgroundColor'> // default token or any color string
  fullBleed?: boolean // if true, takes full width/height of parent container
} & React.ComponentProps<typeof Stack>

export function Divider({
  type = 'horizontal',
  thickness = 1,
  color = '$borderColor',
  fullBleed = false,
  ...rest
}: DividerProps) {
  const isHorizontal = type === 'horizontal'
  const length = fullBleed
    ? Dimensions.get('window')[isHorizontal ? 'width' : 'height']
    : '100%'

  return (
    <Stack
      {...rest}
      width={isHorizontal ? length : thickness}
      height={isHorizontal ? thickness : length}
      bg={color}
    />
  )
}
