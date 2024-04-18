import Layout from 'components/Layout';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useState } from 'react';
import ContractDetailsForm from 'components/contracts/contractDetailsForm';
import ContractListingPanel from 'components/contracts/contractListingPanel';
import { ProductionContent, getProductionsWithContent } from 'services/productionService';
import GlobalToolbar from 'components/toolbar';
import { bookingMapperWithVenue } from 'lib/mappers';
import { getProductionJumpState } from 'utils/getProductionJumpState';
import { getAccountId, getEmailFromReq } from 'services/userService';

const Index = ({ bookings }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [activeContractIndex, setActiveContractIndex] = useState<number | null>(null);

  function incrementActiveContractIndex() {
    if (activeContractIndex < bookings.length + 1) {
      setActiveContractIndex(activeContractIndex + 1);
    }
  }

  return (
    <Layout title="Contracts | Seque">
      <div className="flex flex-auto flex-col w-full">
        <GlobalToolbar title={'Contracts'} />
        <div className="flex-row flex">
          <ContractListingPanel
            bookings={bookings}
            activeContractIndex={activeContractIndex}
            setActiveContractIndex={setActiveContractIndex}
          />
          {activeContractIndex !== null && (
            <ContractDetailsForm
              incrementActiveContractIndex={incrementActiveContractIndex}
              activeContract={bookings?.[activeContractIndex]?.Id}
            />
          )}
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const email = await getEmailFromReq(ctx.req);
  const AccountId = await getAccountId(email);

  const productionJump = await getProductionJumpState(ctx, 'contracts', AccountId);

  const productions: ProductionContent[] = await getProductionsWithContent();
  let allBookings = [];
  for (const production of productions) {
    const bookings = production.DateBlock.map((x) => x.Booking)
      .flat()
      .map(bookingMapperWithVenue);
    allBookings = [...allBookings, ...bookings];
  }
  allBookings = allBookings.sort((a, b) => new Date(a.Date).getTime() - new Date(b.Date).getTime());
  return { props: { bookings: allBookings, initialState: { global: { productionJump } } } };
};

export default Index;
