import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { Spinner } from 'components/global/Spinner';
import Table from 'components/core-ui-lib/Table';
import { tourSummaryColumnDefs, styleProps } from '../table/tableConfig';
import PopupModal from 'components/core-ui-lib/PopupModal';

const tableLens = ['h-[48px]', 'h-[96px]', 'h-[144px]', 'h-[192px]', 'h-[240px]', 'h-[288px]']

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

  const gridOptions = {
    autoSizeStrategy: {
      type: 'fitGridWidth',
      defaultMinWidth: 50,
      defaultMinHeight: 10
    },
  };

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
             <div className={"w-[460px] flex flex-col " + tableLens[item.length - 1]}>
            <Table 
              key={index}
              columnDefs={tourSummaryColumnDefs} 
              rowData={item} 
              styleProps={styleProps} 
              gridOptions={gridOptions} 
              displayHeader={index === 0 ? true : false}
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
