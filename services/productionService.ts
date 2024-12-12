import getPrismaClient from 'lib/prisma';
import master from 'lib/prisma_master';
import { Prisma, ProductionRegion } from 'prisma/generated/prisma-client';
import { dateBlockMapper, productionEditorMapper } from 'lib/mappers';

import { ProductionDTO, UICurrency } from 'interfaces';
import { getProductionsByStartDate } from 'utils/getProductionsByStartDate';
import { getWeekNumsToDateMap } from 'utils/getDateFromWeekNum';
import { omit } from 'radash';
import { NextApiRequest } from 'next';
import { getAccountUserByEmailAndOrganisationId, getEmailFromReq, getOrganisationIdFromReq } from './userService';
import { dateTimeToTime } from './dateService';

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
  const productionsRaw = await prisma.production.findMany({
    include: {
      Show: true,
      DateBlock: true,
    },
  });

  const productions = getProductionsByStartDate(productionsRaw).map(productionEditorMapper);

  return { props: { productions } };
};

export const getUserAccessibleProductions = async (req: NextApiRequest, organisationId: string) => {
  const prisma = await getPrismaClient(req);
  const email = await getEmailFromReq(req);
  const accountUser = await getAccountUserByEmailAndOrganisationId(email, organisationId);
  const accountUserProductions = await prisma.accountUserProduction.findMany({
    where: {
      AUPAccUserId: accountUser?.AccUserId,
    },
  });
  return getAllProductions(
    req,
    accountUserProductions.map((production) => production.AUPProductionId),
  );
};

export const getAllProductions = async (req: NextApiRequest, productionIdList?: number[]) => {
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
      ...(productionIdList && { Id: { in: productionIdList } }),
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
  const productionsWithTasks = await prisma.production.findMany({
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

  let results = null;
  results = productionsWithTasks.map((production) => {
    return {
      ...production,
      ProductionTask: production.ProductionTask.map((task) => {
        const tempTask = {
          ...task,
          TaskCompletedDate: task.TaskCompletedDate ? task.TaskCompletedDate.toISOString() : null,
          TaskRepeatFromWeekNum: task.ProductionTaskRepeat?.FromWeekNum || null,
          TaskRepeatToWeekNum: task.ProductionTaskRepeat?.ToWeekNum || null,
          RepeatInterval: task.ProductionTaskRepeat?.Interval || null,
        };
        return omit(tempTask, ['ProductionTaskRepeat']);
      }),
    };
  });

  results = productionsWithTasks.map((production) => {
    const { StartDate, EndDate } = production.DateBlock.find((DateBlock) => DateBlock.Name === 'Production') || {};
    const weekNumsList = production.ProductionTask.map((ProductionTask) => [
      ProductionTask.CompleteByWeekNum,
      ProductionTask.StartByWeekNum,
    ]).flat();
    const WeekNumToDateMap = getWeekNumsToDateMap(
      StartDate.toISOString(),
      EndDate.toISOString(),
      Array.from(new Set(weekNumsList)),
    );
    return { ...production, WeekNumToDateMap };
  });
  return getProductionsByStartDate(results);
};

export const getAllProductionRegions = async (req: NextApiRequest) => {
  try {
    const prisma = await getPrismaClient(req);
    return prisma.productionRegion.findMany({
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

export const transformProductions = (productionsRaw, allProductionRegions: ProductionRegion[]) => {
  const productions = productionsRaw
    .map((t) => {
      let db = t.DateBlock.find((block) => block.IsPrimary);
      if (db) {
        db = dateBlockMapper(db);
      }

      return {
        Id: t.Id,
        Code: t.Code,
        IsArchived: t.IsArchived,
        ShowCode: t.Show.Code,
        ShowName: t.Show.Name,
        StartDate: db?.StartDate || null,
        EndDate: db?.EndDate || null,
        ShowRegionId: allProductionRegions
          ? allProductionRegions.find((pair) => pair.PRProductionId === t.Id)?.PRRegionId
          : null,
        RunningTime: t.RunningTime ? dateTimeToTime(t.RunningTime.toISOString()) : null,
        RunningTimeNote: t.RunningTimeNote,
        SalesFrequency: t.SalesFrequency,
        ProductionCompany: t.ProductionCompany || '',
        SalesEmail: t.SalesEmail,
      };
    })
    .sort((a, b) => {
      if (a.IsArchived !== b.IsArchived) {
        return a.IsArchived ? 1 : -1;
      }
      return new Date(a.StartDate).valueOf() - new Date(b.StartDate).valueOf();
    });

  return productions;
};

export const checkProductionAccess = async (req: NextApiRequest, productionId: number) => {
  const prisma = await getPrismaClient(req);
  const email = await getEmailFromReq(req);
  const organisationId = await getOrganisationIdFromReq(req);
  const accountUser = await getAccountUserByEmailAndOrganisationId(email, organisationId);
  const access = await prisma.accountUserProduction.findFirst({
    where: {
      AUPAccUserId: accountUser?.AccUserId,
      AUPProductionId: productionId,
    },
  });
  return access;
};
