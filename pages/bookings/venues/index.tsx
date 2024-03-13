import Layout from 'components/Layout';
import VenueFilter from 'components/venues/VenueFilter';
import VenueTable from 'components/venues/VenueTable';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { getUniqueVenueCountrylist, getUniqueVenueTownlist } from 'services/venueService';
import { filterVenueState } from 'state/booking/filterVenueState';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getProductionJumpState } from 'utils/getProductionJumpState';
import { getAccountIdFromReq } from 'services/userService';
import { InitialState } from 'lib/recoil';
import axios from 'axios';

export default function Index(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { venueTownList = [], venueCountryList = [] } = props;
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);
  const venuesFilter = useRecoilValue(filterVenueState);
  const townOptions = useMemo(() => venueTownList.map(({ Town }) => ({ text: Town, value: Town })), [venueTownList]);
  const countryOptions = useMemo(
    () => venueCountryList.map(({ Country }) => ({ text: Country, value: Country })),
    [venueCountryList],
  );

  const fetchVenues = useCallback(async (payload) => {
    setLoading(true);
    const { data } = await axios.post('/api/venue/list', {
      ...payload,
    });
    console.log(loading);
    const venusList = data?.map(({ Code, Id, Name, Seats, VenueAddress }) => ({
      Code,
      Id,
      Name,
      Seats,
      Town: VenueAddress?.[0]?.Town,
    }));
    setVenues(venusList);
    setLoading(false);
  }, []);
  useEffect(() => {
    const { productionId, town, country } = venuesFilter;
    if (productionId || town || country) {
      fetchVenues({ productionId, town, country });
    }
  }, [venuesFilter]);

  return (
    <Layout title="Venues | Segue" flush>
      <div className="mb-8">
        <VenueFilter townOptions={townOptions} countryOptions={countryOptions} />
      </div>
      <VenueTable items={venues} />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const AccountId = await getAccountIdFromReq(ctx.req);
  const productionJump = await getProductionJumpState(ctx, 'bookings', AccountId);
  const venueTownList = await getUniqueVenueTownlist();
  const venueCountryList = await getUniqueVenueCountrylist();
  const initialState: InitialState = {
    global: {
      productionJump,
    },
  };
  return {
    props: {
      venueTownList,
      venueCountryList,
      initialState,
    },
  };
};
