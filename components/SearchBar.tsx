import React, { useCallback, useRef, useState } from 'react'
import { Stack, Input, StackProps } from 'tamagui'

interface SearchBarProps extends StackProps {
  value: string
  onChange: (text: string) => void
}

export function SearchBar({ value, onChange, ...rest }: SearchBarProps) {
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

  return (
    <Stack {...rest}>
      <Input
        p="$0"
        size="$3"
        placeholder="Tìm kiếm..."
        value={text}
        onChangeText={handleSearchChange}
      />
    </Stack>
  )
}
