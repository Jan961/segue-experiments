import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Layout from 'components/Layout';
import { InitialState } from 'lib/recoil';
import { getProductionJumpState } from 'utils/getProductionJumpState';
import { getAccountIdFromReq } from 'services/userService';
import useContractsFilter from 'hooks/useContractsFilter';
import ContractFilters from 'components/contracts/ContractFilters';
import CompanyContractsTable from 'components/contracts/table/CompanyContractsTable';
import { getUniqueVenueCountrylist } from 'services/venueService';
import { intialContractsFilterState } from 'state/contracts/contractsFilterState';
import { fetchAllMinPersonsList } from 'services/personService';
import { objectify } from 'radash';
import { PersonMinimalDTO } from 'interfaces';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ContractsPage = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const rows = useContractsFilter();

  return (
    <Layout title="Contracts | Segue" flush>
      <div className="mb-8">
        <ContractFilters />
      </div>
      <CompanyContractsTable rowData={rows} />
    </Layout>
  );
};

export default ContractsPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const department = ctx.query.d as string;
  const AccountId = await getAccountIdFromReq(ctx.req);
  const productionJump = await getProductionJumpState(ctx, 'contracts/company-contracts', AccountId);
  const ProductionId = productionJump.selected;
  const countryList = await getUniqueVenueCountrylist();
  const personList = await fetchAllMinPersonsList();
  const person = objectify(
    personList,
    (p: PersonMinimalDTO) => p.id,
    (p) => p,
  );
  // See _app.tsx for how this is picked up
  const initialState: InitialState = {
    global: {
      productionJump,
      countryList,
    },
    contracts: {
      filters: {
        ...intialContractsFilterState,
        department: department ?? 'all',
      },
      person,
    },
  };

  return {
    props: {
      ProductionId,
      initialState,
    },
  };
};
