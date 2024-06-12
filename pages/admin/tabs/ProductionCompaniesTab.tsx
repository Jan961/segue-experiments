import { productionCompaniesColDefs, styleProps } from 'components/system-admin/productionCompanies/tableConfig';
import { useEffect, useState } from 'react';
import Button from 'components/core-ui-lib/Button';
import ProductionCompaniesTable from 'components/admin/ProductionCompaniesTable';
export default function ProductionCompaniesTab() {
  //  const [createMode, setCreateMode] = useState<boolean>();
  const [productionCompanies, setProductionCompanies] = useState<any[]>();

  useEffect(() => {
    const getProdCompanies = async () => {
      const response = await fetch('/api/productionCompanies/read', {
        method: 'POST',
        headers: {},
      });
      setProductionCompanies(await response.json());
    };
    getProdCompanies();
  }, []);
  console.log(productionCompanies);
  const onAddNewVenueContact = async () => {
    const emptyData = { Name: '', WebSite: '', Logo: '', existsInDB: false };
    setProductionCompanies((prev) => [emptyData, ...prev]);
    // setCreateMode(true);
  };

  const onCellUpdate = async (e) => {
    const { rowIndex } = e;
    const productions = productionCompanies;
    productions[rowIndex] = { ...e.data, existsInDB: productions[rowIndex].existsInDB };
    setProductionCompanies(productions);
    if (productions[rowIndex].existsInDB) {
      // create
    } else {
      // update
      if (e.data.Name.length > 0) {
        const data = e.data;
        const response = await fetch('/api/productionCompanies/insert', {
          method: 'POST',
          headers: {},
          body: JSON.stringify(data),
        });
        console.log(data);
        console.log(response);
      }
    }
  };

  return (
    <div>
      <Button onClick={onAddNewVenueContact} variant="primary" text="Add New Contact" />
      <ProductionCompaniesTable
        columnDefs={productionCompaniesColDefs}
        rowData={productionCompanies}
        styleProps={styleProps}
        onChange={onCellUpdate}
      />
    </div>
  );
}
