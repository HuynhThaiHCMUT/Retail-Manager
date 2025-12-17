import React, { useCallback, useEffect, useRef, useState } from 'react'

import { Input, StackProps, XStack } from 'tamagui'

interface SearchBarProps extends StackProps {
  value: string
  onChange: (text: string) => void
  rightIcon?: React.ReactNode
}

export function SearchBar({
  value,
  onChange,
  rightIcon,
  ...rest
}: SearchBarProps) {
  const [text, setText] = useState(value)
  const searchTimeout = useRef<NodeJS.Timeout | null>(null)

  const handleSearchChange = useCallback(
    (newValue: string) => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current)
      setText(newValue)
      searchTimeout.current = setTimeout(() => {
        onChange(newValue)
      }, 400)
    },
    [onChange]
  )

  useEffect(() => {
    if (value !== text) {
      setText(value)
    }
  }, [value])

  return (
    <XStack items="center" {...rest}>
      <Input
        p="$0"
        size="$3"
        placeholder="Tìm kiếm..."
        width="100%"
        value={text}
        onChangeText={handleSearchChange}
      />
      {rightIcon && (
        <XStack position="absolute" r="$2" t="$1" height="100%">
          {rightIcon}
        </XStack>
      )}
    </XStack>
  )
}
