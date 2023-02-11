import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { insert, remove, update } from 'ramda'

type CUID = string

export type Issue = {
  id: CUID
  title: string
}

type KanbanLane = {
  id: CUID
  name: string
  issues: Issue[]
}

type Board = KanbanLane[]

export interface KanbanState {
  board: Board
  setBoard: (board: Board) => void
  addIssueToLane: (props: { issue: Issue; laneId: CUID; issueIndex: number }) => void
  removeIssueFromLane: (props: { issueId: CUID; laneId: CUID }) => void
  moveIssue: (props: { issueId: CUID; fromLaneId: CUID; toLaneId: CUID; newIndex: number }) => void
}

const getLane = ({ board, laneId }: { board: Board; laneId: CUID }) => {
  const laneIndex = board.findIndex((lane) => lane.id === laneId)
  const targetLane = board[laneIndex]
  return {
    laneIndex,
    targetLane
  }
}

const useKanbanStore = create<KanbanState>()(
  devtools((set, get) => ({
    board: [],
    setBoard: (board) => set({ board }),
    addIssueToLane: ({ issue, laneId, issueIndex }) => {
      const { board } = get()
      const { targetLane, laneIndex } = getLane({ board, laneId })
      if (!targetLane) return
      const laneIssues = targetLane?.issues || []
      const updatedIssues = insert(issueIndex, issue, laneIssues)
      targetLane.issues = updatedIssues
      const updatedBoard = update(laneIndex, targetLane, board)
      set({ board: updatedBoard })
    },
    removeIssueFromLane: ({ issueId, laneId }) => {
      const { board } = get()
      const { targetLane, laneIndex } = getLane({ board, laneId })
      if (!targetLane) return
      const laneIssues = targetLane?.issues || []
      const issueIndex = laneIssues.findIndex((issue) => issue.id === issueId)
      const updatedIssues = remove(issueIndex, 1, laneIssues)
      targetLane.issues = updatedIssues
      const updatedBoard = update(laneIndex, targetLane, board)
      set({ board: updatedBoard })
    },
    moveIssue: ({ issueId, fromLaneId, toLaneId, newIndex }) => {
      const { board, addIssueToLane, removeIssueFromLane } = get()
      const { targetLane: fromLane } = getLane({ board, laneId: fromLaneId })
      const issue = fromLane?.issues?.find((issue) => issue.id === issueId)
      if (!issue) return
      removeIssueFromLane({ issueId, laneId: fromLaneId })
      addIssueToLane({ issue, laneId: toLaneId, issueIndex: newIndex })
    }
  }))
)

export default useKanbanStore
