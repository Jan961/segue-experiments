import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Layout from 'components/Layout';
import { InitialState } from 'lib/recoil';
import { getProductionJumpState } from 'utils/getProductionJumpState';
import { getAccountIdFromReq } from 'services/userService';
import ContractFilters from 'components/contracts/ContractsFilters';
import ContractsTable from 'components/contracts/ContractsTable';
import {
  DateTypeMapper,
  bookingMapper,
  dateBlockMapper,
  getInFitUpMapper,
  otherMapper,
  performanceMapper,
  rehearsalMapper,
  contractStatusmapper,
} from 'lib/mappers';
import useContractsFilter from 'hooks/useContractsFilter';
import { getAllVenuesMin } from 'services/venueService';
import { BookingsWithPerformances } from 'services/bookingService';
import { objectify, all } from 'radash';
import { getDayTypes } from 'services/dayTypeService';
import { getProductionsWithContent } from 'services/productionService';
import { getContractStatus } from 'services/contractStatus';
import { DateType } from '@prisma/client';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ContractsPage = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const rows = useContractsFilter();
  return (
    <Layout title="Contracts | Segue" flush>
      <div className="mb-8">
        <ContractFilters />
      </div>
      <ContractsTable rowData={rows} />
    </Layout>
  );
};

export default ContractsPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  /*
    We get the data for the whole booking page here. We pass it to the constructor, then store it in state management.
    This means we can update a single booking, and the schedule will update without having to redownload all the data.
    We have effectively cloned the database for this production, and populate it using the results of a single query which includes 'everything we want
    to display'.

    The itinery or miles will be different however, as this relies on the preview booking, and has to be generateed programatically
  */
  const AccountId = await getAccountIdFromReq(ctx.req);
  const productionJump = await getProductionJumpState(ctx, 'contracts', AccountId);
  const ProductionId = productionJump.selected;
  // ProductionJumpState is checking if it's valid to access by accountId
  if (!ProductionId) return { notFound: true };

  // Get in parallel
  const [venues, productions, dateTypeRaw, contractStatus] = await all([
    getAllVenuesMin(),
    getProductionsWithContent(ProductionId === -1 ? null : ProductionId, !productionJump.includeArchived),
    getDayTypes(),
    getContractStatus(ProductionId === -1 ? null : ProductionId),
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
      return { Id: v.Id, Code: v.Code, Name: v.Name, Town, Seats: v.Seats, Count: 0 };
    },
  );
  const dayTypeMap = objectify(dateTypeRaw, (type: DateType) => type.Id);

  // Map to DTO. The database can change and we want to control. More info in mappers.ts
  for (const production of productions) {
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

  const contractStatusData = {};
  contractStatus.forEach((contractData) => {
    contractStatusData[contractData.Id] = contractStatusmapper(contractData.Contract);
  });

  // See _app.tsx for how this is picked up
  const initialState: InitialState = {
    global: {
      productionJump,
    },
    contracts: {
      booking,
      rehearsal,
      getInFitUp,
      other,
      dateType: dateTypeRaw.map(DateTypeMapper),
      performance,
      dateBlock: dateBlock.sort((a, b) => {
        return b.StartDate < a.StartDate ? 1 : -1;
      }),
      // Remove extra info
      venue,
      contractStatus: contractStatusData,
    },
  };

  return {
    props: {
      ProductionId,
      initialState,
    },
  };
};
