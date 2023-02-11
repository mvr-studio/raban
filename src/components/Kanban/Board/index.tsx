import { Flex } from '@chakra-ui/react'
import {
  useSensors,
  useSensor,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  DndContext,
  DragOverlay,
  DragStartEvent
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { useState } from 'react'
import { KanbanLane, KanbanItem } from '../'
import { KanbanState } from 'store/useKanbanStore'

interface KanbanBoardProps {
  data: KanbanState['board']
  moveIssueToLane: KanbanState['moveIssue']
}

const KanbanBoard = ({ data, moveIssueToLane }: KanbanBoardProps) => {
  const [activeId, setActiveId] = useState<string | null>(null)
  const onDragEnd = (event: any) => {
    setActiveId(null)
    const activeIssueId = event.active.id
    const startLaneId = event.active?.data?.current?.parent
    const overLaneId = event.over?.data?.current?.parent
    const overIssueIndex = event.over?.data?.current?.index
    if (overLaneId) {
      moveIssueToLane({
        issueId: activeIssueId,
        fromLaneId: startLaneId,
        toLaneId: overLaneId,
        newIndex: overIssueIndex
      })
    }
  }

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const handleDragStart = ({ active }: DragStartEvent) => setActiveId(active.id as any)

  const handleDragOver = (dragOver: any) => {
    const activeIssueId = dragOver.active.id
    const startLaneId = dragOver.active?.data?.current?.parent
    const overLaneId = dragOver.over?.data?.current?.sortable?.containerId
    const overIssueIndex = dragOver.over?.data?.current?.index
    if (startLaneId !== overLaneId && overLaneId) {
      moveIssueToLane({
        issueId: activeIssueId,
        fromLaneId: startLaneId,
        toLaneId: overLaneId,
        newIndex: overIssueIndex
      })
    }
  }

  return (
    <DndContext onDragEnd={onDragEnd} sensors={sensors} onDragStart={handleDragStart} onDragOver={handleDragOver}>
      <Flex>
        {data.map((column: any) => (
          <KanbanLane key={column.id} laneId={column.id} name={column.name} items={column?.issues} />
        ))}
      </Flex>
      <DragOverlay>
        {activeId ? <KanbanItem issueId={activeId} index={0} title="Dragging" parent="complete" /> : null}
      </DragOverlay>
    </DndContext>
  )
}

export default KanbanBoard
