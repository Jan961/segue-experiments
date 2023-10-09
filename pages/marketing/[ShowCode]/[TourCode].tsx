import Layout from 'components/Layout'
import { useMemo, useState } from 'react'
import MarketingPanel from 'components/marketing/MarketingPanel'
import GlobalToolbar from 'components/toolbar'
import { GetServerSideProps } from 'next'
import { InitialState } from 'lib/recoil'
import { getSaleableBookings } from 'services/bookingService'
import { BookingJump, bookingJumpState } from 'state/marketing/bookingJumpState'
import { bookingMapperWithVenue, venueRoleMapper } from 'lib/mappers'
import { getRoles } from 'services/contactService'
import { getTourJumpState } from 'utils/getTourJumpState'
import { getAccountId, getEmailFromReq } from 'services/userService'
import { useRecoilValue } from 'recoil'

type Props = {
  initialState: InitialState
};

const Index = ({ initialState }: Props) => {
  const [searchFilter, setSearchFilter] = useState('')
  const bookingJump = useRecoilValue(bookingJumpState)
  const matching = useMemo(() => bookingJump.bookings?.filter?.(x => x.Id === bookingJump.selected)?.[0], [bookingJump])
  const onIframeClick = () => {
    window.open(`https://${matching?.Venue?.Website}`, '_blank')
  }
  return (
    <Layout title="Marketing | Segue">
      <div className="flex flex-col px-4 flex-auto">
        <div className='flex justify-between items-start'>
          <GlobalToolbar
            searchFilter={searchFilter}
            setSearchFilter={setSearchFilter}
            title={'Marketing'}>
          </GlobalToolbar>
          <div className="flex">
            <div className='flex flex-col items-end justify-between'>
              {matching?.Venue?.TechSpecsURL && <a
                className="text-primary-green whitespace-pre transition-all duration-75 cursor-pointer py-3 bg-white rounded-md font-bold px-4 shadow-md mr-5 "
                href={`https://${matching.Venue.TechSpecsURL}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {matching.Venue.TechSpecsURL}
              </a>}
              {matching?.Venue?.Website && <a
                className="text-primary-green whitespace-pre transition-all duration-75 cursor-pointer py-3 bg-white rounded-md font-bold px-4 shadow-md  mr-5 "
                href={`https://${matching.Venue.Website}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Landing Page
              </a>}
            </div>
            <div className="w-[400px] h-[150px] cursor-pointer" onClick={onIframeClick}>
              {matching?.Venue?.Website && <iframe
                className="pointer-events-none"
                id="Venue"
                width="400"
                height="auto"
                style={{ transform: 'scale(0.25)', transformOrigin: 'top left', width: '1600px', height: '600px' }}
                src={`https://${matching?.Venue?.Website}`}
              >
              </iframe>}
            </div>
          </div>
        </div>
        <MarketingPanel />
      </div>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const email = await getEmailFromReq(ctx.req)
  const AccountId = await getAccountId(email)

  const tourJump = await getTourJumpState(ctx, 'marketing', AccountId)

  const TourId = tourJump.selected
  // TourJumpState is checking if it's valid to access by accountId
  if (!TourId) return { notFound: true }

  const bookings:any[] = await getSaleableBookings(TourId)
  // bookings.filter((booking:any) => booking?.DateBlock?.TourId === TourId)?.[0]?.Id ||
  const selected = null
  const venueRoles = await getRoles()
  const bookingJump: BookingJump = {
    selected,
    bookings: bookings.map(bookingMapperWithVenue)
  }

  const initialState: InitialState = {
    global: {
      tourJump
    },
    marketing: {
      bookingJump,
      venueRole: venueRoles.map(venueRoleMapper)
    }
  }

  return { props: { initialState } }
}

export default Index
