import { useTheme, View, ViewProps } from 'tamagui'
import { BarChart, barDataItem } from 'react-native-gifted-charts'
import React, { useEffect, useMemo, useRef, useState } from 'react'

interface ChartProps extends ViewProps {
  chartData: barDataItem[]
  sections?: number
}

const SUFFIXES = [
  { value: 1e9, suffix: 'Tỷ' },
  { value: 1e6, suffix: 'Tr' },
  { value: 1e3, suffix: 'K' },
  { value: 1, suffix: '' },
]

/**
 * Choose a scale (1, 1e3, 1e6, ...) so scaledMax is in [1, 1000),
 * and return { scale, suffix }.
 */
function chooseScaleAndSuffix(max: number) {
  if (!isFinite(max) || max <= 0) return { scale: 1, suffix: '' }
  for (const s of SUFFIXES) {
    const scaled = max / s.value
    if (scaled >= 1) {
      // prefer the largest suffix where scaled >= 1 and < 1000
      if (scaled < 1000) return { scale: s.value, suffix: s.suffix }
      // if scaled >= 1000, continue to a larger suffix
    }
  }
  return { scale: 1, suffix: '' }
}

function ceilScaled(scaledMax: number) {
  if (scaledMax <= 0) return 0
  if (scaledMax < 10) {
    return Math.ceil(scaledMax)
  } else if (scaledMax < 100) {
    return Math.ceil(scaledMax / 10) * 10
  } else {
    return Math.ceil(scaledMax / 100) * 100
  }
}

/** format a scaled number with up to 3 significant digits, trim trailing zeros */
function formatScaledNumber(n: number) {
  // Use 3 significant digits, then remove trailing zeros/optional dot
  const s = Number(n).toPrecision(3)
  // remove trailing zeros and trailing decimal point
  return s.replace(/(?:\.0+|(\.\d+?)0+)$/, '$1')
}

export function HomeBarChart({
  chartData,
  sections = 10,
  ...rest
}: ChartProps) {
  const [width, setWidth] = useState(0)
  const theme = useTheme()
  const scrollRef = useRef<any>(null)

  // raw maximum from data
  const rawMax = useMemo(() => {
    const values = chartData.map((d) =>
      typeof d.value === 'number' ? d.value : 0
    )
    if (values.length === 0) return 0
    return Math.max(0, ...values)
  }, [chartData])

  // choose scale/suffix based on rawMax, compute max & stepValue
  const { scaledMaxRaw, stepValueRaw, yAxisLabelTexts, suffix } =
    useMemo(() => {
      if (!rawMax || rawMax === 0) {
        const fallbackMax = 10
        const fallbackStep = Math.ceil(fallbackMax / sections)
        const labels = Array.from({ length: sections + 1 }, (_, i) =>
          String(i * fallbackStep)
        )
        return {
          scaledMaxRaw: fallbackMax,
          stepValueRaw: fallbackStep,
          yAxisLabelTexts: labels,
          suffix: '',
        }
      }

      const { scale, suffix } = chooseScaleAndSuffix(rawMax)
      let scaledMax = rawMax / scale

      // apply the ceil rule to scaled max
      let scaled = ceilScaled(scaledMax)

      // if rounding made it reach 1000, bump scale up (e.g. 1000 K -> 1 M)
      if (scaled >= 1000) {
        // find next suffix (divide scale by 1000 -> multiply scale by 1000 for raw)
        const nextIndex = SUFFIXES.findIndex((s) => s.value === scale) - 1
        if (nextIndex >= 0) {
          const nextScale = SUFFIXES[nextIndex].value
          const nextSuffix = SUFFIXES[nextIndex].suffix
          // recompute scaled & scaled with the next scale
          scaledMax = rawMax / nextScale
          scaled = ceilScaled(scaledMax)
          // update scale & suffix for label formatting
          const scaledMaxRaw = Math.ceil(scaled) * nextScale
          const stepValueRaw = scaledMaxRaw / sections
          const labels = Array.from({ length: sections + 1 }, (_, i) => {
            const val = i * stepValueRaw
            const scaledVal = val / nextScale
            return `${formatScaledNumber(scaledVal)}${nextSuffix}`
          })
          return {
            scaledMaxRaw,
            stepValueRaw,
            yAxisLabelTexts: labels,
            suffix: nextSuffix,
          }
        }
      }

      // final scaled max in raw units
      const scaledMaxRaw = scaled * scale
      const stepValueRaw = scaledMaxRaw / sections

      // build formatted labels (0..scaledMaxRaw)
      const labels = Array.from({ length: sections + 1 }, (_, i) => {
        const val = i * stepValueRaw
        const scaledVal = val / scale
        return `${formatScaledNumber(scaledVal)}${suffix}`
      })

      return { scaledMaxRaw, stepValueRaw, yAxisLabelTexts: labels, suffix }
    }, [rawMax, sections])

  // Scroll to first non-zero bar on data change (bounded by chart scroll)
  useEffect(() => {
    const firstNonZeroIndex = chartData.findIndex((d) => (d.value ?? 0) !== 0)
    if (firstNonZeroIndex === -1) return

    // small delay to allow chart to render; gifted-charts exposes scrollRef for programmatic scroll
    const t = setTimeout(() => {
      try {
        if (scrollRef.current?.scrollToIndex) {
          scrollRef.current.scrollToIndex(firstNonZeroIndex)
        } else if (scrollRef.current?.scrollToEnd) {
          scrollRef.current.scrollToEnd()
        }
      } catch {
        try {
          scrollRef.current?.scrollToEnd?.()
        } catch {
          /* swallow */
        }
      }
    }, 80)
    return () => clearTimeout(t)
  }, [chartData])

  // chart width logic same as your original (width - 64 default padding)
  const chartWidth = Math.max(0, width - 64)

  return (
    <View {...rest} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
      <BarChart
        data={chartData}
        barWidth={28}
        spacing={16}
        roundedTop
        xAxisThickness={1}
        yAxisThickness={1}
        hideRules
        height={300}
        width={chartWidth}
        xAxisColor={theme.accent1.val}
        yAxisColor={theme.accent1.val}
        xAxisLabelTextStyle={{ color: theme.accent1.val }}
        yAxisTextStyle={{ color: theme.accent1.val, width: 40 }}
        rulesColor={theme.accent1.val}
        maxValue={scaledMaxRaw}
        stepValue={stepValueRaw}
        yAxisLabelTexts={yAxisLabelTexts}
        scrollRef={scrollRef}
        isAnimated
      />
    </View>
  )
}
