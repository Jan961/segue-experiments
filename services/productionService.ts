import getPrismaClient from 'lib/prisma';
import master from 'lib/prisma_master';
import { Prisma } from 'prisma/generated/prisma-client';
import { showProductionMapper, productionEditorMapper } from 'lib/mappers';
import { getShowWithProductionsById } from './showService';
import { getAccountId, getEmailFromReq } from './userService';
import { ProductionDTO, UICurrency } from 'interfaces';
import { getProductionsByStartDate } from 'utils/getProductionsByStartDate';
import { getWeekNumsToDateMap } from 'utils/getDateFromWeekNum';
import { omit } from 'radash';
import { NextApiRequest } from 'next';

// Edit Production Page
const productionDateBlockInclude = Prisma.validator<Prisma.ProductionSelect>()({
  Show: true,
  DateBlock: true,
  ProductionRegion: true,
  File: true,
  ConversionRate: {
    select: {
      FromCurrencyCode: true,
      ToCurrencyCode: true,
    },
  },
});

export const getActiveProductions = async (req: NextApiRequest) => {
  const prisma = await getPrismaClient(req);
  const productions = await prisma.production.findMany({
    where: {
      IsArchived: false,
    },
    include: productionDateBlockInclude,
  });

  return getProductionsByStartDate(productions);
};

export const getRegionlist = async (req: NextApiRequest) => {
  const prisma = await getPrismaClient(req);
  return await prisma.region.findMany({});
};

export interface AllProductionPageProps {
  productions: ProductionDTO[];
}

export const getAllProductionPageProps = async (req: NextApiRequest) => {
  const prisma = await getPrismaClient(req);
  const productionsRaw = await prisma.Production.findMany({
    include: {
      Show: true,
      DateBlock: true,
    },
  });

  const productions = getProductionsByStartDate(productionsRaw).map(productionEditorMapper);

  return { props: { productions } };
};

export const getProductionPageProps = async (ctx: any) => {
  const { ShowCode } = ctx.params;
  const email = await getEmailFromReq(ctx.req);
  const AccountId = await getAccountId(email);

  const prisma = await getPrismaClient(ctx.req);

  const showRaw = await prisma.show.findFirst({
    where: {
      Code: ShowCode,
      AccountId,
    },
    select: {
      Id: true,
      Code: true,
    },
  });

  if (!showRaw) return { notFound: true, props: { productions: [], code: '', name: '' } };

  const show = await getShowWithProductionsById(showRaw.Id, ctx.req);
  const productions = showProductionMapper(show);

  return { props: { productions, code: show.Code, name: show.Name } };
};

export const lookupProductionId = async (
  ShowCode: string,
  ProductionCode: string,
  AccountId: number,
  req: NextApiRequest,
) => {
  const prisma = await getPrismaClient(req);
  return prisma.production.findFirst({
    where: {
      Code: ProductionCode as string,
      Show: {
        Code: ShowCode as string,
        AccountId,
      },
    },
    select: {
      Id: true,
    },
  });
};

export const getAllProductions = async (req: NextApiRequest) => {
  const prisma = await getPrismaClient(req);
  // TODO: convert this to lookup.
  const productionCompanyList = await master.ProductionCompany.findMany({
    orderBy: {
      ProdCoName: 'asc',
    },
  });

  const productions = await prisma.production.findMany({
    select: {
      Id: true,
      Code: true,
      RunningTime: true,
      RunningTimeNote: true,
      SalesFrequency: true,
      IsArchived: true,
      Show: {
        select: {
          Code: true,
          Name: true,
        },
      },
      DateBlock: true,
      ProdCoId: true,
      SalesEmail: true,
    },
    where: {
      IsDeleted: false,
    },
  });

  const productionList = productions.map((production) => {
    return {
      ...production,
      ProductionCompany: productionCompanyList.find((prodCo) => prodCo.ProdCoId === production.ProdCoId),
    };
  });

  return getProductionsByStartDate(productionList);
};

export const getProductionsByShowCode = async (Code: string, req: NextApiRequest) => {
  const prisma = await getPrismaClient(req);
  return prisma.production.findMany({
    where: {
      Show: {
        Code,
      },
    },
    select: {
      Id: true,
      Code: true,
      IsArchived: true,
      Show: {
        select: {
          Code: true,
        },
      },
    },
  });
};

// Booking List
const productionContentInclude = Prisma.validator<Prisma.ProductionSelect>()({
  Show: true,
  DateBlock: {
    include: {
      Booking: {
        include: {
          Venue: true,
          Performance: true,
        },
      },
      GetInFitUp: true,
      Rehearsal: true,
      Other: {
        include: {
          DateType: true,
        },
      },
    },
  },
});

export type ProductionContent = Prisma.ProductionGetPayload<{
  include: typeof productionContentInclude;
}>;

export const getProductionWithContent = async (Id: number, req: NextApiRequest) => {
  const prisma = await getPrismaClient(req);
  return await prisma.production.findUnique({
    where: {
      Id,
    },
    include: productionContentInclude,
  });
};

export const getProductionsWithContent = async (req: NextApiRequest, Id?: number, excludeArchived = true) => {
  const prisma = await getPrismaClient(req);
  const productions = await prisma.production.findMany({
    where: {
      ...(Id && { Id }),
      ...(excludeArchived && { IsArchived: false }),
    },
    include: productionContentInclude,
  });

  return productions;
};

export type ProductionWithDateblocks = Prisma.ProductionGetPayload<{
  include: typeof productionDateBlockInclude;
}>;

export const getProductionById = async (Id: number, req: NextApiRequest) => {
  const prisma = await getPrismaClient(req);
  return await prisma.production.findUnique({
    where: {
      Id,
    },
    include: productionDateBlockInclude,
  });
};

export const getProductionsAndTasks = async (req: NextApiRequest, ProductionId?: number) => {
  const prisma = await getPrismaClient(req);
  let productionsWithTasks = await prisma.Production.findMany({
    where: {
      IsArchived: false,
      ...(ProductionId && { Id: ProductionId }),
    },
    include: {
      Show: true,
      DateBlock: true,
      ProductionTask: {
        orderBy: {
          StartByWeekNum: 'asc',
        },
        include: {
          ProductionTaskRepeat: {
            select: {
              Id: true,
              FromWeekNum: true,
              ToWeekNum: true,
              Interval: true,
            },
          },
        },
      },
    },
  });
  productionsWithTasks = productionsWithTasks.map((production) => {
    return {
      ...production,
      ProductionTask: production.ProductionTask.map((task) => {
        const tempTask = {
          ...task,
          TaskCompletedDate: task.TaskCompletedDate != null ? task.TaskCompletedDate.toISOString() : null,
          TaskRepeatFromWeekNum: task.ProductionTaskRepeat?.FromWeekNum || null,
          TaskRepeatToWeekNum: task.ProductionTaskRepeat?.ToWeekNum || null,
          RepeatInterval: task.ProductionTaskRepeat?.Interval || null,
        };
        return omit(tempTask, ['ProductionTaskRepeat']);
      }),
    };
  });

  productionsWithTasks = productionsWithTasks.map((production) => {
    const { StartDate, EndDate } = production.DateBlock.find((DateBlock) => DateBlock.Name === 'Production') || {};
    const weekNumsList = production.ProductionTask.map((ProductionTask) => [
      ProductionTask.CompleteByWeekNum,
      ProductionTask.StartByWeekNum,
    ]).flat();
    const WeekNumToDateMap = getWeekNumsToDateMap(StartDate, EndDate, Array.from(new Set(weekNumsList)));
    return { ...production, WeekNumToDateMap };
  });
  return getProductionsByStartDate(productionsWithTasks);
};

export const getAllProductionRegions = async (req: NextApiRequest) => {
  try {
    const prisma = await getPrismaClient(req);
    return prisma.ProductionRegion.findMany({
      orderBy: {
        PRProductionId: 'asc',
      },
    });
  } catch (Exception) {
    console.log(Exception);
    return [];
  }
};

export const getAllCurrencylist = async (): Promise<UICurrency[]> => {
  const currencyList = await master.currency.findMany({});
  return currencyList.map(({ CurrencyCode, CurrencyName, CurrencySymbolUnicode }) => ({
    code: CurrencyCode,
    name: CurrencyName,
    symbolUnicode: CurrencySymbolUnicode,
  }));
};
