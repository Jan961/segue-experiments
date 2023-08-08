import Layout from 'components/Layout'
import { GetServerSideProps } from 'next'
import { useState } from 'react'
import ContractDetailsForm from 'components/contracts/contractDetailsForm'
import ContractListingPanel from 'components/contracts/contractListingPanel'
import { TourContent, getTourWithContent, lookupTourId } from 'services/TourService'
import { ParsedUrlQuery } from 'querystring'
import GlobalToolbar from 'components/toolbar'
import { bookingMapper } from 'lib/mappers'
import { BookingDTO } from 'interfaces'
import { getTourJumpState } from 'utils/getTourJumpState'

interface ContractsProps {
  bookings: BookingDTO[]
}

const Index = ({ bookings }: ContractsProps) => {
  const [activeContractIndex, setActiveContractIndex] = useState<number|null>(null)

  function incrementActiveContractIndex () {
    if (activeContractIndex < (bookings.length + 1)) { setActiveContractIndex(activeContractIndex + 1) }
  }

  return (
    <Layout title="Contracts | Seque">
      <div className="flex flex-auto flex-col w-full">
        <GlobalToolbar
          title={'Contracts'} />
        <div className="flex-row flex">
          <ContractListingPanel
            bookings={bookings}
            activeContractIndex={activeContractIndex}
            setActiveContractIndex={setActiveContractIndex}></ContractListingPanel>
          {activeContractIndex !== null &&
            <ContractDetailsForm
              incrementActiveContractIndex={incrementActiveContractIndex}
              activeContract={bookings[activeContractIndex].Id} />
          }
        </div>
      </div>
    </Layout>
  )
}

interface Params extends ParsedUrlQuery {
  ShowCode: string
  TourCode: string
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ShowCode, TourCode } = ctx.query as Params
  const tourJump = await getTourJumpState(ctx, 'contracts')
  const { Id } = await lookupTourId(ShowCode, TourCode)
  const tour: TourContent = await getTourWithContent(Id)
  const bookings = tour.DateBlock.map(x => x.Booking).flat().map(bookingMapper)

  return { props: { bookings, initialState: { global: { tourJump } } } }
}

export default Index
