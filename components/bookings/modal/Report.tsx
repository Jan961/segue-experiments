import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { Spinner } from 'components/global/Spinner';
import Table from 'components/core-ui-lib/Table';
import { tourSummaryColumnDefs, styleProps } from '../table/tableConfig';
import PopupModal from 'components/core-ui-lib/PopupModal';

const tableLens = ['h-[46px]', 'h-[90px]', 'h-[132px]', 'h-[192px]', 'h-[240px]', 'h-[261px]']

export default function Report({
  visible,
  onClose,
  ProductionId,
}: {
  ProductionId: number;
  visible: boolean;
  onClose: () => void;
}) {
  const [productionSummary, setProductionSummary] = useState<any[]>([]);
  const [loading, setIsLoading] = useState<boolean>(false);
  const [error] = useState<string>('Oops! Something went wrong. Please try again after some time');
  const fetchProductionSummary = useCallback((productionCode) => {
    setIsLoading(true);
    axios
      .get(`/api/productions/summary/${productionCode}`)
      .then((response: any) => {
        if (response?.data?.ok) {
          setProductionSummary(response.data.data);
        }
      })
      .catch((error) => {
        console.log('Error:', error);
      })
      .finally(() => setIsLoading(false));
  }, []);
  useEffect(() => {
    if (ProductionId) {
      fetchProductionSummary(ProductionId);
    }
  }, [ProductionId]);


  /**
   * used to get the table length based on the number of rows supplied
   * the first table will be given more space to accommodate the header
   */
  const getTableStyle = (numRows: number, index: number) => {    
    // first table
    if(index === 0){
      return 'h-[97px]'
    } else {
      return tableLens[numRows - 1]
    }
  }

  return (
    <>
      <PopupModal
        show={visible}
        onClose={onClose}
        title="Tour Summary"
      >
        {loading && (
          <div className="w-full h-full absolute left-0 top-0 bg-white flex items-center opacity-95">
            <Spinner className="w-full" size="lg" />
          </div>
        )}
        <div className="py-4 overflow-y-auto max-h-[90vh]">
          {productionSummary.length ? (
            <div>
              {productionSummary.map((item, index) => (
             <div className={"w-[438px] mb-2 flex-col " + getTableStyle(item.length, index)}>
            <Table 
              key={index}
              columnDefs={tourSummaryColumnDefs} 
              rowData={item} 
              styleProps={styleProps} 
              displayHeader={index === 0 ? true : false}
              overrideHLimit={true}
              />
           </div>
              ))}
           </div>

          ) : (
            <div className="text-primary-orange w-100 h-[100px] text-center">{error}</div>
          )}


        </div>

    

      </PopupModal>
    </>
  );
}
