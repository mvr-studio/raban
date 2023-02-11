import { Card, Stack, Text } from '@chakra-ui/react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const KanbanItem = ({
  issueId,
  index,
  title,
  parent,
  emptyLane = false
}: {
  issueId: string
  index: number
  title: string
  parent: string
  emptyLane?: boolean
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: issueId,
    data: {
      title,
      index,
      parent
    }
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  }

  return (
    <Card padding="0.75rem 1rem" {...listeners} {...attributes} ref={setNodeRef} style={style}>
      <Stack>
        <Text id={issueId}>{title}</Text>
      </Stack>
    </Card>
  )
}

export default KanbanItem
