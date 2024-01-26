import { ToolbarButton } from '../ToolbarButton';
import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { StyledDialog } from 'components/global/StyledDialog';
import { Spinner } from 'components/global/Spinner';

export default function Report({ ProductionId }: { ProductionId: number }) {
  const [productionSummary, setProductionSummary] = useState<any[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
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
    if (ProductionId) fetchProductionSummary(ProductionId);
  }, [ProductionId]);
  return (
    <>
      <ToolbarButton onClick={() => setShowModal(true)} submit>
        Production Summary
      </ToolbarButton>
      <StyledDialog
        className="w-1/4 max-w-full max-h-[95vh] relative"
        open={showModal}
        onClose={() => setShowModal(false)}
        title="Production Summary"
        width="xl"
      >
        {loading && (
          <div className="w-full h-full absolute left-0 top-0 bg-white flex items-center opacity-95">
            <Spinner className="w-full" size="lg" />
          </div>
        )}
        <div className="py-4 overflow-y-auto max-h-[80vh]">
          {productionSummary.length ? (
            <div className="grid grid-cols-1">
              {productionSummary.map((summaryGroup, i) => (
                <div key={i}>
                  {summaryGroup.map((summaryItem, j) => (
                    <div
                      key={j}
                      className={'grid rounded px-2 py-2 gap-4 grid-cols-[1fr_50px] bg-table-row-alternating'}
                    >
                      <div>{summaryItem.name}</div>
                      <div>{summaryItem.value}</div>
                    </div>
                  ))}
                  <div className={'w-full h-[25px] white'}></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-primary-orange w-100 h-[100px] text-center">{error}</div>
          )}
        </div>
      </StyledDialog>
    </>
  );
}
