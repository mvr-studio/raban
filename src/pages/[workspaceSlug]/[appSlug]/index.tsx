import { AspectRatio, Box, Heading, HStack, IconButton, Icon, Stack, useToken, Tooltip } from '@chakra-ui/react'
import { Layout } from 'components'
import { useSettings } from 'hooks'
import { NextPage } from 'next'
import {
  XAxis,
  ResponsiveContainer,
  Line,
  Tooltip as RechartsTooltip,
  Area,
  ComposedChart,
  CartesianGrid,
  YAxis
} from 'recharts'
import { api } from 'utils/api'
import dayjs from 'dayjs'
import { TbAppWindow } from 'react-icons/tb'

const DATA = [
  { events: 4, date: '2020-10-10' },
  { events: 10, date: '2020-10-11' },
  { events: 6, date: '2020-10-12' }
]

const AppDashboardPage: NextPage = () => {
  const { settings } = useSettings()
  const appSlug = settings?.appSlug
  const { data: app } = api.apps.findOne.useQuery({ appSlug })
  const [cyan600, cyan100, gray400] = useToken('colors', ['cyan.600', 'cyan.100', 'gray.400'])
  return (
    <Layout
      page={{
        title: 'Dashboard',
        subtitle: app?.name,
        addon: (
          <HStack>
            <Tooltip label="App Settings">
              <IconButton icon={<Icon as={TbAppWindow} boxSize="1.25rem" />} aria-label="Workspace Settings" />
            </Tooltip>
          </HStack>
        )
      }}
    >
      <Stack gap="0.5rem">
        <Heading size="sm">Events Overview</Heading>
        <Box backgroundColor="white" borderRadius="0.5rem" border="1px solid" borderColor="gray.200">
          <AspectRatio ratio={3}>
            <ResponsiveContainer>
              <ComposedChart width={400} height={400} data={DATA} margin={{ top: 32, right: 40, left: -4, bottom: 32 }}>
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="10%" stopColor={cyan600} stopOpacity={0.2} />
                    <stop offset="90%" stopColor={cyan100} stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => dayjs(value).format('DD MMM')}
                  style={{ fontSize: 12, color: gray400 }}
                  axisLine={{ stroke: gray400, strokeDasharray: 8 }}
                  tickLine={{ display: 'none' }}
                  tickMargin={16}
                />
                <YAxis
                  dataKey="events"
                  tickLine={{ display: 'none' }}
                  axisLine={{ display: 'none' }}
                  style={{ fontSize: 12 }}
                />
                <RechartsTooltip
                  contentStyle={{
                    borderRadius: '0.5rem',
                    boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.05)',
                    fontSize: '0.75rem',
                    border: '0px solid',
                    height: '4rem',
                    backgroundColor: 'black',
                    color: 'white'
                  }}
                />
                <Line type="linear" dataKey="events" stroke={cyan600} yAxisId={0} strokeWidth={2} dot={false} />
                <Area
                  type="linear"
                  dataKey="events"
                  stroke="transparent"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorUv)"
                />
                <CartesianGrid vertical={false} strokeDasharray={8} strokeOpacity={0.5} />
              </ComposedChart>
            </ResponsiveContainer>
          </AspectRatio>
        </Box>
      </Stack>
    </Layout>
  )
}

export default AppDashboardPage
