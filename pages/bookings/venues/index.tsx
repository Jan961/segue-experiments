import { useCallback, useEffect, useMemo, useState } from 'react';
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
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getProductionJumpState } from 'utils/getProductionJumpState';
import { getAccountIdFromReq } from 'services/userService';
import axios from 'axios';
import { defaultVenueFilters } from 'config/bookings';
import { debounce, objectify } from 'radash';
import { intialState as intialProductionJumpState } from 'state/booking/productionJumpState';
import { transformToOptions } from 'utils';
import { SelectOption } from 'components/core-ui-lib/Select/Select';
import { getAllCurrencyList } from 'services/currencyService';
import { UiTransformedVenue, transformVenues } from 'utils/venue';
import { initialVenueState } from 'config/venue';

export type VenueFilters = {
  venueId: string;
  town: string;
  country: number;
  productionId: string;
  search: string;
};
export default function Index(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const {
    venueTownList = [],
    venueCountryOptionList = [],
    venueFamilyOptionList = [],
    venueRoleOptionList = [],
  } = props;
  const [filters, setFilters] = useState<VenueFilters>(defaultVenueFilters);
  const [venues, setVenues] = useState([]);
  const [editVenueContext, setEditVenueContext] = useState<UiTransformedVenue>(null);
  const { productionId, town, country, search } = filters;
  const filterVenues = useMemo(() => debounce({ delay: 1000 }, (payload) => fetchVenues(payload)), []);
  const townOptions = useMemo(() => venueTownList.map(({ Town }) => ({ text: Town, value: Town })), [venueTownList]);
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

  const refreshTable = useCallback(() => {
    filterVenues({ productionId, town, country, searchQuery: search, limit: productionId ? null : 50 });
  }, [productionId, town, country, search, filterVenues]);

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

  const onModalClose = useCallback(
    (isSuccess?: boolean) => {
      if (isSuccess) {
        refreshTable();
      }
      setEditVenueContext(null);
    },
    [refreshTable, setEditVenueContext],
  );
  return (
    <>
      <Layout title="Venues | Segue" flush>
        <div className="max-w-5xl mx-auto">
          <div className="mb-4">
            <VenueFilter
              townOptions={townOptions}
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
    getAllVenuesMin(),
    getAllVenueRoles(),
  ]);

  const productionJump = results[0].status === 'fulfilled' ? results[0].value : intialProductionJumpState;
  const venueTownList = results[1].status === 'fulfilled' ? results[1].value : [];
  const venueCountryOptionList: SelectOption[] =
    results[2].status === 'fulfilled' ? transformToOptions(results[2].value, 'Name', 'Id') : [];
  const venueCurrencyOptionList: SelectOption[] =
    results[3].status === 'fulfilled'
      ? transformToOptions(results[3].value, null, 'Code', (item) => item.Code + ' ' + item.Name)
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
      venueTownList,
      venueCountryOptionList,
      venueCurrencyOptionList,
      venueFamilyOptionList,
      venueRoleOptionList,
      initialState,
    },
  };
};
