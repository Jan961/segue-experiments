import React, { useRef, useState, useMemo } from 'react';
import { dateToSimple } from 'services/dateService';
import { StyledDialog } from 'components/global/StyledDialog';
import { useRecoilValue } from 'recoil';
import { tourJumpState } from 'state/booking/tourJumpState';
import axios from 'axios';
import { Table } from 'components/global/table/Table';
import { BarredVenue } from 'pages/api/tours/venue/barred';
import { FormInputSelect } from 'components/global/forms/FormInputSelect';
import { FormInputNumeric } from 'components/global/forms/FormInputNumeric';
import { FormInputCheckbox } from 'components/global/forms/FormInputCheckbox';
import { ToolbarButton } from '../ToolbarButton';
import Typeahead from 'components/global/Typeahead';
import { Spinner } from 'components/global/Spinner';
import { MenuButton } from 'components/global/MenuButton';

export default function Barring() {
  const { tours } = useRecoilValue(tourJumpState);
  const [showModal, setShowModal] = React.useState(false);
  const [venues, setVenues] = useState([]);
  const [inputs, setInputs] = useState({
    tour: null,
    venue: null,
    barDistance: 0,
    London: false,
    TourOnly: false,
    Seats: 0,
  });
  const [barringVenues, setBarringVenues] = useState<BarredVenue[]>([]);
  const [loading, setIsLoading] = useState<boolean>(false);
  const formRef = useRef(null);
  const fetchBarredVenues = async () => {
    setIsLoading(true);
    axios
      .post('/api/tours/venue/barred', {
        tourId: parseInt(inputs.tour),
        venueId: parseInt(inputs.venue),
        excludeLondon: inputs.London,
      })
      .then((response) => {
        setBarringVenues(response?.data);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        console.log('Error fetching Barred Venues', error);
      });
  };
  const handleOnSubmit = async (e) => {
    e.preventDefault();
    fetchBarredVenues();
  };

  const closeForm = () => {
    setInputs({
      tour: null,
      venue: null,
      barDistance: 0,
      London: false,
      TourOnly: false,
      Seats: 0,
    });

    setShowModal(false);
  };

  const handleOnChange = async (e: any) => {
    console.log(e);
    const { id, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [id]: value,
    }));
    if (e.target.name === 'tour') {
      // Load Venues for this tour
      // setIsLoading(true)
      await axios.get(`/api/tours/read/venues/${e.target.value}`)
        .then(data => data?.data)
        .then((data) => {
          // setIsLoading(false)
          setInputs((prevState) => ({ ...prevState, Venue: null }));
          setVenues(data);
          setInputs((prev) => ({
            ...prev,
            venue: null,
          }));
        })
        .catch((error) => {
          // setIsLoading(false)
          console.log('Error fetching Venues:', error);
        });
    }
  };

  const tourOptions = tours.map((tour) => ({
    text: `${tour.ShowCode}/${tour.Code} | ${tour.ShowName}`,
    value: tour.Id,
  }));
  const venueOptions = useMemo(
    () =>
      venues.map((venue) => ({
        name: `${dateToSimple(new Date(venue.booking.FirstDate))} - ${venue.Name}`,
        value: String(venue.Id),
      })),
    [venues]
  );
  // @ts-ignore
  return (
    <>
      <ToolbarButton onClick={() => setShowModal(true)}>Barring</ToolbarButton>
      <StyledDialog
        className="w-4/5 max-w-full h-[90vh] relative"
        open={showModal}
        onClose={() => setShowModal(false)}
        title="Barring"
        width="xl"
      >
        {loading && (
          <div className="w-full h-full absolute left-0 top-0 bg-white flex items-center opacity-95">
            <Spinner className="w-full" size="lg" />
          </div>
        )}
        <form ref={formRef} onSubmit={handleOnSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-4 lg:gap-x-2 items-center">
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
              onChange={(selectedVenue) => handleOnChange({ target: { value: selectedVenue, id: 'venue' } })}
              options={[{ value: 0, name: '-- Select Venue --' }, ...venueOptions]}
              placeholder="-- Select Venue --"
              value={inputs.venue}
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
              label="EXCLUDE LONDON VENUES"
              name="London"
              className="!justify-start"
              value={inputs.London}
              onChange={handleOnChange}
            />
            <div />
            <div />
            <div className="text-right">
              {/* <StyledDialog.FooterCancel disabled={loading} onClick={closeForm}>Cancel</StyledDialog.FooterCancel> */}
              <MenuButton disabled={loading} submit>
                Get Venues
              </MenuButton>
            </div>
          </div>
        </form>
        <div className={'max-h-[48vh] lg:max-h-[65vh] overflow-auto'}>
          <h4 className="text-xl mb-2">Barred Venue List</h4>
          {barringVenues.length > 0 && (
            <Table>
              <Table.HeaderRow>
                <Table.HeaderCell>Venue</Table.HeaderCell>
                <Table.HeaderCell>Date</Table.HeaderCell>
                <Table.HeaderCell>Miles</Table.HeaderCell>
              </Table.HeaderRow>
              <Table.Body>
                {barringVenues.map((venue) => {
                  const isMore = venue.Mileage < inputs.barDistance;
                  return (
                    <Table.Row
                      className={`${isMore ? '!bg-primary-orange even:bg-primary-orange hover:bg-primary-orange' : ''}`}
                      hover
                      key={venue.Name}
                    >
                      <Table.Cell className={`${isMore ? 'text-white' : 'text-grey'}`}>{venue.Name}</Table.Cell>
                      <Table.Cell className={`${isMore ? 'text-white' : 'text-grey'}`}>
                        {dateToSimple(venue.Date)}
                      </Table.Cell>
                      <Table.Cell className={`${isMore ? 'text-white' : 'text-grey'}`}>{venue.Mileage}</Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table>
          )}
          {barringVenues.length === 0 && (
            <p className="bg-gray-100 p-1 rounded text-gray-400 text-center">No barring venues</p>
          )}
          {/* footer */}
        </div>
      </StyledDialog>
    </>
  );
}
