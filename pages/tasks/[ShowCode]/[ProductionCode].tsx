import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
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
import { useRouter } from 'next/router';
import NewProductionEmpty from 'components/tasks/modals/NewProductionEmpty';
import NewProductionTask from 'components/tasks/modals/NewProductionTask';
import { intialTasksState, tasksfilterState } from 'state/tasks/tasksFilterState';
import MasterTaskList from 'components/tasks/modals/MasterTaskList';
import ProductionTaskList from 'components/tasks/modals/ProductionTaskList';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TasksPage = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { filteredProductions } = useTasksFilter();

  const { users } = useRecoilValue(userState);

  const filter = useRecoilValue(tasksfilterState);

  const router = useRouter();

  const usersList = useMemo(
    () =>
      Object.values(users).map(({ Id, FirstName = '', LastName = '' }) => ({
        value: Id,
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

  const [productionId, setProductionId] = useState<number>(null);

  const handleShowTask = () => {
    setShowAddTask(!showAddTask);
    router.replace(router.asPath);
  };

  const isFilterMatchingInitialState = () => {
    const { assignee, endDueDate, startDueDate, status, taskText } = filter;

    return (
      assignee === intialTasksState.assignee &&
      endDueDate === intialTasksState.endDueDate &&
      startDueDate === intialTasksState.startDueDate &&
      status === intialTasksState.status &&
      taskText === intialTasksState.taskText
    );
  };

  useEffect(() => {
    if (filteredProductions.length === 1) {
      filteredProductions.forEach((production) => {
        if (production.Tasks.length === 0 && isFilterMatchingInitialState()) {
          setShowEmptyProductionModal(true);
          setProductionId(production.Id);
        } else {
          setShowEmptyProductionModal(false);
          setProductionId(null);
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
    if (val === 'taskManual') setShowAddTask(true);
    else if (val === 'master') setIsMasterTaskList(true);
    else setIsProductionTaskList(true);
  };

  const handleMasterListClose = (val: string) => {
    setIsMasterTaskList(false);
    if (val === 'data-added') {
      router.replace(router.asPath);
    }
  };

  const handleProductionListClose = (val: string) => {
    setIsProductionTaskList(false);
    setIsMasterTaskList(false);
    if (val === 'data-added') {
      router.replace(router.asPath);
    }
  };

  return (
    <Layout title="Tasks | Segue" flush>
      <div className="mb-8">
        <Filters usersList={usersList} handleShowTask={handleModalConditions} />
      </div>
      {filteredProductions.length === 0 ? (
        <TasksTable rowData={[]} />
      ) : (
        filteredProductions.map((production) => {
          const columnDefs = getColumnDefs(usersList, production);
          return (
            <div key={production.Id} className="mb-10">
              <TasksTable
                tableHeight={filteredProductions.length > 1}
                rowData={production.Tasks}
                columnDefs={columnDefs}
                productionId={production.Id}
                showAddTask={showAddTask}
                handleShowTask={handleShowTask}
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
      <MasterTaskList visible={isMasterTaskList} onClose={handleMasterListClose} productionId={productionId} />
      <ProductionTaskList
        visible={isProductionTaskList}
        onClose={handleProductionListClose}
        productionId={productionId}
      />
    </Layout>
  );
};

export default TasksPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const AccountId = await getAccountIdFromReq(ctx.req);
  const productionJump = await getProductionJumpState(ctx, 'tasks', AccountId);
  const ProductionId = productionJump.selected;
  // ProductionJumpState is checking if it's valid to access by accountId
  if (!ProductionId) return { notFound: true };
  const users = await getUsers(AccountId);
  const productionsWithTasks = await getProductionsAndTasks(AccountId, ProductionId);

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
