import { useEffect, useState } from 'react';
import Button from 'components/core-ui-lib/Button';
import AllocatedSeatsModal from '../modal/AllocatedSeatsModal';
import AvailableSeatsModal from '../modal/AvailableSeatsModal';
import Checkbox from 'components/core-ui-lib/Checkbox';
import useAxios from 'hooks/useAxios';
import Table from 'components/core-ui-lib/Table';
import { allocSeatsColDefs, styleProps } from '../table/tableConfig';
import { AllocatedHoldDTO } from 'interfaces';
import TextArea from 'components/core-ui-lib/TextArea/TextArea';
import formatInputDate from 'utils/dateInputFormat';

interface PromotorHoldsTabProps {
  bookingId: string;
}

interface PromoterData {
  allocations: Array<AllocatedHoldDTO>;
  holds: Array<any>;
}

export default function PromotorHoldsTab({ bookingId }: PromotorHoldsTabProps) {
  const [showAllocSeatsModal, setShowAllocSeatsModal] = useState<boolean>(false);
  const [showAvailSeatsModal, setShowAvailSeatModal] = useState<boolean>(false);
  const [availableSeats, setAvailableSeats] = useState<number>(0);
  const [allocatedSeats, setAllocatedSeats] = useState<number>(0);
  const [castRateArranged, setCastRateArranged] = useState<boolean>(false);
  const [allocRows, setAllocRows] = useState(null);
  const [castRateNotes, setCastRateNotes] = useState('');
  const [availSeatsCont, setAvailSeatsCont] = useState(null);

  const { fetchData } = useAxios();

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
  //   }, [bookingId])]

  const getPromoterHoldData = async (bookingId) => {
    try {
      const data = await fetchData({
        url: '/api/marketing/promoterHolds/' + bookingId,
        method: 'POST',
      });

      if (typeof data === 'object') {
        const promData = data as PromoterData;
        setAllocRows(promData.allocations);
        const tempAvailSeats = [];
        promData.holds.forEach((holdRec) => {
          console.log(holdRec.note);
          tempAvailSeats.push(
            <div className="w-[1064.92px] h-[65px] bg-white mb-5 rounded-md">
              <div className="text-base text-primary-navy font-bold ml-2">
                {formatInputDate(holdRec.info.Date)} | {holdRec.info.Date.substring(0, 5)} | Seats Allocated:{' '}
                {holdRec.totalAllocated} / {holdRec.totalAvailable}
              </div>
              <div className="text-sm text-primary-navy mb-4 ml-2">{holdRec.note}</div>
            </div>,
          );
        });

        setAvailSeatsCont(tempAvailSeats);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setAllocatedSeats(0);
    setAvailableSeats(0);

    getPromoterHoldData(bookingId.toString());
  }, [bookingId]);

  return (
    <>
      <div className="flex flex-row">
        <div className="flex flex-col mr-3">
          <Checkbox
            id={'Cast Rate Arranged'}
            name={'Cast Rate Arra'}
            checked={castRateArranged}
            onChange={(e) => setCastRateArranged(e.target.checked)}
            className="w-[19px] h-[19px] mt-[2px]"
          />
        </div>

        <div className="text-primary-input-text">Cast Rate Arranged</div>
      </div>

      <div className="flex flex-row">
        <TextArea
          className="w-[1071px] h-[103px]"
          value={castRateNotes}
          placeholder="Notes Field"
          onChange={(e) => setCastRateNotes(e.target.value)}
          disabled={!castRateArranged}
        />
      </div>

      <div className="text-xl text-primary-navy font-bold mb-4">Available Seats</div>

      <div className="h-40 overflow-auto my-5">{availSeatsCont}</div>

      <div className="flex flex-row justify-between items-center mb-4">
        <div className="text-xl text-primary-navy font-bold">Allocated Seats</div>
        <div className="flex flex-row items-center gap-4">
          <Button
            text="Export Allocated Seats"
            className="w-[203px]"
            iconProps={{ className: 'h-4 w-3' }}
            sufixIconName={'excel'}
          />
          <Button text="Add New" className="w-[160px]" onClick={() => setShowAllocSeatsModal(true)} />
        </div>
      </div>

      <Table columnDefs={allocSeatsColDefs} rowData={allocRows} styleProps={styleProps} tableHeight={230} />
      <AllocatedSeatsModal
        show={showAllocSeatsModal}
        bookingId={bookingId}
        onCancel={() => setShowAllocSeatsModal(false)}
      />

      <AvailableSeatsModal
        currAllocated={allocatedSeats}
        currAvailable={availableSeats}
        show={showAvailSeatsModal}
        onCancel={() => setShowAvailSeatModal(false)}
      />
    </>
  );
}
