import { Box, Flex, Grid, Heading, Stack } from '@chakra-ui/react'
import { useSettings } from 'hooks'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { api } from 'utils/api'
import { SideMenu } from '../'

type PageProps = {
  title?: string
  subtitle?: string
  addon?: React.ReactNode
}

interface LayoutProps {
  children: React.ReactNode
  page?: PageProps
}

const Layout = ({ children, page }: LayoutProps) => {
  const { status: sessionStatus } = useSession()
  const router = useRouter()
  const { data: applications, isLoading: areAppsLoading } = api.apps.findAll.useQuery()
  const { settings, areSettingsLoading, updateSettings } = useSettings()
  const workspaceSlug = settings?.workspaceSlug
  const appSlug = settings?.appSlug
  const hasApplications = (applications?.length || []) > 0
  const isSessionLoading = sessionStatus === 'loading'

  const redirectToLogin = () => router.replace('/api/auth/signin')
  const redirectToWorkspaceSelection = () => router.replace('/workspaces')
  const redirectToWorkspace = (workspaceSlug: string) => router.replace(`/${workspaceSlug}`)

  useEffect(() => {
    const handleRedirects = async () => {
      if (areAppsLoading || areSettingsLoading || isSessionLoading) return
      if (sessionStatus === 'unauthenticated') return redirectToLogin()
      if (!workspaceSlug) return redirectToWorkspaceSelection()
      if (!appSlug) {
        if (!hasApplications) return router.replace(`/${workspaceSlug}/apps/new`)
        const firstAppSlug = applications?.[0]?.slug
        await updateSettings({ settings: { appSlug: firstAppSlug } })
        return redirectToWorkspace(firstAppSlug as string)
      }
    }
    handleRedirects()
  }, [areAppsLoading, areSettingsLoading, workspaceSlug, appSlug])

  return (
    <Flex direction="column" minHeight="100vh">
      <Grid templateColumns={['1fr 2fr', '1fr 3fr', '1fr 3fr', '1fr 5fr']} flex={1}>
        <SideMenu />
        <Flex direction="column" padding="1rem 2rem" backgroundColor="gray.50" minHeight="100vh">
          <Stack flex={1} gap="2rem">
            {page && (
              <Flex justify="space-between">
                <Stack>
                  {page.title && <Heading size="md">{page.title}</Heading>}
                  {page.subtitle && (
                    <Heading size="xs" color="gray.600">
                      {page.subtitle}
                    </Heading>
                  )}
                </Stack>
                {page.addon}
              </Flex>
            )}
            <Box flex={1}>{children}</Box>
          </Stack>
        </Flex>
      </Grid>
    </Flex>
  )
}

export default Layout
