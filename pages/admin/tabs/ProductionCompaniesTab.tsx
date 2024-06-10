import Table from '../../../components/core-ui-lib/Table';
import { productionCompaniesColDefs } from '../../../components/system-admin/productionCompanies/tableConfig';
export default function ProductionCompaniesTab() {
  const tempRowData = [{ CompanyName: 'Jendagi', CompanyWebsite: 'www.robertckelly.co.uk', CompanyLogo: 'Beans' }];

  return (
    <div>
      <h1>Prod Companies Tab</h1>
      <Table columnDefs={productionCompaniesColDefs} rowData={tempRowData} />
    </div>
  );
}
