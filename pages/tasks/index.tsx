import Layout from 'components/Layout'
import { Tour } from 'interfaces'
import { useState } from 'react'
import Toolbar from 'components/tasks/toolbar'
import Tasklist from 'components/tasks/TaskList'
import TaskModal from 'components/tasks/modal/TaskModal'
import TaskButtons from 'components/tasks/TaskButtons'
import UpdateTaskForm from 'components/tasks/UpdateTaskForm'
import BulkActionForm from 'components/tasks/BulkActionForm'
import GlobalToolbar from 'components/toolbar'
import { Spinner } from 'spinner'
import { GetServerSideProps } from 'next'
import { getToursAndTasks } from 'services/TourService'

const TaskPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [bulkIsOpen, setBulkIsOpen] = useState(false)
  const [masterTourData, setMasterTourData] = useState<Tour[]>([])
  const [tourData, setTourData] = useState<Tour[]>([])
  const [isSelectedArray, setIsSelectedArray] = useState<String[]>([])
  const [bulkActionField, setBulkActionField] = useState<String>('')
  const [updateTask, setUpdateTask] = useState<any>()
  const [updateTaskModalIsOpen, setUpdateTaskModalIsOpen] =
    useState<boolean>(false)

  /*
  function applyFilters () {
    console.log('the master data:', masterTourData)
    console.log('the tour data:', tourData)
    setTourData([])
    setIsLoading(true)

    let filteredTourData = deepCopy(masterTourData)

    if (selectedTour !== 0) {
      filteredTourData = filteredTourData.filter(
        (tour) => selectedTour === 0 || selectedTour === tour.TourId
      )
    }

    if (assignee !== 0 || assignedBy !== 0 || searchFilter.length > 0) {
      filteredTourData = filteredTourData.map((tour) => {
        const tasks = tour.TourTask.filter((task) => {
          return (
            task.Assignee === assignee ||
            task.AssignedBy === assignedBy ||
            (searchFilter.length > 0 && task.TaskName.toLowerCase().includes(searchFilter.toLowerCase()))
          )
        })

        const updatedTour = deepCopy(tour)
        updatedTour.TourTask = tasks

        return updatedTour
      })
    }

    setTourData(filteredTourData)
    setIsLoading(true)
  }
  */

  function isTaskSelected (taskId: string): boolean {
    return isSelectedArray.includes(taskId)
  }

  function handleSelectedFunction (taskId: string): void {
    console.log('the selected task array', isSelectedArray)
    if (isSelectedArray.includes(taskId)) {
      setIsSelectedArray(isSelectedArray.filter((id) => id !== taskId))
    } else {
      setIsSelectedArray([...isSelectedArray, taskId])
    }
  }

  function handleSelectAll (taskIds: string[]): void {
    const alreadySelectedTaskIds = taskIds.filter((id) =>
      isSelectedArray.includes(id)
    )
    if (isSelectedArray.length === taskIds.length) {
      // If all taskIds are already in the isSelectedArray, remove them all
      setIsSelectedArray([])
    } else {
      // If not all taskIds are already selected, add all taskIds to the isSelectedArray
      setIsSelectedArray(taskIds)
    }
  }

  function openBulkModal (key) {
    switch (key) {
    case 'setstatus':
      setBulkActionField('Status')
      setBulkIsOpen(true)
      break
    case 'priority':
      setBulkActionField('Priority')
      setBulkIsOpen(true)

      break
    case 'progress':
      setBulkActionField('Progress')
      setBulkIsOpen(true)

      break
    case 'followup':
      setBulkActionField('FollowUp')
      setBulkIsOpen(true)

      break
    case 'reassign':
      setBulkActionField('Assignee')
      setBulkIsOpen(true)

      break
    default:
      break
    }
  }

  return (
    <Layout title="Tasks | Seque">
      <div className="flex flex-auto w-full h-screen">
        <div
          className="flex-col px-12 w-full flex justify-between"
          style={{ minHeight: '60vh' }}
        >
          <GlobalToolbar
            tourJump={false}
            title={'Tasks'}
            color={'text-primary-purple'}
            filterComponent={
              <Toolbar
                tours={masterTourData}
              />
            }
          />
          {isLoading && <Spinner />}
          {tourData.length > 0
            ? tourData.map((tour, idx) => {
              return (
                <>
                  <p className="text-primary-purple text-xl font-bold">
                    {tour.Show.Name && tour.Show.Name}
                  </p>
                  <Tasklist
                    openUpdateModal={console.log}
                    handleSelectAll={handleSelectAll}
                    handleSelectedFunction={handleSelectedFunction}
                    isTaskSelected={isTaskSelected}
                    tasks={tour.TourTask}
                    key={idx}
                  />
                </>
              )
            })
            : !isLoading && (
              <div className="text-center font-bold text-lg">
                <p>No Tasks Found</p>
              </div>
            )}
          <TaskButtons openBulkModal={openBulkModal} />
        </div>
      </div>
      <TaskModal
        isOpen={updateTaskModalIsOpen}
        onClose={setUpdateTaskModalIsOpen}
      >
        <UpdateTaskForm
          userAccountId={0}
          closeModal={console.log} task={updateTask} />
      </TaskModal>
      <TaskModal isOpen={bulkIsOpen} onClose={setBulkIsOpen}>
        <BulkActionForm
          userAccountId={0}
          closeModal={console.log}
          taskIdArray={isSelectedArray}
          bulkActionField={bulkActionField}
        />
      </TaskModal>
    </Layout>
  )
}

export default TaskPage

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const toursWithTasks = await getToursAndTasks()
  const tasks = toursWithTasks.map((t: any) => t.TourTask).flat()

  console.log(tasks)

  return { props: { tasks: { tasks } } }
}
