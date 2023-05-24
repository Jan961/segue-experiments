import Layout from 'components/Layout'
import { Tour, ITourTask } from 'interfaces'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

const defaultTourTask: ITourTask = {
  TourTaskId: 0,
  TourId: 0,
  TaskCode: 0,
  TaskName: "",
  StartByWeekCode: "",
  CompleteByWeekCode: "",
  Priority: 0,
  Notes: undefined,
  DeptRCK: false,
  DeptMarketing: false,
  DeptProduction: false,
  DeptAccounts: false,
  Progress: 0,
  DueDate: undefined,
  FollowUp: undefined,
  Assignee: undefined,
  AssignedBy: undefined,
  CreatedDate: undefined,
  Interval: undefined,
  User_TourTask_AssignedByToUser: undefined,
  User_TourTask_AssigneeToUser: undefined,
  Tour: undefined,
  Status: "",
};

const Index = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [bulkIsOpen, setBulkIsOpen] = useState(false);
  const [activeTourId, setActiveTourId] = useState<string>();
  const [tourData, setTourData] = useState<Tour>();
  const [taskData, setTaskData] = useState<ITourTask[]>();
  const [isMounted, setIsMounted] = useState(false);
  const [isSelectedArray, setIsSelectedArray] = useState<String[]>([]);
  const [bulkActionField, setBulkActionField] = useState<String>("");
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [bulkActionValue, setBulkActionValue] = useState<
    String | Number | Date
  >("");
  const [updateTask, setUpdateTask] = useState<any>();
  const [updateTaskModalIsOpen, setUpdateTaskModalIsOpen] =
    useState<boolean>(false);
  const router = useRouter();
  const { tourId } = router.query;

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  useEffect(() => {
    if (typeof tourId === "string") {
      setActiveTourId(tourId);
    }
  }, [router.query.tourId]);

  async function refreshTourData() {
    console.log("the tourId", activeTourId);
    try {
      const response = await fetch(`/api/tasks/${activeTourId}`);
      if (response.ok && isMounted) {
        const parsedResponse = await response.json();
        console.log("the parsed response", parsedResponse);
        setTourData(parsedResponse);
        if(searchFilter.length >0 ){
          setTaskData(parsedResponse.TourTask.filter(task => task.TaskName.includes(searchFilter)))
        } else {
          setTaskData(parsedResponse.TourTask);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    refreshTourData();
  }, [activeTourId, isMounted]);
  useEffect(() => {
    console.log("wow")
    if(searchFilter.length > 0){
      setTaskData(tourData.TourTask.filter(task => task.TaskName.includes(searchFilter)))
    }
  }, [searchFilter]);

  function isTaskSelected(taskId: string): boolean {
    return isSelectedArray.includes(taskId);
  }

  function handleSelectedFunction(taskId: string): void {
    console.log("the selected task array", isSelectedArray)
    if (isSelectedArray.includes(taskId)) {
      setIsSelectedArray(isSelectedArray.filter((id) => id !== taskId));
    } else {
      setIsSelectedArray([...isSelectedArray, taskId]);
    }
  }

  function handleSelectAll(taskIds: string[]): void {
    const alreadySelectedTaskIds = taskIds.filter((id) =>
      isSelectedArray.includes(id)
    );
    if (isSelectedArray.length === taskIds.length) {
      // If all taskIds are already in the isSelectedArray, remove them all
      setIsSelectedArray([]);
    } else {
      // If not all taskIds are already selected, add all taskIds to the isSelectedArray
      setIsSelectedArray(taskIds);
    }
  }


  function closeModal() {
    setIsOpen(false);
    refreshTourData();
  }

  function openUpdateModal(task: ITourTask) {
    setUpdateTaskModalIsOpen(true);
    setUpdateTask(task);
    refreshTourData();
  }
  function closeUpdateModal() {
    setUpdateTask(defaultTourTask);
    setUpdateTaskModalIsOpen(false);
    refreshTourData();
  }

  function openBulkModal(key) {
    switch (key) {
      case "setstatus":
        setBulkActionField("Status");
        setBulkIsOpen(true);
        break;
      case "priority":
        setBulkActionField("Priority");
        setBulkIsOpen(true);

        break;
      case "progress":
        setBulkActionField("Progress");
        setBulkIsOpen(true);

        break;
      case "followup":
        setBulkActionField("FollowUp");
        setBulkIsOpen(true);

        break;
      case "reassign":
        setBulkActionField("Assignee");
        setBulkIsOpen(true);

        break;
      default:
        break;
    }
  }

  function closeBulkModal(){
    setBulkIsOpen(false)
    refreshTourData()
  }

  return (
    <Layout title="Tasks | Seque">
      {/* <div className="flex flex-auto w-full h-screen">

        <div
          className="flex-col px-12 w-full flex justify-between"
          style={{ minHeight: "60vh" }}
        >
              <Toolbar searchFilter={searchFilter} setSearchFilter={setSearchFilter} openAddTask={setIsOpen}/>
          {tourData ? (
            <Tasklist
              openUpdateModal={openUpdateModal}
              handleSelectAll={handleSelectAll}
              handleSelectedFunction={handleSelectedFunction}
              isTaskSelected={isTaskSelected}
              tasks={taskData}
              key={"showid"}
            ></Tasklist>
          ) : (
            <p>No Tasks Found</p>
          )}
          <TaskButtons openBulkModal={openBulkModal} />
        </div>
      </div>
      <TaskModal isOpen={isOpen} onClose={setIsOpen}>
        <NewTaskForm closeModal={closeModal} tourId={activeTourId} user={user} />
      </TaskModal>
      <TaskModal
        isOpen={updateTaskModalIsOpen}
        onClose={setUpdateTaskModalIsOpen}
      >
        <UpdateTaskForm closeModal={closeUpdateModal} task={updateTask} />
      </TaskModal>
      <TaskModal isOpen={bulkIsOpen} onClose={setBulkIsOpen} ><BulkActionForm closeModal={closeBulkModal} taskIdArray={isSelectedArray} bulkActionField={bulkActionField}/></TaskModal>
    */}
    </Layout> 
  );
};

export default Index;
