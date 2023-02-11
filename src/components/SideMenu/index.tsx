import {
  Button,
  Stack,
  Icon,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  MenuDivider,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Link,
  Box,
  Avatar,
  Heading
} from '@chakra-ui/react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { TbLayoutDashboard, TbAlertOctagon, TbPlus, TbBox, TbColumns, TbRefresh } from 'react-icons/tb'
import { api } from 'utils/api'
import NextImage from 'next/image'
import { useSettings, useWorkspace } from 'hooks'

const SideMenu = () => {
  const router = useRouter()
  const { settings, onAppChange } = useSettings()
  const workspaceSlug = settings?.workspaceSlug
  const { data: workspace } = useWorkspace({ slug: workspaceSlug })
  const { data: apps } = api.apps.findAll.useQuery()
  const appSlug = settings?.appSlug
  const { data: currentApp } = api.apps.findOne.useQuery({ appSlug })
  const hasApps = (apps || [])?.length > 0

  const BASE_URL = `/${workspaceSlug}`
  const APP_BASE_URL = `${BASE_URL}/${appSlug}`

  const SIDE_MENU = [
    {
      title: workspace?.name,
      isVisible: true,
      items: [{ label: 'Overview', url: BASE_URL, icon: TbBox }]
    },
    {
      title: currentApp?.name,
      isVisible: hasApps,
      items: [
        { label: 'Dashboard', url: APP_BASE_URL, icon: TbLayoutDashboard },
        { label: 'Events', url: `${APP_BASE_URL}/events`, icon: TbAlertOctagon }
      ]
    }
  ]

  return (
    <Stack gap="1rem">
      <Stack margin="0.5rem 1rem" gap="1rem">
        <Flex justify="space-between" align="center">
          <NextLink href={`/${workspaceSlug}`}>
            <NextImage src="/logo.svg" width={32} height={28} alt="Logo" />
          </NextLink>
          <Popover>
            <PopoverTrigger>
              <Avatar name="Tomasz Marciniak" size="sm" cursor="pointer" />
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverBody>
                <Link as={NextLink} href="/workspaces">
                  Change Workspace
                </Link>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </Flex>
      </Stack>
      <Stack flex={1} gap="1rem" paddingX="1rem">
        {SIDE_MENU.map((section, i) => {
          if (!section.isVisible) return
          return (
            <Stack key={i}>
              <Heading size="xs">{section.title}</Heading>
              {section.items.map((item) => {
                const isActive = router.asPath === item.url
                return (
                  <NextLink href={item.url} key={i}>
                    <Button
                      variant="ghost"
                      justifyContent="flex-start"
                      leftIcon={<Icon as={item.icon} boxSize="1.5rem" />}
                      paddingX="0.5rem"
                      width="100%"
                      backgroundColor={isActive ? 'gray.100' : 'transparent'}
                      color={isActive ? 'gray.900' : 'gray.600'}
                    >
                      {item.label}
                    </Button>
                  </NextLink>
                )
              })}
            </Stack>
          )
        })}
      </Stack>
      <Box padding="1rem">
        {hasApps && (
          <Menu>
            <MenuButton
              as={Button}
              leftIcon={<Avatar name={currentApp?.name?.[0]} size="sm" borderRadius="0.5rem" />}
              rightIcon={<TbRefresh />}
              width="100%"
            >
              {currentApp?.name}
            </MenuButton>
            <MenuList>
              {apps?.map((app) => (
                <MenuItem key={app.id} onClick={() => onAppChange(app.slug)}>
                  {app.name}
                </MenuItem>
              ))}
              <MenuDivider />
              <NextLink href={`/${workspaceSlug}/apps/new`}>
                <MenuItem icon={<TbPlus />}>Create App</MenuItem>
              </NextLink>
            </MenuList>
          </Menu>
        )}
      </Box>
    </Stack>
  )
}

export default SideMenu
