import { Stack, Heading, Center, IconButton, Box, Button } from '@chakra-ui/react'
import { api } from 'utils/api'
import { TbArrowLeft, TbArrowRight, TbPlus } from 'react-icons/tb'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useSettings } from 'hooks'

const NewWorkspacePage = () => {
  const router = useRouter()
  const { data: workspaces } = api.workspaces.findAll.useQuery()
  const { settings, updateSettings } = useSettings()

  const onWorkspaceSelected = async (workspaceSlug: string) => {
    await updateSettings({ settings: { workspaceSlug } })
    router.push(`/${workspaceSlug}`)
  }

  return (
    <Center minHeight="100vh" backgroundColor="gray.50">
      <Stack maxWidth="40rem" width="100%" backgroundColor="white" borderRadius="1rem" padding="1rem" gap="1rem">
        <Box>
          <NextLink href="/">
            <IconButton icon={<TbArrowLeft />} variant="outline" size="lg" aria-label="Go back" />
          </NextLink>
        </Box>
        <Heading size="lg">Select Workspace</Heading>
        {workspaces?.map((workspace) => (
          <Button
            key={workspace.id}
            size="lg"
            variant="outline"
            rightIcon={<TbArrowRight />}
            onClick={() => onWorkspaceSelected(workspace.slug)}
          >
            {workspace.name}
          </Button>
        ))}
        <hr />
        <NextLink href="/workspaces/new" style={{ width: '100%', display: 'flex' }}>
          <Button size="lg" variant="outline" leftIcon={<TbPlus />} width="100%">
            Create Workspace
          </Button>
        </NextLink>
      </Stack>
    </Center>
  )
}

export default NewWorkspacePage
