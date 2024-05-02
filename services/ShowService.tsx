import { Prisma } from '@prisma/client';
import { ShowDTO } from 'interfaces';
import { showMapper } from 'lib/mappers';
import prisma from 'lib/prisma';
import { getAccountId, getEmailFromReq } from './userService';

export const getShows = (AccountId: number) => {
  return prisma.show.findMany({ where: { AccountId, IsDeleted: false } });
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
    include: { Show: true, DateBlock: true, ProductionRegion: true },
  },
});

export type ShowWithProductions = Prisma.ShowGetPayload<{
  include: typeof showInclude;
}>;

export const getShowWithProductionsById = async (Id: number) => {
  return await prisma.show.findFirst({
    where: {
      Id,
    },
    include: showInclude,
  });
};

export const getShowById = async (Id: number) => {
  return await prisma.show.findFirst({
    where: {
      Id,
    },
  });
};

export const lookupShowCode = async (Code: string, AccountId: number) => {
  const show = await prisma.show.findUnique({
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

export const getShowsByAccountId = async (AccountId: number) => {
  const shows = await prisma.show.findMany({
    where: { AccountId },
    include: showInclude,
  });

  return shows.slice().sort((a, b) => {
    return a.Name.localeCompare(b.Name);
  });
};
