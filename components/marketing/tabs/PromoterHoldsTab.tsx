import React, { useEffect, useRef, useState } from 'react';
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
import Icon from 'components/core-ui-lib/Icon';
import { bookingJumpState } from 'state/marketing/bookingJumpState';
import { useRecoilState } from 'recoil';

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
  const [availData, setAvailData] = useState<any>(null);
  const [castRateArranged, setCastRateArranged] = useState<boolean>(false);
  const [allocRows, setAllocRows] = useState(null);
  const [castRateNotes, setCastRateNotes] = useState('');
  const [availSeatsCont, setAvailSeatsCont] = useState(null);
  const [holdList, setHoldList] = useState(null);
  const [bookingIdVal, setBookingIdVal] = useState(null);
  const [allocatedRow, setAllocatedRow] = useState(null);
  const [allocType, setAllocType] = useState('new');
  const textAreaRef = useRef(null);
  const bookings = useRecoilState(bookingJumpState);

  const { fetchData } = useAxios();

  const editAvailSeats = (holdRec) => {
    setAvailData(holdRec);
    setShowAvailSeatModal(true);
  };

  const saveAvailSeats = async (data) => {
    try {
      await fetchData({
        url: '/api/marketing/availableSeats/update',
        method: 'POST',
        data,
      });

      getPromoterHoldData(bookingId.toString());
      setShowAvailSeatModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  const getPromoterHoldData = async (bookingId) => {
    setAvailSeatsCont([]);
    try {
      const data = await fetchData({
        url: '/api/marketing/promoterHolds/' + bookingId,
        method: 'POST',
      });

      if (typeof data === 'object') {
        const promData = data as PromoterData;
        setHoldList(promData.holds);
        setAllocRows(promData.allocations);
        const tempAvailSeats = [];
        promData.holds.forEach((holdRec) => {
          const splitNotes = holdRec.note.split('\r\n');
          tempAvailSeats.push(
            <div>
              <Icon color="#fff" className="float-right mt-3" iconName="edit" onClick={() => editAvailSeats(holdRec)} />
              <div className="w-[1045px] bg-white mb-1 rounded-md border border-primary-border">
                <div className="text-base text-primary-navy font-bold ml-2">
                  {formatInputDate(holdRec.info.Date)} | {holdRec.info.Time.substring(0, 5)} | Seats Allocated:{' '}
                  {holdRec.totalAllocated > holdRec.totalAvailable ? (
                    <span className="text-primary-red">
                      {holdRec.totalAllocated} / {holdRec.totalAvailable}
                    </span>
                  ) : (
                    <span>
                      {holdRec.totalAllocated} / {holdRec.totalAvailable}
                    </span>
                  )}
                </div>
                <div className="text-sm text-primary-navy ml-2 overflow-y-auto">
                  {splitNotes.map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      {index < splitNotes.length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>,
          );
        });

        setAvailSeatsCont(tempAvailSeats);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const saveAllocatedSeats = async (data, perfId, type) => {
    const holdRec = holdList.find((hold) => hold.info.Id === perfId);
    const recData = { AvailableCompId: holdRec.availableCompId, ...data };

    if (type === 'new') {
      await fetchData({
        url: '/api/marketing/allocatedSeats/create',
        method: 'POST',
        data: recData,
      });

      setAllocRows([...allocRows, recData]);
      setShowAllocSeatsModal(false);
    } else if (type === 'edit') {
      await fetchData({
        url: '/api/marketing/allocatedSeats/update',
        method: 'POST',
        data: recData,
      });

      const rowIndex = allocRows.findIndex((alloc) => alloc.Id === data.Id);
      const newRows = [...allocRows];
      newRows[rowIndex] = recData;
      setAllocRows(newRows);
    } else if (type === 'delete') {
      await fetchData({
        url: '/api/marketing/allocatedSeats/delete',
        method: 'POST',
        data: recData,
      });

      const rowIndex = allocRows.findIndex((alloc) => alloc.Id === data.Id);
      const newRows = [...allocRows];
      if (rowIndex !== -1) {
        newRows.splice(rowIndex, 1);
      }
      setAllocRows(newRows);
    }

    setShowAllocSeatsModal(false);
  };

  const updateBooking = async (type: string, value: any) => {
    const updObj = { [type]: value };

    // update checkbox if changed
    if (type === 'castRateTicketsArranged') {
      setCastRateArranged(value);
    }

    // update in the database
    await fetchData({
      url: '/api/bookings/update/' + bookingIdVal,
      method: 'POST',
      data: updObj,
    });
  };

  const triggerEdit = (e) => {
    setAllocatedRow(e.data);
    setAllocType('edit');
    setShowAllocSeatsModal(true);
  };

  const newAllocatedSeats = () => {
    setAllocType('new');
    setShowAllocSeatsModal(true);
  };

  useEffect(() => {
    if (bookingId !== null && bookingId !== undefined) {
      getPromoterHoldData(bookingId.toString());
      setBookingIdVal(bookingId.toString());

      const booking = bookings[0].bookings.find((booking) => booking.Id === bookingId);
      setCastRateArranged(booking.CastRateTicketsArranged);
      setCastRateNotes(booking.CastRateTicketsNotes);
    }
  }, [bookingId]);

  useEffect(() => {
    if (textAreaRef.current) {
      // Reset the height to auto to shrink if necessary
      textAreaRef.current.style.height = 'auto';
      // Set the height based on the scroll height
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  }, [castRateNotes]);

  return (
    <>
      <div className="flex flex-row">
        <div className="flex flex-col mr-3 mb-5">
          <Checkbox
            id={'Cast Rate Arranged'}
            name={'Cast Rate Arra'}
            checked={castRateArranged}
            onChange={(e) => updateBooking('castRateTicketsArranged', e.target.checked)}
            className="w-[19px] h-[19px] mt-[2px]"
          />
        </div>

        <div className="text-primary-input-text">Cast Rate Arranged</div>
      </div>

      <div className="flex flex-row">
        {castRateArranged && (
          <TextArea
            className="w-[1071px] h-auto resize-none overflow-hidden"
            value={castRateNotes}
            placeholder="Notes Field"
            onChange={(e) => setCastRateNotes(e.target.value)}
            ref={textAreaRef}
            onBlur={(e) => updateBooking('castRateTicketsNotes', e.target.value)}
          />
        )}
      </div>

      <div className="text-xl text-primary-navy font-bold -mb-4 mt-2">Available Seats</div>

      <div className="my-5">{availSeatsCont}</div>

      <div className="flex flex-row justify-between items-center mb-4">
        <div className="text-xl text-primary-navy font-bold">Allocated Seats</div>
        <div className="flex flex-row items-center gap-4">
          <Button
            text="Export Allocated Seats"
            className="w-[203px]"
            iconProps={{ className: 'h-4 w-3' }}
            sufixIconName={'excel'}
          />
          <Button text="Add New" className="w-[160px]" onClick={() => newAllocatedSeats()} />
        </div>
      </div>

      <Table
        columnDefs={allocSeatsColDefs}
        rowData={allocRows}
        styleProps={styleProps}
        tableHeight={230}
        onRowDoubleClicked={triggerEdit}
      />

      <AllocatedSeatsModal
        show={showAllocSeatsModal}
        bookingId={bookingId}
        onCancel={() => setShowAllocSeatsModal(false)}
        onSave={(data, perfId, type) => saveAllocatedSeats(data, perfId, type)}
        data={allocatedRow}
        type={allocType}
      />

      <AvailableSeatsModal
        data={availData}
        show={showAvailSeatsModal}
        onCancel={() => setShowAvailSeatModal(false)}
        onSave={(data) => saveAvailSeats(data)}
      />
    </>
  );
}
