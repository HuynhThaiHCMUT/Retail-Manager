import React, { useState } from 'react'

import { RefreshControl } from 'react-native'
import {
  Button,
  Image,
  ScrollView,
  Stack,
  Text,
  ThemeName,
  XStack,
  styled,
} from 'tamagui'

import { useGetChartQuery, useGetSummaryQuery, useGetTopSoldQuery } from '@/api'
import { DataWrapper, HomeBarChart, RangeButtonGroup } from '@/components'
import { MetricType, RangeType } from '@/dto'

const colorMap: Record<MetricType, string> = {
  revenue: '#3b82f6', // blue
  profit: '#10b981', // green
  orders: '#ef4444', // red
  products: '#f59e0b', // yellow
}

export default function Home() {
  const [selectedRange, setSelectedRange] = useState<RangeType>('day')
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('revenue')
  const {
    data: summary,
    refetch: refetchSummary,
    isLoading: isLoadingSummary,
    error: errorSummary,
  } = useGetSummaryQuery({
    range: selectedRange,
    date: selectedDate?.toISOString(),
  })
  const {
    data: chart,
    refetch: refetchChart,
    isLoading: isLoadingChart,
    error: errorChart,
  } = useGetChartQuery({
    range: selectedRange,
    metric: selectedMetric,
    date: selectedDate?.toISOString(),
  })
  const {
    data: topSold,
    refetch: refetchTopSold,
    isLoading: isLoadingTopSold,
    error: errorTopSold,
  } = useGetTopSoldQuery({
    range: selectedRange,
    date: selectedDate?.toISOString(),
  })

  const chartData =
    chart?.map((item) => ({ ...item, frontColor: colorMap[selectedMetric] })) ||
    []

  const refetch = () => {
    refetchSummary()
    refetchChart()
    refetchTopSold()
  }

  const themeMap: Record<MetricType, ThemeName> = {
    revenue: 'blue',
    profit: 'green',
    orders: 'red',
    products: 'yellow',
  }

  return (
    <Stack py="$2" flex={1} items="center">
      <Image
        source={require('@/assets/images/Logo.png')}
        width="60%"
        objectFit="contain"
        alt="Logo"
        mt="$4"
      />

      <RangeButtonGroup
        value={selectedRange}
        onChange={setSelectedRange}
        mb="$4"
      />

      <ScrollView
        flex={1}
        width="100%"
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={refetch} />
        }
      >
        <DataWrapper
          py="$0"
          isLoading={isLoadingSummary || isLoadingChart || isLoadingTopSold}
          error={errorSummary || errorChart || errorTopSold}
        >
          <XStack>
            <MetricToggle
              value="revenue"
              selected={selectedMetric}
              onSelect={setSelectedMetric}
              theme={themeMap.revenue}
            >
              <Stack>
                <Text>Tổng doanh thu</Text>
                <Text>{Math.round(summary?.revenue || 0)} đ</Text>
              </Stack>
            </MetricToggle>

            <MetricToggle
              value="orders"
              selected={selectedMetric}
              onSelect={setSelectedMetric}
              theme={themeMap.orders}
            >
              <Stack>
                <Text>Tổng đơn hàng</Text>
                <Text>{Math.round(summary?.ordersCount || 0)}</Text>
              </Stack>
            </MetricToggle>
          </XStack>

          <XStack>
            <MetricToggle
              value="profit"
              selected={selectedMetric}
              onSelect={setSelectedMetric}
              theme={themeMap.profit}
            >
              <Stack>
                <Text>Tổng lợi nhuận</Text>
                <Text>{Math.round(summary?.profit || 0)} đ</Text>
              </Stack>
            </MetricToggle>

            <MetricToggle
              value="products"
              selected={selectedMetric}
              onSelect={setSelectedMetric}
              theme={themeMap.products}
            >
              <Stack>
                <Text>Tổng sản phẩm</Text>
                <Text>{Math.round(summary?.productsCount || 0)}</Text>
              </Stack>
            </MetricToggle>
          </XStack>

          <HomeBarChart mt="$4" chartData={chartData ?? []} />

          <Text mt="$4" fontWeight="bold" fontSize="$6">
            Danh sách sản phẩm bán chạy
          </Text>

          <Stack mb="$4" mt="$2" gap="$2">
            {topSold?.map((item, index) => (
              <XStack key={index}>
                <Text>{index + 1}. </Text>
                <Text flex={1}>{item.name}</Text>
                <Text>{item.amountSold}</Text>
              </XStack>
            ))}
          </Stack>
        </DataWrapper>
      </ScrollView>
    </Stack>
  )
}

const MetricButton = styled(Button, {
  flex: 1,
  m: '$2',
  p: '$0',
  rounded: '$0',
  height: 'auto',
})

function MetricToggle({
  value,
  selected,
  onSelect,
  theme,
  children,
}: {
  value: MetricType
  selected: MetricType
  onSelect: (v: MetricType) => void
  theme: ThemeName
  children: React.ReactNode
}) {
  const isSelected = value === selected

  return (
    <MetricButton
      theme={theme}
      onPress={() => onSelect(value)}
      borderWidth={2}
      borderColor={isSelected ? '$borderColor' : '$background'}
    >
      <Stack width={6} height="100%" bg="$color10" />
      <Stack flex={1} p="$2">
        {children}
      </Stack>
    </MetricButton>
  )
}
