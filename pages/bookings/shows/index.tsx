import Layout from 'components/Layout';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getProductionJumpState } from 'utils/getProductionJumpState';
import { getAccountIdFromReq } from 'services/userService';
import { InitialState } from 'lib/recoil';
import { getShowsByAccountId } from 'services/ShowService';
import ShowsTable from 'components/shows/ShowsTable';
import { showMapper } from 'lib/mappers';
import Checkbox from 'components/core-ui-lib/Checkbox';
import Button from 'components/core-ui-lib/Button';
import { useMemo, useState } from 'react';

export default function Index(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { showsList = [] } = props;
  const [isArchived, setIsArchived] = useState<boolean>(false);
  const [isAddRow, setIsAddRow] = useState<boolean>(false);

  const handleArchive = () => {
    setIsArchived(!isArchived);
  };

  const unArchivedList = useMemo(() => {
    return showsList.filter((item) => !item.IsArchived);
  }, [showsList, isArchived]);

  const archivedList = useMemo(() => {
    return showsList.filter((item) => item.IsArchived);
  }, [showsList, isArchived]);

  const rowsData = useMemo(() => {
    if (isArchived) return [...unArchivedList, ...archivedList];
    return [...unArchivedList];
  }, [unArchivedList, archivedList, isArchived]);

  const addNewRow = () => {
    setIsAddRow(!isAddRow);
  };

  return (
    <Layout title="Shows | Segue" flush>
      <div className="w-9/12 mx-auto">
        <div className="flex items-center justify-between py-4">
          <h1 className="text-primary-orange text-4xl font-bold">Shows</h1>
          <div className="flex gap-2 items-center">
            <Checkbox
              className="flex flex-row-reverse"
              checked={isArchived}
              label="Include archived"
              id={''}
              onChange={handleArchive}
            />
            <Button disabled={isAddRow} onClick={addNewRow} text="Add New Show" />
          </div>
        </div>
        <ShowsTable isArchived={isArchived} isAddRow={isAddRow} addNewRow={addNewRow} rowsData={rowsData} />
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const AccountId = await getAccountIdFromReq(ctx.req);
  const productionJump = await getProductionJumpState(ctx, 'bookings', AccountId);
  const shows = (await getShowsByAccountId(AccountId)) || [];
  const showsList = shows.map(showMapper);
  const initialState: InitialState = {
    global: {
      productionJump,
    },
  };
  return {
    props: {
      showsList,
      initialState,
    },
  };
};
