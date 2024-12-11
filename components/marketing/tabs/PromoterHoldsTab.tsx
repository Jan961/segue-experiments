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
import { isNull, isNullOrEmpty } from 'utils';
import { Spinner } from 'components/global/Spinner';
import { exportExcelReport } from 'components/bookings/modal/request';
import { notify } from 'components/core-ui-lib';
import { productionJumpState } from 'state/booking/productionJumpState';
import axios from 'axios';
import { dateTimeToTime } from 'services/dateService';
import { PerformanceDTO } from 'interfaces';

interface PromotorHoldsTabProps {
  bookingId: string;
}

export interface PerformanceType {
  text: string;
  value: number;
  date: string;
  time: string;
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
  const [allocType, setAllocType] = useState('new');
  const textAreaRef = useRef(null);
  const bookings = useRecoilValue(bookingJumpState);
  const users = useRecoilValue(userState);
  const { selected: productionId, productions } = useRecoilValue(productionJumpState);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [perfList, setPerfList] = useState<Array<PerformanceType>>([]);

  const gridOptions = {
    getRowId: (data) => {
      return data?.data?.Id;
    },
    suppressHorizontalScroll: true,
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
      const { data: promData } = await axios.get(`/api/marketing/promoter-holds/${bookingId}`);

      if ((promData.allocations && Array.isArray(promData.allocations)) || Array.isArray(promData.holds)) {
        setHoldList(promData.holds);
        setAllocRows(
          promData.allocations.map((allocRow) => {
            const arrangedByUser = getNameFromId(allocRow.ArrangedByAccUserId);
            return {
              ...allocRow,
              ArrangedByAccUserId: arrangedByUser,
              name_email: `${allocRow.TicketHolderName}\n${allocRow.TicketHolderEmail}`,
            };
          }),
        );

        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const saveAllocatedSeats = async (data, perfId, type) => {
    const holdRecIndex = holdList.findIndex((hold) => hold?.info?.Id === perfId);
    const recData = { AvailableCompId: holdList[holdRecIndex]?.availableCompId, ...data };

    const apiRoute = {
      new: 'create',
      edit: 'update',
      delete: 'delete',
    };

    const { data: row } = await axios.post(`/api/marketing/allocated-seats/${apiRoute[type]}`, recData);

    if (type === 'new' || type === 'edit') {
      const arrangedByUser = getNameFromId(recData.ArrangedByAccUserId);
      const tableRow = {
        ...recData,
        ArrangedByAccUserId: arrangedByUser,
        name_email: `${recData.TicketHolderName}\n${recData.TicketHolderEmail}`,
        Id: row.id,
      };

      if (type === 'new') {
        updateHoldRows(tableRow.Seats, holdRecIndex);
        setAllocRows([...allocRows, tableRow]);
      } else if (type === 'edit') {
        const rowIndex = allocRows.findIndex((rec) => rec.Id === row.id);
        if (rowIndex !== -1) {
          const seatsChange = tableRow.Seats - allocRows[rowIndex].Seats;
          const updatedAllocRows = allocRows.map((row, index) => (index === rowIndex ? { ...row, ...tableRow } : row));
          updateHoldRows(seatsChange, holdRecIndex);
          setAllocRows(updatedAllocRows);
        }
      }
    } else if (type === 'delete') {
      const seats = allocRows.find((rec) => rec.Id === row.id).Seats;
      const updatedAllocRows = allocRows.filter((rec) => rec.Id !== row.id);
      updateHoldRows(-seats, holdRecIndex);
      setAllocRows(updatedAllocRows);
    }

    setShowAllocSeatsModal(false);
  };

  const updateHoldRows = (seatsChange: number, index: number) => {
    const holdRows = holdList.map((row) => ({ ...row }));
    holdRows[index] = {
      ...holdRows[index],
      totalAllocated: holdRows[index].totalAllocated + seatsChange,
    };
    setHoldList(holdRows);
  };

  const getNameFromId = (id: number) => {
    const user = Object.values(users).find((user) => user.AccUserId === id);
    const firstname = isNullOrEmpty(user.FirstName) ? '' : user.FirstName;
    const surname = isNullOrEmpty(user.LastName) ? '' : user.LastName;
    return firstname + ' ' + surname;
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

  // Get performance list
  const getPerformanceList = async (bookingId: string) => {
    try {
      setPerfList([]);
      const { data } = await axios.get(`/api/performances/read/${bookingId}`);

      if (typeof data === 'object') {
        const perfList = data as Array<PerformanceDTO>;
        const optionList: PerformanceType[] = [];
        perfList.forEach((perf) => {
          const perfTime = isNull(perf.Time) ? 'TBC' : perf.Time.substring(0, 5);
          optionList.push({
            text: formatInputDate(perf.Date) + ' | ' + perfTime,
            value: perf.Id,
            date: perf.Date,
            time: perfTime,
          });
        });

        setPerfList(optionList);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (props.bookingId !== null && props.bookingId !== undefined) {
      getPromoterHoldData(props.bookingId.toString());
      setBookingIdVal(props.bookingId.toString());
      getPerformanceList(props.bookingId.toString());

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
                  <div className="w-auto bg-white mb-1 rounded-md border border-primary-border">
                    <Icon
                      color="#fff"
                      className="float-right mt-1"
                      iconName="edit"
                      onClick={() => editAvailSeats(holdRec)}
                      testId="iconEditAvailSeats"
                    />
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
                disabled={perfList.length === 0}
              />
            </div>
          </div>

          <Table
            gridOptions={gridOptions}
            rowData={allocRows}
            styleProps={styleProps}
            columnDefs={allocSeatsColDefs}
            tableHeight={440}
            onRowDoubleClicked={triggerEdit}
            testId="tableAllocSeats"
          />

          <AllocatedSeatsModal
            show={showAllocSeatsModal}
            onCancel={() => setShowAllocSeatsModal(false)}
            onSave={(data, perfId, type: string) => saveAllocatedSeats(data, perfId, type)}
            data={allocatedRow}
            type={allocType}
            performances={perfList}
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
