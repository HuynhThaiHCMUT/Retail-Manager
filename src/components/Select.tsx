import { useRef, useState } from 'react'

import { Portal } from '@tamagui/portal'
import { View } from 'react-native'
import {
  Button,
  ButtonProps,
  ListItem,
  Paragraph,
  Stack,
  StackProps,
  YStack,
} from 'tamagui'

type Option = {
  label: string
  value: string
}

export interface SelectProps extends StackProps {
  options: Option[] | string[]
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  trigger?: React.ReactNode // let consumers define their trigger UI
  size?: ButtonProps['size'] // size prop to control button size
}

export function Select({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  trigger,
  size = '$3',
  ...rest
}: SelectProps) {
  const parsedOptions: Option[] =
    typeof options[0] === 'string'
      ? (options as string[]).map((opt) => ({ label: opt, value: opt }))
      : (options as Option[])
  const [open, setOpen] = useState(false)
  const [dropdownPos, setDropdownPos] = useState<{
    x: number
    y: number
    width: number
    height: number
  } | null>(null)

  const buttonRef = useRef<View>(null)

  const selectedLabel =
    parsedOptions.find((opt) => opt.value === value)?.label ?? placeholder

  const toggleDropdown = () => {
    if (open) {
      setOpen(false)
      return
    }

    buttonRef.current?.measureInWindow((x, y, width, height) => {
      setDropdownPos({ x, y, width, height })
      setOpen(true)
    })
  }

  return (
    <YStack {...rest}>
      {/* Trigger */}
      <Button ref={buttonRef} size={size} onPress={toggleDropdown}>
        {trigger ?? selectedLabel}
      </Button>

      {/* Dropdown + Backdrop */}
      {open && dropdownPos && (
        <Portal>
          {/* Fullscreen backdrop */}
          <Stack
            onPress={() => setOpen(false)}
            t={0}
            l={0}
            width="100%"
            height="100%"
            z={99}
          />

          {/* Dropdown */}
          <Stack
            position="absolute"
            t={dropdownPos.y + dropdownPos.height + 20}
            l={dropdownPos.x}
            z={100}
            bg="$background"
            borderWidth={1}
            borderColor="$borderColor"
            rounded="$4"
            mt="$2"
            elevationAndroid={4}
            shadowColor="rgba(0,0,0,0.2)"
          >
            {parsedOptions.map((opt) => (
              <ListItem
                key={opt.value}
                size={size}
                onPress={() => {
                  onChange(opt.value)
                  setOpen(false)
                }}
                bg={opt.value === value ? '$blue5' : 'transparent'}
              >
                <Paragraph>{opt.label}</Paragraph>
              </ListItem>
            ))}
          </Stack>
        </Portal>
      )}
    </YStack>
  )
}
