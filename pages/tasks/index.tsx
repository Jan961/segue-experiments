import Layout from 'components/Layout'
import { Tour } from 'interfaces'
import { useState } from 'react'
import Toolbar from 'components/tasks/toolbar'
import Tasklist from 'components/tasks/TaskList'
import TaskButtons from 'components/tasks/TaskButtons'
import GlobalToolbar from 'components/toolbar'
import { GetServerSideProps } from 'next'
import { getToursAndTasks } from 'services/TourService'
import { useRecoilValue } from 'recoil'
import { ToursWithTasks, tourState } from 'state/tasks/tourState'
import { InitialState } from 'lib/recoil'
import { mapToTourTaskDTO } from 'lib/mappers'

const Index = () => {
  const [bulkIsOpen, setBulkIsOpen] = useState(false)
  const [bulkActionField, setBulkActionField] = useState<String>('')

  const tours = useRecoilValue(tourState)

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
          >
            <Toolbar />
          </GlobalToolbar>
          {tours.length > 0
            ? tours.map((tour) => {
              return (
                <>
                  <h3 className=" text-xl font-bold mt-8 mb-2">
                    { tour.ShowName }
                  </h3>
                  <Tasklist
                    tourId={tour.Id}
                    key={tour.Id}
                  />
                </>
              )
            })
            : (
              <div className="text-center font-bold text-lg">
                <p>No Tasks Found</p>
              </div>
            )}
          <TaskButtons openBulkModal={openBulkModal} />
        </div>
      </div>
      {/*
        <BulkActionForm
          userAccountId={0}
          closeModal={console.log}
          taskIdArray={isSelectedArray}
          bulkActionField={bulkActionField}
        />
        */}
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const toursWithTasks = await getToursAndTasks()

  const tours: ToursWithTasks[] = toursWithTasks.map((t: any) =>
    ({
      Id: t.Id,
      ShowName: t.Show.Name,
      ShowCode: t.Show.Code,
      ShowId: t.Show.Id,
      Code: t.Code,
      Tasks: t.TourTask.map(mapToTourTaskDTO)
    }))

  const initialState: InitialState = { tasks: { tours, bulkSelection: {} } }
  return { props: { initialState } }
}

export default Index
