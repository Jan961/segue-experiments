import React, { forwardRef, useEffect, useImperativeHandle, useState, useRef } from 'react';
import Button from 'components/core-ui-lib/Button';
import AllocatedSeatsModal from '../modal/AllocatedSeatsModal';
import AvailableSeatsModal from '../modal/AvailableSeatsModal';
import Checkbox from 'components/core-ui-lib/Checkbox';
import Table from 'components/core-ui-lib/Table';
import { allocSeatsColDefs, styleProps } from '../table/tableConfig';
import TextArea from 'components/core-ui-lib/TextArea/TextArea';
import formatInputDate from 'utils/dateInputFormat';
import Icon from 'components/core-ui-lib/Icon';
import { bookingJumpState } from 'state/marketing/bookingJumpState';
import { useRecoilValue } from 'recoil';
import { userState } from 'state/account/userState';
import { isNullOrEmpty } from 'utils';
import { Spinner } from 'components/global/Spinner';
import { exportExcelReport } from 'components/bookings/modal/request';
import { notify } from 'components/core-ui-lib';
import { productionJumpState } from 'state/booking/productionJumpState';
import axios from 'axios';
import { dateTimeToTime } from 'services/dateService';

interface PromotorHoldsTabProps {
  bookingId: string;
}

export interface PromoterHoldTabRef {
  resetData: () => void;
}

const PromotorHoldsTab = forwardRef<PromoterHoldTabRef, PromotorHoldsTabProps>((props, ref) => {
  const [showAllocSeatsModal, setShowAllocSeatsModal] = useState<boolean>(false);
  const [showAvailSeatsModal, setShowAvailSeatModal] = useState<boolean>(false);
  const [availData, setAvailData] = useState<any>(null);
  const [castRateArranged, setCastRateArranged] = useState<boolean>(false);
  const [allocRows, setAllocRows] = useState([]);
  const [castRateNotes, setCastRateNotes] = useState('');
  const [holdList, setHoldList] = useState(null);
  const [bookingIdVal, setBookingIdVal] = useState(null);
  const [allocatedRow, setAllocatedRow] = useState(null);
  const [dataAvailable, setDataAvailable] = useState<boolean>(false);
  const [tableHeight, setTableHeight] = useState(100);
  const [allocType, setAllocType] = useState('new');
  const textAreaRef = useRef(null);
  const bookings = useRecoilValue(bookingJumpState);
  const users = useRecoilValue(userState);
  const { selected: productionId, productions } = useRecoilValue(productionJumpState);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const gridOptions = {
    getRowId: (data) => {
      return data.data.date + '-' + data.data.time;
    },
  };

  useImperativeHandle(ref, () => ({
    resetData: () => {
      setDataAvailable(false);
    },
  }));

  const editAvailSeats = (holdRec) => {
    setAvailData(holdRec);
    setShowAvailSeatModal(true);
  };

  const saveAvailSeats = async (data) => {
    try {
      await axios.post('/api/marketing/available-seats/update', data);

      getPromoterHoldData(bookingIdVal);
      setShowAvailSeatModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  const getPromoterHoldData = async (bookingId) => {
    try {
      const response = await axios.get(`/api/marketing/promoter-holds/${bookingId}`);
      const promData = response.data;

      if ((promData.allocations && Array.isArray(promData.allocations)) || Array.isArray(promData.holds)) {
        setHoldList(promData.holds);

        setAllocRows(
          promData.allocations.map((allocRow) => {
            const user = Object.values(users).find((user) => user.AccUserId === allocRow.ArrangedByAccUserId);
            const firstname = isNullOrEmpty(user.FirstName) ? '' : user.FirstName;
            const surname = isNullOrEmpty(user.LastName) ? '' : user.LastName;
            return { ...allocRow, ArrangedByAccUserId: firstname + ' ' + surname };
          }),
        );

        // process the available seats data
        setTableHeight(120 * promData.allocations.length);

        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const saveAllocatedSeats = async (data, perfId, type) => {
    const holdRec = holdList.find((hold) => hold.info.Id === perfId);
    const recData = { AvailableCompId: holdRec.availableCompId, ...data };

    const apiRoute = {
      new: 'create',
      edit: 'update',
      delete: 'delete',
    };

    await axios.post(`/api/marketing/allocated-seats/${apiRoute[type]}`, recData);
    getPromoterHoldData(bookingIdVal);
    setShowAllocSeatsModal(false);
  };

  const updateBooking = async (type: string, value: any) => {
    const updObj = { [type]: value };

    // update checkbox if changed
    if (type === 'castRateTicketsArranged') {
      setCastRateArranged(value);
    }

    // update in the database
    await axios.post(`/api/bookings/update/${bookingIdVal}`, updObj);
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
    if (props.bookingId !== null && props.bookingId !== undefined) {
      getPromoterHoldData(props.bookingId.toString());
      setBookingIdVal(props.bookingId.toString());

      const booking = bookings.bookings.find((booking) => booking.Id === props.bookingId);
      setCastRateArranged(booking.CastRateTicketsArranged);
      setCastRateNotes(booking.CastRateTicketsNotes);

      setDataAvailable(true);
    }
  }, [props.bookingId]);

  useEffect(() => {
    if (textAreaRef.current) {
      // Reset the height to auto to shrink if necessary
      textAreaRef.current.style.height = 'auto';
      // Set the height based on the scroll height
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  }, [castRateNotes]);

  const onExport = async () => {
    const urlPath = `/api/reports/marketing/promoter-holds/allocated-seats`;
    const selectedVenue = bookings.bookings?.filter((booking) => booking.Id === bookings.selected);
    const venueAndDate = selectedVenue[0].Venue.Code + ' ' + selectedVenue[0].Venue.Name;
    const selectedProduction = productions?.filter((production) => production.Id === productionId);
    const { ShowName, ShowCode, Code } = selectedProduction[0];
    const productionName = `${ShowName} (${ShowCode + Code})`;
    const payload = {
      productionName,
      venueAndDate,
      bookingId: props.bookingId,
    };

    notify.promise(exportExcelReport(urlPath, payload), {
      loading: 'Generating Allocated Seats report',
      success: 'Allocated Seats  report downloaded successfully',
      error: 'Error generating Allocated Seats report',
    });
  };

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
          <div className="flex flex-row">
            <div className="flex flex-col mr-3 mb-5">
              <Checkbox
                id="castRateArranged"
                name="castRateArranged"
                checked={castRateArranged}
                onChange={(e) => updateBooking('castRateTicketsArranged', e.target.checked)}
                className="w-[19px] h-[19px] mt-[2px]"
                testId="checkCastRateArr"
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
                testId="textAreaCastRateNotes"
              />
            )}
          </div>

          <div className="text-xl text-primary-navy font-bold -mb-4 mt-2">Available Seats</div>

          <div className="my-5">
            {holdList.map((holdRec, index) => {
              const date = formatInputDate(holdRec.info.Date);
              const time = isNullOrEmpty(holdRec.info.Time) ? '-' : dateTimeToTime(holdRec.info.Date);

              return (
                <div key={index}>
                  <Icon
                    color="#fff"
                    className="float-right mt-3"
                    iconName="edit"
                    onClick={() => editAvailSeats(holdRec)}
                    testId="iconEditAvailSeats"
                  />
                  <div className="w-[1045px] bg-white mb-1 rounded-md border border-primary-border">
                    <div className="text-base text-primary-navy font-bold ml-2">
                      {date} | {time} | Seats Allocated:{' '}
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
                      {holdRec.note.split('\r\n').map((line, index) => (
                        <React.Fragment key={index}>
                          {line}
                          {index < holdRec.note.split('\r\n').length - 1 && <br />}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-row justify-between items-center mb-4">
            <div className="text-xl text-primary-navy font-bold">Allocated Seats</div>
            <div className="flex flex-row items-center gap-4">
              <Button
                text="Export Allocated Seats"
                className="w-[203px]"
                iconProps={{ className: 'h-4 w-3' }}
                sufixIconName="excel"
                onClick={onExport}
                testId="btnExportAllocSeats"
              />

              <Button
                text="Add New"
                className="w-[160px]"
                onClick={() => newAllocatedSeats()}
                testId="btnAddNewAllocSeats"
              />
            </div>
          </div>

          <Table
            gridOptions={gridOptions}
            rowData={allocRows}
            styleProps={styleProps}
            columnDefs={allocSeatsColDefs}
            tableHeight={tableHeight}
            onRowDoubleClicked={triggerEdit}
            testId="tableAllocSeats"
          />

          <AllocatedSeatsModal
            show={showAllocSeatsModal}
            bookingId={bookingIdVal}
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
        </div>
      );
    }
  }
});

PromotorHoldsTab.displayName = 'PromoterHoldsTab';
export default PromotorHoldsTab;
