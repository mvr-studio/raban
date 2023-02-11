import { Stack } from '@chakra-ui/react'
import { DndContext } from '@dnd-kit/core'
import { KanbanState } from 'store/useKanbanStore'
import KanbanListGroup from '../Group'

interface KanbanListProps {
  data: KanbanState['board']
}

const BacklogList = ({ data }: KanbanListProps) => {
  return (
    <DndContext>
      <Stack gap="1rem">
        {data?.map((group) => (
          <KanbanListGroup key={group.id} id={group.id} issues={group.issues} name={group.name} />
        ))}
      </Stack>
    </DndContext>
  )
}

export default BacklogList
