import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { PerformanceDTO } from 'interfaces';
import { calculateWeekNumber } from 'services/dateService';
import { group } from 'radash';
import { checkAccess, getEmailFromReq } from 'services/userService';

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

    const email = await getEmailFromReq(req);
    const access = await checkAccess(email, { BookingId });
    if (!access) return res.status(401).end();

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
            CurrencyCode: true,
            Currency: {
              select: {
                SymbolUnicode: true,
              },
            },
          },
        },
        DateBlock: {
          select: {
            StartDate: true,
            EndDate: true,
            Production: {
              select: {
                ConversionRate: {
                  select: {
                    ConversionRate: true,
                  },
                },
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
    const { Seats: Capacity, CurrencyCode } = booking?.Venue || {};
    const { SymbolUnicode } = booking?.Venue?.Currency || {};
    const { ConversionRate } = performance?.DateBlock?.Production?.ConversionRate || {};
    const AvgTicketPrice = salesSummary && salesSummary.Value / salesSummary.Seats;
    const TotalSeats = Capacity * NumberOfPerformances;
    const GrossProfit = AvgTicketPrice && AvgTicketPrice * TotalSeats;
    const seatsSalePercentage = salesSummary && (salesSummary.Seats / TotalSeats) * 100;
    const currentProductionWeekNum = calculateWeekNumber(new Date(), new Date(booking.FirstDate));
    const result: SummaryResponseDTO = {
      Performances: performances,
      Info: {
        SeatsSold: salesSummary.Seats,
        Seats: TotalSeats,
        SalesValue: salesSummary?.Value,
        AvgTicketPrice: AvgTicketPrice && parseFloat(AvgTicketPrice.toFixed(2)),
        GrossPotential: GrossProfit && parseFloat(GrossProfit.toFixed(2)),
        VenueCurrencyCode: CurrencyCode,
        VenueCurrencySymbol: SymbolUnicode,
        seatsSalePercentage: seatsSalePercentage && parseFloat(seatsSalePercentage.toFixed(1)),
        ConversionRate,
        Capacity,
      },
      ProductionInfo: {
        StartDate: booking?.DateBlock.StartDate,
        Date: performances?.[0]?.Date,
        salesFigureDate: salesSummary?.SaleFiguresDate,
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
    // no summary data therefore send defaults
    const result: SummaryResponseDTO = {
      Performances: [],
      Info: {
        SeatsSold: 0,
        Seats: 0,
        SalesValue: 0,
        AvgTicketPrice: 0,
        GrossPotential: 0,
        VenueCurrencyCode: '',
        VenueCurrencySymbol: '-',
        seatsSalePercentage: 0,
        ConversionRate: 0,
        Capacity: 0,
      },
      ProductionInfo: {
        StartDate: '-',
        Date: '-',
        salesFigureDate: '-',
        week: 0,
        lastDate: '-',
        numberOfDays: 0,
      },
      Notes: {
        BookingDealNotes: 'None',
        BookingNotes: 'None',
        MarketingDealNotes: 'None',
        HoldNotes: 'None',
        CompNotes: 'None',
      },
    };

    res.status(200).json(result);
  }
}
