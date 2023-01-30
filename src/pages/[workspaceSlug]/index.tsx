import { Heading, HStack, SimpleGrid, Stack, Icon, Link, useToken, IconButton, Tooltip } from '@chakra-ui/react'
import { Layout } from 'components'
import { useSettings } from 'hooks'
import { NextPage } from 'next'
import { rgba } from 'polished'
import { TbAppWindow, TbPlus, TbUsers } from 'react-icons/tb'
import { api } from 'utils/api'
import NextLink from 'next/link'

const WorkspaceDashboardPage: NextPage = () => {
  const { data: settings } = api.user.getSettings.useQuery()
  const { data: workspace } = api.workspaces.findOne.useQuery({ slug: settings?.workspaceSlug })
  const [cyan500] = useToken('colors', ['cyan.500'])
  const { onAppChange } = useSettings()
  const applications = workspace?.applications
  const workspaceSlug = settings?.workspaceSlug
  return (
    <Layout
      page={{
        title: workspace?.name,
        subtitle: 'Workspace Overview',
        addon: (
          <HStack>
            <Tooltip label="Workspace Settings">
              <IconButton icon={<Icon as={TbUsers} boxSize="1.25rem" />} aria-label="Workspace Settings" />
            </Tooltip>
          </HStack>
        )
      }}
    >
      <Stack gap="0.5rem">
        <Heading size="sm">Apps</Heading>
        <SimpleGrid columns={4} gap="1rem">
          {applications?.map((application) => (
            <Link
              backgroundColor="white"
              padding="1rem"
              key={application.id}
              boxShadow="0 0.25rem 1rem rgba(0, 0, 0, 0.05)"
              borderRadius="0.5rem"
              border="1px solid"
              borderColor="gray.200"
              onClick={() => onAppChange(application.slug)}
            >
              <HStack>
                <Icon as={TbAppWindow} boxSize="1.5rem" />
                <Heading size="sm">{application.name}</Heading>
              </HStack>
            </Link>
          ))}
          <Link
            as={NextLink}
            href={`/${workspaceSlug}/apps/new`}
            backgroundColor="cyan.50"
            color="cyan.700"
            padding="1rem"
            boxShadow={`0 0.25rem 1rem ${rgba(cyan500, 0.1)}`}
            borderRadius="0.5rem"
            border="1px solid"
            borderColor="cyan.500"
          >
            <HStack>
              <Icon as={TbPlus} boxSize="1.5rem" />
              <Heading size="sm">Create App</Heading>
            </HStack>
          </Link>
        </SimpleGrid>
      </Stack>
    </Layout>
  )
}

export default WorkspaceDashboardPage
