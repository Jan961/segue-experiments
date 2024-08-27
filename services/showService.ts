import { Prisma } from 'prisma/generated/prisma-client';
import { ShowDTO } from 'interfaces';
import { showMapper } from 'lib/mappers';
import client from 'lib/prisma';
import master from 'lib/prisma_master';
import { getAccountId, getEmailFromReq } from './userService';

export const getShows = (AccountId: number) => {
  return client.show.findMany({ where: { AccountId, IsDeleted: false } });
};

export interface ShowPageProps {
  shows: ShowDTO[];
}

export const getShowPageProps = async (ctx: any) => {
  const email = await getEmailFromReq(ctx.req);
  const accountId = await getAccountId(email);
  const shows = await getShows(accountId);

  return {
    props: {
      shows: shows.map(showMapper),
    },
  };
};

const showInclude = Prisma.validator<Prisma.ShowInclude>()({
  Production: {
    include: {
      Show: true,
      DateBlock: true,
      ProductionRegion: true,
      File: true,
      ConversionRate: true,
    },
  },
});

export type ShowWithProductions = Prisma.ShowGetPayload<{
  include: typeof showInclude;
}>;

export const getShowWithProductionsById = async (Id: number) => {
  return await client.show.findFirst({
    where: {
      Id,
    },
    include: showInclude,
  });
};

export const getShowById = async (Id: number) => {
  return await client.show.findFirst({
    where: {
      Id,
    },
  });
};

export const lookupShowCode = async (Code: string, AccountId: number) => {
  const show = await client.show.findUnique({
    where: {
      AccountId_Code: {
        Code,
        AccountId,
      },
    },
    select: {
      Id: true,
    },
  });

  return show ? show.Id : undefined;
};

export const getShowsByAccountId = async () => {
  const shows = await client.show.findMany({
    where: {
      OR: [
        {
          Production: {
            some: {
              IsDeleted: false,
            },
          },
        },
        {
          Production: {
            none: {},
          },
        },
      ],
    },
    include: showInclude,
  });

  return shows.slice().sort((a, b) => {
    return a.Name.localeCompare(b.Name);
  });
};

export const getAllProductionCompanyList = async () => {
  const productionCompanies = await master.ProductionCompany.findMany({
    orderBy: {
      ProdCoName: 'asc',
    },
  });
  return productionCompanies.map(({ ProdCoId, ProdCoAccountId, ProdCoName, ProdCoWebSite }) => ({
    id: ProdCoId,
    name: ProdCoName,
    accountId: ProdCoAccountId,
    website: ProdCoWebSite || '',
  }));
};
