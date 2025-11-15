import { DialogProps, DialogVariant } from '@/store/dialog.slice'
import { CircleAlert, CircleCheckBig, CircleX } from '@tamagui/lucide-icons'
import React, { ReactElement } from 'react'
import { AlertDialog, Button, Stack, Text, XStack } from 'tamagui'

const typeColors: Record<DialogVariant, 'red' | 'blue' | 'yellow' | 'green'> = {
  error: 'red',
  info: 'blue',
  warning: 'yellow',
  success: 'green',
}

const typeIcons: Record<DialogVariant, ReactElement> = {
  error: <CircleAlert color="$colorFocus" size="$5" />,
  info: <CircleX color="$colorFocus" size="$5" />,
  warning: <CircleAlert color="$colorFocus" size="$5" />,
  success: <CircleCheckBig color="$colorFocus" size="$5" />,
}

export function ConfirmDialog({
  open = false,
  variant = 'info',
  title,
  message,
  onClose,
  onConfirm,
  confirmLabel = 'Xác nhận',
  cancelLabel = 'Huỷ',
}: DialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={() => !open && onClose && onClose()}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay themeInverse opacity={0.1} />
        <AlertDialog.Content
          elevate
          key="content"
          bg="$background"
          rounded="$4"
          py="$6"
          width="$20"
        >
          <Stack items="center">
            <Stack theme={typeColors[variant]}>{typeIcons[variant]}</Stack>
            <Text fontSize="$6" fontWeight="bold" text="center">
              {title}
            </Text>
            {message && (
              <Text mt="$2" text="center">
                {message}
              </Text>
            )}

            <XStack mt="$4" gap="$2">
              <Button flex={1} onPress={onClose}>
                {cancelLabel}
              </Button>
              <Button flex={1} theme={typeColors[variant]} onPress={onConfirm}>
                {confirmLabel}
              </Button>
            </XStack>
          </Stack>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog>
  )
}
