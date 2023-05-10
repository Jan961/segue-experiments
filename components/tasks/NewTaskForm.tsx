import { useEffect, useState } from "react";
import { loggingService } from "../../services/loggingService";
import getUsers from "utils/getUsers";
import { LocalUser } from "types/userTypes";
import { Tour } from "interfaces";

function NewTaskForm({
  tours,
  closeModal,
  user,
}: {
  tours: Tour[];
  closeModal: () => void;
  user: LocalUser;
}) {
  const [showsArray, setShowsArray] = useState([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [interval, setInterval] = useState("once");
  const [progress, setProgress] = useState(0);
  const [assignee, setAssignee] = useState(1);
  const [assignedBy, setAssignedBy] = useState(user ? user.id : 0);
  const [status, setStatus] = useState("todo");
  const [priority, setPriority] = useState(0);
  const [followUp, setFollowUp] = useState("low");
  const [notes, setNotes] = useState("");
  const [users, setUsers] = useState([]);
  const [tourId, setTourId] = useState<number>(0);
  const [alert, setAlert] = useState<string>("");

  const handleTaskTitleChange = (event) => {
    setTaskTitle(event.target.value);
  };
  const handleDueDateChange = (event) => {
    setDueDate(event.target.value);
  };

  // const handleIntervalChange = (event) => {
  //   setInterval(event.target.value);
  // };

  const handleProgressChange = (event) => {
    setProgress(parseInt(event.target.value));
  };

  const handleAssigneeChange = (event) => {
    setAssignee(event.target.value);
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };
  const handlePriorityChange = (event) => {
    setPriority(event.target.value);
  };
  const handleFollowUpChange = (event) => {
    setFollowUp(event.target.value);
  };
  const handleNotesChange = (event) => {
    setNotes(event.target.value);
  };
  const handleTourIdChange = (event) => {
    setTourId(event.target.value);
  };

  async function requestAccountUsers() {
    let foundUsers = await getUsers(user.accountId);
    console.log("The found users", foundUsers);
    loggingService.logAction("User Response", foundUsers);
    if (foundUsers) {
      setUsers(foundUsers);
    }
  }

  useEffect(() => {
    requestAccountUsers();
  }, []);

  async function addTask() {
    try {
      const payload = {
        taskTitle: taskTitle,
        dueDate: dueDate,
        interval: interval,
        progress: progress,
        assignee: assignee,
        assignedBy: assignedBy,
        status: status,
        priority: priority,
        followUp: followUp,
        notes: notes,
        tourId: tourId,
      };

      const address = () => `/api/tasks/create/single/`;
      const response = await fetch(address(), {
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        method: "POST",
      });

      if (response.ok) {
        const parsedResponse = await response.json();
        closeModal();
      }
    } catch (error) {
      loggingService.logError(error);
      console.error(error);
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    if(tourId !== 0){
        addTask();
    } else{
        setAlert("Select a Tour to add a task")
    }
  };
  async function fetchData() {
    try {
      // const showResponse = await fetch(`/api/tour/shows`)
      // if(showResponse.ok){
      //   const parsedShowResponse = await showResponse.json()
      //   setShowsArray(parsedShowResponse)
      // }
    } catch (error) {
      loggingService.logError(error);
      console.error(error);
    }
  }
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex-col items-center pb-3">
      <p className="text-2xl font-bold w-full text-center"> Add task </p>

      <div className="overflow-hidden bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Create a New Task
          </h3>
        </div>
        <p className="text-center text-red-500">{alert ?? ""}</p>

        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Tour</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                <select
                  name="assignee"
                  onChange={handleTourIdChange}
                  value={tourId}
                >
                  <option value={0}>Select a Tour</option>

                  {tours.map((tour) => {
                    return (
                      <option value={tour.TourId}>{tour.Show.Name}</option>
                    );
                  })}
                </select>
              </dd>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Task Title</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                <div className="flex items-center justify-center">
                  <div className="datepicker relative form-floating mb-3 xl:w-96">
                    <input
                      onChange={handleTaskTitleChange}
                      value={taskTitle}
                      type={"text"}
                      className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                      placeholder="title..."
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
                      type={"date"}
                      className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                      placeholder="Select a date"
                    />
                  </div>
                </div>
              </dd>
            </div>

            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Progress</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                <select
                  name="Progress"
                  onChange={handleProgressChange}
                  value={progress}
                >
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
                <select
                  name="assignee"
                  onChange={handleAssigneeChange}
                  value={assignee}
                >
                  {/* users that are connected to the tour will be mapped here */}
                  {users.map((usr) => {
                    return <option value={usr.UserId}>{usr.UserName}</option>;
                  })}
                </select>
              </dd>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Assigned By</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {user.name}
              </dd>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                <select
                  name="status"
                  onChange={handleStatusChange}
                  value={status}
                >
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
                <select
                  name="prioroty"
                  onChange={handlePriorityChange}
                  value={priority}
                >
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
                      placeholder="notes ..."
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
            >
              add task
            </button>
            <button
              onClick={closeModal}
              className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewTaskForm;
