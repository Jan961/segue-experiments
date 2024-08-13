import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Layout from 'components/Layout';
import { InitialState } from 'lib/recoil';
import { getProductionJumpState } from 'utils/getProductionJumpState';
import { getAccountIdFromReq, getUsers } from 'services/userService';
import CompanyContractFilters from 'components/contracts/ContractFilters';
import CompanyContractsTable from 'components/contracts/table/CompanyContractsTable';
import { getAllVenuesMin, getUniqueVenueCountrylist } from 'services/venueService';
import { objectify } from 'radash';
import { intialContractsFilterState } from 'state/contracts/contractsFilterState';
import { fetchAllMinPersonsList } from 'services/personService';
import { PersonMinimalDTO } from 'interfaces';
import { getAllCurrencylist } from 'services/productionService';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ContractsPage = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <Layout title="Contracts | Segue" flush>
      <div className="mb-8">
        <CompanyContractFilters />
      </div>
      <CompanyContractsTable rowData={[]} />
    </Layout>
  );
};

export default ContractsPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const department = ctx.query.d as string;
  const accountId = await getAccountIdFromReq(ctx.req);
  const productionJump = await getProductionJumpState(ctx, `contracts/company-contracts`, accountId);
  const ProductionId = productionJump.selected;
  const users = await getUsers(accountId);
  const countryList = await getUniqueVenueCountrylist();
  const venues = await getAllVenuesMin();
  const personsList = await fetchAllMinPersonsList();
  const currencyList = await getAllCurrencylist();
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
      user: { users: objectify(users, (user) => user.Id) },
    },
    contracts: {
      venue,
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
