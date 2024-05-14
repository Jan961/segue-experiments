import { useState } from 'react';
import Button from 'components/core-ui-lib/Button';
import AllocatedSeatsModal from '../modal/AllocatedSeatsModal';

interface PromotorHoldsTabProps {
  bookingId: string;
}

export default function PromotorHoldsTab({ bookingId }: PromotorHoldsTabProps) {
  const [showAllocSeatsModal, setShowAllocSeatsModal] = useState<boolean>(false);

  //   const retrieveSalesData = async (bookingId: string) => {
  //     const data = await fetchData({
  //       url: '/api/marketing/sales/read/' + bookingId,
  //       method: 'POST',
  //     });

  //     if (Array.isArray(data) && data.length > 0) {
  //       const tempSales = data as Array<SalesSnapshot>;
  //       setSalesTable(
  //         <SalesTable
  //           containerHeight="h-auto"
  //           containerWidth="w-[1465px]"
  //           module="marketing"
  //           variant="salesSnapshot"
  //           data={tempSales}
  //           booking={bookingId}
  //         />,
  //       );
  //     }
  //   };

  //   useEffect(() => {
  //     setSalesTable(<div />);
  //     if (bookingId !== null && bookingId !== undefined) {
  //       retrieveSalesData(bookingId.toString());
  //     }
  //   }, [bookingId]);

  return (
    <>
      <Button
        className="ml-4 w-[132px]"
        onClick={() => setShowAllocSeatsModal(true)}
        variant="secondary"
        text="Show Allocated Seats Modal"
      />

      <AllocatedSeatsModal
        show={showAllocSeatsModal}
        bookingId={bookingId}
        onCancel={() => setShowAllocSeatsModal(false)}
      />
    </>
  );
}
