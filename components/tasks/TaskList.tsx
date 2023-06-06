import TaskListItem from "./TaskListItem";
import { ITourTask } from "interfaces";

const Tasklist = ({
  tasks,
  handleSelectedFunction,
  handleSelectAll,
  isTaskSelected,
  openUpdateModal,
}: {
  openUpdateModal: (task: ITourTask) => void;
  tasks: ITourTask[];
  handleSelectAll: (taskIds: any) => void;
  isTaskSelected: (taskId: any) => boolean;
  handleSelectedFunction: (taskId: any) => void;
}) => {
  const taskIds = tasks && tasks.map((task) => task.TourTaskId);

  return (
    <div className=" flex flex-col">
      <div className="bg-red-300 bg-amber-300 hidden"></div>
      <div className="mb-2 overflow-x-auto">
        <div className="inline-block min-w-full align-middle ">
          <div className="relative overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full table-fixed divide-y divide-gray-300">
              <thead className="bg-transparent">
                <tr>
                  <th
                    scope="col"
                    className="relative w-12 px-6 sm:w-16 sm:px-8"
                  >
                    <input
                      type="checkbox"
                      onChange={() => handleSelectAll(taskIds)}
                      className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 sm:left-6"
                    />
                  </th>
                  <th
                    scope="col"
                    className=" py-3.5 pr-3 text-left text-sm font-semibold text-primary-purple"
                  >
                    Start by (wk)
                  </th>
                  <th
                    scope="col"
                    className=" py-3.5 pr-3 text-left text-sm font-semibold text-primary-purple"
                  >
                    Start by
                  </th>
                  <th
                    scope="col"
                    className=" py-3.5 pr-3 text-left text-sm font-semibold text-primary-purple"
                  >
                    Due (wk)
                  </th>
                  <th
                    scope="col"
                    className=" py-3.5 pr-3 text-left text-sm font-semibold text-primary-purple"
                  >
                    Due
                  </th>
                  <th
                    scope="col"
                    className=" py-3.5 pr-3 text-left text-sm font-semibold text-primary-purple"
                  >
                    Progress
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-primary-purple"
                  >
                    Title
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-primary-purple"
                  >
                    Assignee
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-primary-purple"
                  >
                    Assigned By
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-primary-purple"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-primary-purple"
                  >
                    Priority
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-primary-purple"
                  >
                    Follow Up
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-transparent">
                {tasks.length > 0 ? (
                  tasks.map((task) => (
                    <TaskListItem
                      openUpdateModal={openUpdateModal}
                      handleSelectedFunction={handleSelectedFunction}
                      isTaskSelected={isTaskSelected}
                      task={task}
                      key={task.TourTaskId}
                    ></TaskListItem>
                  ))
                ) : (
                  <></>
                )}
              </tbody>
            </table>
            {tasks.length < 1 && (
              <div className="w-full-screen text-center font-bold my-4">
                <p className="">No Tasks Available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tasklist;
