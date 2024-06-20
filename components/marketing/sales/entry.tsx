import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { Button, Checkbox, Table, TextArea, TextInput } from 'components/core-ui-lib';
import useAxios from 'hooks/useAxios';
import { salesEntryColDefs, styleProps } from '../table/tableConfig';
import { useRecoilValue } from 'recoil';
import { bookingJumpState } from 'state/marketing/bookingJumpState';
import { productionJumpState } from 'state/booking/productionJumpState';
import { SelectOption } from '../MarketingHome';
import { addDurationToDate, getMonday } from 'services/dateService';
import { isNullOrEmpty } from 'utils';
import { Spinner } from 'components/global/Spinner';

type TourResponse = {
  data: Array<SelectOption>;
  frequency: string;
};

interface HoldComp {
  name: number;
  seats: number;
  value?: number;
}

interface HoldCompSet {
  comps: Array<HoldComp>;
  holds: Array<HoldComp>;
}

interface SalesFigure {
  seatsReserved: string;
  seatsReservedVal: string;
  seatsSold: string;
  seatsSoldVal: string;
}

interface SalesFigureSet {
  general: SalesFigure;
  schools: SalesFigure;
}

export interface SalesEntryRef {
  resetForm: (salesWeek) => void;
}

const Entry = forwardRef<SalesEntryRef>((ref) => {
  const [genSeatsSold, setGenSeatsSold] = useState('');
  const [genSeatsSoldVal, setGenSeatsSoldVal] = useState('');
  const [genSeatsReserved, setGenSeatsReserved] = useState('');
  const [genSeatsReservedVal, setGenSeatsReservedVal] = useState('');
  const [schSeatsSold, setSchSeatsSold] = useState('');
  const [schSeatsSoldVal, setSchSeatsSoldVal] = useState('');
  const [schSeatsReserved, setSchSeatsReserved] = useState('');
  const [schSeatsReservedVal, setSchSeatsReservedVal] = useState('');
  const [currency, setCurrency] = useState('£');
  const [schoolSalesNotRequired, setSchoolSalesNotRequired] = useState<boolean>(false);
  const [bookingSaleNotes, setBookingSaleNotes] = useState('');
  const [holdData, setHoldData] = useState([]);
  const [holdNotes, setHoldNotes] = useState('');
  const [compData, setCompData] = useState([]);
  const [compNotes, setCompNotes] = useState('');
  const [salesDate, setSalesDate] = useState(null);
  const [loading, setLoading] = useState<boolean>(true);
  const bookings = useRecoilValue(bookingJumpState);
  const { selected: productionId } = useRecoilValue(productionJumpState);

  const { fetchData } = useAxios();

  const handleUpdate = async () => {
    const data = {
      bookingId: bookings.selected,
      salesDate,
      schools: {
        seatsSold: parseInt(schSeatsSold),
        seatsSoldVal: parseFloat(schSeatsSoldVal),
        seatsReserved: parseInt(schSeatsReserved),
        seatsReservedVal: parseFloat(schSeatsReservedVal),
      },
      general: {
        seatsSold: parseInt(genSeatsSold),
        seatsSoldVal: parseFloat(genSeatsSoldVal),
        seatsReserved: parseInt(genSeatsReserved),
        seatsReservedVal: parseFloat(genSeatsReservedVal),
      },
    };

    await fetchData({
      url: '/api/marketing/sales/process/entry/sales',
      method: 'POST',
      data,
    });
  };

  const handleTableUpdate = (value, data, type, field) => {
    if (type === 'Holds') {
      const holdRecIndex = holdData.findIndex((rec) => rec.name === data.name);
      const tempHoldRecs = [...holdData];

      if (holdRecIndex !== -1) {
        tempHoldRecs[holdRecIndex] = { ...tempHoldRecs[holdRecIndex], [field]: value };
      }

      setHoldData(tempHoldRecs);
    }
  };

  const handleCancel = () => {
    setSalesFigures(true);
  };

  const setNumericVal = (setFunction: (value) => void, value: string) => {
    if (value === '') {
      setFunction(0);
    } else {
      const regexPattern = /^-?\d*(\.\d*)?$/;

      if (regexPattern.test(value)) {
        setFunction(value);
      }
    }
  };

  const getSalesDate = async () => {
    const data = await fetchData({
      url: '/api/marketing/sales/tourWeeks/' + productionId.toString(),
      method: 'POST',
    });

    if (typeof data === 'object') {
      const tourData = data as TourResponse;
      if (tourData.frequency === undefined) {
        return;
      }
      const salesDate = tourData.frequency === 'W' ? getMonday(new Date()) : new Date();
      setSalesDate(salesDate);

      return { date: salesDate, frequency: tourData.frequency };
    }
  };

  const setSalesFigures = async (previous: boolean) => {
    setLoading(true);
    const saleParams = await getSalesDate();
    if (saleParams === undefined) {
      return;
    }

    let salesDate = new Date();
    const duration = saleParams.frequency === 'W' ? 7 : 1;
    if (previous) {
      salesDate = addDurationToDate(saleParams.date, duration, false);
    } else {
      salesDate = saleParams.date;
    }

    // get the salesFigures for the selected date/week if they exist
    const sales = await fetchData({
      url: '/api/marketing/sales/read/currentDay',
      method: 'POST',
      data: {
        bookingId: bookings.selected,
        salesDate,
        frequency: saleParams.frequency,
      },
    });

    if (typeof sales === 'object') {
      const salesFigures = sales as SalesFigureSet;

      // set the sales figures, if available
      setGenSeatsReserved(validateSale(salesFigures.general?.seatsReserved));
      setGenSeatsReservedVal(validateSale(salesFigures.general?.seatsReservedVal));
      setGenSeatsSold(validateSale(salesFigures.general?.seatsSold));
      setGenSeatsSoldVal(validateSale(salesFigures.general?.seatsSoldVal));
      setSchSeatsReserved(validateSale(salesFigures.schools?.seatsReserved));
      setSchSeatsReservedVal(validateSale(salesFigures.schools?.seatsReservedVal));
      setSchSeatsSold(validateSale(salesFigures.schools?.seatsSold));
      setSchSeatsSoldVal(validateSale(salesFigures.schools?.seatsSoldVal));
    }

    // holds and comps
    const holdCompList = await fetchData({
      url: '/api/marketing/sales/read/holdComp',
      method: 'POST',
      data: {
        bookingId: bookings.selected,
        salesDate,
      },
    });

    if (typeof holdCompList === 'object') {
      const holdCompData = holdCompList as HoldCompSet;

      setHoldData(holdCompData.holds);
      setCompData(holdCompData.comps);
    }

    // get the booking details to set the notes fields
    const booking = bookings.bookings.find((booking) => booking.Id === bookings.selected);
    setBookingSaleNotes(booking.BookingSalesNotes === null ? '' : booking.BookingSalesNotes);
    setCompNotes(booking.BookingCompNotes === null ? '' : booking.BookingCompNotes);
    setHoldNotes(booking.BookingHoldNotes === null ? '' : booking.BookingHoldNotes);

    setLoading(false);
  };

  const validateSale = (saleFigure) => {
    if (isNullOrEmpty(saleFigure)) {
      return '';
    } else {
      return saleFigure;
    }
  };

  useEffect(() => {
    const initForm = async () => {
      try {
        // set the current days sales figues if available
        setSalesFigures(false);
      } catch (error) {
        console.log('error is: ' + error);
      }
    };

    initForm();
    setCurrency('£');
  }, [fetchData, bookings.selected]);

  useImperativeHandle(ref, () => ({
    resetForm: (week) => {
      alert(week);
      setSalesFigures(false);
    },
  }));

  return (
    <div>
      {loading ? (
        <Spinner size="lg" className="mt-2 mr-3 -mb-1" />
      ) : (
        <div className="flex flex-row w-full gap-8">
          <div className="flex flex-col">
            <div className="w-[849px] h-[275px] bg-primary-green/[0.30] rounded-xl mt-5 p-4">
              <div className="leading-6 text-xl text-primary-input-text font-bold mt-1 flex-row">General</div>

              <div className="flex flex-row justify-between">
                <div className="flex flex-col mr-[20px]">
                  <div className="flex flex-row mt-4">
                    <div className="flex flex-col">
                      <div className="text-primary-dark-blue base font-bold mr-[52px]">Seats Sold</div>
                    </div>
                    <TextInput
                      className="w-[137px] h-[31px] flex flex-col -mt-1"
                      placeholder="Enter Seats"
                      id="genSeatsSold"
                      value={genSeatsSold}
                      onChange={(event) => setNumericVal(setGenSeatsSold, event.target.value)}
                    />
                  </div>

                  <div className="flex flex-row mt-4">
                    <div className="flex flex-col">
                      <div className="text-primary-dark-blue base font-bold mr-5">Reserved Seats</div>
                    </div>
                    <TextInput
                      className="w-[137px] h-[31px] flex flex-col -mt-1"
                      placeholder="Enter Seats"
                      id="genSeatsReserved"
                      value={genSeatsReserved}
                      onChange={(event) => setNumericVal(setGenSeatsReserved, event.target.value)}
                    />
                  </div>
                </div>

                <div className="flex flex-col">
                  <div className="flex flex-row mt-4">
                    <div className="flex flex-col">
                      <div className="text-primary-dark-blue base font-bold mr-[52px]">Seats Sold Value</div>
                    </div>
                    <TextInput
                      className="w-[137px] h-[31px] flex flex-col -mt-1"
                      placeholder="Enter Value"
                      id="genSeatsSoldVal"
                      value={genSeatsSoldVal}
                      onChange={(event) => setNumericVal(setGenSeatsSoldVal, event.target.value)}
                    />
                  </div>

                  <div className="flex flex-row mt-4">
                    <div className="flex flex-col">
                      <div className="text-primary-dark-blue base font-bold mr-5">Reserved Seats Value</div>
                    </div>
                    <TextInput
                      className="w-[137px] h-[31px] flex flex-col -mt-1"
                      placeholder="Enter Value"
                      id="genSeatsReservedVal"
                      value={genSeatsReservedVal}
                      onChange={(event) => setNumericVal(setGenSeatsReservedVal, event.target.value)}
                    />
                  </div>
                </div>

                <div className="flex flex-col mt-4 justify-end">
                  <div className="flex flex-col items-end">
                    <Button
                      className="w-[132px] flex flex-row mb-2"
                      variant="primary"
                      text="Update"
                      onClick={handleUpdate}
                    />
                    <Button
                      className="w-[211px] flex flex-row"
                      variant="primary"
                      text="Copy Previous Week's Sales"
                      onClick={() => setSalesFigures(true)}
                    />
                  </div>
                </div>
              </div>

              <div className="leading-6 text-xl text-primary-input-text font-bold mt-5 flex-row">Schools</div>

              <div className="flex flex-row justify-between">
                <div className="flex flex-col mr-[20px]">
                  <div className="flex flex-row mt-4">
                    <div className="flex flex-col">
                      <div className="text-primary-dark-blue base font-bold mr-[52px]">Seats Sold</div>
                    </div>
                    <TextInput
                      className="w-[137px] h-[31px] flex flex-col -mt-1"
                      placeholder="Enter Seats"
                      id="schSeatsSold"
                      value={schSeatsSold}
                      onChange={(event) => setNumericVal(setSchSeatsSold, event.target.value)}
                    />
                  </div>

                  <div className="flex flex-row mt-4">
                    <div className="flex flex-col">
                      <div className="text-primary-dark-blue base font-bold mr-5">Reserved Seats</div>
                    </div>
                    <TextInput
                      className="w-[137px] h-[31px] flex flex-col -mt-1"
                      placeholder="Enter Seats"
                      id="schSeatsReserved"
                      value={schSeatsReserved}
                      onChange={(event) => setNumericVal(setSchSeatsReserved, event.target.value)}
                    />
                  </div>
                </div>

                <div className="flex flex-col">
                  <div className="flex flex-row mt-4">
                    <div className="flex flex-col">
                      <div className="text-primary-dark-blue base font-bold mr-[52px]">Seats Sold Value</div>
                    </div>
                    <TextInput
                      className="w-[137px] h-[31px] flex flex-col -mt-1"
                      placeholder="Enter Value"
                      id="schSeatsSoldVal"
                      value={schSeatsSoldVal}
                      onChange={(event) => setNumericVal(setSchSeatsSoldVal, event.target.value)}
                    />
                  </div>

                  <div className="flex flex-row mt-4">
                    <div className="flex flex-col">
                      <div className="text-primary-dark-blue base font-bold mr-5">Reserved Seats Value</div>
                    </div>
                    <TextInput
                      className="w-[137px] h-[31px] flex flex-col -mt-1"
                      placeholder="Enter Value"
                      id="schSeatsReservedVal"
                      value={schSeatsReservedVal}
                      onChange={(event) => setNumericVal(setSchSeatsReservedVal, event.target.value)}
                    />
                  </div>
                </div>

                <div className="flex flex-col mt-4 justify-end">
                  <div className="flex flex-col items-end">
                    <div className="flex flex-row mb-5">
                      <div className="text-base text-primary-dark-blue font-bold flex flex-col mr-3">
                        School Sales not required
                      </div>
                      <div className="flex flex-col">
                        <Checkbox
                          id="Marketing Plans Received"
                          name="Marketing Plans Received"
                          checked={schoolSalesNotRequired}
                          onChange={(e) => setSchoolSalesNotRequired(e.target.checked)}
                          className="w-[19px] h-[19px]"
                        />
                      </div>
                    </div>

                    <Button
                      className="w-[132px] flex flex-row"
                      variant="secondary"
                      text="Cancel"
                      onClick={handleCancel}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-row w-[849px] gap-6 mt-5">
              <div className="flex flex-col w-[415px]">
                <Table
                  columnDefs={salesEntryColDefs('Holds', currency, handleTableUpdate)}
                  rowData={holdData}
                  styleProps={styleProps}
                  gridOptions={{ suppressHorizontalScroll: true }}
                />

                <div className="leading-6 text-xl text-primary-input-text font-bold mt-5 flex-row">Holds Notes</div>
                <TextArea
                  className="mt-2 h-[105px] w-[416px] mb-10"
                  value={holdNotes}
                  placeholder="Notes Field"
                  onChange={(e) => setHoldNotes(e.target.value)}
                />
              </div>

              <div className="flex flex-col w-[300px]">
                <Table
                  columnDefs={salesEntryColDefs('Comps', currency, handleTableUpdate)}
                  rowData={compData}
                  styleProps={styleProps}
                  gridOptions={{ suppressHorizontalScroll: true }}
                />

                <div className="leading-6 text-xl text-primary-input-text font-bold mt-5 flex-row">Comp Notes</div>
                <TextArea
                  className="mt-2 h-[105px] w-[416px] mb-10"
                  value={compNotes}
                  placeholder="Notes Field"
                  onChange={(e) => setCompNotes(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="leading-6 text-xl text-primary-input-text font-bold mt-5 flex-row">Booking Sales Notes</div>
            <TextArea
              className="mt-2 h-[1030px] w-[514px] mb-10"
              value={bookingSaleNotes}
              placeholder="Notes Field"
              onChange={(e) => setBookingSaleNotes(e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
});

Entry.displayName = 'Entry';
export default Entry;
