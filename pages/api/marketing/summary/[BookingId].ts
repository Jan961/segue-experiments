import getPrismaClient from 'lib/prisma';
import master from 'lib/prisma_master';
import { NextApiRequest, NextApiResponse } from 'next';
import { PerformanceDTO } from 'interfaces';
import { calculateWeekNumber } from 'services/dateService';
import { group } from 'radash';
import { loggingService } from 'services/loggingService';
import { getCurrencyCodeFromCountryId } from 'services/venueCurrencyService';

export type SummaryResponseDTO = {
  Performances: PerformanceDTO[];
  Info: {
    Seats: number;
    SeatsSold: number;
    GrossPotential: number;
    SalesValue: number;
    VenueCurrencyCode: string;
    VenueCurrencySymbol: string;
    ConversionRate: number;
    AvgTicketPrice: number;
    seatsSalePercentage: number;
    Capacity: number;
  };
  ProductionInfo: {
    Date: string;
    StartDate: string;
    week: number;
    numberOfDays: number;
    lastDate: string;
    salesFigureDate: string;
  };
  Notes: {
    BookingDealNotes: string;
    BookingNotes: string;
    MarketingDealNotes: string;
    HoldNotes: string;
    CompNotes: string;
  };
};

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const BookingId = parseInt(req.query?.BookingId as string, 10);
    const prisma = await getPrismaClient(req);

    const performance: any = await prisma.performance.findFirst({
      where: {
        BookingId,
      },
      orderBy: {
        Date: 'asc',
      },
      take: 1,
    });

    const performances: any[] = await prisma.performance.findMany({
      where: {
        BookingId,
      },
      select: {
        Id: true,
        Date: true,
        Time: true,
      },
      orderBy: {
        Date: 'asc',
      },
    });

    const NumberOfPerformances: number = performances.length;

    const salesSummary = await prisma.salesSetTotalsView.findFirst({
      where: {
        SaleTypeName: {
          in: ['General Sales', 'School Sales'],
        },
        SetBookingId: BookingId,
        Seats: {
          not: 0,
        },
        Value: {
          not: 0,
        },
      },
      select: {
        SetSalesFiguresDate: true,
        SetIsFinalFigures: true,
        Seats: true,
        Value: true,
      },
      orderBy: {
        SetSalesFiguresDate: 'desc',
      },
    });

    const booking: any = await prisma.booking.findFirst({
      select: {
        FirstDate: true,
        VenueId: true,
        DealNotes: true,
        Notes: true,
        MarketingDealNotes: true,
        HoldNotes: true,
        CompNotes: true,
        Venue: {
          select: {
            Seats: true,
            VenueAddress: { where: { TypeName: { equals: 'Main' } }, select: { CountryId: true } },
          },
        },
        DateBlock: {
          select: {
            StartDate: true,
            EndDate: true,
            Production: {
              select: {
                ConversionRate: true,
              },
            },
          },
        },
      },
      where: {
        Id: BookingId,
        NOT: {
          VenueId: {
            equals: undefined,
          },
        },
      },
    });

    const {
      DealNotes: BookingDealNotes,
      Notes: BookingNotes,
      MarketingDealNotes,
      HoldNotes,
      CompNotes,
    } = booking || {};

    const currencyCode: string | null = await getCurrencyCodeFromCountryId(
      booking?.Venue?.VenueAddress[0]?.CountryId,
      req,
    );
    const { Seats: Capacity } = booking?.Venue || {};

    const unicodeQuery = await master.Currency.findFirst({
      where: { CurrencyCode: { equals: currencyCode } },
      select: { CurrencySymbolUnicode: true },
    });

    const SymbolUnicode = unicodeQuery?.CurrencySymbolUnicode;

    const { ConversionRate } = performance?.DateBlock?.Production?.ConversionRate || {};
    const AvgTicketPrice = salesSummary === null ? 0 : Number(salesSummary.Value) / Number(salesSummary.Seats);
    const TotalSeats = Capacity * NumberOfPerformances;
    const GrossProfit = AvgTicketPrice === 0 ? 0 : AvgTicketPrice * TotalSeats;
    const seatsSalePercentage = salesSummary === null ? 0 : (Number(salesSummary?.Seats) / TotalSeats) * 100;
    const currentProductionWeekNum = calculateWeekNumber(new Date(), new Date(booking.FirstDate));

    const result: SummaryResponseDTO = {
      Performances: performances,
      Info: {
        SeatsSold: salesSummary?.Seats === undefined ? 0 : Number(salesSummary?.Seats),
        Seats: TotalSeats,
        SalesValue: salesSummary?.Value === undefined ? 0 : Number(salesSummary?.Value),
        AvgTicketPrice: AvgTicketPrice && parseFloat(AvgTicketPrice.toFixed(2)),
        GrossPotential: GrossProfit && parseFloat(GrossProfit.toFixed(2)),
        VenueCurrencyCode: currencyCode,
        VenueCurrencySymbol: SymbolUnicode,
        seatsSalePercentage: seatsSalePercentage && parseFloat(seatsSalePercentage.toFixed(1)),
        ConversionRate,
        Capacity,
      },
      ProductionInfo: {
        StartDate: booking?.DateBlock.StartDate,
        Date: performances?.[0]?.Date,
        salesFigureDate: salesSummary?.SetSalesFiguresDate.toISOString(),
        week: currentProductionWeekNum,
        lastDate: performances?.[performances?.length - 1]?.Date,
        numberOfDays: Object.keys(group(performances, (performance) => performance.Date)).length,
      },
      Notes: {
        BookingDealNotes,
        BookingNotes,
        MarketingDealNotes,
        HoldNotes,
        CompNotes,
      },
    };

    res.status(200).json(result);
  } catch (err) {
    await loggingService.logError('Performance Issue' + err);
    console.log(err);
    res.status(500).json({ err: 'Error occurred while generating search results.' + err });
  }
}
