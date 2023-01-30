import { useRouter } from 'next/router'
import { api } from 'utils/api'

const useSettings = () => {
  const router = useRouter()
  const { data: settings, refetch: refetchSettings, isLoading: areSettingsLoading } = api.user.getSettings.useQuery()
  const { mutateAsync: updateSettings } = api.user.setSettings.useMutation()
  const workspaceSlug = settings?.workspaceSlug

  const onAppChange = async (appSlug: string) => {
    await updateSettings({ settings: { appSlug } })
    await router.push(`/${workspaceSlug}/${appSlug}`)
    refetchSettings()
  }

  return { settings, updateSettings, refetchSettings, onAppChange, areSettingsLoading }
}

export default useSettings
