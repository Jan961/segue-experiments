import { Venue, VenueAddress, VenueBarredVenue, VenueContact } from 'prisma/generated/prisma-client';
import getPrismaClient from 'lib/prisma';
import { omit } from 'radash';
import { isNullOrEmpty } from 'utils';
import { NextApiRequest } from 'next';

export const getAllVenuesMin = async (req: NextApiRequest) => {
  const prisma = await getPrismaClient(req);
  return prisma.venue.findMany({
    where: {
      IsDeleted: false,
    },
    select: {
      Id: true,
      Name: true,
      Code: true,
      Seats: true,
      VenueAddress: {
        select: {
          Town: true,
          TypeName: true,
          CountryId: true,
          Country: {
            select: {
              CurrencyCode: true,
            },
          },
        },
      },
    },
  });
};

export const getAllVenues = async (req: NextApiRequest) => {
  const prisma = await getPrismaClient(req);
  return prisma.venue.findMany({
    where: {
      IsDeleted: false,
    },
    // select: {
    //   VenueAddress: {
    //     Town: true,
    //   },
    // },
  });
};

export const getUniqueVenueTownlist = async (req: NextApiRequest) => {
  const prisma = await getPrismaClient(req);
  const addresses = await prisma.venueAddress.groupBy({
    by: ['Town'],
    where: {
      Town: {
        not: null,
      },
    },
  });

  return addresses.map((a) => a.Town);
};

export const getUniqueVenueCountrylist = async (req: NextApiRequest) => {
  const prisma = await getPrismaClient(req);
  return await prisma.country.findMany({});
};

export const getCountryRegions = async (req: NextApiRequest) => {
  const prisma = await getPrismaClient(req);
  return await prisma.countryInRegion.findMany({
    orderBy: {
      CountryId: 'asc',
    },
  });
};

export const getVenueCurrencies = async (req: NextApiRequest) => {
  console.log(req.query);
  /* const prisma = await getPrismaClient(req);
  try {
    const venueCurrency = await prisma.venue.findMany({
      select: {
        Id: true,
        Currency: {
          select: { SymbolUnicode: true },
        },
      },
    });
    const attempt = venueCurrency.reduce((dict, item) => {
      dict[item.Id] = item.Currency.SymbolUnicode;
      return dict;
    });

    return attempt;
  } catch (exception) {
    return '';
  } */
  return [];
};

export interface DistanceStop {
  Date: string;
  Ids: number[];
}

interface DistanceDTO {
  VenueId: number;
  Mins?: number;
  Miles?: number;
}

export interface DateDistancesDTO {
  Date: string;
  option: DistanceDTO[];
}

// If slow. Optimisation possible (Hash lookup)
export const getDistances = async (stops: DistanceStop[], req: NextApiRequest): Promise<DateDistancesDTO[]> => {
  const ids = stops.map((x) => x.Ids).flat();
  const prisma = await getPrismaClient(req);
  // Get the distances for all possible combinations (optimisation possible)
  const distances = await prisma.venueVenueTravelView.findMany({
    where: {
      Venue1Id: {
        in: ids,
      }, // And
      Venue2Id: {
        in: ids,
      },
      Mileage: { not: null },
      TimeMins: { not: null },
    },
  });

  // Hold the previous stop for distance lookup
  let prev = null;

  return stops.reverse().map((stop: DistanceStop) => {
    if (!prev || prev.Ids.length > 1) {
      // If the last stop has multiple options, we don't know which
      prev = stop;
      return { Date: stop.Date, option: stop.Ids.map((id) => ({ VenueId: id, Miles: null, Mins: null })) };
    }
    const prevIdsAsString = prev.Ids.join(',');
    return {
      Date: stop.Date,
      option: stop.Ids.map((id: number) => {
        // Get any distances that match (optimisation possible)
        const match = distances.filter(
          (x) =>
            (x.Venue2Id === id && x.Venue1Id === prev.Ids[0] && !isNullOrEmpty(x.Mileage)) ||
            (x.Venue1Id === id && x.Venue2Id === prev.Ids[0] && !isNullOrEmpty(x.Mileage)),
        )[0];
        prev = stop;

        return prevIdsAsString === stop.Ids.join(',')
          ? {
              VenueId: id,
              Miles: match?.Mileage,
              Mins: match?.TimeMins,
            }
          : {
              VenueId: id,
              Miles: match?.Mileage ? match.Mileage : -1,
              Mins: match?.TimeMins ? match.TimeMins : -1,
            };
      }),
    };
  });
};

export const getDistance = async (stop: DistanceStop, req: NextApiRequest): Promise<DateDistancesDTO> => {
  const [id1, id2] = stop.Ids;

  if (!id1 || !id2 || id1 === id2) {
    return { Date: stop.Date, option: [{ VenueId: id1, Mins: null, Miles: null }] };
  }
  const prisma = await getPrismaClient(req);
  // Get the distances for all possible combinations (optimisation possible)
  const distance = await prisma.venueVenueTravelView.findMany({
    where: {
      OR: [
        {
          Venue1Id: id1,
          Venue2Id: id2,
        },
        {
          Venue1Id: id2,
          Venue2Id: id1,
        },
      ],
    },
  });

  const { Venue1Id, TimeMins, Mileage } = distance[0];
  return { Date: stop.Date, option: [{ VenueId: Venue1Id, Mins: TimeMins, Miles: Mileage }] };
};

export const getAllVenueFamilyList = async (req: NextApiRequest) => {
  const prisma = await getPrismaClient(req);
  return prisma.venueFamily.findMany({
    orderBy: {
      Name: 'asc',
    },
  });
};

export const createVenue = async (
  tx,
  venue: Partial<Venue>,
  addresses: Partial<VenueAddress>[],
  venueContacts?: Partial<VenueContact & { RoleName?: string }>[],
  barredVenues?: Partial<VenueBarredVenue>[],
) => {
  const contacts: Partial<VenueContact>[] = [];
  if (venueContacts) {
    for (let contact of venueContacts) {
      // Check if RoleId is missing and RoleName is provided
      if (!contact.VenueRoleId && contact.RoleName) {
        // Attempt to find existing role by name or create a new one
        const role = await tx.venueRole.upsert({
          where: { Name: contact.RoleName },
          create: { Name: contact.RoleName, IsStandard: false },
          update: {},
        });
        // Assign the RoleId to the contact data
        contact.VenueRoleId = role.Id;
      }
      contact = omit(contact, ['RoleName']);
      contacts.push(contact);
    }
  }
  return tx.venue.create({
    data: {
      ...venue,
      ...(addresses && {
        VenueAddress: {
          create: addresses,
        },
      }),
      ...(contacts && {
        VenueContact: {
          create: contacts,
        },
      }),
      ...(barredVenues && {
        VenueBarredVenue_VenueBarredVenue_VBVVenueIdToVenue: {
          create: barredVenues,
        },
      }),
    },
  });
};

export const updateVenue = async (
  tx,
  VenueId: number,
  updatedVenue: Partial<Venue>,
  addresses?: Partial<VenueAddress>[],
  barredVenues?: Partial<VenueBarredVenue>[],
  venueContacts?: Partial<VenueContact & { RoleName?: string }>[],
) => {
  // First handle the venue contacts to ensure roles are set up properly
  const contacts: Partial<VenueContact>[] = [];
  if (venueContacts) {
    for (let contact of venueContacts) {
      // Check if RoleId is missing and RoleName is provided
      if (!contact.VenueRoleId && contact.RoleName) {
        // Attempt to find existing role by name or create a new one
        const role = await tx.venueRole.upsert({
          where: { Name: contact.RoleName },
          create: { Name: contact.RoleName, IsStandard: false },
          update: {},
        });
        // Assign the RoleId to the contact data
        contact.VenueRoleId = role.Id;
      }
      contact = omit(contact, ['RoleName']);
      contacts.push(contact);
    }
  }
  return tx.venue.update({
    where: {
      ...(VenueId && { Id: VenueId }),
    },
    data: {
      ...updatedVenue,
      ...(addresses && {
        VenueAddress: {
          upsert: addresses.map((address) => ({
            where: {
              Id: address?.Id || -1,
            },
            create: {
              ...address,
            },
            update: {
              ...address,
            },
          })),
        },
      }),
      ...(barredVenues && {
        VenueBarredVenue_VenueBarredVenue_VBVVenueIdToVenue: {
          upsert: barredVenues.map(({ Id, BarredVenueId }) => ({
            where: {
              Id: Id || -1,
            },
            create: {
              BarredVenueId,
            },
            update: {
              BarredVenueId,
            },
          })),
        },
      }),
      ...(contacts.length && {
        VenueContact: {
          upsert: contacts.map((contact) => ({
            where: {
              Id: contact.Id || -1,
            },
            create: {
              ...contact,
            },
            update: {
              ...contact,
            },
          })),
        },
      }),
    },
    include: {
      VenueAddress: true,
      VenueContact: true,
      VenueBarredVenue_VenueBarredVenue_VBVVenueIdToVenue: true,
    },
  });
};

export const getAllVenueRoles = async (req: NextApiRequest) => {
  const prisma = await getPrismaClient(req);
  return prisma.venueRole.findMany({
    where: {
      IsStandard: true,
    },
  });
};
