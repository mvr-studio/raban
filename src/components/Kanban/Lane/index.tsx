import { Stack, Heading, HStack, Circle, Flex, IconButton } from '@chakra-ui/react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext } from '@dnd-kit/sortable'
import { TbDots } from 'react-icons/tb'
import { KanbanItem } from '../'

const KanbanLane = ({ laneId, name, items }: any) => {
  const { setNodeRef } = useDroppable({
    id: laneId
  })

  return (
    <Stack flex="1" maxWidth="24rem" marginRight="1rem">
      <Flex justify="space-between" align="center">
        <HStack>
          <Heading size="xs" textTransform="uppercase" color="gray.600">
            {name}
          </Heading>
          <Circle backgroundColor="teal.100" size="1.25rem" fontSize="0.75rem" color="teal.500" fontWeight="bold">
            {items?.length}
          </Circle>
        </HStack>
        <IconButton icon={<TbDots />} variant="ghost" size="sm" aria-label="Lane Settings" />
      </Flex>
      <SortableContext id={laneId} items={items}>
        <Stack ref={setNodeRef} minHeight="4rem">
          {!items.length && <KanbanItem issueId="" index={0} title="Empty" parent="" emptyLane />}
          {items?.map(({ id, title }: any, i: number) => (
            <KanbanItem key={id} issueId={id} index={i} title={title} parent={laneId} />
          ))}
        </Stack>
      </SortableContext>
    </Stack>
  )
}

export default KanbanLane
