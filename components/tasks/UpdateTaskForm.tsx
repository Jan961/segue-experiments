import { ITourTask } from 'interfaces'
import { useEffect, useState } from 'react'
import formatInputDate from 'utils/dateInputFormat'
import { loggingService } from '../../services/loggingService'
import getUsers from 'utils/getUsers'
import { LocalUser } from 'types/userTypes'

function UpdateTaskForm ({ userAccountId, task, closeModal }:{userAccountId:number, task:ITourTask, closeModal:()=>void}) {
  const [users, setUsers] = useState([])
  const [showsArray, setShowsArray] = useState([])
  const [taskTitle, setTaskTitle] = useState(task && task.TaskName)
  const [dueDate, setDueDate] = useState(formatInputDate(task && task.DueDate))
  const [interval, setInterval] = useState(task && task.Interval)
  const [progress, setProgress] = useState(task && task.Progress)
  const [assignee, setAssignee] = useState(task && task.Assignee)
  const [assignedBy, setAssignedBy] = useState(task && task.AssignedBy)
  const [status, setStatus] = useState(task && task.Status)
  const [priority, setPriority] = useState(task && task.Priority)
  const [followUp, setFollowUp] = useState(task && formatInputDate(task && task.FollowUp))
  const [notes, setNotes] = useState(task && task.Notes)

  const handleTaskTitleChange = (event) => {
    setTaskTitle(event.target.value)
  }
  const handleDueDateChange = (event) => {
    setDueDate(event.target.value)
  }

  const handleIntervalChange = (event) => {
    setInterval(event.target.value)
  }

  const handleProgressChange = (event) => {
    setProgress(parseInt(event.target.value))
  }

  const handleAssigneeChange = (event) => {
    setAssignee(event.target.value)
    if (parseInt(event.target.value) !== 0) {
      setAssignedBy(0)
    } else {
      setAssignedBy(0)
    }
  }

  const handleStatusChange = (event) => {
    setStatus(event.target.value)
  }
  const handlePriorityChange = (event) => {
    setPriority(event.target.value)
  }
  const handleFollowUpChange = (event) => {
    setFollowUp(event.target.value)
  }
  const handleNotesChange = (event) => {
    setNotes(event.target.value)
  }

  async function updateTask () {
    try {
      const payload = {
        taskTitle,
        dueDate,
        interval,
        progress,
        assignee,
        assignedBy,
        status,
        priority,
        followUp,
        notes
      }

      const address = () => `/api/tasks/update/single/${task.TourTaskId}`
      const response = await fetch(address(), {
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        method: 'PUT'
      })

      if (response.ok) {
        const parsedResponse = await response.json()
        loggingService.logAction('Update Task', parsedResponse)
        closeModal()
      }
    } catch (error) {
      loggingService.logError(error)
      console.error(error)
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    updateTask()
  }

  async function requestAccountUsers () {
    const foundUsers = await getUsers(userAccountId)
    console.log('The found users', foundUsers)
    loggingService.logAction('User Response', foundUsers)
    if (foundUsers) {
      setUsers(foundUsers)
    }
  }

  useEffect(() => {
    requestAccountUsers()
  }, [])

  return (
    <div className="flex-col items-center pb-3">

      <p className="text-2xl font-bold w-full text-center"> Update task </p>

      <div className="overflow-hidden bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            ShowModal Title:
          </h3>
          {/* <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Personal details and application.
          </p> */}
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Task Title</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                <div className="flex items-center justify-center">
                  <div className="datepicker relative form-floating mb-3 xl:w-96">
                    <input
                      onChange={handleTaskTitleChange}
                      value={taskTitle}
                      type={'text'}
                      className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                      placeholder="Select a date"
                    />
                  </div>
                </div>
              </dd>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Due Date</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                <div className="flex items-center justify-center">
                  <div className="datepicker relative form-floating mb-3 xl:w-96">
                    <input
                      onChange={handleDueDateChange}
                      value={dueDate}
                      type={'date'}
                      className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                      placeholder="Select a date"
                    />
                    <label htmlFor="floatingInput" className="text-gray-700">
                      Select a date
                    </label>
                  </div>
                </div>
              </dd>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Task Frequency
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                <select name="interval"
                  onChange={handleIntervalChange} value={interval}>
                  <option value="once">Once</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Bi-Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Annually</option>
                </select>
              </dd>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Progress</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                <select name="Progress"
                  onChange={handleProgressChange}
                  value={progress}>
                  <option value={0}>Not Started</option>
                  <option value={10}>10%</option>
                  <option value={25}>25%</option>
                  <option value={50}>50%</option>
                  <option value={75}>75%</option>
                  <option value={90}>90%</option>
                  <option value={100}>Completed</option>
                </select>
              </dd>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Assignee</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                <select name="assignee"
                  onChange={handleAssigneeChange}
                  value={assignee}>
                  <option value={0}>Assign a User</option>
                  {users.map(usr => {
                    return <option value={usr.UserId}>{usr.UserName}</option>
                  })}
                </select>
              </dd>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Assigned By</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                Peter Carlyle
              </dd>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                <select name="status"
                  onChange={handleStatusChange}
                  value={status}>
                  <option value="todo">To Do</option>
                  <option value="doing">Doing</option>
                  <option value="done">Done</option>
                  <option value="blocked">Blocked</option>
                </select>
              </dd>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Priority</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                <select name="prioroty"
                  onChange={handlePriorityChange}
                  value={priority}>
                  <option value={0}>Low</option>
                  <option value={1}>Medium</option>
                  <option value={2}>High</option>
                </select>
              </dd>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Follow up</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                <div className="flex items-center justify-center">
                  <div className="datepicker relative form-floating mb-3 xl:w-96">
                    <input
                      onChange={handleFollowUpChange}
                      value={followUp}
                      type="date"
                      className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                      placeholder="Select a date"
                    />
                    <label htmlFor="floatingInput" className="text-gray-700">
                      Select a date
                    </label>
                  </div>
                </div>

              </dd>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Notes</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                <div className="flex items-center justify-center">
                  <div className="datepicker relative form-floating mb-3 xl:w-96">
                    <textarea
                      onChange={handleNotesChange}
                      value={notes}
                      className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                      placeholder="Select a date"
                    />
                    <label htmlFor="floatingInput" className="text-gray-700">
                      add any notes
                    </label>
                  </div>
                </div>

              </dd>
            </div>
          </dl>
          <div className="flex-row flex justify-around w-full">
            <button
              onClick={handleSubmit}
              className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"

            >update task</button>
            <button
              onClick={closeModal}
              className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"

            >Cancel</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UpdateTaskForm
