import { SalesSnapshot } from 'types/MarketingTypes';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import SalesTable from '../../global/salesTable/SalesTable';
import axios from 'axios';
import { Spinner } from 'components/global/Spinner';

interface SalesTabProps {
  bookingId: string;
}

export interface SalesTabRef {
  resetData: () => void;
}

const SalesTab = forwardRef<SalesTabRef, SalesTabProps>((props, ref) => {
  const [salesTable, setSalesTable] = useState(<div />);
  const [dataAvailable, setDataAvailable] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useImperativeHandle(ref, () => ({
    resetData: () => {
      setDataAvailable(false);
    },
  }));

  const retrieveSalesData = async (bookingId: string) => {
    try {
      const { data } = await axios.post('/api/marketing/sales/read/' + bookingId);

      if (Array.isArray(data) && data.length > 0) {
        const tempSales = data as Array<SalesSnapshot>;
        setSalesTable(
          <SalesTable
            containerHeight="h-auto"
            containerWidth="w-[1465px]"
            module="marketing"
            variant="salesSnapshot"
            data={tempSales}
            booking={bookingId}
            tableHeight={640}
          />,
        );

        setDataAvailable(true);
        setIsLoading(false);
      }
    } catch (exception) {
      console.log(exception);
    }
  };

  useEffect(() => {
    setSalesTable(<div />);
    if (props.bookingId !== null && props.bookingId !== undefined) {
      retrieveSalesData(props.bookingId.toString());
    }
  }, [props.bookingId]);

  return (
    <>
      {dataAvailable && (
        <div>
          {isLoading ? (
            <div className="mt-[150px] text-center">
              <Spinner size="lg" className="mr-3" />
            </div>
          ) : (
            <div>{salesTable}</div>
          )}
        </div>
      )}
    </>
  );
});

SalesTab.displayName = 'SalesTab';
export default SalesTab;
