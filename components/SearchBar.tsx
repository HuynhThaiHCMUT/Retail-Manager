import React from 'react'
import { Stack, Input } from 'tamagui'

interface SearchBarProps {
  value: string
  onChange: (text: string) => void
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <Stack>
      <Input
        p="$0"
        size="$3"
        placeholder="Tìm kiếm..."
        value={value}
        onChangeText={onChange}
      />
    </Stack>
  )
}
