import { Table } from 'components/global/table/Table';

import BookingSelection from './BookingSelection';
import React, { useEffect, useMemo } from 'react';
import axios from 'axios';
import { useRecoilValue } from 'recoil';
import { bookingJumpState } from 'state/marketing/bookingJumpState';
import { LoadingTab } from './LoadingTab';
import { useRouter } from 'next/router';
import { dateToSimple } from 'services/dateService';
import { productionJumpState } from 'state/booking/productionJumpState';
import classNames from 'classnames';

export const ArchivedSalesTab = () => {
  const router = useRouter();
  const [archivedSales, setArchivedSales] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [salesByType, setSalesByType] = React.useState(null);
  const { selected, bookings } = useRecoilValue(bookingJumpState);
  const { selected: selectedProduction, productions: productionsList } = useRecoilValue(productionJumpState);
  const [productions, setProductions] = React.useState<any[]>([]);
  const selectedBooking = useMemo(() => bookings.find((booking) => booking.Id === selected), [bookings, selected]);
  const tableWidth = useMemo(() => 260 + productions.length * 180, [productions]);
  const openBookingSelection = (type) => {
    setSalesByType(type);
  };
  const getBookingSales = async (bookingIds, productions) => {
    setProductions(productions);
    setLoading(true);
    try {
      const { data } = await axios.post('/api/marketing/sales/read/archived', {
        bookingIds,
      });
      setArchivedSales(data.response);
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (selected) {
      const production = productionsList.find((production) => production.Id === selectedProduction);
      getBookingSales([selected], [{ FullProductionCode: `${production.ShowCode}${production.Code}` }]);
    }
  }, [selected]);
  if (loading) return <LoadingTab />;

  return (
    <>
      <div className={'mb-1 space-x-3 pl-1 pb-4 mt-4'}>
        <button
          onClick={() => openBookingSelection('venue')}
          className={
            'inline-flex items-center rounded-md  bg-white  px-6 py-3 text-xs font-bold drop-shadow-lg text-primary-green hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
          }
        >
          For this Venue{' '}
        </button>
        <button
          onClick={() => openBookingSelection('town')}
          className={
            'inline-flex items-center rounded-md  bg-white  px-6 py-3 text-xs font-bold drop-shadow-lg text-primary-green hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
          }
        >
          For this Town{' '}
        </button>
        {salesByType && (
          <BookingSelection
            venueCode={selectedBooking?.Venue?.Code}
            showCode={router.query.ShowCode}
            salesByType={salesByType}
            onSubmit={getBookingSales}
            selectedBookingId={selectedBooking?.Id}
            onClose={() => setSalesByType(null)}
          />
        )}
      </div>
      {archivedSales?.length ? (
        <Table className={'table-auto !min-w-0 sticky-header-table'} style={{ maxWidth: tableWidth }}>
          <Table.HeaderRow className="rounded-t-lg">
            <Table.HeaderCell className="rounded-tl-lg"></Table.HeaderCell>
            {productions.map((production, i) => (
              <>
                <Table.HeaderCell
                  className={classNames('text-center !text-lg', { 'rounded-tr-lg': i === productions.length - 1 })}
                  key={i}
                >
                  {production.FullProductionCode}
                </Table.HeaderCell>
              </>
            ))}
          </Table.HeaderRow>
          <Table.HeaderRow>
            <Table.HeaderCell className="text-center">Week</Table.HeaderCell>
            <Table.HeaderCell className="text-center">Week of</Table.HeaderCell>
            {productions.map((_) => (
              <>
                <Table.HeaderCell className={classNames('text-center')}>Seats</Table.HeaderCell>
                <Table.HeaderCell className={classNames('text-center')}>Value</Table.HeaderCell>
              </>
            ))}
          </Table.HeaderRow>
          <Table.Body className="" style={{ maxHeight: 'calc(100vh - 500px)' }}>
            {archivedSales.map((sale, i) => (
              <Table.Row key={i}>
                <Table.Cell className="text-center">
                  {sale.SetIsFinalFigures ? 'Final' : `Week ${sale.SetBookingWeekNum}`}
                </Table.Cell>
                <Table.Cell>{dateToSimple(sale.SetProductionWeekDate)}</Table.Cell>
                {sale.data.map((productionSale, i) => (
                  <>
                    <Table.Cell className={classNames('text-right', { 'bg-gray-100': i % 2 === 0 })}>
                      {productionSale.Seats}
                    </Table.Cell>
                    <Table.Cell className={classNames('text-right', { 'bg-gray-100': i % 2 === 0 })}>
                      {productionSale.ValueWithCurrencySymbol}
                    </Table.Cell>
                  </>
                ))}
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      ) : (
        <div>Please select archived productions</div>
      )}
    </>
  );
};
