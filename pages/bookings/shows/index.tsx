import Layout from 'components/Layout';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getProductionJumpState } from 'utils/getProductionJumpState';
import { InitialState } from 'lib/recoil';
import { getAllProductionCompanyList, getShowsByAccountId } from 'services/showService';
import ShowsTable from 'components/shows/ShowsTable';
import { showMapper, showProductionMapper } from 'lib/mappers';
import Checkbox from 'components/core-ui-lib/Checkbox';
import Button from 'components/core-ui-lib/Button';
import { useMemo, useState } from 'react';
import { getAllCurrencylist, getRegionlist } from 'services/productionService';

export default function Index(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { showsList = [] } = props;
  const [isArchived, setIsArchived] = useState<boolean>(false);
  const [isAddRow, setIsAddRow] = useState<boolean>(false);
  const [isEdited, setIsEdited] = useState<boolean>(false);

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

  const handleEdit = () => {
    setIsEdited(!isEdited);
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
              id=""
              disabled={isEdited}
              onChange={handleArchive}
            />
            <Button disabled={isAddRow} onClick={addNewRow} text="Add New Show" />
          </div>
        </div>
        <ShowsTable
          handleEdit={handleEdit}
          isEdited={isEdited}
          isArchived={isArchived}
          isAddRow={isAddRow}
          addNewRow={addNewRow}
          rowsData={rowsData}
        />
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const productionJump = await getProductionJumpState(ctx, 'bookings');
  const shows = (await getShowsByAccountId()) || [];
  const regionsList = await getRegionlist();
  const productionCompanyList = await getAllProductionCompanyList();
  const currencyList = await getAllCurrencylist();

  const showsList = shows.map((show) => {
    return {
      ...showMapper(show),
      productions: showProductionMapper(show),
    };
  });

  console.log({ showsList });

  const initialState: InitialState = {
    global: {
      productionJump,
    },
    productions: {
      currencyList,
      productionCompanyList,
    },
  };
  return {
    props: {
      showsList,
      initialState,
      regionsList,
    },
  };
};
