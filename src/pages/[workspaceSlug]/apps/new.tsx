import {
  Stack,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Center,
  Button,
  FormErrorMessage,
  Flex,
  Text,
  Box,
  Select
} from '@chakra-ui/react'
import { api, RouterInputs } from 'utils/api'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { appCreateSchema } from 'utils/validation'
import { Layout } from 'components'
import { useRouter } from 'next/router'
import { useSettings } from 'hooks'
import slugify from 'slugify'
import { useEffect } from 'react'

type AppInput = RouterInputs['apps']['create']

const NewAppPage = () => {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<AppInput>({
    resolver: zodResolver(appCreateSchema)
  })
  const { mutateAsync: createApp } = api.apps.create.useMutation()
  const { settings, updateSettings } = useSettings()
  const { data: workspaces } = api.workspaces.findAll.useQuery()
  const workspaceSlug = String(router.query?.workspaceSlug)

  const onNameSlugBlur = (event: any) => {
    const value: string = event.target.value
    if (value === '') return event
    const slug = slugify(value, { trim: true, replacement: '-', lower: true })
    setValue('slug', slug)
    return event
  }

  const onSubmit = async (data: AppInput) => {
    const response = await createApp(data)
    await updateSettings({ settings: { appSlug: response.slug } })
    return router.push(`/${settings.workspaceSlug}/${response.slug}`)
  }

  useEffect(() => {
    if (!workspaceSlug) return
    setValue('workspaceSlug', workspaceSlug)
  }, [workspaceSlug])

  return (
    <Layout page={{ title: 'New App' }}>
      <Flex>
        <Stack flex={1}>
          <Heading size="xs" textTransform="uppercase" color="gray.600">
            General Information
          </Heading>
        </Stack>
        <Stack flex={2} as="form" borderRadius="1rem" gap="1rem" onSubmit={handleSubmit(onSubmit)} noValidate>
          <FormControl isInvalid={!!errors.workspaceSlug} isRequired>
            <FormLabel>Workspace</FormLabel>
            <Select {...register('workspaceSlug')} variant="filled">
              {workspaces?.map((workspace) => (
                <option key={workspace.id} value={workspace.slug}>
                  {workspace.name}
                </option>
              ))}
            </Select>
            <FormErrorMessage>{errors.workspaceSlug?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.name} isRequired>
            <FormLabel>App Name</FormLabel>
            <Input
              {...register('name', {
                onBlur: onNameSlugBlur
              })}
              variant="filled"
            />
            <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.slug} isRequired>
            <FormLabel>App Slug</FormLabel>
            <Input {...register('slug', { onBlur: onNameSlugBlur })} variant="filled" />
            <FormErrorMessage>{errors.slug?.message}</FormErrorMessage>
          </FormControl>
          <Box>
            <Button type="submit" colorScheme="black" backgroundColor="black" size="lg">
              Create App
            </Button>
          </Box>
        </Stack>
      </Flex>
    </Layout>
  )
}

export default NewAppPage
