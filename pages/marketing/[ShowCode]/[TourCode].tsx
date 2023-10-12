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
import { useRecoilState } from 'recoil'
import { StyledDialog } from 'components/global/StyledDialog'
import { FormInputText } from 'components/global/forms/FormInputText'
import { FormButtonSubmit } from 'components/global/forms/FormButtonSubmit'
import { Spinner } from 'components/global/Spinner'
import axios from 'axios'

type Props = {
  initialState: InitialState
};

const Index = ({ initialState }: Props) => {
  const [searchFilter, setSearchFilter] = useState('')
  const [bookingJump, setBookingJump] = useRecoilState(bookingJumpState)
  const matching = useMemo(() => bookingJump.bookings?.find?.(x => x.Id === bookingJump.selected), [bookingJump.bookings, bookingJump.selected])
  const [showLandingPageModal, setShowLandingPageModal] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [landingPageUrl, setLandingPageUrl] = useState()
  const onIframeClick = () => {
    window.open(getSanitisedUrl(matching?.Venue?.Website), '_blank')
  }
  const handleSubmit = (e:any) => {
    e?.preventDefault?.()
    setLoading(true)
    updateVenueWebsite(matching?.Venue?.Id)
  }
  const onClose = () => {
    setShowLandingPageModal(false)
    setLoading(false)
  }

  const onVenueWebsiteChange = (e:any) => {
    setLandingPageUrl(e.target.value)
  }

  const updateVenueWebsite = (VenueId:number) => {
    axios.put('/api/venue/update', { Website: landingPageUrl, VenueId })
      .then(() => {
        setShowLandingPageModal(false)
        setBookingJump({
          ...bookingJump,
          bookings: bookingJump.bookings.map(booking => {
            if (booking.Venue.Id === VenueId) {
              return { ...booking, Venue: { ...booking.Venue, Website: landingPageUrl } }
            }
            return booking
          })
        })
      })
      .catch((error) => console.log('Error updating venue website', error))
      .finally(() => {
        setLoading(false)
      })
  }
  const getSanitisedUrl = (url) => {
    if (url.startsWith('https://')) {
      return url
    }
    return `https://${url}`
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
                href={getSanitisedUrl(matching.Venue.TechSpecsURL)}
                target="_blank"
                rel="noopener noreferrer"
              >
                {matching.Venue.TechSpecsURL}
              </a>}
              {matching && <div
                className="text-primary-green whitespace-pre transition-all duration-75 cursor-pointer py-3 bg-white rounded-md font-bold px-4 shadow-md  mr-5 "
                onClick={() => {
                  setShowLandingPageModal(true)
                  setLandingPageUrl(matching?.Venue?.Website || '')
                }}
              >
                Landing Page
              </div>}
            </div>
            <div className="w-[400px] h-[150px] cursor-pointer" onClick={onIframeClick}>
              {matching?.Venue?.Website && <iframe
                className="pointer-events-none"
                id="Venue"
                width="400"
                height="auto"
                style={{ transform: 'scale(0.25)', transformOrigin: 'top left', width: '1600px', height: '600px' }}
                src={getSanitisedUrl(matching?.Venue?.Website)}
              >
              </iframe>}
            </div>
          </div>
          <StyledDialog className='w-1/4 max-w-full relative' open={showLandingPageModal} onClose={onClose} title="Venue Landing Page" width='xl'>
            {loading && <div className="w-full h-full absolute left-0 top-0 bg-white flex items-center opacity-95"><Spinner className="w-full" size='lg'/></div>}
            <form onSubmit={handleSubmit}>
              <FormInputText value={landingPageUrl} onChange={onVenueWebsiteChange} name={'Venue Landing page'}/>
              <FormButtonSubmit text={'Submit'}></FormButtonSubmit>
            </form>
          </StyledDialog>
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
