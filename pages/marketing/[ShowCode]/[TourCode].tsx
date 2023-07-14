import Layout from 'components/Layout'
import { useState } from 'react'
import MarketingPanel from 'components/marketing/MarketingPanel'
import GlobalToolbar from 'components/toolbar'
import { GetServerSideProps } from 'next'
import { getToursByShowCode } from 'services/TourService'
import { TourJump } from 'state/booking/tourJumpState'
import { InitialState } from 'lib/recoil'
import { getSaleableBookings } from 'services/bookingService'
import { BookingJump } from 'state/marketing/bookingJumpState'
import { bookingMapperWithVenue } from 'lib/mappers'

type Props = {
  initialState: InitialState
};

const Index = ({ initialState }: Props) => {
  const [searchFilter, setSearchFilter] = useState('')

  return (
    <Layout title="Marketing | Segue">
      <div className="flex flex-col px-4 flex-auto">
        <GlobalToolbar
          searchFilter={searchFilter}
          setSearchFilter={setSearchFilter}
          title={'Marketing'} />
        <MarketingPanel />
      </div>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ShowCode, TourCode } = ctx.params

  const toursRaw = await getToursByShowCode(ShowCode as string)

  const tourJump: TourJump = {
    tours: toursRaw.map((t: any) => (
      {
        Id: t.Id,
        Code: t.Code,
        IsArchived: t.IsArchived,
        ShowCode: t.Show.Code
      })),
    selected: TourCode as string
  }

  const tourId = tourJump.tours.filter(x => x.Code === TourCode)[0].Id

  const bookings = await getSaleableBookings(tourId)

  const bookingJump: BookingJump = {
    selected: bookings[0] ? bookings[0].Id : undefined,
    bookings: bookings.map(bookingMapperWithVenue)
  }

  console.log(bookings[0].Venue)

  const initialState: InitialState = {
    global: {
      tourJump
    },
    marketing: {
      bookingJump
    }
  }

  return { props: { initialState } }
}

export default Index
