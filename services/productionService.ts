import prisma from 'lib/prisma';
import { Prisma } from '@prisma/client';
import { showProductionMapper, productionEditorMapper } from 'lib/mappers';
import { getShowWithProductionsById } from './ShowService';
import { getAccountId, getEmailFromReq } from './userService';
import { ProductionDTO } from 'interfaces';
import { getProductionsByStartDate } from 'utils/getProductionsByStartDate';
import { getWeekNumsToDateMap } from 'utils/getDateFromWeekNum';

// Edit Production Page
const productionDateBlockInclude = Prisma.validator<Prisma.ProductionSelect>()({
  Show: true,
  DateBlock: true,
});

export const getActiveProductions = async (accountId: number) => {
  const productions = await prisma.production.findMany({
    where: {
      IsArchived: false,
      Show: {
        AccountId: accountId,
      },
    },
    include: productionDateBlockInclude,
  });
  return getProductionsByStartDate(productions);
};

export interface AllProductionPageProps {
  productions: ProductionDTO[];
}

export const getAllProductionPageProps = async (ctx: any) => {
  const email = await getEmailFromReq(ctx.req);
  const AccountId = await getAccountId(email);
  // console.log("====", prisma)
  const productionsRaw = await prisma.Production.findMany({
    where: {
      Show: {
        is: {
          AccountId,
        },
      },
    },
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

  const show = await getShowWithProductionsById(showRaw.Id);
  const productions = showProductionMapper(show);

  return { props: { productions, code: show.Code, name: show.Name } };
};

export const lookupProductionId = async (ShowCode: string, ProductionCode: string, AccountId: number) => {
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

export const getAllProductions = async (AccountId: number) => {
  const productions = await prisma.production.findMany({
    select: {
      Id: true,
      Code: true,
      IsArchived: true,
      Show: {
        select: {
          Code: true,
          Name: true,
        },
      },
      DateBlock: true,
    },
    where: {
      Show: {
        is: {
          AccountId,
        },
      },
    },
  });
  return getProductionsByStartDate(productions);
};

export const getProductionsByShowCode = (Code: string) => {
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

export const getProductionWithContent = async (Id: number) => {
  return await prisma.production.findUnique({
    where: {
      Id,
    },
    include: productionContentInclude,
  });
};

export const getProductionsWithContent = async (Id?: number, excludeArchived = true) => {
  return await prisma.production.findMany({
    where: {
      ...(Id && { Id }),
      ...(excludeArchived && { IsArchived: false }),
    },
    include: productionContentInclude,
  });
};

export type ProductionWithDateblocks = Prisma.ProductionGetPayload<{
  include: typeof productionDateBlockInclude;
}>;

export const getProductionById = async (Id: number) => {
  return await prisma.production.findUnique({
    where: {
      Id,
    },
    include: productionDateBlockInclude,
  });
};

export const getProductionsAndTasks = async (AccountId: number, ProductionId?: number) => {
  let productionsWithTasks = await prisma.production.findMany({
    where: {
      IsArchived: false,
      ...(ProductionId && { Id: ProductionId }),
      Show: {
        is: {
          AccountId,
        },
      },
    },
    include: {
      Show: true,
      DateBlock: true,
      ProductionTask: {
        orderBy: {
          StartByWeekNum: 'asc',
        },
      },
    },
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
