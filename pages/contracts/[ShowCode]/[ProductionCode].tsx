import Layout from 'components/Layout';
import { GetServerSideProps } from 'next';
import { useState } from 'react';
import ContractDetailsForm from 'components/contracts/contractDetailsForm';
import ContractListingPanel from 'components/contracts/contractListingPanel';
import { ProductionContent, getProductionWithContent } from 'services/productionService';
import GlobalToolbar from 'components/toolbar';
import { bookingMapper } from 'lib/mappers';
import { BookingDTO } from 'interfaces';
import { getProductionJumpState } from 'utils/getProductionJumpState';
import { getAccountId, getEmailFromReq } from 'services/userService';

interface ContractsProps {
  bookings: BookingDTO[];
}

const Index = ({ bookings }: ContractsProps) => {
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
          ></ContractListingPanel>
          {activeContractIndex !== null && (
            <ContractDetailsForm
              incrementActiveContractIndex={incrementActiveContractIndex}
              activeContract={bookings[activeContractIndex].Id}
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

  const ProductionId = productionJump.selected;
  // ProductionJumpState is checking if it's valid to access by accountId
  if (!ProductionId) return { notFound: true };

  const production: ProductionContent = await getProductionWithContent(ProductionId);
  const bookings = production.DateBlock.map((x) => x.Booking)
    .flat()
    .map(bookingMapper);

  return { props: { bookings, initialState: { global: { productionJump } } } };
};

export default Index;
