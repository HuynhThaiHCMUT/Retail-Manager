import React, { forwardRef, useImperativeHandle } from 'react'

import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { YStack } from 'tamagui'

export interface SwipeableRowRef {
  close: () => void
}

export interface SwipeableRowProps {
  children: React.ReactNode
  id?: string
  onOpen?: (id: string) => void
  action?: React.ReactNode
  threshold?: number
  enabled?: boolean
}

export const SwipeableRow = forwardRef<SwipeableRowRef, SwipeableRowProps>(
  ({ children, id, onOpen, action, threshold = -40, enabled = true }, ref) => {
    const translateX = useSharedValue(0)
    const context = useSharedValue(0)

    // expose close() to parent
    useImperativeHandle(ref, () => ({
      close: () => {
        translateX.value = withTiming(0, { duration: 300 })
      },
    }))

    let pan = Gesture.Pan()
      .activeOffsetX([-5, 5])
      .failOffsetY([-10, 10])
      .onBegin(() => {
        if (onOpen && id) runOnJS(onOpen)(id)
        context.value = translateX.value
      })
      .onUpdate((event) => {
        translateX.value = Math.min(0, context.value + event.translationX)
      })
      .onEnd(() => {
        if (translateX.value < threshold) {
          // open row (do NOT auto-delete)
          translateX.value = withTiming(threshold, { duration: 200 })
        } else {
          translateX.value = withTiming(0, { duration: 300 })
        }
      })

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ translateX: translateX.value }],
    }))

    return (
      <YStack overflow="hidden">
        {action}
        {enabled === false ? (
          // just render children, no gesture
          <Animated.View style={{ transform: [{ translateX: 0 }] }}>
            {children}
          </Animated.View>
        ) : (
          <GestureDetector gesture={pan}>
            <Animated.View style={animatedStyle}>{children}</Animated.View>
          </GestureDetector>
        )}
      </YStack>
    )
  }
)
