import Layout from "components/Layout";
import { Tour, ITourTask, User } from "interfaces";
import { useEffect, useState } from "react";
import Toolbar from "components/tasks/toolbar";
import Tasklist from "components/tasks/TaskList";
import TaskModal from "components/tasks/modal/TaskModal";
import TaskButtons from "components/tasks/TaskButtons";
import NewTaskForm from "components/tasks/NewTaskForm";
import { useRouter } from "next/router";
import UpdateTaskForm from "components/tasks/UpdateTaskForm";
import BulkActionForm from "components/tasks/BulkActionForm";
import { userService } from "services/user.service";
import axios from "axios";
import { LocalUser } from "types/userTypes";
import GlobalToolbar from "components/toolbar";
import { Spinner } from "spinner";
import RecurringTaskForm from "components/tasks/RecurringTaskForm";

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
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isRecurringOpen, setIsRecurringOpen] = useState(false);
  const [bulkIsOpen, setBulkIsOpen] = useState(false);
  const [activeTourId, setActiveTourId] = useState<string>();
  const [masterTourData, setMasterTourData] = useState<Tour[]>([]);
  const [tourData, setTourData] = useState<Tour[]>([]);
  const [taskData, setTaskData] = useState<ITourTask[]>();
  const [isMounted, setIsMounted] = useState(false);
  const [isSelectedArray, setIsSelectedArray] = useState<String[]>([]);
  const [bulkActionField, setBulkActionField] = useState<String>("");
  const [filtersOpen, setFiltersOpen] = useState<boolean>(false);
  const [bulkActionValue, setBulkActionValue] = useState<
    String | Number | Date
  >("");
  const [updateTask, setUpdateTask] = useState<any>();
  const [updateTaskModalIsOpen, setUpdateTaskModalIsOpen] =
    useState<boolean>(false);

  // Filters Start
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [selectedTour, setSelectedTour] = useState<number>(0);
  const [assignee, setAssignee] = useState<number>(0);
  const [assignedBy, setAssignedBy] = useState<number>(0);

  
  // Filters End
  
  function deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
  }
  function applyFilters() {
    console.log("the master data:", masterTourData);
    console.log("the tour data:", tourData);
    setTourData([]);
    setIsLoading(true);
  
    let filteredTourData = deepCopy(masterTourData);
  
    if (selectedTour !== 0) {
      filteredTourData = filteredTourData.filter(
        (tour) => selectedTour === 0 || selectedTour === tour.TourId
      );
    }
  
    if (assignee !== 0 || assignedBy !== 0 || searchFilter.length > 0) {
      filteredTourData = filteredTourData.map((tour) => {
        let tasks = tour.TourTask.filter((task) => {
          return (
            task.Assignee === assignee ||
            task.AssignedBy === assignedBy ||
            (searchFilter.length > 0 && task.TaskName.toLowerCase().includes(searchFilter.toLowerCase()))
          );
        });
    
        let updatedTour = deepCopy(tour);
        updatedTour.TourTask = tasks;
    
        return updatedTour;
      });
    }
    
  
    setTourData(filteredTourData);
    setIsLoading(true);
  }
  
  

  useEffect(() => {
    console.log(
      "applying filters ",
      assignee,
      assignedBy,
      searchFilter,
      selectedTour
    );
    applyFilters();
  }, [assignee, assignedBy, searchFilter, selectedTour]);

  const router = useRouter();
  const { tourId } = router.query;

  const user: LocalUser = userService.userValue;
  // To be used with headers once ssl certificate is set
  // const userConfig = {
  //   headers: {
  //     account_admin: user.accountAdmin,
  //     segue_admin: user.segueAdmin,
  //     user_id: user.id,
  //     "Content-Type": "application/json",
  //   },
  // };
  const userConfig = {
      account_admin: user.accountAdmin,
      segue_admin: user.segueAdmin,
      user_id: user.id,
  };

  function retrieveTourData(assignee=null, assignedBy=null, search=null, tour=null) {
    setIsLoading(true);

    // if(assignedBy || search ||tour||assignee){

    //   let body = {assignee:assignee, assignedBy:assignedBy, search:searchFilter, tour:selectedTour}
    //   axios.get(`/api/tasks/filtered/${user.accountId}`, {...userConfig, data:body})
    //   .then((response) => {
    //     let data = JSON.stringify(response.data)

    //     setTourData(JSON.parse(data));
    //     // setMasterTourData(JSON.parse(data));
    //     setIsLoading(false);
    //   })
    //   .catch((error) => {
    //     setIsLoading(false);
    //     console.error(error);
    //   });
    // }

    axios
      .post(`/api/tours/read/notArchived/${user.accountId}`, {...userConfig})
      .then((response) => {
        let data = JSON.stringify(response.data)

        setTourData(JSON.parse(data));
        setMasterTourData(JSON.parse(data));
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        console.error(error);
      });
  }
  useEffect(() => {
    retrieveTourData();
  }, []);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  // useEffect(() => {
  //   if (typeof tourId === "string") {
  //     setActiveTourId(tourId);
  //   }
  // }, [router.query.tourId]);

  async function refreshTourData() {
    console.log("the tourId", activeTourId);
    try {
      retrieveTourData();
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    refreshTourData();
  }, [isMounted]);

  // Old filter
  // useEffect(() => {
  //   if (searchFilter.length > 0) {
  //     setTourData(
  //       masterTourData.map((tour)=>{
  //       let tourTasks = tour.TourTask.filter((task) => task.TaskName.includes(searchFilter))
  //       tour.TourTask = tourTasks
  //       return tour
  //       })
  //     );
  //   }
  // }, [searchFilter]);

  function isTaskSelected(taskId: string): boolean {
    return isSelectedArray.includes(taskId);
  }

  function handleSelectedFunction(taskId: string): void {
    console.log("the selected task array", isSelectedArray);
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

  function closeBulkModal() {
    setBulkIsOpen(false);
    refreshTourData();
  }

  return (
    <Layout title="Tasks | Seque">
      <div className="flex flex-auto w-full h-screen">
        <div
          className="flex-col px-12 w-full flex justify-between"
          style={{ minHeight: "60vh" }}
        >
          <GlobalToolbar
            tourJump={false}
            title={"Tasks"}
            color={"text-primary-purple"}
            filtersOpen={filtersOpen}
            setFiltersOpen={setFiltersOpen}
            searchFilter={searchFilter}
            setSearchFilter={setSearchFilter}
            filterComponent={
              <Toolbar
              filtersOpen={filtersOpen}
                userAccountId={user.accountId}
                tours={masterTourData}
                searchFilter={searchFilter}
                setSearchFilter={setSearchFilter}
                openAddTask={setIsOpen}
                openAddRecurringTask={setIsRecurringOpen}
                assignee={assignee}
                setAssignee={setAssignee}
                assignedBy={assignedBy}
                setAssignedBy={setAssignedBy}
                selectedTour={selectedTour}
                setSelectedTour={setSelectedTour}
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
                      openUpdateModal={openUpdateModal}
                      handleSelectAll={handleSelectAll}
                      handleSelectedFunction={handleSelectedFunction}
                      isTaskSelected={isTaskSelected}
                      tasks={tour.TourTask}
                      key={idx}
                    />
                  </>
                );
              })
            : !isLoading && (
                <div className="text-center font-bold text-lg">
                  <p>No Tasks Found</p>
                </div>
              )}
          <TaskButtons openBulkModal={openBulkModal} />
        </div>
      </div>
      <TaskModal isOpen={isOpen} onClose={setIsOpen}>
        <NewTaskForm tours={tourData} closeModal={closeModal} user={user} />
      </TaskModal>
      <TaskModal isOpen={isRecurringOpen} onClose={setIsRecurringOpen}>
        <RecurringTaskForm tours={tourData} closeModal={() => setIsRecurringOpen(false)} user={user} />
      </TaskModal>
      <TaskModal
        isOpen={updateTaskModalIsOpen}
        onClose={setUpdateTaskModalIsOpen}
      >
        <UpdateTaskForm 
        currentUser={user}
          userAccountId={user.accountId}
          closeModal={closeUpdateModal} task={updateTask} />
      </TaskModal>
      <TaskModal isOpen={bulkIsOpen} onClose={setBulkIsOpen}>
        <BulkActionForm
          userAccountId={user.accountId}
          closeModal={closeBulkModal}
          taskIdArray={isSelectedArray}
          bulkActionField={bulkActionField}
        />
      </TaskModal>
    </Layout>
  );
};

export default Index;
