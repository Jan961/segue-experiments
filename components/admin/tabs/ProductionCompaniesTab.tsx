import { productionCompaniesColDefs, styleProps } from 'components/admin/tableConfig';
import { useCallback, useEffect, useState } from 'react';
import Button from 'components/core-ui-lib/Button';
import ProductionCompaniesTable from 'components/admin/ProductionCompaniesTable';
import { DeleteConfirmation } from 'components/global/DeleteConfirmation';
import { PopupModal } from 'components/core-ui-lib';
import axios from 'axios';
export default function ProductionCompaniesTab() {
  const [productionCompanies, setProductionCompanies] = useState<any[]>();
  const [showErrorModal, setShowErrorModal] = useState<boolean>();
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>();
  const [selectedProdCompany, setSelectedProdCompany] = useState();
  const [errorMessage, setErrorMessage] = useState<string>();

  const fetchProductionCompanies = async () => {
    try {
      const response = await fetch('/api/productionCompanies/read', {
        method: 'POST',
        headers: {},
      });
      setProductionCompanies(
        (await response.json()).map((item) => {
          if (item.Logo.length > 0) {
            const img = new Image();
            img.src = 'data:image/png;base64,' + item.Logo;
            item.Logo = img;
          }
          return item;
        }),
      );
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchProductionCompanies();
  }, []);

  const addNewVenueContact = async () => {
    const newRow = { Name: '', WebSite: '', Logo: '', Id: null };
    setProductionCompanies((prev) => [newRow, ...prev]);
  };

  const onCellClicked = async (e) => {
    const { column, rowIndex } = e;
    if (column.colId === 'delete') {
      if (productionCompanies.length <= 1) {
        setErrorMessage('Deletion is not permitted as this list must have at least one entry.');
        setShowErrorModal(true);
      } else {
        if (productionCompanies[rowIndex].Id === null) {
          setShowDeleteModal(false);
          setSelectedProdCompany(null);
          await fetchProductionCompanies();
        } else {
          setSelectedProdCompany(productionCompanies[rowIndex].Id);
          setShowDeleteModal(true);
        }
      }
    }
  };
  const deleteProductionCompany = async () => {
    if (selectedProdCompany != null) {
      const response = await axios.post('/api/productionCompanies/delete', {
        body: JSON.stringify({ Id: selectedProdCompany }),
      });
      if (!(response.status >= 400 && response.status <= 499)) {
        await fetchProductionCompanies();
      } else {
        setErrorMessage((await response.data)?.errorMessage);
        setShowErrorModal(true);
      }
      setSelectedProdCompany(null);
      setShowDeleteModal(false);
    }
  };

  const onCellUpdate = async (e) => {
    try {
      const { rowIndex } = e;
      const productions = productionCompanies;
      productions[rowIndex] = { ...e.data, Id: productions[rowIndex].Id };
      setProductionCompanies(productions);
      if (productions[rowIndex].Id) {
        const data = e.data;
        const response = await axios.post('/api/productionCompanies/update', {
          body: JSON.stringify({ ...data, Id: productions[rowIndex].Id }),
        });
        if (response.status >= 400 && response.status <= 499) {
          setErrorMessage((await response.data)?.errorMessage);
          setShowErrorModal(true);
        }
      } else {
        if (e.data.Name.length > 0) {
          const data = e.data;
          const response = await axios.post('/api/productionCompanies/insert', { body: JSON.stringify(data) });
          if (!(response.status >= 400 && response.status <= 499)) {
            await fetchProductionCompanies();
          } else {
            setErrorMessage((await response.data)?.errorMessage);
            setShowErrorModal(true);
          }
        }
      }
    } catch (exception) {
      console.log(exception);
    }
  };
  const getRowHeight = (params) => {
    if (params.data.Logo != null) {
      const columnWidth = 200;
      const ratio = params.data.Logo.width / columnWidth;
      const calculatedHeight = Math.ceil(params.data.Logo.height / ratio);
      return calculatedHeight >= 50 ? calculatedHeight : 50;
    }
    return 50;
  };

  const getRowStyle = useCallback(({ data }) => {
    return data.existsInDB === false ? { background: '#E9458033' } : null;
  }, []);

  return (
    <div>
      <div>
        <div className="flex justify-between items-center pt-8">
          <h1 className="text-primary-navy text-responsive-xl">Production Companies / Special Purpose Vehicles</h1>
          <div className="pb-4">
            <Button onClick={addNewVenueContact} variant="secondary" text="Add New Company" />
          </div>
        </div>
        <ProductionCompaniesTable
          columnDefs={productionCompaniesColDefs(fetchProductionCompanies)}
          rowData={productionCompanies}
          styleProps={styleProps}
          onChange={onCellUpdate}
          onCellClicked={onCellClicked}
          getRowStyle={getRowStyle}
          getRowHeight={getRowHeight}
        />
      </div>
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
      {showErrorModal && (
        <PopupModal
          show={showErrorModal}
          title="Deletion Failed"
          showCloseIcon={true}
          onClose={() => setShowErrorModal(false)}
        >
          <p>{errorMessage}</p>
        </PopupModal>
      )}
    </div>
  );
}
