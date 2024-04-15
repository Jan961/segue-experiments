import { useCallback, useEffect, useMemo, useState } from 'react';
import Layout from 'components/Layout';
import VenueFilter from 'components/venues/VenueFilter';
import VenueTable from 'components/venues/VenueTable';
import AddEditVenueModal from 'components/venues/modal/AddEditVenueModal';

import { getAllVenueFamilyList, getUniqueVenueCountrylist, getUniqueVenueTownlist } from 'services/venueService';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getProductionJumpState } from 'utils/getProductionJumpState';
import { getAccountIdFromReq } from 'services/userService';
import axios from 'axios';
import { defaultVenueFilters } from 'config/bookings';
import { debounce } from 'radash';
import { intialState as intialProductionJumpState } from 'state/booking/productionJumpState';
import { transformToOptions } from 'utils';
import { SelectOption } from 'components/core-ui-lib/Select/Select';
import { getAllCurrencyList } from 'services/currencyService';
import { UiTransformedVenue, transformVenues } from 'utils/venue';
import { initialVenueState } from 'config/venue';

export type VenueFilters = {
  venueId: string;
  town: string;
  country: string;
  productionId: string;
  search: string;
};
export default function Index(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { venueTownList = [], venueCountryList = [], venueCurrencyOptionList = [], venueFamilyOptionList = [] } = props;
  const [filters, setFilters] = useState<VenueFilters>(defaultVenueFilters);
  const [venues, setVenues] = useState([]);
  const [editVenueContext, setEditVenueContext] = useState<UiTransformedVenue>(null);
  const { productionId, town, country, search } = filters;
  const filterVenues = useMemo(() => debounce({ delay: 1000 }, (payload) => fetchVenues(payload)), []);
  const townOptions = useMemo(() => venueTownList.map(({ Town }) => ({ text: Town, value: Town })), [venueTownList]);
  const countryOptions = useMemo(
    () => venueCountryList.map(({ Country }) => ({ text: Country, value: Country })),
    [venueCountryList],
  );

  const fetchVenues = useCallback(async (payload) => {
    const { productionId, town, country, searchQuery } = payload || {};
    if (!(productionId || town || country || searchQuery)) {
      setVenues([]);
      return;
    }
    setVenues(null);
    try {
      const { data } = await axios.post('/api/venue/list', {
        ...payload,
      });
      const venusList = transformVenues(data);
      setVenues(venusList);
    } catch (err) {
      setVenues([]);
    }
  }, []);

  useEffect(() => {
    filterVenues({ productionId, town, country, searchQuery: search, limit: productionId ? null : 50 });
  }, [productionId, town, country, search]);

  const updateFilters = (change) => {
    setFilters((prevFilters) => ({ ...prevFilters, ...change }));
  };

  const onSelectVenue = useCallback(
    (venue: UiTransformedVenue) => {
      setEditVenueContext(venue);
    },
    [setEditVenueContext],
  );

  return (
    <>
      <Layout title="Venues | Segue" flush>
        <div className="max-w-5xl mx-auto">
          <div className="mb-4">
            <VenueFilter
              townOptions={townOptions}
              countryOptions={countryOptions}
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
          venueCurrencyOptionList={venueCurrencyOptionList}
          visible={!!editVenueContext}
          onClose={() => {
            setEditVenueContext(null);
          }}
        />
      )}
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const accountIdPromise = getAccountIdFromReq(ctx.req);

  const AccountId = await accountIdPromise;

  const results = await Promise.allSettled([
    getProductionJumpState(ctx, 'bookings', AccountId),
    getUniqueVenueTownlist(),
    getUniqueVenueCountrylist(),
    getAllCurrencyList(),
    getAllVenueFamilyList(),
  ]);

  const productionJump = results[0].status === 'fulfilled' ? results[0].value : intialProductionJumpState;
  const venueTownList = results[1].status === 'fulfilled' ? results[1].value : [];
  const venueCountryList = results[2].status === 'fulfilled' ? results[2].value : [];
  const venueCurrencyOptionList: SelectOption[] =
    results[3].status === 'fulfilled'
      ? transformToOptions(results[3].value, null, 'Code', (item) => item.Code + ' ' + item.Name)
      : [];
  console.table(venueCurrencyOptionList);
  const venueFamilyOptionList: SelectOption[] =
    results[4].status === 'fulfilled' ? transformToOptions(results[4].value, 'Name', 'Id') : [];

  const initialState = {
    global: {
      productionJump,
    },
  };

  return {
    props: {
      venueTownList,
      venueCountryList,
      venueCurrencyOptionList,
      venueFamilyOptionList,
      initialState,
    },
  };
};
