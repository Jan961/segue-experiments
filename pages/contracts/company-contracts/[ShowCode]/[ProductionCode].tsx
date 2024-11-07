import { GetServerSideProps, InferGetServerSidePropsType, NextApiRequest } from 'next';
import Layout from 'components/Layout';
import { InitialState } from 'lib/recoil';
import { getProductionJumpState } from 'utils/getProductionJumpState';
import { getAccountIdFromReq, getUsers } from 'services/userService';
import CompanyContractFilters from 'components/company-contracts/CompanyContractFilters';
import CompanyContractsTable from 'components/company-contracts/CompanyContractsTable';
import { getAllVenuesMin, getUniqueVenueCountrylist } from 'services/venueService';
import { all, objectify } from 'radash';
import { intialContractsFilterState } from 'state/contracts/contractsFilterState';
import { fetchAllMinPersonsList } from 'services/personService';
import { ContractPermissionGroup, PersonMinimalDTO, StandardClauseDTO, TemplateMinimalDTO, UserDto } from 'interfaces';
import { getAllCurrencylist } from 'services/productionService';
import { fetchAllContracts, fetchAllStandardClauses, fetchDepartmentList } from 'services/contracts';
import { IContractDepartment, IContractSummary } from 'interfaces/contracts';
import useCompanyContractsFilter from 'hooks/useCompanyContractsFilters';
import { getAccountContacts } from 'services/contactService';
import { fetchAllTemplates } from 'services/templateService';
import { useRecoilValue } from 'recoil';
import { accessAllContracts, accessContractsHome } from 'state/account/selectors/permissionSelector';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ContractsPage = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const accessPermissions = useRecoilValue(accessContractsHome);
  const permissions = useRecoilValue(accessAllContracts);

  // Add permission getting
  const accessNewPerson: ContractPermissionGroup = {
    artisteContracts: permissions.includes('ADD_NEW_PERSON_ARTISTE'),
    creativeContracts: permissions.includes('ADD_NEW_PERSON_CREATIVE'),
    smTechCrewContracts: permissions.includes('ADD_TECH_NEW_PERSON'),
  };

  const accessNewContract: ContractPermissionGroup = {
    artisteContracts: permissions.includes('ADD_NEW_ARTISTE_CONTRACT'),
    creativeContracts: permissions.includes('ADD_NEW_CREATIVE_CONTRACT'),
    smTechCrewContracts: permissions.includes('ADD_NEW_TECH_CONTRACT'),
  };

  const accessContracts: ContractPermissionGroup = {
    artisteContracts: accessPermissions.includes('ACCESS_ARTISTE_CONTRACTS'),
    creativeContracts: accessPermissions.includes('ACCESS_CREATIVE_CONTRACTS'),
    smTechCrewContracts: accessPermissions.includes('ACCESS_SM_/_CREW_/_TECH_CONTRACTS'),
  };

  const accessEditRow: ContractPermissionGroup = {
    artisteContracts: permissions.includes('EDIT_CONTRACT_ARTISTE'),
    creativeContracts: permissions.includes('EDIT_CONTRACT_CREATIVE'),
    smTechCrewContracts: permissions.includes('EDIT_TECH_CONTRACT'),
  };

  const accessSavePdf: ContractPermissionGroup = {
    artisteContracts: permissions.includes('EXPORT_ARTISTE_CONTRACT'),
    creativeContracts: permissions.includes('EXPORT_CREATIVE_CONTRACT'),
    smTechCrewContracts: permissions.includes('EXPORT_TECH_CONTRACT'),
  };

  const accessChangeStatus: ContractPermissionGroup = {
    artisteContracts: permissions.includes('EDIT_ARTISTE_CONTRACT_STATUS_DROPDOWNS'),
    creativeContracts: permissions.includes('EDIT_CREATIVE_CONTRACT_STATUS_DROPDOWNS'),
    smTechCrewContracts: permissions.includes('EDIT_TECH_CONTRACT_STATUS_DROPDOWNS'),
  };

  const accessEditPerson: ContractPermissionGroup = {
    artisteContracts: permissions.includes('EDIT_PERSON_DETAILS_ARTISTE'),
    creativeContracts: permissions.includes('EDIT_PERSON_DETAILS_CREATIVE'),
    smTechCrewContracts: permissions.includes('EDIT_TECH_PERSON_DETAILS'),
  };

  const rows = useCompanyContractsFilter();

  return (
    <Layout title="Contracts | Segue" flush>
      <div className="mb-8">
        <CompanyContractFilters
          permissions={{
            accessNewPerson,
            accessNewContract,
            accessContracts,
          }}
        />
      </div>
      <CompanyContractsTable
        rowData={rows}
        permissions={{
          accessContracts,
          editRow: accessEditRow,
          savePDF: accessSavePdf,
          changeStatus: accessChangeStatus,
          editPerson: accessEditPerson,
        }}
      />
    </Layout>
  );
};

export default ContractsPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const departmentId = ctx.query.d as string;
  const accountId = await getAccountIdFromReq(ctx.req);
  const productionJump = await getProductionJumpState(ctx, `contracts/company-contracts`);
  const ProductionId = productionJump.selected;
  const [
    users,
    countryList,
    venues,
    personsList,
    templateList,
    currencyList,
    standardClauses,
    departmentList,
    contractList,
    contacts,
  ] = await all([
    getUsers(accountId),
    getUniqueVenueCountrylist(ctx.req as NextApiRequest),
    getAllVenuesMin(ctx.req as NextApiRequest),
    fetchAllMinPersonsList(ctx.req as NextApiRequest),
    fetchAllTemplates(ctx.req as NextApiRequest),
    getAllCurrencylist(),
    fetchAllStandardClauses(ctx.req as NextApiRequest),
    fetchDepartmentList(ctx.req as NextApiRequest),
    fetchAllContracts(ctx.req as NextApiRequest, ProductionId),
    getAccountContacts(accountId),
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

  const template =
    objectify(
      templateList,
      (v: TemplateMinimalDTO) => v.id,
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
      template,
      standardClause,
      contract,
      department,
      accountContacts: contacts,
    },
  };
  return {
    props: {
      ProductionId,
      initialState,
    },
  };
};
