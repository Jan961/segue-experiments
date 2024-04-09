import { calculateWeekNumber, dateToSimple, getTimeFromDateAndTime } from 'services/dateService';
import { bookingJumpState } from 'state/marketing/bookingJumpState';
import { useRecoilValue } from 'recoil';
import axios from 'axios';
import React from 'react';
import numeral from 'numeral';
import { LoadingTab } from './tabs/LoadingTab';
import { SummaryResponseDTO } from 'pages/api/marketing/summary/[BookingId]';
import classNames from 'classnames';

export const formatCurrency = (amount: number, currency: string) => {
  const formatter = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: currency || 'GBP',
    minimumFractionDigits: 0,
  });

  return formatter.format(amount);
};

export const Summary = () => {
  const { selected } = useRecoilValue(bookingJumpState);
  const [summary, setSummary] = React.useState<Partial<SummaryResponseDTO>>({});
  const [loading, setLoading] = React.useState(false);

  const boldText = 'text-base font-bold text-primary-input-text';
  const normalText = 'text-base font-normal text-primary-input-text';

  const search = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/marketing/summary/${selected}`);
      setSummary(data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    if (selected) {
      search();
    }
  }, [selected]);

  if (loading) return <LoadingTab />;

  if (!summary) return null;
  const weekNo = calculateWeekNumber(
    new Date(summary?.ProductionInfo?.StartDate),
    new Date(summary?.ProductionInfo?.Date),
  );

  if (!summary?.Info) return null;

  const currency = summary?.Info?.VenueCurrencyCode;
  const info = summary?.Info;
  const notes = summary?.Notes;

  return (
    <div className="text-sm mb-2">
      <div className={classNames(boldText, 'text-lg')}>General Info</div>
      <div className="flex flex-row">
        <div className={classNames(boldText, 'mr-1')}>First Date:</div>
        <div className={normalText}>{dateToSimple(summary?.ProductionInfo?.Date)}</div>
      </div>

      <div className="flex flex-row">
        <div className={classNames(boldText, 'mr-1')}>Last Date:</div>
        <div className={normalText}>{dateToSimple(summary?.ProductionInfo?.lastDate)}</div>
      </div>

      <div className="flex flex-row">
        <div className={classNames(boldText, 'mr-1')}>Number of Day(s):</div>
        <div className={normalText}>{summary?.ProductionInfo?.numberOfDays}</div>
      </div>
      <div className="flex flex-row">
        <div className={classNames(boldText, 'mr-1')}>Production Week No:</div>
        <div className={normalText}>{weekNo}</div>
      </div>
      <div className="flex flex-row flex-wrap">
        <div className={classNames(boldText, 'mr-1')}>Performance Time(s):</div>
        <div className={normalText}>
          {summary.Performances?.map?.((x, i) => (
            <p key={i}>{`${dateToSimple(x.Date)} ${x.Time ? getTimeFromDateAndTime(x.Time) : ''}`}</p>
          )) || 'N/A'}
        </div>
      </div>

      <div className={classNames(boldText, 'text-lg mt-2')}>Sales Summary</div>
      <div className="flex flex-row">
        <div className={classNames(boldText, 'mr-1')}>Total Seats Sold:</div>
        <div className={normalText}>{numeral(info.SeatsSold).format('0,0') || '-'}</div>
      </div>
      <div className="flex flex-row">
        <div className={classNames(boldText, 'mr-1')}>Total Sales ({currency}):</div>
        <div className={normalText}>{info.SalesValue ? formatCurrency(info.SalesValue, currency) : '-'}</div>
      </div>
      <div className="flex flex-row">
        <div className={classNames(boldText, 'mr-1')}>Gross Potential:</div>
        <div className={normalText}>{formatCurrency(info.GrossPotential, currency)}</div>
      </div>
      <div className="flex flex-row">
        <div className={classNames(boldText, 'mr-1')}>AVG Ticket Price:</div>
        <div className={normalText}>{formatCurrency(info.AvgTicketPrice, currency)}</div>
      </div>
      <div className="flex flex-row">
        <div className={classNames(boldText, 'mr-1')}>Booking %:</div>
        <div className={normalText}>{info.seatsSalePercentage ? `${info.seatsSalePercentage}%` : '-'}</div>
      </div>
      <div className="flex flex-row">
        <div className={classNames(boldText, 'mr-1')}>Capacity:</div>
        <div className={normalText}>{numeral(info.Capacity).format('0,0') || '-'}</div>
      </div>
      <div className="flex flex-row">
        <div className={classNames(boldText, 'mr-1')}>Perf(s):</div>
        <div className={normalText}>{summary?.Performances?.length}</div>
      </div>
      <div className="flex flex-row">
        <div className={classNames(boldText, 'mr-1')}>Total Seats:</div>
        <div className={normalText}>{numeral(info.Seats).format('0,0') || '-'}</div>
      </div>
      <div className="flex flex-row">
        <div className={classNames(boldText, 'mr-1')}>Currency:</div>
        <div className={normalText}>{info.VenueCurrencyCode || '-'}</div>
      </div>

      {notes && (
        <>
          <div className={classNames(boldText, 'text-lg mt-2')}>Notes</div>
          <div className={classNames(boldText, 'mr-1')}>Marketing Deal:</div>
          <div className={normalText}>{notes.MarketingDealNotes ? notes.MarketingDealNotes : 'None'}</div>
          <div className={classNames(boldText, 'mr-1')}>Booking Notes:</div>
          <div className={normalText}>{notes.BookingNotes ? notes.BookingNotes : 'None'}</div>

          <div className="flex flex-row">
            <div className={classNames(boldText, 'mr-1')}>Booking Deal Notes:</div>
            <div className={normalText}>
              <span>{notes.BookingDealNotes ? notes.BookingDealNotes : 'None'}</span>
            </div>
          </div>
          <div className="flex flex-row">
            <div className={classNames(boldText, 'mr-1')}>Hold Notes:</div>
            <div className={normalText}>{notes.HoldNotes ? notes.HoldNotes : 'None'}</div>
          </div>
          <div className="flex flex-row">
            <div className={classNames(boldText, 'mr-1')}>Comp Notes:</div>
            <div className={normalText}>
              <span>{notes.CompNotes ? notes.CompNotes : 'None'}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
