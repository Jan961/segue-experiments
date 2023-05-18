
import React, { useEffect, useState } from 'react'
import { userService } from 'services/user.service'
import { dateService } from 'services/dateService'
import moment from 'moment/moment'
import { StyledDialog } from 'components/global/StyledDialog'

export default function Barring () {
  const [showModal, setShowModal] = React.useState(false)
  const [pres, setPres] = useState([])
  const [activeTours, setActiveTours] = useState([])
  const [isLoading, setLoading] = useState(false)
  const [salesWeeksVenues, SetSalesWeeksVenues] = useState([])
  const [activeSetTours, setActiveSetTours] = useState([])
  const [inputs, setInputs] = useState({
    SetTour: null,
    venueDate: null,
    barDistance: 0,
    London: false,
    TourOnly: false,
    Seats: 0
  })
  const [venues, setVenues] = useState([])
  const [status, setStatus] = useState({
    submitted: false,
    submitting: false,
    info: { error: false, msg: null }
  })
  const [barringVenues, setBarringVenues] = useState(null)

  useEffect(() => {
    (async () => {
      fetch(`/api/tours/read/notArchived/${userService.userValue.accountId}`,
        {
          method: 'GET',
          headers: {
            'content-type': 'application/json;charset=UTF-8',
            segue_admin: userService.userValue.segueAdmin,
            account_admin: userService.userValue.accountAdmin,
            user_id: userService.userValue.userId
          }
        })
        .then((res) => res.json())
        .then((data) => {
          setActiveTours(data)
          setLoading(false)
        })
    })()
  }, [])

  useEffect(() => {
    const MondayDate = moment(new Date('2000-01-01')) // moment(new Date(RawMondayDate)).format("yyyy-MM-DD")
    // @ts-ignore
    const SundayDate = moment(new Date('2036-01-01')) // moment(new Date(RawMondayDate)).add(6,"days").format("yyyy-MM-DD")
    fetch(`/api/bookings/ShowWeek/${inputs.SetTour}/${MondayDate}/${SundayDate}`)
      .then(res => res.json())
      .then(res => {
        SetSalesWeeksVenues(res)
      })
  }, [inputs.SetTour])

  async function handleOnSubmit (e) {
    e.preventDefault()
    setStatus((prevStatus) => ({ ...prevStatus, submitting: true }))

    const BarringVenueList = fetch(`/api/barring/${inputs.venueDate}/${inputs.SetTour}/${inputs.barDistance}/${inputs.London}/${inputs.TourOnly}/${inputs.Seats}`)
      .then(barredVenueList => (barredVenueList.json()))
      .then(barredVenueList => (
        setBarringVenues(barredVenueList)
      ))
  }

  function closeForm () {
    setInputs({
      SetTour: null,
      venueDate: null,
      barDistance: 0,
      London: false,
      TourOnly: false,
      Seats: 0
    })
    setVenues([])

    setShowModal(false)
  }

  function setVenueWeek () {
    // @ts-ignore
    const MondayDate = moment(new Date('2000-01-01')) // moment(new Date(RawMondayDate)).format("yyyy-MM-DD")
    // @ts-ignore
    const SundayDate = moment(new Date('2036-01-01')) // moment(new Date(RawMondayDate)).add(6,"days").format("yyyy-MM-DD")

    fetch(`/api/bookings/ShowWeek/${inputs.SetTour}/${MondayDate}/${SundayDate}`)
      .then(res => res.json())
      .then(res => {
        SetSalesWeeksVenues(res)
      })
  }

  async function handleOnChange (e) {
    e.persist()
    setInputs((prev) => ({
      ...prev,
      [e.target.id]: e.target.value
    }))
  }

  // @ts-ignore
  return (
    <>

      <button
        className="bg-white shadow-md hover:shadow-lg text-primary-blue font-bold py-2 px-5 rounded-l-md rounded-r-md mx-1"
        type="button"
        onClick={() => setShowModal(true)}
      >
                Barring
      </button>
      <StyledDialog open={showModal} onClose={() => setShowModal(false)} title="Barring">

        <form onSubmit={handleOnSubmit}>

          <div className="flex flex-row space-x-2 space-y-2">
            <label htmlFor="date" className="">Tour</label>
            <select

              id="SetTour"
              name="SetTour"
              value={inputs.SetTour}
              onChange={handleOnChange}
              className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
            >
              <option value={0}>Select A Tour</option>
              {activeTours.map((tour) => (
                <option key={tour.TourId} value={`${tour.TourId}`} >{tour.Show.Code}/{tour.Code} | {tour.Show.Name}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-row space-x-2 space-y-2">
            <label htmlFor="date" className="">Venue/Date</label>
            <select

              id="venueDate"
              name="venueDate"
              value={inputs.venueDate}
              onChange={handleOnChange}
              className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
            >
              <option value={0}>Select A Tour</option>
              {salesWeeksVenues.map((item) => (
                <option value={item.VenueId}>{dateService.dateToSimple(new Date(item.ShowDate))} - {item.Venue.Name})</option>
              ))}
            </select>
          </div>

          <div className="mt-1 sm:col-span-2 sm:mt-0">
            <label htmlFor="date" className="">Bar Distance</label>
            <input
              type={'number'}
              id="barDistance"
              name="barDistance"
              className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
              onChange={handleOnChange}
              value={inputs.barDistance}
            />

          </div>
          <div className="mt-1 sm:col-span-2 sm:mt-0">
            <label htmlFor="date" className="">Min Seats</label>
            <input
              type={'number'}
              id="Seats"
              name="Seats"
              className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
              onChange={handleOnChange}
              value={inputs.Seats}
            />
          </div>

          <div className="mt-1 sm:col-span-2 sm:mt-0">
            <label htmlFor="date" className="">London Only</label>
            <input
              type={'checkbox'}
              id="London"
              name="London"
              className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
              onChange={handleOnChange}
              checked={inputs.London}
            />
          </div>

          {barringVenues > 0
            ? (
              <>
              </>
            )
            : (
              <>
                <div className="flex flex-row space-x-2 space-y-2">
                                            Display list
                                            for venues in venue list
                </div>
              </>
            )

          }

          {/* footer */}
          <StyledDialog.FooterContainer>
            <StyledDialog.FooterCancel onClick={closeForm}>Cancel</StyledDialog.FooterCancel>
            <StyledDialog.FooterContinue submit>Get Venues</StyledDialog.FooterContinue>
          </StyledDialog.FooterContainer>
        </form>
      </StyledDialog>
    </>

  )
}
