
import React, { useState } from 'react'
import { dateToSimple } from 'services/dateService'
import { StyledDialog } from 'components/global/StyledDialog'
import { useRecoilValue } from 'recoil'
import { tourJumpState } from 'state/booking/tourJumpState'
import axios from 'axios'
import { Table } from 'components/global/table/Table'
import { BarredVenue } from 'pages/api/tours/venue/barred'
import { FormInputSelect } from 'components/global/forms/FormInputSelect'
import { FormInputNumeric } from 'components/global/forms/FormInputNumeric'
import { FormInputCheckbox } from 'components/global/forms/FormInputCheckbox'
import { ToolbarButton } from '../ToolbarButton'
import Typeahead from 'components/Typeahead'

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
    axios.post('/api/tours/venue/barred', { tourId: parseInt(inputs.tour), venueId: parseInt(inputs.venue), excludeLondon: inputs.London }).then((response) => {
      setBarringVenues(response?.data)
    })
  }
  const handleOnSubmit = async (e) => {
    e.preventDefault()
    fetchBarredVenues()
  }

  const closeForm = () => {
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

  const handleOnChange = async (e: any) => {
    console.log(e)
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

  const tourOptions = tours.map((tour) => ({ text: `${tour.ShowCode}/${tour.Code} | ${tour.ShowName}`, value: tour.Id }))
  const venueOptions = venues.map((venue) => ({ text: `${dateToSimple(new Date(venue.booking.FirstDate))} - ${venue.Name})`, value: String(venue.Id) }))

  // @ts-ignore
  return (
    <>
      <ToolbarButton
        onClick={() => setShowModal(true)}
      >
        Barring
      </ToolbarButton>
      <StyledDialog open={showModal} onClose={() => setShowModal(false)} title="Barring" width='xl'>
        <form onSubmit={handleOnSubmit}>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-2'>
            <FormInputSelect
              label="Tour"
              name="tour"
              value={inputs.tour}
              options={[{ value: 0, text: '-- Select Tour --' }, ...tourOptions]}
              onChange={handleOnChange}
              required
            />
            <Typeahead
              label="Venue"
              name="venue"
              placeholder='-- Select Venue --'
              value={inputs.venue}
              options={[{ value: 0, text: '-- Select Venue --' }, ...venueOptions]}
              onChange={(selectedVenue) => handleOnChange({ target: { value: selectedVenue.value, id: 'venue' } })}
            />
            <FormInputNumeric
              label="Bar Distance"
              name="barDistance"
              onChange={(value) => handleOnChange({ target: { value, id: 'barDistance' } })}
              value={inputs.barDistance}
              required
            />
            <FormInputNumeric
              label="Seats"
              name="Seats"
              onChange={(value) => handleOnChange({ target: { value, id: 'Seats' } })}
              value={inputs.Seats}
              required
            />
            <FormInputCheckbox
              label="Exclude London"
              name="London"
              value={inputs.London}
              onChange={handleOnChange}
            />
          </div>
          <StyledDialog.FooterContainer>
            <StyledDialog.FooterCancel onClick={closeForm}>Cancel</StyledDialog.FooterCancel>
            <StyledDialog.FooterContinue submit>Get Venues</StyledDialog.FooterContinue>
          </StyledDialog.FooterContainer>
          <div className="max-h-[400px] overflow-auto">
            <h4 className='text-xl mb-2'>Barred Venue List</h4>
            {barringVenues.length > 0 && (
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
                    const isMore = venue.Mileage < inputs.barDistance
                    return (
                      <Table.Row className={`${isMore ? '!bg-primary-orange even:bg-primary-orange hover:bg-primary-orange' : ''}`} hover key={venue.Name}>
                        <Table.Cell className={`${isMore ? 'text-white' : 'text-grey'}`}>
                          {venue.Name}
                        </Table.Cell>
                        <Table.Cell className={`${isMore ? 'text-white' : 'text-grey'}`}>
                          {dateToSimple(venue.Date)}
                        </Table.Cell>
                        <Table.Cell className={`${isMore ? 'text-white' : 'text-grey'}`}>
                          {venue.Mileage}
                        </Table.Cell>
                      </Table.Row>
                    )
                  })}
                </Table.Body>
              </Table>
            )}
            {barringVenues.length === 0 && (<p className="bg-gray-100 p-1 rounded text-gray-400 text-center">No barring venues</p>)}
            {/* footer */}
          </div>
        </form>
      </StyledDialog>
    </>

  )
}
