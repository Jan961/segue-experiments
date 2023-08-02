import Layout from 'components/Layout'
import { GetServerSideProps } from 'next'
import { useState } from 'react'
import ContractDetailsForm from 'components/contracts/contractDetailsForm'
import ContractListingPanel from 'components/contracts/contractListingPanel'
import { TourContent, getTourWithContent, getToursByShowCode, lookupTourId } from 'services/TourService'
import { TourJump } from 'state/booking/tourJumpState'
import { ParsedUrlQuery } from 'querystring'
import GlobalToolbar from 'components/toolbar'
import { bookingMapper } from 'lib/mappers'
import { BookingDTO } from 'interfaces'

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
      <div className=" px-2 sm:px-4 md:px-6 lg:px-12 pt-6 flex flex-auto flex-col w-full">
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
  const toursRaw = await getToursByShowCode(ShowCode as string)

  const tourJump: TourJump = {
    tours: toursRaw.map((t: any) => (
      {
        Code: t.Code,
        IsArchived: t.IsArchived,
        ShowCode: t.Show.Code
      })),
    selected: TourCode
  }

  const { Id } = await lookupTourId(ShowCode, TourCode)
  const tour: TourContent = await getTourWithContent(Id)
  const bookings = tour.DateBlock.map(x => x.Booking).flat().map(bookingMapper)

  return { props: { bookings, initialState: { global: { tourJump } } } }
}

export default Index
