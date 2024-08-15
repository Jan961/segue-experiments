import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Layout from 'components/Layout';
import { InitialState } from 'lib/recoil';
import { getProductionJumpState } from 'utils/getProductionJumpState';
import { getAccountIdFromReq, getUsers } from 'services/userService';
import useContractsFilter from 'hooks/useContractsFilter';
import ContractFilters from 'components/contracts/ContractFilters';
import CompanyContractsTable from 'components/contracts/table/CompanyContractsTable';
import { getAllVenuesMin, getUniqueVenueCountrylist } from 'services/venueService';
import { intialContractsFilterState } from 'state/contracts/contractsFilterState';
import { fetchAllMinPersonsList } from 'services/personService';
import { all, objectify } from 'radash';
import { PersonMinimalDTO, StandardClauseDTO, UserDto } from 'interfaces';
import { getAllCurrencylist } from 'services/productionService';
import { fetchAllStandardClauses } from 'services/contracts';

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
  const accountId = await getAccountIdFromReq(ctx.req);
  const productionJump = await getProductionJumpState(ctx, 'contracts/company-contracts', accountId);
  const ProductionId = -1;
  productionJump.selected = -1;
  const [users, countryList, venues, personsList, currencyList, standardClauses] = await all([
    getUsers(accountId),
    getUniqueVenueCountrylist(),
    getAllVenuesMin(),
    fetchAllMinPersonsList(),
    getAllCurrencylist(),
    fetchAllStandardClauses(),
  ]);
  const standardClause = objectify(
    standardClauses,
    (c: StandardClauseDTO) => c.id,
    (c) => c,
  );
  const venue = objectify(
    venues,
    (v) => v.Id,
    (v: any) => {
      const Town: string | null = v.VenueAddress.find((address: any) => address?.TypeName === 'Main')?.Town ?? null;
      return { Id: v.Id, Code: v.Code, Name: v.Name, Town, Seats: v.Seats, Count: 0 };
    },
  );
  const person =
    objectify(
      personsList,
      (v: PersonMinimalDTO) => v.id,
      (v) => v,
    ) ?? {};
  // See _app.tsx for how this is picked up
  const initialState: InitialState = {
    global: {
      productionJump,
      countryList,
    },
    productions: {
      currencyList,
    },
    account: {
      user: { users: objectify(users, (user: UserDto) => user.Id) },
    },
    contracts: {
      filters: {
        ...intialContractsFilterState,
        department: department ? parseInt(department, 10) : -1,
      },
      venue,
      person,
      standardClause,
    },
  };

  return {
    props: {
      ProductionId,
      initialState,
    },
  };
};
