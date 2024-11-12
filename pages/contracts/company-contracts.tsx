import { GetServerSideProps, InferGetServerSidePropsType, NextApiRequest } from 'next';
import Layout from 'components/Layout';
import { InitialState } from 'lib/recoil';
import { getProductionJumpState } from 'utils/getProductionJumpState';
import useContractsFilter from 'hooks/useContractsFilter';
import CompanyContractFilters from 'components/company-contracts/CompanyContractFilters';
import CompanyContractsTable from 'components/company-contracts/CompanyContractsTable';
import { getUniqueVenueCountrylist } from 'services/venueService';
import { ContractPermissionGroup } from 'interfaces';
import { useRecoilValue } from 'recoil';
import { accessContractsHome, accessAllContracts } from 'state/account/selectors/permissionSelector';

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

  const rows = useContractsFilter();

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
