import { useCallback, useEffect, useState } from 'react';
import useDebounce from 'hooks/useDebounce';
import Layout from 'components/Layout';
import VenueFilter from 'components/venues/VenueFilter';
import VenueTable from 'components/venues/VenueTable';
import AddEditVenueModal from 'components/venues/modal/AddEditVenueModal';

import {
  getAllVenueFamilyList,
  getAllVenueRoles,
  getAllVenuesMin,
  getUniqueVenueCountrylist,
  getUniqueVenueTownlist,
} from 'services/venueService';
import { GetServerSideProps, InferGetServerSidePropsType, NextApiRequest } from 'next';
import { getProductionJumpState } from 'utils/getProductionJumpState';
import axios from 'axios';
import { defaultVenueFilters } from 'config/bookings';
import { objectify } from 'radash';
import { intialState as intialProductionJumpState } from 'state/booking/productionJumpState';
import { transformToOptions } from 'utils';
import { SelectOption } from 'components/core-ui-lib/Select/Select';
import { getAllCurrencyList } from 'services/globalService';
import { UiTransformedVenue, transformVenues } from 'utils/venue';
import { initialVenueState } from 'config/venue';
import Spinner from 'components/core-ui-lib/Spinner';

export type VenueFilters = {
  venueId: string;
  town: string;
  country: number;
  productionId: string;
  search: string;
};
export default function Index(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const {
    venueTownOptionsList = [],
    venueCountryOptionList = [],
    venueFamilyOptionList = [],
    venueRoleOptionList = [],
  } = props;
  const [filters, setFilters] = useState<VenueFilters>(defaultVenueFilters);
  const debouncedFilters = useDebounce(filters, 1000);
  const { productionId, town, country, search } = debouncedFilters;
  const [venues, setVenues] = useState([]);
  const [editVenueContext, setEditVenueContext] = useState<UiTransformedVenue>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchVenues = useCallback(async (payload) => {
    console.log('fetching venues', payload);
    const { productionId, town, country, searchQuery } = payload || {};
    if (!(productionId || town || country || searchQuery)) {
      setVenues([]);
      return;
    }
    setVenues(null);
    try {
      const { data } = await axios.post('/api/venue/list', { ...payload });
      const venusList = transformVenues(data);
      setVenues(venusList);
    } catch (err) {
      setVenues([]);
    }
  }, []);

  useEffect(() => {
    (async () => {
      await fetchVenues({ productionId, town, country, searchQuery: search, limit: productionId ? null : 50 });
    })();
  }, [country, productionId, search, town, fetchVenues]);

  const updateFilters = useCallback(
    (change) => {
      setFilters((prevFilters) => ({ ...prevFilters, ...change }));
    },
    [setFilters],
  );

  const onSelectVenue = useCallback(
    (venue: UiTransformedVenue) => {
      setEditVenueContext(venue);
    },
    [setEditVenueContext],
  );

  const onModalClose = useCallback(() => {
    setEditVenueContext(null);
  }, [setEditVenueContext]);

  return (
    <>
      {isLoading && (
        <div
          data-testid="tech-specs-page-spinner"
          className="inset-0 absolute bg-white bg-opacity-50 z-50 flex justify-center items-center"
        >
          <Spinner size="lg" />
        </div>
      )}
      <Layout title="Venues | Segue" flush>
        <div className="max-w-5xl mx-auto">
          <div className="mb-4">
            <VenueFilter
              townOptions={venueTownOptionsList}
              countryOptions={venueCountryOptionList}
              onFilterChange={updateFilters}
              filters={filters}
              showVenueModal={() => setEditVenueContext(initialVenueState)}
            />
          </div>
          <VenueTable onSelectVenue={onSelectVenue} items={venues} />
        </div>
      </Layout>
      {!!editVenueContext && (
        <AddEditVenueModal
          venue={editVenueContext}
          venueFamilyOptionList={venueFamilyOptionList}
          countryOptions={venueCountryOptionList}
          venueRoleOptionList={venueRoleOptionList}
          visible={!!editVenueContext}
          onClose={onModalClose}
          fetchVenues={fetchVenues}
          setIsLoading={setIsLoading}
        />
      )}
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const results = await Promise.allSettled([
    getProductionJumpState(ctx, 'bookings'),
    getUniqueVenueTownlist(ctx.req as NextApiRequest),
    getUniqueVenueCountrylist(ctx.req as NextApiRequest),
    getAllCurrencyList(),
    getAllVenueFamilyList(ctx.req as NextApiRequest),
    getAllVenuesMin(ctx.req as NextApiRequest),
    getAllVenueRoles(ctx.req as NextApiRequest),
  ]);

  const productionJump = results[0].status === 'fulfilled' ? results[0].value : intialProductionJumpState;
  const venueTownOptionsList: SelectOption[] =
    results[1].status === 'fulfilled'
      ? (results[1] as PromiseFulfilledResult<any>).value.map((t) => ({ value: t, text: t }))
      : [];

  const venueCountryOptionList: SelectOption[] =
    results[2].status === 'fulfilled' ? transformToOptions(results[2].value, 'Name', 'Id') : [];
  // console.log("countries at the start", venueCountryOptionList)

  const venueCurrencyOptionList: SelectOption[] =
    results[3].status === 'fulfilled'
      ? transformToOptions(
          results[3].value,
          null,
          'CurrencyCode',
          (item) => item.CurrencyCode + ' ' + item.CurrencyName,
        )
      : [];

  const venueFamilyOptionList: SelectOption[] =
    results[4].status === 'fulfilled' ? transformToOptions(results[4].value, 'Name', 'Id') : [];

  const venues = results[5].status === 'fulfilled' ? results[5].value : [];

  const venue = objectify(
    venues,
    (v) => v.Id,
    (v: any) => {
      const Town: string | null = v.VenueAddress.find((address: any) => address?.TypeName === 'Main')?.Town ?? null;
      return { Id: v.Id, Code: v.Code, Name: v.Name, Town, Seats: v.Seats, Count: 0 };
    },
  );
  const venueRoleOptionList: SelectOption[] =
    results[6].status === 'fulfilled' ? transformToOptions(results[6].value, 'Name', 'Id') : [];

  const initialState = {
    global: {
      productionJump,
    },
    booking: {
      venue,
    },
  };

  return {
    props: {
      venueTownOptionsList,
      venueCountryOptionList,
      venueCurrencyOptionList,
      venueFamilyOptionList,
      venueRoleOptionList,
      initialState,
    },
  };
};
