import React, { useState } from 'react'
import { Input, Stack, Text, XStack, Button } from 'tamagui'

type Props = {
  value: string[]
  onChangeText: (value: string[]) => void
  placeholder?: string
}

export function CategoryInput({ value, onChangeText, placeholder }: Props) {
  const [input, setInput] = useState('')

  const handleAdd = () => {
    const newCat = input.trim()
    if (newCat && !value.includes(newCat)) {
      onChangeText([...value, newCat])
    }
    setInput('')
  }

  const handleRemove = (cat: string) => {
    onChangeText(value.filter((c) => c !== cat))
  }

  const handleKeyPress = (e: any) => {
    if (e.nativeEvent.key === 'Enter') {
      handleAdd()
    }
  }

  return (
    <Stack gap="$2">
      <Input
        value={input}
        onChangeText={setInput}
        placeholder={placeholder}
        onKeyPress={handleKeyPress}
        onBlur={handleAdd}
        onSubmitEditing={handleAdd}
        returnKeyType="done"
      />

      <XStack flexWrap="wrap" gap="$2">
        {value &&
          value.map((cat) => (
            <XStack
              key={cat}
              bg="$blue5"
              px="$3"
              py="$1"
              rounded="$4"
              items="center"
              gap="$2"
            >
              <Text>{cat}</Text>
              <Button
                onPress={() => handleRemove(cat)}
                size="$2"
                theme="blue"
                chromeless
              >
                ✕
              </Button>
            </XStack>
          ))}
      </XStack>
    </Stack>
  )
}
