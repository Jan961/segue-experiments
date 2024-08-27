import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Layout from 'components/Layout';
import { InitialState } from 'lib/recoil';
import { getProductionJumpState } from 'utils/getProductionJumpState';
import { getAccountIdFromReq, getUsers } from 'services/userService';
import CompanyContractFilters from 'components/contracts/ContractFilters';
import CompanyContractsTable from 'components/contracts/table/CompanyContractsTable';
import { getAllVenuesMin, getUniqueVenueCountrylist } from 'services/venueService';
import { all, objectify } from 'radash';
import { intialContractsFilterState } from 'state/contracts/contractsFilterState';
import { fetchAllMinPersonsList } from 'services/personService';
import { PersonMinimalDTO, StandardClauseDTO, UserDto } from 'interfaces';
import { getAllCurrencylist } from 'services/productionService';
import { fetchAllContracts, fetchAllStandardClauses, fetchDepartmentList } from 'services/contracts';
import { IContractDepartment, IContractSummary } from 'interfaces/contracts';
import useCompanyContractsFilter from 'hooks/useCompanyContractsFilters';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ContractsPage = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const rows = useCompanyContractsFilter();

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
  const departmentId = ctx.query.d as string;
  const accountId = await getAccountIdFromReq(ctx.req);
  const productionJump = await getProductionJumpState(ctx, `contracts/company-contracts`, accountId);
  const ProductionId = productionJump.selected;
  const [users, countryList, venues, personsList, currencyList, standardClauses, departmentList, contractList] =
    await all([
      getUsers(accountId),
      getUniqueVenueCountrylist(),
      getAllVenuesMin(),
      fetchAllMinPersonsList(),
      getAllCurrencylist(),
      fetchAllStandardClauses(),
      fetchDepartmentList(),
      fetchAllContracts(ProductionId),
    ]);

  const department = objectify(
    departmentList,
    (d: IContractDepartment) => d.id,
    (d) => d,
  );

  const contract = objectify(
    contractList,
    (d: IContractSummary) => d.id,
    (d) => d,
  );

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
      venue,
      filters: {
        ...intialContractsFilterState,
        department: department ? parseInt(departmentId, 10) : -1,
      },
      person,
      standardClause,
      contract,
      department,
    },
  };
  return {
    props: {
      ProductionId,
      initialState,
    },
  };
};