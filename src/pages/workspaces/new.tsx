import {
  Stack,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Center,
  Button,
  FormErrorMessage,
  IconButton,
  Box
} from '@chakra-ui/react'
import { api, RouterInputs } from 'utils/api'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { workspaceCreateSchema } from 'utils/validation'
import { TbArrowLeft } from 'react-icons/tb'
import NextLink from 'next/link'
import slugify from 'slugify'
import { useRouter } from 'next/router'
import { useSettings } from 'hooks'

type WorkspaceInput = RouterInputs['workspaces']['create']

const NewWorkspacePage = () => {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<WorkspaceInput>({
    resolver: zodResolver(workspaceCreateSchema)
  })
  const { mutateAsync: createWorkspace } = api.workspaces.create.useMutation()
  const { updateSettings } = useSettings()

  const onNameSlugBlur = (event: any) => {
    const value: string = event.target.value
    if (value === '') return event
    const slug = slugify(value, { trim: true, replacement: '-', lower: true })
    setValue('slug', slug)
    return event
  }

  const onSubmit = async (data: WorkspaceInput) => {
    const workspace = await createWorkspace(data)
    await updateSettings({ settings: { workspaceSlug: workspace.slug } })
    return router.push(`/${workspace.slug}`)
  }

  return (
    <Center minHeight="100vh" backgroundColor="gray.50">
      <Stack
        as="form"
        maxWidth="36rem"
        width="100%"
        backgroundColor="white"
        borderRadius="1rem"
        padding="1rem"
        gap="1rem"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <Box>
          <NextLink href="/workspaces">
            <IconButton icon={<TbArrowLeft />} variant="outline" size="lg" aria-label="Go back" />
          </NextLink>
        </Box>
        <Heading size="lg">New workspace</Heading>
        <FormControl isInvalid={!!errors.name} isRequired={true}>
          <FormLabel>Workspace Name</FormLabel>
          <Input {...register('name', { onBlur: onNameSlugBlur })} variant="filled" />
          <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors.slug} isRequired={true}>
          <FormLabel>Workspace Slug</FormLabel>
          <Input {...register('slug', { onBlur: onNameSlugBlur })} variant="filled" />
          <FormErrorMessage>{errors.slug?.message}</FormErrorMessage>
        </FormControl>
        <Button type="submit" colorScheme="black" backgroundColor="black">
          Create Workspace
        </Button>
      </Stack>
    </Center>
  )
}

export default NewWorkspacePage
