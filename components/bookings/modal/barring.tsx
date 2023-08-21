
import React, { useState } from 'react'
import { dateToSimple } from 'services/dateService'
import { StyledDialog } from 'components/global/StyledDialog'
import { useRecoilValue } from 'recoil'
import { tourJumpState } from 'state/booking/tourJumpState'
import axios from 'axios'
import { Table } from 'components/global/table/Table'
import { BarredVenue } from 'pages/api/tours/venue/barred'

export default function Barring () {
  const { tours } = useRecoilValue(tourJumpState)
  const [showModal, setShowModal] = React.useState(false)
  const [venues, setVenues] = useState([])
  const [inputs, setInputs] = useState({
    tour: null,
    venue: null,
    barDistance: 0,
    London: false,
    TourOnly: false,
    Seats: 0
  })
  const [barringVenues, setBarringVenues] = useState<BarredVenue[]>([])

  const fetchBarredVenues = async () => {
    axios.post('/api/tours/venue/barred', { tourId: parseInt(inputs.tour), venueId: parseInt(inputs.venue) }).then((response) => {
      console.log('====Vnues List', response)
      setBarringVenues(response?.data)
    })
  }
  async function handleOnSubmit (e) {
    e.preventDefault()
    fetchBarredVenues()
  }

  function closeForm () {
    setInputs({
      tour: null,
      venue: null,
      barDistance: 0,
      London: false,
      TourOnly: false,
      Seats: 0
    })

    setShowModal(false)
  }

  async function handleOnChange (e) {
    e.persist()
    setInputs((prev) => ({
      ...prev,
      [e.target.id]: e.target.value
    }))

    if (e.target.name === 'tour') {
      // Load Venues for this tour
      await axios.get(`/api/tours/read/venues/${e.target.value}`)
        .then(data => data?.data?.data)
        .then((data) => {
          setInputs(prevState => ({ ...prevState, Venue: null }))
          setVenues(data)
        })
    }
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
      <StyledDialog open={showModal} onClose={() => setShowModal(false)} title="Barring" width='xl'>
        <form className='' onSubmit={handleOnSubmit}>
          <div className="grid grid-cols-1 gap-4">
            <div className="flex flex-col space-y-2">
              <label htmlFor="tour" className="text-lg font-medium">Tour</label>
              <select
                required
                id="tour"
                name="tour"
                value={inputs.tour}
                onChange={handleOnChange}
                className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
              >
                <option value={0}>Select A Tour</option>
                {tours.filter(tour => !tour.IsArchived).map((tour) => (
                  <option key={tour.Id} value={`${tour.Id}`}>{tour.ShowCode}/{tour.Code} | {tour.ShowName}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col space-y-2 mt-4">
              <label htmlFor="venue" className="text-lg font-medium">Venue/Date</label>
              <select
                required
                id="venue"
                name="venue"
                value={inputs.venue}
                onChange={handleOnChange}
                className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
              >
                <option value={0}>Select A Tour</option>
                {venues.map((venue, key) => (
                  <option key={key} value={venue.Id}>{dateToSimple(new Date(venue.booking.FirstDate))} - {venue.Name})</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col space-y-2 mt-4">
              <label htmlFor="date" className="text-lg font-medium">Bar Distance</label>
              <input
                required
                type={'number'}
                id="barDistance"
                name="barDistance"
                className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                onChange={handleOnChange}
                value={inputs.barDistance}
              />

            </div>
            <div className="flex flex-col space-y-2 mt-4">
              <label htmlFor="date" className="text-lg font-medium">Min Seats</label>
              <input
                type={'number'}
                id="Seats"
                name="Seats"
                className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                onChange={handleOnChange}
                value={inputs.Seats}
              />
            </div>
            <div className="flex flex-col space-y-2 mt-4">
              <label htmlFor="date" className="text-lg font-medium">London Only</label>
              <input
                type={'checkbox'}
                id="London"
                name="London"
                className="block  rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                onChange={handleOnChange}
                checked={inputs.London}
              />
            </div>
          </div>
          <div className="flex flex-col space-x-2 space-y-2 max-h-[300px] overflow-auto">
            <h4>Barred Venue List</h4>
            <div>
              <Table>
                <Table.HeaderRow>
                  <Table.HeaderCell>
                          Venue
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                          Date
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                          Miles
                  </Table.HeaderCell>
                </Table.HeaderRow>
                <Table.Body>
                  {barringVenues.map((venue) => {
                    const isMore = venue.Mileage > inputs.barDistance
                    return (
                      <Table.Row className={`${isMore ? 'bg-red' : ''}`} hover key={venue.Name}>
                        <Table.Cell>
                          {venue.Name}
                        </Table.Cell>
                        <Table.Cell>
                          {dateToSimple(venue.Date)}
                        </Table.Cell>
                        <Table.Cell>
                          {venue.Mileage}
                        </Table.Cell>
                      </Table.Row>
                    )
                  })}
                </Table.Body>
              </Table>
            </div>
          </div>

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
