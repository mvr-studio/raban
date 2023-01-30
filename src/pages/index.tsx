import { GetServerSideProps, type NextPage } from 'next'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { api } from 'utils/api'

const Home: NextPage = () => {
  const router = useRouter()
  const { data: settings, isLoading: areSettingsLoading } = api.user.getSettings.useQuery()
  const { data: workspaces, isLoading: areWorkspacesLoading } = api.workspaces.findAll.useQuery()
  const { status: sessionStatus } = useSession()

  const redirectToWorkspaceSelection = () => router.replace('/workspaces')
  const redirectToWorkspaceCreation = () => router.replace('/workspaces/new')
  const redirectToWorkspace = (workspaceSlug: string) => router.replace(`/${workspaceSlug}`)

  useEffect(() => {
    const handleRedirects = () => {
      if (areSettingsLoading || areWorkspacesLoading) return
      const workspaceSlug = settings?.workspaceSlug
      if (!workspaceSlug) {
        if ((workspaces || []).length > 1) return redirectToWorkspaceSelection()
        if ((workspaces || []).length === 1) return redirectToWorkspace(workspaces?.[0]?.slug as string)
        return redirectToWorkspaceCreation()
      }
      return redirectToWorkspace(workspaceSlug)
    }
    handleRedirects()
  }, [areSettingsLoading, settings, sessionStatus])

  return null
}

export default Home
