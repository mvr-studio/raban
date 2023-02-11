import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@chakra-ui/react'
import { Kanban, Layout } from 'components'
import { useEffect } from 'react'
import { useKanbanStore } from 'store'
import { shallow } from 'zustand/shallow'

const DEFAULT_DATA = [
  {
    id: 'to-do',
    name: 'To do',
    issues: [
      { id: 'a1', title: 'Test' },
      { id: 'a2', title: 'Test 2' }
    ]
  },
  { id: 'complete', name: 'Complete', issues: [{ id: 'a3', title: 'Test 3' }] }
]

const BoardPage = () => {
  const { board, setBoard, moveIssue } = useKanbanStore(
    (state) => ({
      board: state.board,
      setBoard: state.setBoard,
      moveIssue: state.moveIssue
    }),
    shallow
  )

  useEffect(() => {
    setBoard(DEFAULT_DATA)
  }, [])

  return (
    <Layout page={{ title: 'Board name', subtitle: 'Test' }} noPadding>
      <Tabs colorScheme="teal">
        <TabList>
          <Tab>Board</Tab>
          <Tab>List</Tab>
        </TabList>
        <TabPanels>
          <TabPanel padding="1rem 0">
            <Kanban.KanbanBoard data={board} moveIssueToLane={moveIssue} />
          </TabPanel>
          <TabPanel padding="1rem 0">
            <Kanban.BacklogList data={board} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Layout>
  )
}

export default BoardPage
