import Table from '../../../components/core-ui-lib/Table';
import {
  productionCompaniesColDefs,
  styleProps,
} from '../../../components/system-admin/productionCompanies/tableConfig';
import { useEffect, useState } from 'react';
import Button from '../../../components/core-ui-lib/Button';
export default function ProductionCompaniesTab() {
  const [createMode, setCreateMode] = useState<boolean>();
  const [productionCompanies, setProductionCompanies] = useState<any>();

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
  const onAddNewVenueContact = () => {
    if (createMode) return;
    const emptyData = { Name: '', WebSite: '', Logo: '' };
    setProductionCompanies((prev) => [emptyData, ...prev]);
    setCreateMode(true);
  };

  // const tempData = [{ Name: 'Jendagi Productions Limited', WebSite: 'www.robertckelly.co.uk', Logo: null }];
  // setProductionCompanies(tempData);
  // const productionCompanies = await response.json();
  // console.log(productionCompanies);
  return (
    <div>
      <Button disabled={createMode} onClick={onAddNewVenueContact} variant="primary" text="Add New Contact" />
      <Table columnDefs={productionCompaniesColDefs} rowData={productionCompanies} styleProps={styleProps} />{' '}
    </div>
  );
}
