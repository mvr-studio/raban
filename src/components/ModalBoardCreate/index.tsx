import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  HStack,
  Stack,
  FormControl,
  FormLabel,
  Input
} from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSettings } from 'hooks'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { api, RouterInputs } from 'utils/api'
import { boardCreateSchema } from 'utils/validation'

type BoardInput = RouterInputs['boards']['create']

interface ModalBoardCreateProps {
  isOpen: boolean
  onClose: () => void
}

const ModalBoardCreate = ({ isOpen, onClose }: ModalBoardCreateProps) => {
  const router = useRouter()
  const { mutateAsync: createBoard } = api.boards.create.useMutation()
  const { settings } = useSettings()
  const { register, handleSubmit } = useForm<BoardInput>({
    resolver: zodResolver(boardCreateSchema.omit({ workspaceSlug: true }))
  })

  const onSubmit = async (data: BoardInput) => {
    const workspaceSlug = settings?.workspaceSlug
    const payload = { ...data, workspaceSlug }
    const board = await createBoard(payload)
    return router.push(`/${workspaceSlug}/boards/${board.slug}`)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create Board</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack id="boardCreateForm" as="form" onSubmit={handleSubmit(onSubmit)}>
            <FormControl>
              <FormLabel>Board Name</FormLabel>
              <Input variant="filled" autoFocus {...register('name')} />
            </FormControl>
            <FormControl>
              <FormLabel>Board Slug</FormLabel>
              <Input variant="filled" {...register('slug')} />
            </FormControl>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <HStack>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" form="boardCreateForm" colorScheme="black" backgroundColor="black">
              Create Board
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default ModalBoardCreate
