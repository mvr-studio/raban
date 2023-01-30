import {
  Button,
  Stack,
  Icon,
  IconButton,
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
  Avatar
} from '@chakra-ui/react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { TbLayoutDashboard, TbAlertOctagon, TbSettings, TbChevronDown, TbPlus } from 'react-icons/tb'
import { api } from 'utils/api'
import NextImage from 'next/image'
import { useSettings } from 'hooks'

const SideMenu = () => {
  const router = useRouter()
  const { settings, onAppChange } = useSettings()
  const { data: apps } = api.apps.findAll.useQuery()
  const workspaceSlug = settings?.workspaceSlug
  const appSlug = settings?.appSlug
  const { data: currentApp } = api.apps.findOne.useQuery({ appSlug })
  const hasApps = (apps || [])?.length > 0

  const BASE_URL = `/${workspaceSlug}/${appSlug}`

  const MENU_ITEMS = [
    { label: 'Dashboard', url: BASE_URL, icon: TbLayoutDashboard },
    { label: 'Events', url: `${BASE_URL}/events`, icon: TbAlertOctagon }
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
              <IconButton
                icon={<Icon as={TbSettings} boxSize="1.25rem" color="gray.600" />}
                variant="ghost"
                aria-label="Settings"
              />
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
        {hasApps && (
          <Menu>
            <MenuButton as={Button} rightIcon={<TbChevronDown />}>
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
      </Stack>
      {hasApps ? (
        <Stack flex={1} paddingX="1rem">
          {MENU_ITEMS.map((menuItem, i) => {
            const isActive = router.asPath === menuItem.url
            return (
              <NextLink href={menuItem.url} key={i}>
                <Button
                  variant="ghost"
                  justifyContent="flex-start"
                  leftIcon={<Icon as={menuItem.icon} boxSize="1.5rem" />}
                  paddingX="0.5rem"
                  width="100%"
                  backgroundColor={isActive ? 'gray.100' : 'transparent'}
                  color={isActive ? 'gray.900' : 'gray.600'}
                >
                  {menuItem.label}
                </Button>
              </NextLink>
            )
          })}
        </Stack>
      ) : (
        <Box flex={1} />
      )}
      <Box padding="1rem">
        <NextLink href="/account">
          <Button
            leftIcon={<Avatar name="Tomasz Marciniak" size="sm" />}
            width="100%"
            justifyContent="flex-start"
            variant="ghost"
          >
            User
          </Button>
        </NextLink>
      </Box>
    </Stack>
  )
}

export default SideMenu
