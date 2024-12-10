import { GetServerSideProps, InferGetServerSidePropsType, NextApiRequest } from 'next';
import Layout from 'components/Layout';
import { InitialState } from 'lib/recoil';
import { getProductionJumpState } from 'utils/getProductionJumpState';
import { getAccountIdFromReq, getUsers } from 'services/userService';
import Filters from 'components/tasks/Filters';
import TasksTable from 'components/tasks/TasksTable';
import useTasksFilter from 'hooks/useTasksFilter';
import { getProductionsAndTasks } from 'services/productionService';
import { ProductionsWithTasks } from 'state/tasks/productionState';
import { objectify } from 'radash';
import { useRecoilValue } from 'recoil';
import { userState } from 'state/account/userState';
import { useEffect, useMemo, useState } from 'react';
import { getColumnDefs } from 'components/tasks/tableConfig';
import { mapToProductionTasksDTO } from 'mappers/tasks';
import NewProductionEmpty from 'components/tasks/modals/NewProductionEmpty';
import NewProductionTask from 'components/tasks/modals/NewProductionTask';
import { intialTasksState, tasksfilterState } from 'state/tasks/tasksFilterState';
import MasterTaskList from 'components/tasks/modals/MasterTaskList';
import ProductionTaskList from 'components/tasks/modals/ProductionTaskList';
import { productionJumpState } from 'state/booking/productionJumpState';
import Spinner from 'components/core-ui-lib/Spinner';
import { isNullOrEmpty } from 'utils';
import { useRouter } from 'next/router';
import { accessProjectManagement } from 'state/account/selectors/permissionSelector';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TasksPage = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { filteredProductions } = useTasksFilter();
  const { users } = useRecoilValue(userState);
  const permissions = useRecoilValue(accessProjectManagement);
  const canAccessTaskNotes = permissions.includes('ACCESS_PROD_TASK_NOTES');
  const canEditDropdowns = permissions.includes('EDIT_PROD_TASK_DROPDOWNS');

  const filter = useRecoilValue(tasksfilterState);
  const router = useRouter();
  const usersList = useMemo(
    () =>
      Object.values(users).map(({ AccUserId, FirstName = '', LastName = '' }) => ({
        value: AccUserId,
        text: `${FirstName || ''} ${LastName || ''}`,
      })),
    [users],
  );

  const exists = usersList.some((item) => item.text === 'All');

  if (!exists) {
    usersList.unshift({ value: -1, text: 'All' });
  }

  const [showAddTask, setShowAddTask] = useState<boolean>(false);
  const [showEmptyProductionModal, setShowEmptyProductionModal] = useState<boolean>(false);
  const [showNewProduction, setShowNewProduction] = useState<boolean>(false);
  const [isMasterTaskList, setIsMasterTaskList] = useState<boolean>(false);
  const [isProductionTaskList, setIsProductionTaskList] = useState<boolean>(false);
  const [isShowSpinner, setIsShowSpinner] = useState<boolean>(false);
  const filterMatchingInitial = useMemo(() => {
    const { assignee, endDueDate, startDueDate, status, taskText, production } = filter;
    return (
      assignee === intialTasksState.assignee &&
      endDueDate === intialTasksState.endDueDate &&
      startDueDate === intialTasksState.startDueDate &&
      status === intialTasksState.status &&
      taskText === intialTasksState.taskText &&
      !isNullOrEmpty(production)
    );
  }, [filter]);

  const { selected: ProductionId } = useRecoilValue(productionJumpState);
  const handleShowTask = () => {
    setShowAddTask(false);
  };
  const isShowingTaskModals = useMemo(() => {
    return !(showNewProduction || showAddTask || isMasterTaskList || isProductionTaskList || isShowSpinner);
  }, [showNewProduction, showAddTask, isMasterTaskList, isProductionTaskList, isShowSpinner]);

  useEffect(() => {
    if (filteredProductions.length === 1) {
      filteredProductions.forEach((production) => {
        if (production.Tasks.length === 0 && filterMatchingInitial && isShowingTaskModals) {
          setShowEmptyProductionModal(true);
        } else {
          setShowEmptyProductionModal(false);
        }
      });
    }
  }, [filteredProductions]);

  const handleShowEmptyProduction = () => {
    setShowEmptyProductionModal(false);
  };

  const handleNewProductionTaskModal = () => {
    setShowNewProduction(false);
  };

  const handleModalConditions = () => {
    setShowNewProduction(true);
  };

  const handleNewProductionTaskSubmit = (val: string) => {
    handleNewProductionTaskModal();
    if (val === 'taskManual') {
      setShowAddTask(true);
    } else if (val === 'master') {
      setIsMasterTaskList(true);
    } else {
      setIsProductionTaskList(true);
    }
    setShowEmptyProductionModal(false);
  };

  const handleMasterListClose = async (_val: string) => {
    await router.replace(router.asPath);
    setIsMasterTaskList(false);
  };

  const handleProductionListClose = async (_val: string) => {
    await router.replace(router.asPath);
    setIsProductionTaskList(false);
    setIsMasterTaskList(false);
  };
  const currentProductionObj = useRecoilValue(productionJumpState).productions.find((item) => item.Id === ProductionId);
  return (
    <>
      {isShowSpinner && (
        <div
          data-testid="tasks-page-spinner"
          className="inset-0 absolute bg-white bg-opacity-50 z-50 flex justify-center items-center"
        >
          <Spinner size="lg" />
        </div>
      )}
      <Layout title="Tasks | Segue" flush>
        <div className="mb-8">
          <Filters usersList={usersList} handleShowTask={handleModalConditions} />
        </div>
        {filteredProductions.length === 0 ? (
          <TasksTable rowData={[]} />
        ) : (
          filteredProductions.map((production) => {
            const columnDefs = getColumnDefs(usersList, currentProductionObj, canEditDropdowns, canAccessTaskNotes);
            return (
              <div key={production.Id} className="mb-10">
                <TasksTable
                  tableHeight={filteredProductions.length > 1}
                  rowData={production.Tasks}
                  columnDefs={columnDefs}
                  productionId={production.Id}
                  showAddTask={showAddTask}
                  handleShowTask={handleShowTask}
                  setIsShowSpinner={setIsShowSpinner}
                />
              </div>
            );
          })
        )}
        <NewProductionEmpty
          visible={showEmptyProductionModal}
          onClose={handleShowEmptyProduction}
          handleSubmit={handleNewProductionTaskSubmit}
        />
        <NewProductionTask
          visible={showNewProduction}
          onClose={handleNewProductionTaskModal}
          handleNewProductionTaskSubmit={handleNewProductionTaskSubmit}
        />
        <MasterTaskList visible={isMasterTaskList} onClose={handleMasterListClose} productionId={ProductionId} />
        <ProductionTaskList
          visible={isProductionTaskList}
          onClose={handleProductionListClose}
          productionId={ProductionId}
        />
      </Layout>
    </>
  );
};

export default TasksPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const AccountId = await getAccountIdFromReq(ctx.req);
  const productionJump = await getProductionJumpState(ctx, 'tasks');
  const ProductionId = productionJump.selected;
  if (!ProductionId) return { notFound: true };
  const users = await getUsers(AccountId);
  const productionsWithTasks = await getProductionsAndTasks(ctx.req as NextApiRequest, ProductionId);

  const productions: ProductionsWithTasks[] = mapToProductionTasksDTO(productionsWithTasks);
  const initialState: InitialState = {
    global: {
      productionJump,
    },
    tasks: { productions, bulkSelection: {} },
    account: {
      user: { users: objectify(users, (user) => user.Id) },
    },
  };
  return { props: { initialState } };
};
