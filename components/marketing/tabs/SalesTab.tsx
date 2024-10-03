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
  const [rowData, setRowData] = useState([]);
  const [dataAvailable, setDataAvailable] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [bookingIdVal, setBookingIdVal] = useState(null);
  const [showError, setShowError] = useState<boolean>(false);

  useImperativeHandle(ref, () => ({
    resetData: () => {
      setDataAvailable(false);
    },
  }));

  const retrieveSalesData = async (bookingId: string) => {
    try {
      const { data } = await axios.post(`/api/marketing/sales/read/${bookingId}`);

      if (Array.isArray(data) && data.length > 0) {
        const tempSales = data as Array<SalesSnapshot>;
        setRowData(tempSales);
        setIsLoading(false);
      } else {
        setShowError(true);
        setIsLoading(false);
      }
    } catch (exception) {
      console.log(exception);
    }
  };

  useEffect(() => {
    if (props.bookingId === null) {
      setDataAvailable(false);
    } else {
      setDataAvailable(true);
      setIsLoading(true);
      setShowError(false);
    }
    setRowData([]);
    if (props.bookingId !== null && props.bookingId !== undefined) {
      retrieveSalesData(props.bookingId.toString());
      setBookingIdVal(props.bookingId.toString());
    }
  }, [props.bookingId]);

  if (dataAvailable) {
    if (isLoading) {
      return (
        <div className="mt-[150px] text-center">
          <Spinner size="lg" className="mr-3" />
        </div>
      );
    } else {
      return (
        <div>
          {showError ? (
            <div data-testid="no-sales-figures-msg">No sales figures to show.</div>
          ) : (
            <SalesTable
              containerHeight="h-auto"
              containerWidth="w-[1465px]"
              module="marketing"
              variant="salesSnapshot"
              data={rowData}
              booking={bookingIdVal}
              tableHeight={640}
            />
          )}
        </div>
      );
    }
  }
});

SalesTab.displayName = 'SalesTab';
export default SalesTab;
