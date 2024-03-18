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
  const [filterVenues, setFilterVenues] = useState([]);
  const venuesFilter = useRecoilValue(filterVenueState);
  const townOptions = useMemo(() => venueTownList.map(({ Town }) => ({ text: Town, value: Town })), [venueTownList]);
  const countryOptions = useMemo(
    () => venueCountryList.map(({ Country }) => ({ text: Country, value: Country })),
    [venueCountryList],
  );

  const fetchVenues = useCallback(async (payload) => {
    const { data } = await axios.post('/api/venue/list', {
      ...payload,
    });

    const venusList = data?.map(({ Code, Id, Name, Seats, VenueAddress }) => ({
      Code,
      Id,
      Name,
      Seats,
      Town: VenueAddress?.[0]?.Town,
    }));
    setVenues(venusList);
    setFilterVenues(venusList);
  }, []);

  useEffect(() => {
    const { productionId, town, country } = venuesFilter;
    if (productionId || town || country) {
      fetchVenues({ productionId, town, country });
    } else {
      setFilterVenues([]);
    }
  }, [venuesFilter]);

  const handleSearchInputChange = (e) => {
    const serchText = e.target.value;

    if (serchText === '') {
      setFilterVenues(venues);
    } else {
      const updatedVenues = venues.filter(({ Name }) => {
        return Name.includes(serchText);
      });

      setFilterVenues(updatedVenues);
    }
  };

  return (
    <Layout title="Venues | Segue" flush>
      <div className="mb-8">
        <VenueFilter
          townOptions={townOptions}
          countryOptions={countryOptions}
          onSearchInputChange={handleSearchInputChange}
        />
      </div>

      <VenueTable items={filterVenues} />
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
