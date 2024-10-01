import { GetServerSideProps, InferGetServerSidePropsType, NextApiRequest } from 'next';
import Layout from 'components/Layout';
import {
  DateTypeMapper,
  bookingMapper,
  dateBlockMapper,
  getInFitUpMapper,
  otherMapper,
  performanceMapper,
  rehearsalMapper,
} from 'lib/mappers';
import { getAllVenuesMin, getCountryRegions, getVenueCurrencies } from 'services/venueService';
import { InitialState } from 'lib/recoil';
import { BookingsWithPerformances } from 'services/bookingService';
import { objectify, all } from 'radash';
import { getDayTypes } from 'services/dayTypeService';
import { getProductionJumpState } from 'utils/getProductionJumpState';
import useBookingFilter from 'hooks/useBookingsFilter';
import Filters from 'components/bookings/Filters';
import { getProductionsWithContent } from 'services/productionService';
import BookingsTable from 'components/bookings/BookingsTable';
import { DateType } from 'prisma/generated/prisma-client';
import { useMemo, useRef, useState } from 'react';
import ExportModal from 'components/core-ui-lib/ExportModal';
import { useRecoilValue } from 'recoil';
import { filterState } from 'state/booking/filterState';
import { exportToExcel, exportToPDF } from 'utils/export';
import { getExportExtraContent } from 'components/bookings/table/tableConfig';
import { currentProductionSelector } from 'state/booking/selectors/currentProductionSelector';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const BookingPage = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const rows = useBookingFilter();
  const tableRef = useRef(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const currentProduction = useRecoilValue(currentProductionSelector);
  const appliedFilters = useRecoilValue(filterState);
  const excelExportExtraContents = useMemo(() => {
    const showName = currentProduction?.ShowName;
    const code = currentProduction?.Code;
    const showCode = currentProduction?.ShowCode;

    return getExportExtraContent(showName, showCode, code, appliedFilters);
  }, [appliedFilters]);

  const onExportClick = () => {
    setIsExportModalOpen(true);
  };

  const exportTable = (key: string) => {
    if (key === 'Excel') {
      exportToExcel(tableRef, excelExportExtraContents);
    } else if (key === 'PDF') {
      exportToPDF(tableRef);
    }
  };

  return (
    <Layout title="Booking | Segue" flush>
      <div className="mb-8">
        <Filters onExportClick={onExportClick} />
      </div>
      <BookingsTable tableRef={tableRef} rowData={rows} />
      {isExportModalOpen && (
        <ExportModal
          visible={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          onItemClick={exportTable}
          ExportList={[
            {
              key: 'Excel',
              iconName: 'excel',
              iconProps: { fill: '#1D6F42', variant: '7xl' },
            },
            {
              key: 'PDF',
              iconName: 'document-solid',
              iconProps: { fill: 'red', variant: '7xl' },
            },
          ]}
        />
      )}
    </Layout>
  );
};

export default BookingPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  /*
    We get the data for the whole booking page here. We pass it to the constructor, then store it in state management.
    This means we can update a single booking, and the schedule will update without having to redownload all the data.
    We have effectively cloned the database for this production, and populate it using the results of a single query which includes 'everything we want
    to display'.

    The itinery or miles will be different however, as this relies on the preview booking, and has to be generateed programatically
  */
  const productionJump = await getProductionJumpState(ctx, 'bookings');
  const ProductionId = productionJump.selected;
  // ProductionJumpState is checking if it's valid to access by accountId
  if (!ProductionId) return { notFound: true };

  // Get in parallel
  const [venues, productions, dateTypeRaw, countryRegions, venueCurrencies] = await all([
    getAllVenuesMin(ctx.req as NextApiRequest),
    getProductionsWithContent(
      ctx.req as NextApiRequest,
      ProductionId === -1 ? null : ProductionId,
      !productionJump.includeArchived,
    ),
    getDayTypes(ctx.req as NextApiRequest),
    getCountryRegions(ctx.req as NextApiRequest),
    getVenueCurrencies(ctx.req as NextApiRequest),
  ]);

  const dateBlock = [];
  const rehearsal = {};
  const booking = {};
  const getInFitUp = {};
  const performance = {};
  const other = {};
  const venue = objectify(
    venues,
    (v) => v.Id,
    (v: any) => {
      const Town: string | null = v.VenueAddress.find((address: any) => address?.TypeName === 'Main')?.Town ?? null;
      const countryId = v.VenueAddress.find((address: any) => address.TypeName === 'Main')?.CountryId;

      const region = countryRegions.find((countryRegion: any) => countryRegion?.CountryId === countryId) ?? null;
      const currencyCode = venueCurrencies[v.Id] ?? null;

      return {
        Id: v.Id,
        Code: v.Code,
        Name: v.Name,
        Town,
        Seats: v.Seats,
        Count: 0,
        RegionId: region ? region.RegionId : -1,
        CurrencyCode: currencyCode || null,
      };
    },
  );

  let distance = {};
  const dayTypeMap = objectify(dateTypeRaw, (type: DateType) => type.Id);
  // Map to DTO. The database can change and we want to control. More info in mappers.ts
  for (const production of productions) {
    distance = {
      ...distance,
      [production.Id]: {
        ...(distance[production.Id] || {}),
        stops: [],
        outdated: true,
        productionCode: production?.Code,
      },
    };
    const PrimaryDateBlock = production.DateBlock.find((dateBlock) => dateBlock.IsPrimary);
    for (const db of production.DateBlock) {
      const mappedBlock = dateBlockMapper(db);
      dateBlock.push({
        ...mappedBlock,
        ProductionId: production?.Id,
      });
      db.Other.forEach((o) => {
        other[o.Id] = {
          ...otherMapper(o),
          ProductionId: production?.Id,
          DayTypeName: dayTypeMap[o.DayTypeId] || 'Other',
          PrimaryDateBlock: dateBlockMapper(PrimaryDateBlock),
        };
      });
      db.Rehearsal.forEach((r) => {
        rehearsal[r.Id] = {
          ...rehearsalMapper(r),
          ProductionId: production?.Id,
          PrimaryDateBlock: dateBlockMapper(PrimaryDateBlock),
        };
      });
      db.GetInFitUp.forEach((gifu) => {
        getInFitUp[gifu.Id] = {
          ...getInFitUpMapper(gifu),
          ProductionId: production?.Id,
          PrimaryDateBlock: dateBlockMapper(PrimaryDateBlock),
        };
      });
      db.Booking.forEach((b) => {
        booking[b.Id] = {
          ...bookingMapper(b as BookingsWithPerformances),
          ProductionId: production?.Id,
          PerformanceIds: b.Performance.map((perf) => perf.Id),
          PrimaryDateBlock: dateBlockMapper(PrimaryDateBlock),
        };
        b.Performance.forEach((p) => {
          performance[p.Id] = {
            ...performanceMapper(p),
            Time: performanceMapper(p).Time ?? null, // Example of setting a default value
          };
        });
        const venueId = booking[b.Id].VenueId;
        if (venue[venueId]) venue[venueId].Count++;
      });
    }
  }

  // See _app.tsx for how this is picked up
  const initialState: InitialState = {
    global: {
      productionJump,
    },
    booking: {
      distance,
      rehearsal,
      booking,
      getInFitUp,
      other,
      dateType: dateTypeRaw.map(DateTypeMapper),
      performance,
      dateBlock: dateBlock.sort((a, b) => {
        return b.StartDate < a.StartDate ? 1 : -1;
      }),
      // Remove extra info
      venue,
    },
  };

  return {
    props: {
      ProductionId,
      initialState,
    },
  };
};
