import { useEffect, useState } from 'react'
import Email from '../copyButton/email'
import { dateToSimple, getWeekDay } from 'services/dateService'
import moment from 'moment'
import axios from 'axios'
import { LoadingPage } from 'components/global/LoadingPage'
import { useRecoilValue } from 'recoil'
import { tourJumpState } from 'state/booking/tourJumpState'

interface props {
  searchFilter: String;
}
export default function Entry ({ searchFilter }: props) {
  const [isLoading, setLoading] = useState(false)
  const [loadedEmails, setLoadedEmails] = useState([])
  const [salesWeeks, SetSalesWeeks] = useState([])
  const [salesWeeksVenues, SetSalesWeeksVenues] = useState([])
  const [bookingSaleId, setBookingSaleId] = useState(null)
  const [options, setOptions] = useState<any>(null)
  const [holds, setHolds] = useState<any>({})
  const [comps, setComps] = useState<any>({})
  const [status, setStatus] = useState({
    submitted: false,
    submitting: false,
    info: { error: false, msg: null }
  })
  const [inputs, setInputs] = useState<any>({})
  const { tours } = useRecoilValue(tourJumpState)
  const type = 1
  const AccountId = 1
  // tours===>`/api/tours/read/notArchived/${userService.userValue.accountId}
  // loaded emails====>/api/marketing/sales/emailImport/${AccountId}/${type}
  // Tour Dates====>`/api/tours/read/tourDates/${TourID}`
  // Venue Date=====> `/api/tours/read/week/${TourId}`
  // Sales Week Venues====> `/api/bookings/ShowWeek/${inputs.SetTour}/${MondayDate}/${SundayDate}`
  const fetchTourWeeks = (tourId) => {
    if (tourId) {
      fetch(`/api/reports/tourWeek/${tourId}`)
        .then((res) => res.json())
        .then((data) => {
          SetSalesWeeks(data?.data || [])
        })
    }
  }
  const fetchVenues = (tourId) => {
    if (tourId) {
      fetch(`/api/tours/read/venues/${tourId}`)
        .then((res) => res.json())
        .then(data => data.data)
        .then((data) => {
          console.log('===Venues==', data)
          SetSalesWeeksVenues(data)
        })
    }
  }
  const fetchSales = (SetSalesFiguresDate, SetBookingId) => {
    axios.post('/api/marketing/sales/read', { SetSalesFiguresDate, SetBookingId })
      .then((data) => {
        console.log('===Sales==', data)
        // SetSalesWeeksVenues(data)
      }).catch(error => console.log(error))
  }
  const fetchOptionTypes = () => {
    axios.get('/api/marketing/sales/options')
      .then((data) => {
        setOptions(data.data)
        // SetSalesWeeksVenues(data)
      }).catch(error => console.log(error))
  }
  useEffect(() => {
    fetchTourWeeks(inputs.SetTour)
    fetchVenues(inputs.SetTour)
  }, [inputs.SetTour])
  useEffect(() => {
    if (!options) {
      fetchOptionTypes()
    }
  }, [])
  useEffect(() => {
    if (inputs.SaleWeek && inputs.Venue) {
      fetchSales(inputs.SaleWeek, parseInt(inputs.Venue, 10))
    }
  }, [inputs.SaleWeek, inputs.Venue])
  // const handleServerResponse = (ok, msg) => {
  //   if (ok) {
  //     setStatus({
  //       submitted: true,
  //       submitting: false,
  //       info: { error: false, msg }
  //     })
  //     setInputs({})
  //   } else {
  //     // @ts-ignore
  //     setStatus(false)
  //   }
  // }

  if (isLoading) return <LoadingPage />

  // /**
  //  * Onn update of activeSetTours
  //  * Venues need updated
  //  */
  // function setTour (TourID) {
  //   fetch(`/api/tours/read/tourDates/${TourID}`)
  //     .then((res) => res.json())
  //     .then((res) => {
  //       // setActiveSetTourDates(res)
  //     })
  // }

  // /**
  //  *  Booking ID set from Venue/Date
  //  */
  // function setVenueDate (TourId) {
  //   // alert(TourId)
  //   fetch(`/api/tours/read/week/${TourId}`)
  //     .then((res) => res.json())
  //     .then((res) => {
  //       SetSalesWeeksVenues([])
  //       SetSalesWeeks(res)
  //     })
  //   inputs.BookingId = 999 // "Found Booking ID"
  // }

  // function setVenueWeek (RawMondayDate) {
  //   const MondayDate = moment(new Date(RawMondayDate)).format('yyyy-MM-DD')
  //   const SundayDate = moment(new Date(RawMondayDate))
  //     .add(6, 'days')
  //     .format('yyyy-MM-DD')

  //   fetch(
  //     `/api/bookings/ShowWeek/${inputs.SetTour}/${MondayDate}/${SundayDate}`
  //   )
  //     .then((res) => res.json())
  //     .then((res) => {
  //       SetSalesWeeksVenues(res)
  //     })
  // }

  const handleOnChange = (e) => {
    e.persist()
    if (e.target.id === 'SetTour') {
      setInputs({ [e.target.id]: e.target.value })
      return
    }
    setInputs((prev) => ({
      ...prev,
      [e.target.id]: e.target.value
    }))
    setStatus({
      submitted: false,
      submitting: false,
      info: { error: false, msg: null }
    })
  }

  function importEmail (id) {
    setInputs({})
  }

  function copyToClipboard () {}

  async function addNotes () {
    alert('hello')
    await axios({
      method: 'POST',
      url: '/api/marketing/sales/process/entry/BookingSaleNotes',
      data: inputs
    })
  }

  async function onSubmit () {
    const Holds = Object.keys(holds).map((SetHoldHoldTypeId) => ({ SetHoldHoldTypeId, SetHoldSeats: holds[SetHoldHoldTypeId].seats, SetHoldValue: holds[SetHoldHoldTypeId].value }))
    const Comps = Object.keys(comps).map((SetCompCompTypeId) => ({ SetCompCompTypeId, SetCompSeats: comps[SetCompCompTypeId] }))
    const Sales = [
      {
        SaleSaleTypeId: 1,
        SaleSeats: inputs.Seats,
        SaleValue: inputs.Value
      },
      {
        SaleSaleTypeId: 2,
        SaleSeats: inputs.ReservedSeats,
        SaleValue: inputs.ReservedValue
      }
    ]
    await axios.post('/api/marketing/sales/upsert', { Holds, Comps, Sales, SetBookingId: inputs.Venue, SetSalesFiguresDate: inputs.SalesWeek })
      .then((res) => {
        setBookingSaleId(res.data.BookingSaleId)
        addNotes()
      }).catch(error => {
        console.log('Error updating Sales', error)
      })

    // Reserved SeatsValue
    // BookingID, date, NumSeatsSold, SeatsSoldValue, ReservedSeatsSold, ReservedSeatsValue, finalFigures

    // BookingSaleHold
    // BookingSaleID, HoldId, Seats, Value

    // BookingSaleComp
    // BookingSaleID, CompId, Seats

    // BookingSaleNotes
    // BookingSaleId, HoldNotes, CompNotes, BookingSaleNotes
  }
  const handleOnHoldsChange = (e, key) => {
    setHolds(prev => ({ ...prev, [e.target.id]: { ...(prev?.[e.target.id] || {}), [key]: e.target.value } }))
  }
  const handleOnCompsChange = (e) => {
    setComps(prev => ({ ...prev, [e.target.id]: e.target.value }))
  }

  return (
    <div className="flex flex-row w-full">
      <div className={'flex bg-transparent w-5/8 p-5'}>
        <div className="flex-auto mx-4 mt-0overflow-hidden  ring-black ring-opacity-5 sm:-mx-6 md:mx-0 md:rounded-lg">
          <div className={'mb-1'}></div>
          <form onSubmit={onSubmit}>
            <div>
              <div className="bg-soft-primary-green p-4 rounded-md mb-4">
                <div className="flex flex-col space-y-2">
                  <div className="flex flex-row items-center justify-between">
                    <label
                      htmlFor="SetTour"
                      className="text-sm font-medium text-gray-700"
                    >
                      Set Tour
                    </label>
                    <select
                      id="SetTour"
                      name="SetTour"
                      value={inputs.SetTour}
                      onChange={handleOnChange}
                      className="block w-full rounded-md drop-shadow-md max-w-lg border-gray-300  focus:border-primary-green focus:ring-primary-green  text-sm"
                    >
                      <option value={0}>Select A Tour</option>
                      {tours?.map?.((tour) => (
                        <option key={tour.Id} value={tour.Id}>
                          {tour.ShowCode}/{tour.Code}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-row items-center justify-between">
                    <label
                      htmlFor="SaleWeek"
                      className="text-sm font-medium text-gray-700"
                    >
                      Tour Sale Week
                    </label>
                    <select
                      id="SaleWeek"
                      name="SaleWeek"
                      className="block w-full  max-w-lg rounded-md border-gray-300 drop-shadow-md focus:border-primary-green focus:ring-primary-green text-sm"
                      onChange={handleOnChange}
                    >
                      <option value={0}>Select A Tour</option>
                      {salesWeeks?.map?.((week) => (
                        <option
                          key={week.MondayDate}
                          value={week.MondayDate}
                        >
                          {week.MondayDate ? dateToSimple(week.MondayDate) : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-row items-center justify-between">
                    <label
                      htmlFor="Venue"
                      className="text-sm font-medium text-gray-700"
                    >
                      Venue
                    </label>
                    <select
                      id="Venue"
                      name="Venue"
                      className="block bg-dark-primary-green w-full text-white max-w-lg rounded-md border-none drop-shadow-md focus:border-primary-green focus:ring-primary-green text-sm"
                      onChange={handleOnChange}
                    >
                      <option value={0}>Select A Performance</option>
                      {salesWeeksVenues?.sort((a, b) => a.Name?.localCompare?.(b.Name))?.map?.((venue) => (
                        <option key={venue.BookingId} value={venue.BookingId}>
                          {/* {getWeekDay(item.ShowDate)}{' '}
                          {dateToSimple(item.ShowDate)} |{' '} */}
                          {venue.Name}
                          {/* ({item.Venue.Town}) */}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="columns-2">
                  <div className={'columns-1'}>
                    <div className="sm:grid sm:grid-cols-3 px-2 sm:items-start sm:gap-4  sm:pt-5">
                      <label
                        htmlFor="Value"
                        className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                      >
                        Sold Seat Value
                      </label>
                      <div className="mt-1 sm:col-span-2 sm:mt-0">
                        <input
                          type="text"
                          name="Value"
                          id="Value"
                          value={inputs.Value}
                          onChange={handleOnChange}
                          className="block w-full max-w-lg rounded-md border-none drop-shadow-md focus:border-primary-green focus:ring-primary-green sm:text-sm"
                        />
                      </div>
                    </div>
                    <div className="sm:grid sm:grid-cols-3 px-2 sm:items-start sm:gap-4   sm:pt-5">
                      <label
                        htmlFor="ReservedValue"
                        className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                      >
                        Reserved Seats Value
                      </label>
                      <div className="mt-1 sm:col-span-2 sm:mt-0">
                        <input
                          type="text"
                          name="ReservedValue"
                          id="ReservedValue"
                          autoComplete="ReservedValue"
                          value={inputs.ReservedValue}
                          onChange={handleOnChange}
                          className="block w-full max-w-lg rounded-md border-none drop-shadow-md focus:border-primary-green focus:ring-primary-green sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>
                  <div className={'columns-1'}>
                    <div className="sm:grid sm:grid-cols-3 px-2 sm:items-start sm:gap-4 sm:pt-5">
                      <label
                        htmlFor="street-address"
                        className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                      >
                        Seats Sold
                      </label>
                      <div className="mt-1 sm:col-span-2 sm:mt-0">
                        <input
                          type="text"
                          name="Seats"
                          id="Seats"
                          autoComplete="Seats"
                          value={inputs.Seats}
                          onChange={handleOnChange}
                          className="block w-full max-w-lg rounded-md border-gray-300 drop-shadow-md focus:border-primary-green focus:ring-primary-green sm:text-sm"
                        />
                      </div>
                    </div>
                    <div className="sm:grid sm:grid-cols-3 px-2 sm:items-start sm:gap-4  sm:pt-5">
                      <label
                        htmlFor="street-address"
                        className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                      >
                        Reserved Seats
                      </label>
                      <div className="mt-1 sm:col-span-2 sm:mt-0">
                        <input
                          type="text"
                          name="ReservedSeats"
                          id="ReservedSeats"
                          autoComplete="ReservedSeats"
                          value={inputs.ReservedSeats}
                          onChange={handleOnChange}
                          className="block w-full max-w-lg rounded-md border-none drop-shadow-md focus:border-primary-green focus:ring-primary-green sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid-cols-2 grid gap-4  md:gap-6 pt-10">
                <div className="sm:col-span-1" >
                  <div className={'flex flex-col'}>
                    <div className=" bg-dark-primary-green text-white rounded-t-md px-2 sm:grid sm:grid-cols-3 sm:items-start sm:gap-2 sm:border-t sm:border-gray-200 sm:pt-2">
                      <div className=" sm:col-span-1 sm:mt-0">Holds</div>
                      <div className=" sm:col-span-1 text-center sm:mt-0">Seats</div>
                      <div className=" sm:col-span-1 text-center sm:mt-0">Value</div>
                    </div>
                    {
                      options?.holdTypes.map((hold, i) => (
                        <div key={i} className="sm:grid sm:grid-cols-3 px-2 sm:items-start sm:gap-4 sm:border-none sm:border-gray-200 sm:pt-5">
                          <label
                            htmlFor="street-address"
                            className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                          >
                            {hold.HoldTypeName}
                          </label>
                          <div className="mt-1 sm:col-span-1 sm:mt-0">
                            <input
                              type="text"
                              name={hold.HoldTypeId}
                              id={hold.HoldTypeId}
                              autoComplete="PressHoldsSeats"
                              value={holds?.[hold.HoldTypeId]?.seats}
                              onChange={(e) => handleOnHoldsChange(e, 'seats')}
                              className="block w-full max-w-lg rounded-md border-gray-300 drop-shadow-md focus:border-primary-green focus:ring-primary-green sm:text-sm"
                            />
                          </div>
                          <div className="mt-1 sm:col-span-1 sm:mt-0">
                            <input
                              type="text"
                              name={hold.HoldTypeId}
                              id={hold.HoldTypeId}
                              autoComplete="PressHoldsValue"
                              value={holds?.[hold.HoldTypeId]?.value}
                              onChange={(e) => handleOnHoldsChange(e, 'value')}
                              className="block w-full max-w-lg rounded-md border-gray-300 drop-shadow-md focus:border-primary-green focus:ring-primary-green sm:text-sm"
                            />
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>
                <div className={'col-span-1'}>
                  <div className="sm:grid bg-dark-primary-green text-white sm:grid-cols-3 px-2 sm:items-start sm:gap-4 rounded-t-md sm:border-none sm:border-gray-200 pt-2">
                    <div className={' sm:col-span-1 '}>Comps</div>
                    <div className=" text-right sm:col-span-2 ">Seats</div>
                  </div>
                  {
                    options?.compTypes?.map((comp, j) => (
                      <div key={j} className="sm:grid sm:grid-cols-3 px-2 sm:items-start sm:gap-4 sm:border-none sm:border-gray-200 sm:pt-5">
                        <label
                          htmlFor="street-address"
                          className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                        >
                          {comp.CompTypeName}
                        </label>
                        <div className="mt-1 sm:col-span-2 sm:mt-0">
                          <input
                            type="text"
                            name={comp.CompTypeId}
                            id={comp.CompTypeId}
                            autoComplete="PressSeats"
                            value={comps?.[comp.CompTypeId]}
                            onChange={handleOnCompsChange}
                            className="block w-full max-w-lg rounded-md border-gray-300 drop-shadow-md focus:border-primary-green focus:ring-primary-green sm:text-sm"
                          />
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>
              <div className={'columns-1'}>
                <div className="sm:grid sm:grid-cols-2 px-2 sm:items-start sm:gap-4 sm:border-none sm:border-gray-200 sm:pt-5">
                  <div className="flex flex-col w-full col-span-1">
                    <label
                      htmlFor="street-address"
                      className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                    >
                      Hold Notes
                    </label>
                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                      <textarea
                        className="w-full"
                        onChange={handleOnChange}
                        name={'HoldNotes'}
                        id={'HoldNotes'}
                        value={inputs.HoldNotes}
                      ></textarea>
                    </div>
                  </div>
                  <div className={'col-span-1'}>
                    <div className="flex flex-col px-2 sm:items-start sm:border-none sm:border-gray-200 w-full">
                      <label
                        htmlFor="street-address"
                        className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                      >
                      Comp Notes
                      </label>
                      <div className="mt-1 sm:mt-0">
                        <textarea
                          onChange={handleOnChange}
                          name={'CompNotes'}
                          id={'CompNotes'}
                          value={inputs.CompNotes}
                          className="w-full"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={'flex flex-col'}>
                <label
                  htmlFor="street-address"
                  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                >
                    Booking Sale Notes
                </label>
                <div className="mt-1 sm:mt-0 w-full">
                  <textarea
                    onChange={handleOnChange}
                    name={'BookingSaleNotes'}
                    id={'BookingSaleNotes'}
                    value={inputs.BookingSaleNotes}
                    className="w-full"
                  ></textarea>
                </div>
              </div>
            </div>
            <button
              type={'submit'}
              className={
                'inline-flex items-center mt-5 rounded border border-gray-300 bg-primary-green w-100 h-16 text-white px-2.5 py-1.5 text-xs font-medium drop-shadow-md hover:bg-dark-primary-green focus:outline-none focus:ring-2 focus:ring-primary-green focus:ring-offset-2'
              }
            >
              Add Sales Data
            </button>
          </form>
          <div>
            <Email></Email>
          </div>
        </div>
      </div>
      <div className={'flex bg-transparent flex flex-col w-1/3 p-5'}>
        {/* Buttons go here  */}
        <div className="grid grid-cols-2 gap-1 mb-4">

          <button className="bg-primary-green text-white drop-shadow-md px-4 rounded-md">Copy Last Weeks Sales Data</button>
          <button className="bg-primary-green text-white drop-shadow-md px-4 rounded-md">Insert Data From Email</button>
        </div>
        <div className="flex-auto mx-4 mt-0 overflow-hidden max-h-screen border-primary-green border   ring-opacity-5 sm:-mx-6 md:mx-0 ">
          <div className={'mb-1'}></div>
          <div>
            {loadedEmails.length > 0 && (
              <>
                <span>Click Email to load Data</span>
                {loadedEmails.map((item) => (
                  <div key={item.id}>
                    <button onClick={() => importEmail(item.Id)}>
                      <span>
                        {JSON.stringify(item)}
                        {item.SetTour} {dateToSimple(item.Date)}{' '}
                        Import
                      </span>
                    </button>
                  </div>
                ))}
              </>
            )}
            {loadedEmails.length == 0 && (
              <>
                <span></span>
              </>
            )}
          </div>
        </div>
        <span>Our system found the following sales emails which matches the tour sale</span>
      </div>
    </div>
  )
}
