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
  const [summaryAvail, setSummaryAvail] = useState(false);

  const boldText = 'text-base font-bold text-primary-input-text';
  const normalText = 'text-base font-normal text-primary-input-text';

  useEffect(() => {
    const search = async () => {
      try {
        setSummaryAvail(true);
        setLoading(true);
        if (selected === undefined) {
          return;
        }
        const { data } = await axios.get(`/api/marketing/summary/${selected}`);
        setSummary(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (selected !== null) {
      search();
    } else {
      setSummaryAvail(false);
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

  const generalInfo = [
    {
      id: 1,
      label: 'First Date:',
      data: summary?.ProductionInfo?.Date === '-' ? '-' : dateToSimple(summary?.ProductionInfo?.Date),
    },
    {
      id: 2,
      label: 'Last Date:',
      data: summary?.ProductionInfo?.lastDate === '-' ? '-' : dateToSimple(summary?.ProductionInfo?.lastDate),
    },
    { id: 3, label: 'Number of Day(s):', data: summary?.ProductionInfo?.numberOfDays.toString() },
    { id: 4, label: 'Production Week No:', data: weekNo.toString() },
  ];

  const salesSummary = [
    { id: 1, label: 'Total Seats Sold:', data: numeral(info.SeatsSold).format('0,0') || '-' },
    {
      id: 2,
      label: `Total Sales ${currency}:`,
      data: info.SalesValue ? formatCurrency(info.SalesValue, currency) : '-',
    },
    { id: 3, label: 'Gross Potential:', data: formatCurrency(info.GrossPotential, currency) },
    { id: 4, label: 'AVG Ticket Price:', data: formatCurrency(info.AvgTicketPrice, currency) },
    { id: 5, label: 'Booking %:', data: info.seatsSalePercentage ? `${info.seatsSalePercentage}%` : '-' },
    { id: 6, label: 'Capacity:', data: numeral(info.Capacity).format('0,0') || '-' },
    { id: 7, label: 'Perf(s):', data: summary?.Performances?.length.toString() },
    { id: 8, label: 'Total Seats:', data: numeral(info.Seats).format('0,0') || '-' },
    { id: 9, label: 'Currency:', data: info.VenueCurrencyCode || '-' },
  ];

  const notesInfo = [{ id: 1, label: 'Booking Deal:', data: notes.BookingDealNotes ? notes.BookingDealNotes : 'None' }];

  const getPerformances = () => {
    const result = [];

    const groupedAndSorted = Object.entries(
      summary.Performances.reduce((acc, obj) => {
        (acc[obj.Date] = acc[obj.Date] || []).push(obj);
        return acc;
      }, {}),
    );

    const processed = [];
    groupedAndSorted.forEach((x) => {
      const times: any = x[1];
      const data = {
        date: x[0],
        time: times.map((item) => (item.Time === null ? 'TBC' : getTimeFromDateAndTime(item.Time))),
      };
      processed.push(data);
    });

    if (processed.length === 0) {
      return '-';
    } else {
      processed.forEach((element) => {
        result.push(
          <p>
            {dateToSimple(element.date)} {element.time.join('; ')}{' '}
          </p>,
        );
      });

      return result;
    }
  };

  return (
    <div className="text-sm mb-2">
      {summaryAvail && (
        <div>
          <div className={classNames(boldText, 'text-lg')}>General Info</div>

          {generalInfo.map((item) => (
            <SummaryRow key={item.id} label={item.label} data={item.data} />
          ))}

          <SummaryRow label="Performance Time(s):" data="" />
          <div className={normalText}>{getPerformances()}</div>

          <div className={classNames(boldText, 'text-lg')}>Sales Summary</div>
          {salesSummary.map((item) => (
            <SummaryRow key={item.id} label={item.label} data={item.data} />
          ))}

          {notes && (
            <>
              <div className={classNames(boldText, 'text-lg mt-2')}>Notes</div>
              <div className={classNames(boldText, 'mr-1')}>Marketing Deal:</div>
              <div className={normalText}>
                {notes.MarketingDealNotes || notes.MarketingDealNotes === 'None' ? notes.MarketingDealNotes : 'None'}
              </div>
              <div className={classNames(boldText, 'mr-1')}>Booking Notes:</div>
              <div className={normalText}>
                {notes.BookingNotes || notes.BookingNotes === 'None' ? notes.BookingNotes : 'None'}
              </div>

              {notesInfo.map((item) => (
                <SummaryRow key={item.id} label={item.label} data={item.data} />
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};
