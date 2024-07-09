import { productionCompaniesColDefs, styleProps } from 'components/admin/tableConfig';
import { useCallback, useEffect, useState } from 'react';
import Button from 'components/core-ui-lib/Button';
import Table from 'components/core-ui-lib/Table';
import { DeleteConfirmation } from 'components/global/DeleteConfirmation';
import axios from 'axios';

type ProductionCompany = {
  companyName: '';
  webSite: '';
  companyVATNo: '';
  id: null;
  fileLocation: '';
};
const ProductionCompaniesTab = () => {
  const [productionCompanies, setProductionCompanies] = useState<any[]>();
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>();
  const [selectedProdCompany, setSelectedProdCompany] = useState<ProductionCompany>();

  const fetchProductionCompanies = async () => {
    try {
      const { data } = await axios('/api/productionCompanies/read');
      setProductionCompanies(data);
    } catch (e) {
      console.log(e);
    }
  };

  const handleUploadSuccess = async (companyDetails) => {
    await axios.post('/api/productionCompanies/update', companyDetails);
  };

  useEffect(() => {
    fetchProductionCompanies();
  }, []);

  const addNewVenueContact = async () => {
    const newRow = { companyName: '', webSite: '', companyVATNo: '', id: null };
    setProductionCompanies((prev) => [newRow, ...prev]);
  };

  const onCellClicked = async (e) => {
    const { column, rowIndex } = e;
    if (column.colId === 'delete') {
      if (productionCompanies[rowIndex].id === null) {
        setShowDeleteModal(false);
        setSelectedProdCompany(null);
        await fetchProductionCompanies();
      } else {
        setSelectedProdCompany(productionCompanies[rowIndex]);
        setShowDeleteModal(true);
      }
    }
  };
  const deleteProductionCompany = async () => {
    if (selectedProdCompany) {
      try {
        await axios.delete(`/api/productionCompanies/delete?id=${selectedProdCompany.id}`);
        await axios.delete(`/api/file/delete?location=${selectedProdCompany.fileLocation}`);
        await fetchProductionCompanies();
        setSelectedProdCompany(null);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const onCellUpdate = async (e) => {
    try {
      const { rowIndex, data } = e;
      const productions = productionCompanies;
      productions[rowIndex] = { ...e.data, id: productions[rowIndex].id };
      setProductionCompanies(productions);
      if (data.id) {
        await axios.post('/api/productionCompanies/update', data);
      } else {
        if (data.companyName.length > 0) {
          const response = await axios.post('/api/productionCompanies/insert', data);
          if (response.status !== 500) {
            await fetchProductionCompanies();
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
    return !data.id ? { background: '#E9458033' } : null;
  }, []);

  return (
    <div>
      <div>
        <div className="flex justify-between items-center pt-4">
          <h1 className="text-primary-navy text-responsive-xl font-bold leading-8">
            Production Companies / Special Purpose Vehicles
          </h1>
          <div className="pb-4 pr-2">
            <Button className="w-[160px]" onClick={addNewVenueContact} variant="secondary" text="Add New Company" />
          </div>
        </div>
        <Table
          columnDefs={productionCompaniesColDefs(fetchProductionCompanies, handleUploadSuccess)}
          rowData={productionCompanies}
          styleProps={styleProps}
          onCellClicked={onCellClicked}
          onCellValueChange={onCellUpdate}
          getRowStyle={getRowStyle}
          getRowHeight={getRowHeight}
        />
      </div>
      {showDeleteModal && (
        <DeleteConfirmation
          title="Delete Company Details"
          onCancel={() => {
            setShowDeleteModal(false);
            setSelectedProdCompany(null);
          }}
          onConfirm={deleteProductionCompany}
        >
          <p>This will the delete the company details</p>
        </DeleteConfirmation>
      )}
    </div>
  );
};

export default ProductionCompaniesTab;
