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
  const textAreaRef = useRef(null);

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
              <div className="w-[1045px] h-[65px] bg-white mb-5 rounded-md border border-primary-border">
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
                <div className="text-sm text-primary-navy mb-4 ml-2 max-h-8 overflow-y-auto">
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

  const saveAllocatedSeats = async (data, perfId) => {
    const holdRec = holdList.find((hold) => hold.info.Id === perfId);
    const newRecDate = { AvailableCompId: holdRec.availableCompId, ...data };

    console.log(newRecDate);

    await fetchData({
      url: '/api/marketing/allocatedSeats/create',
      method: 'POST',
      data: newRecDate,
    });
  };

  useEffect(() => {
    if (bookingId !== null && bookingId !== undefined) {
      getPromoterHoldData(bookingId.toString());
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
        {castRateArranged && (
          <TextArea
            className="w-[1071px] h-auto resize-none overflow-hidden"
            value={castRateNotes}
            placeholder="Notes Field"
            onChange={(e) => setCastRateNotes(e.target.value)}
            ref={textAreaRef}
          />
        )}
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
        onSave={(data, perfId) => saveAllocatedSeats(data, perfId)}
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
