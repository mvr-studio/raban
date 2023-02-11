import { api } from 'utils/api'

interface UseWorkspaceProps {
  slug: string
}

const useWorkspace = ({ slug }: UseWorkspaceProps) => {
  return api.workspaces.findOne.useQuery({ slug })
}

export default useWorkspace
