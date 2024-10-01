import { GetServerSideProps, InferGetServerSidePropsType, NextApiRequest } from 'next';
import Layout from 'components/Layout';
import { InitialState } from 'lib/recoil';
import { getProductionJumpState } from 'utils/getProductionJumpState';
import useContractsFilter from 'hooks/useContractsFilter';
import CompanyContractFilters from 'components/contracts/CompanyContractsFilters';
import CompanyContractsTable from 'components/contracts/table/CompanyContractsTable';
import { getUniqueVenueCountrylist } from 'services/venueService';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ContractsPage = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const rows = useContractsFilter();

  return (
    <Layout title="Contracts | Segue" flush>
      <div className="mb-8">
        <CompanyContractFilters />
      </div>
      <CompanyContractsTable rowData={rows} />
    </Layout>
  );
};

export default ContractsPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const productionJump = await getProductionJumpState(ctx, 'contracts/company-contracts');
  const ProductionId = productionJump.selected;
  const countryList = await getUniqueVenueCountrylist(ctx.req as NextApiRequest);
  // See _app.tsx for how this is picked up
  const initialState: InitialState = {
    global: {
      productionJump,
      countryList,
    },
  };

  return {
    props: {
      ProductionId,
      initialState,
    },
  };
};
