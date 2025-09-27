import { HomeBarChart } from '@/components/HomeBarChart'
import { RangeButtonGroup } from '@/components/RangeButtonGroup'
import { RangeType, MetricType } from '@/dto/report.dto'
import {
  useGetChartQuery,
  useGetSummaryQuery,
  useGetTopSoldQuery,
} from '@/utils/api.service'
import React, { useState } from 'react'
import { RefreshControl } from 'react-native'
import {
  Stack,
  Button,
  Image,
  XStack,
  Text,
  styled,
  ThemeName,
  ScrollView,
} from 'tamagui'

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
  const { data: summary, refetch: refetchSummary } = useGetSummaryQuery({
    range: selectedRange,
    date: selectedDate?.toISOString(),
  })
  const { data: chart, refetch: refetchChart } = useGetChartQuery({
    range: selectedRange,
    metric: selectedMetric,
    date: selectedDate?.toISOString(),
  })
  const { data: topSold, refetch: refetchTopSold } = useGetTopSoldQuery({
    range: selectedRange,
    date: selectedDate?.toISOString(),
  })

  const chartData =
    chart?.map((item) => ({ ...item, frontColor: colorMap[selectedMetric] })) ||
    []

  const refetch = () => {
    refetchSummary()
    refetchChart()
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
        <XStack mx="$4">
          <MetricToggle
            value="revenue"
            selected={selectedMetric}
            onSelect={setSelectedMetric}
            theme={themeMap.revenue}
          >
            <Stack>
              <Text>Tổng doanh thu</Text>
              <Text>{summary?.revenue || 0} đ</Text>
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
              <Text>{summary?.ordersCount || 0}</Text>
            </Stack>
          </MetricToggle>
        </XStack>

        <XStack mx="$4">
          <MetricToggle
            value="profit"
            selected={selectedMetric}
            onSelect={setSelectedMetric}
            theme={themeMap.profit}
          >
            <Stack>
              <Text>Tổng lợi nhuận</Text>
              <Text>{summary?.profit || 0} đ</Text>
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
              <Text>{summary?.productsCount || 0}</Text>
            </Stack>
          </MetricToggle>
        </XStack>

        <HomeBarChart mx="$4" mt="$4" chartData={chartData ?? []} />

        <Text mx="$4" mt="$4" fontWeight="bold" fontSize="$6">
          Danh sách sản phẩm bán chạy
        </Text>

        <Stack mx="$4" mb="$4" mt="$2" gap="$2">
          {topSold?.map((item) => (
            <XStack key={item.productId}>
              <Text flex={1}>{item.productName}</Text>
              <Text>{item.amountSold}</Text>
            </XStack>
          ))}
        </Stack>
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
