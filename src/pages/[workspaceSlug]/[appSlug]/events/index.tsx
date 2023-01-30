import { Box, Heading, Stack, Table, Tag, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import { Layout } from 'components'
import { useSettings } from 'hooks'
import { NextPage } from 'next'
import { api } from 'utils/api'

const WorkspaceEventsPage: NextPage = () => {
  const { settings } = useSettings()
  const appSlug = settings?.appSlug
  const { data: app } = api.apps.findOne.useQuery({ appSlug })
  const { data: events } = api.events.findAll.useQuery({ appSlug })

  const getShortenedId = (id: string) => {
    const start = id.substring(0, 4)
    const end = id.substring(id.length - 4, id.length)
    return `${start}...${end}`
  }

  console.log('>>>EVENTS', events)
  return (
    <Layout page={{ title: 'Events', subtitle: app?.name }}>
      <Stack>
        <Box backgroundColor="white" borderRadius="0.5rem" border="1px solid" borderColor="gray.200">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>State</Th>
                <Th>Created At</Th>
              </Tr>
            </Thead>
            <Tbody>
              {events?.map((event) => {
                const shortenedId = getShortenedId(event.id)
                return (
                  <Tr key={event.id}>
                    <Td>{shortenedId}</Td>
                    <Td>
                      <Tag colorScheme="teal">{event.state.name}</Tag>
                    </Td>
                    <Td>{event.createdAt.toISOString()}</Td>
                  </Tr>
                )
              })}
            </Tbody>
          </Table>
        </Box>
      </Stack>
    </Layout>
  )
}

export default WorkspaceEventsPage
