import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { Spinner } from 'components/global/Spinner';
import Table from 'components/core-ui-lib/Table';
import { tourSummaryColumnDefs, styleProps } from '../table/tableConfig';
import PopupModal from 'components/core-ui-lib/PopupModal';

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
    defaultColDef: { wrapHeaderText: true },
    autoSizeStrategy: {
      type: 'fitGridWidth',
    },
    getRowStyle: (params) => {
      if (params.data.bold) {
        return { fontWeight: '800' };
      } else {
        return { fontWeight: 'normal' };
      }
    },
    onRowDataUpdated: (params) => {
      params.api.forEachNode((rowNode) => {
        rowNode.id = rowNode.data.name;
      });
    },
    getRowId: (data) => {
      return data.data.name;
    },
    getRowNodeId: (data) => {
      return data.id;
    },
  };
  return (
    <>
      <PopupModal show={visible} onClose={onClose} title="Tour Summary" titleClass="text-primary-navy">
        {loading && (
          <div className="w-full h-full absolute left-0 top-0 bg-white flex items-center opacity-95">
            <Spinner className="w-full" size="lg" />
          </div>
        )}
        <div className="py-4 overflow-y-scroll overflow-x-hidden max-h-[85vh] w-[500px] no-scrollbar">
          {productionSummary.length ? (
            <>
              {productionSummary.map((item, index) => (
                <>
                  {item.length > 0 && (
                    <div key={index} className={`w-full ${item.bold ? 'font-bold' : 'font-normal'}`}>
                      <Table
                        testId="tour-report"
                        key={index}
                        columnDefs={tourSummaryColumnDefs}
                        rowData={item}
                        styleProps={styleProps}
                        displayHeader={index === 0}
                        gridOptions={gridOptions}
                      />
                    </div>
                  )}
                </>
              ))}
            </>
          ) : (
            <div className="text-primary-orange w-100 h-[100px] text-center">No records to show</div>
          )}
        </div>
      </PopupModal>
    </>
  );
}
