import { SalesSnapshot } from 'types/MarketingTypes';
import useAxios from 'hooks/useAxios';
import { useEffect, useState } from 'react';
import SalesTable from '../../global/salesTable/SalesTable';

interface SalesTabProps {
  bookingId: string;
}

export default function SalesTab({ bookingId }: SalesTabProps) {
  const [salesTable, setSalesTable] = useState(<div />);

  const { fetchData } = useAxios();

  const retrieveSalesData = async (bookingId: string) => {
    const data = await fetchData({
      url: '/api/marketing/sales/read/' + bookingId,
      method: 'POST',
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
        />,
      );
    }
  };

  useEffect(() => {
    setSalesTable(<div />);
    if (bookingId !== null && bookingId !== undefined) {
      retrieveSalesData(bookingId.toString());
    }
  }, [bookingId]);

  return <>{salesTable}</>;
}
