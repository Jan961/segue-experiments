import { SalesSnapshot } from 'types/MarketingTypes';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import SalesTable from '../../global/salesTable/SalesTable';
import axios from 'axios';

interface SalesTabProps {
  bookingId: string;
}

export interface SalesTabRef {
  resetData: () => void;
}

const SalesTab = forwardRef<SalesTabRef, SalesTabProps>((props, ref) => {
  const [salesTable, setSalesTable] = useState(<div />);
  const [dataAvailable, setDataAvailable] = useState<boolean>(false);

  useImperativeHandle(ref, () => ({
    resetData: () => {
      setDataAvailable(false);
    },
  }));

  const retrieveSalesData = async (bookingId: string) => {
    let data: any;
    try {
      data = await axios.post('/api/marketing/sales/read/' + bookingId);
      data = data?.data;
    } catch (exception) {
      console.log(exception);
      data = [];
    }

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
    }
  };

  useEffect(() => {
    setSalesTable(<div />);
    if (props.bookingId !== null && props.bookingId !== undefined) {
      retrieveSalesData(props.bookingId.toString());
    }
  }, [props.bookingId]);

  return <>{dataAvailable && <div>{salesTable}</div>}</>;
});

SalesTab.displayName = 'SalesTab';
export default SalesTab;
