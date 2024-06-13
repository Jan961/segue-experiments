import { productionCompaniesColDefs, styleProps } from 'components/system-admin/productionCompanies/tableConfig';
import { useEffect, useState } from 'react';
import Button from 'components/core-ui-lib/Button';
import ProductionCompaniesTable from 'components/admin/ProductionCompaniesTable';
import { DeleteConfirmation } from '../../../components/global/DeleteConfirmation';
export default function ProductionCompaniesTab() {
  //  const [createMode, setCreateMode] = useState<boolean>();
  const [productionCompanies, setProductionCompanies] = useState<any[]>();
  // const [showErrorModal, setShowErrorModal] = useState<boolean>();
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>();
  const [selectedProdCompany, setSelectedProdCompany] = useState();
  const fetchProductionCompanies = async () => {
    const response = await fetch('/api/productionCompanies/read', {
      method: 'POST',
      headers: {},
    });
    setProductionCompanies(
      (await response.json()).map((item) => {
        item.existsInDB = true;
        return item;
      }),
    );
  };

  useEffect(() => {
    (async () => {
      await fetchProductionCompanies();
    })();
  }, []);
  console.log(productionCompanies);
  const onAddNewVenueContact = async () => {
    const emptyData = { Name: '', WebSite: '', Logo: '', existsInDB: false, Id: null };
    setProductionCompanies((prev) => [emptyData, ...prev]);
    // setCreateMode(true);
  };
  const onCellClicked = async (e) => {
    const { column, rowIndex } = e;
    if (column.colId === 'delete') {
      console.log('delete column');
      console.log(productionCompanies);
      console.log(rowIndex);

      if (productionCompanies.length <= 1) {
        console.log('You cannot delete this row');
      } else {
        setSelectedProdCompany(productionCompanies[rowIndex].Id);
        setShowDeleteModal(true);
      }
    }
  };
  const deleteProductionCompany = async () => {
    console.log('im in delete');
    if (selectedProdCompany != null) {
      const response = await fetch('/api/productionCompanies/delete', {
        method: 'POST',
        headers: {},
        body: JSON.stringify({ Id: selectedProdCompany }),
      });
      if (response.ok) {
        await fetchProductionCompanies();
      }
      setSelectedProdCompany(null);
      setShowDeleteModal(false);
    }
  };

  const onCellUpdate = async (e) => {
    const { rowIndex } = e;
    const productions = productionCompanies;
    productions[rowIndex] = { ...e.data, existsInDB: productions[rowIndex].existsInDB };
    setProductionCompanies(productions);
    if (productions[rowIndex].existsInDB) {
      // update
      // const prodCompId = e.data.id;
      console.log('updating ', e.data);
      const data = e.data;
      const response = await fetch('/api/productionCompanies/update', {
        method: 'POST',
        headers: {},
        body: JSON.stringify(data),
      });
      console.log(response);
    } else {
      // create
      if (e.data.Name.length > 0) {
        const data = e.data;
        const response = await fetch('/api/productionCompanies/insert', {
          method: 'POST',
          headers: {},
          body: JSON.stringify(data),
        });
        const tempProd = productions;
        tempProd[rowIndex].existsInDB = true;
        const jsonOutput = await response.json();
        tempProd[rowIndex].Id = jsonOutput?.Id;
        setProductionCompanies(tempProd);
        console.log(productionCompanies);
      }
    }
  };
  console.log(showDeleteModal);
  return (
    <div>
      <div>
        <Button onClick={onAddNewVenueContact} variant="primary" text="Add New Contact" />
        <ProductionCompaniesTable
          columnDefs={productionCompaniesColDefs}
          rowData={productionCompanies}
          styleProps={styleProps}
          onChange={onCellUpdate}
          onCellClicked={onCellClicked}
        />
      </div>
      <div>
        {showDeleteModal && (
          <DeleteConfirmation
            title="Delete Booking"
            onCancel={() => {
              setShowDeleteModal(false);
              setSelectedProdCompany(null);
            }}
            onConfirm={deleteProductionCompany}
          >
            <p>This will the delete the booking and related performances</p>
          </DeleteConfirmation>
        )}
      </div>
    </div>
  );
}
