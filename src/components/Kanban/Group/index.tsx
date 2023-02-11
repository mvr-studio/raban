import { Stack, Heading } from '@chakra-ui/react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext } from '@dnd-kit/sortable'
import { Issue } from 'store/useKanbanStore'
import KanbanItem from '../Item'

interface KanbanListGroupProps {
  id: string
  issues: Issue[]
  name: string
}

const KanbanListGroup = ({ id, issues, name }: KanbanListGroupProps) => {
  const { setNodeRef } = useDroppable({
    id
  })

  return (
    <SortableContext id={id} items={issues}>
      <Stack>
        <Heading size="sm">{name}</Heading>
        <Stack ref={setNodeRef}>
          {issues.map((issue, i) => (
            <KanbanItem key={issue.id} issueId={issue.id} index={i} title={issue.title} parent="backlog" />
          ))}
        </Stack>
      </Stack>
    </SortableContext>
  )
}

export default KanbanListGroup
