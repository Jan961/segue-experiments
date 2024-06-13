import { productionCompaniesColDefs, styleProps } from 'components/system-admin/productionCompanies/tableConfig';
import { useCallback, useEffect, useState } from 'react';
import Button from 'components/core-ui-lib/Button';
import ProductionCompaniesTable from 'components/admin/ProductionCompaniesTable';
import { DeleteConfirmation } from '../../../components/global/DeleteConfirmation';
import { PopupModal } from '../../../components/core-ui-lib';
export default function ProductionCompaniesTab() {
  //  const [createMode, setCreateMode] = useState<boolean>();
  const [productionCompanies, setProductionCompanies] = useState<any[]>();
  const [showErrorModal, setShowErrorModal] = useState<boolean>();
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>();
  const [selectedProdCompany, setSelectedProdCompany] = useState();
  const [errorMessage, setErrorMessage] = useState<string>();
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
  };
  const onCellClicked = async (e) => {
    const { column, rowIndex } = e;
    if (column.colId === 'delete') {
      if (productionCompanies.length <= 1) {
        setErrorMessage('Deletion is not permitted as this list must have at least one entry.');
        setShowErrorModal(true);
      } else {
        if (productionCompanies[rowIndex].Id === null) {
          await fetchProductionCompanies();
        }
        setSelectedProdCompany(productionCompanies[rowIndex].Id);
        setShowDeleteModal(true);
      }
    }
  };
  const deleteProductionCompany = async () => {
    if (selectedProdCompany != null) {
      const response = await fetch('/api/productionCompanies/delete', {
        method: 'POST',
        headers: {},
        body: JSON.stringify({ Id: selectedProdCompany }),
      });
      if (response.ok) {
        await fetchProductionCompanies();
      } else {
        setErrorMessage((await response.json())?.errorMessage);
        setShowErrorModal(true);
      }
      setSelectedProdCompany(null);
      setShowDeleteModal(false);
    }
  };

  const onCellUpdate = async (e) => {
    const { rowIndex } = e;
    const productions = productionCompanies;
    productions[rowIndex] = { ...e.data, Id: productions[rowIndex].Id, existsInDB: productions[rowIndex].existsInDB };
    console.log(e);
    setProductionCompanies(productions);
    if (productions[rowIndex].existsInDB) {
      const data = e.data;
      const response = await fetch('/api/productionCompanies/update', {
        method: 'POST',
        headers: {},
        body: JSON.stringify({ ...data, Id: productions[rowIndex].Id }),
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
      }
    }
  };
  const getRowStyle = useCallback((params) => {
    if (params.data.existsInDB === false) {
      return { background: '#E9458033' };
    }
    return null;
  }, []);
  console.log(showDeleteModal);
  return (
    <div>
      <div>
        <Button onClick={onAddNewVenueContact} variant="primary" text="Add New Company" />
        <ProductionCompaniesTable
          columnDefs={productionCompaniesColDefs}
          rowData={productionCompanies}
          styleProps={styleProps}
          onChange={onCellUpdate}
          onCellClicked={onCellClicked}
          getRowStyle={getRowStyle}
        />
      </div>
      {showDeleteModal && (
        <div>
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
        </div>
      )}
      {showErrorModal && (
        <div>
          <PopupModal
            show={showErrorModal}
            title="Deletion Failed"
            showCloseIcon={true}
            onClose={() => setShowErrorModal(false)}
          >
            <p>{errorMessage}</p>
          </PopupModal>
        </div>
      )}
    </div>
  );
}
