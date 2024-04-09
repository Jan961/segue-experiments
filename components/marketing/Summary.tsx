import { calculateWeekNumber, dateToSimple, getTimeFromDateAndTime } from 'services/dateService';
import { bookingJumpState } from 'state/marketing/bookingJumpState';
import { useRecoilValue } from 'recoil';
import axios from 'axios';
import { useEffect, useState } from 'react';
import numeral from 'numeral';
import { LoadingTab } from './tabs/LoadingTab';
import { SummaryResponseDTO } from 'pages/api/marketing/summary/[BookingId]';
import classNames from 'classnames';
import SummaryRow from './SummaryRow';

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
  const [summary, setSummary] = useState<Partial<SummaryResponseDTO>>({});
  const [loading, setLoading] = useState(false);

  const boldText = 'text-base font-bold text-primary-input-text';
  const normalText = 'text-base font-normal text-primary-input-text';

  useEffect(() => {
    const search = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/marketing/summary/${selected}`);
        setSummary(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

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

      <SummaryRow label='First Date:' data={dateToSimple(summary?.ProductionInfo?.Date)} />
      <SummaryRow label='Last Date:' data={dateToSimple(summary?.ProductionInfo?.lastDate)} />
      <SummaryRow label='Number of Day(s):' data={summary?.ProductionInfo?.numberOfDays.toString()} />
      <SummaryRow label='Production Week No:' data={weekNo.toString()} />
      <SummaryRow label='Performance Time(s):' data={''} />
      <div className={normalText}>
        {summary.Performances?.map?.((x, i) => (
          <p key={i}>{`${dateToSimple(x.Date)} ${x.Time ? getTimeFromDateAndTime(x.Time) : ''}`}</p>
        )) || 'N/A'}
      </div>

      <div className={classNames(boldText, 'text-lg')}>Sales Summary</div>
      <SummaryRow label='Total Seats Sold:' data={numeral(info.SeatsSold).format('0,0') || '-'} />
      <SummaryRow label={`Total Sales ${currency}:`} data={info.SalesValue ? formatCurrency(info.SalesValue, currency) : '-'} />
      <SummaryRow label='Gross Potential:' data={formatCurrency(info.GrossPotential, currency)} />
      <SummaryRow label='AVG Ticket Price:' data={formatCurrency(info.AvgTicketPrice, currency)} />
      <SummaryRow label='Booking %:' data={info.seatsSalePercentage ? `${info.seatsSalePercentage}%` : '-'} />
      <SummaryRow label='Capacity:' data={numeral(info.Capacity).format('0,0') || '-'} />
      <SummaryRow label='Perf(s):' data={summary?.Performances?.length.toString()} />
      <SummaryRow label='Total Seats:' data={numeral(info.Seats).format('0,0') || '-'} />
      <SummaryRow label='Currency:' data={info.VenueCurrencyCode || '-'} />
  
      {notes && (
        <>
          <div className={classNames(boldText, 'text-lg mt-2')}>Notes</div>
          <div className={classNames(boldText, 'mr-1')}>Marketing Deal:</div>
          <div className={normalText}>{notes.MarketingDealNotes ? notes.MarketingDealNotes : 'None'}</div>
          <div className={classNames(boldText, 'mr-1')}>Booking Notes:</div>
          <div className={normalText}>{notes.BookingNotes ? notes.BookingNotes : 'None'}</div>

          <SummaryRow label='Booking Deal Notes:' data={notes.BookingDealNotes ? notes.BookingDealNotes : 'None'} />
          <SummaryRow label='Hold Notes:' data={notes.HoldNotes ? notes.HoldNotes : 'None'} />
          <SummaryRow label='Comp Notes:' data={notes.CompNotes ? notes.CompNotes : 'None'} />
        </>
      )}
    </div>
  );
};
