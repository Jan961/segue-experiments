import { SalesSnapshot } from 'types/MarketingTypes';
import useAxios from 'hooks/useAxios';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import SalesTable from '../../global/salesTable/SalesTable';

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

  const { fetchData } = useAxios();

  const retrieveSalesData = async (bookingId: string) => {
    const data = await fetchData({
      url: '/api/marketing/sales/read/' + bookingId,
      method: 'POST',
    });
    const currencySymbol: string = await fetchData({
      url: '/api/marketing/sales/currency/currency',
      method: 'POST',
      data: { searchValue: parseInt(bookingId), inputType: 'bookingId' },
    }).then((outputData: any) => {
      if (outputData.currencyCode) {
        return String.fromCharCode(Number('0x' + outputData.currencyCode));
      } else {
        return '£';
      }
    });

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
          currencySymbol={currencySymbol}
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
