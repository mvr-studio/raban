import {
  Heading,
  HStack,
  SimpleGrid,
  Stack,
  Icon,
  useToken,
  IconButton,
  Tooltip,
  Card,
  useDisclosure,
  CardProps
} from '@chakra-ui/react'
import { Layout, ModalBoardCreate } from 'components'
import { useSettings } from 'hooks'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { rgba } from 'polished'
import { TbAppWindow, TbLayoutColumns, TbPlus, TbUsers } from 'react-icons/tb'
import { api } from 'utils/api'

interface CardButtonProps extends CardProps {
  label: string
  onClick: () => void
  icon: any
}

const CardButton = ({ label, onClick, icon, ...rest }: CardButtonProps) => (
  <Card cursor="pointer" padding="1rem" onClick={onClick} {...rest}>
    <HStack>
      <Icon as={icon} boxSize="1.5rem" />
      <Heading size="sm">{label}</Heading>
    </HStack>
  </Card>
)

const CreateButton = ({ onClick, label }: { onClick: () => void; label: string }) => {
  const [cyan500] = useToken('colors', ['cyan.500'])

  return (
    <CardButton
      label={label}
      onClick={onClick}
      icon={TbPlus}
      border="1px solid"
      borderColor="cyan.500"
      boxShadow={`0 0.25rem 1rem ${rgba(cyan500, 0.1)}`}
      backgroundColor="cyan.50"
      color="cyan.700"
    />
  )
}

const WorkspaceDashboardPage: NextPage = () => {
  const router = useRouter()
  const { data: settings } = api.user.getSettings.useQuery()
  const workspaceSlug = settings?.workspaceSlug
  const { data: workspace } = api.workspaces.findOne.useQuery({ slug: workspaceSlug })
  const { data: boards } = api.boards.findAll.useQuery({ workspaceSlug })
  const { isOpen: isModalBoardCreateOpen, onToggle: onModalBoardCreateToggle } = useDisclosure()
  const { onAppChange } = useSettings()
  const applications = workspace?.applications
  console.log('>>>BRDZ', boards)
  return (
    <Layout
      page={{
        title: 'Workspace Overview',
        subtitle: workspace?.name,
        addon: (
          <HStack>
            <Tooltip label="Workspace Settings">
              <IconButton icon={<Icon as={TbUsers} boxSize="1.25rem" />} aria-label="Workspace Settings" />
            </Tooltip>
          </HStack>
        )
      }}
    >
      <ModalBoardCreate isOpen={isModalBoardCreateOpen} onClose={onModalBoardCreateToggle} />
      <Stack gap="1.5rem">
        <Stack gap="0.5rem">
          <Heading size="sm">Apps</Heading>
          <SimpleGrid columns={4} gap="1rem">
            {applications?.map((application) => (
              <CardButton
                label={application.name}
                key={application.id}
                icon={TbAppWindow}
                onClick={() => onAppChange(application.slug)}
              />
            ))}
            <CreateButton label="Create App" onClick={() => router.push(`/${workspaceSlug}/apps/new`)} />
          </SimpleGrid>
        </Stack>
        <Stack gap="0.5rem">
          <Heading size="sm">Boards</Heading>
          <SimpleGrid columns={4} gap="1rem">
            {boards?.map((board) => (
              <CardButton
                label={board.name}
                key={board.id}
                icon={TbLayoutColumns}
                onClick={() => router.push(`/${workspaceSlug}/boards/${board.slug}`)}
              />
            ))}
            <CreateButton label="Create Board" onClick={onModalBoardCreateToggle} />
          </SimpleGrid>
        </Stack>
      </Stack>
    </Layout>
  )
}

export default WorkspaceDashboardPage
