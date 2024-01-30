import { useRef, useState, useMemo } from 'react';
import { dateToSimple } from 'services/dateService';
import { StyledDialog } from 'components/global/StyledDialog';
import { useRecoilValue } from 'recoil';
import { productionJumpState } from 'state/booking/productionJumpState';
import axios from 'axios';
import { Table } from 'components/global/table/Table';
import { BarredVenue } from 'pages/api/productions/venue/barred';
import { FormInputSelect } from 'components/global/forms/FormInputSelect';
import { FormInputNumeric } from 'components/global/forms/FormInputNumeric';
import { FormInputCheckbox } from 'components/global/forms/FormInputCheckbox';
import FormTypeahead from 'components/global/forms/FormTypeahead';
import { Spinner } from 'components/global/Spinner';
import { MenuButton } from 'components/global/MenuButton';

type BarringProps = {
  visible: boolean;
  onClose: () => void;
};

export default function Barring({ visible, onClose }: BarringProps) {
  const { productions } = useRecoilValue(productionJumpState);
  const [venues, setVenues] = useState([]);
  const [inputs, setInputs] = useState({
    production: null,
    venue: null,
    barDistance: 0,
    London: false,
    ProductionOnly: false,
    Seats: 0,
  });
  const [barringVenues, setBarringVenues] = useState<BarredVenue[]>([]);
  const [loading, setIsLoading] = useState<boolean>(false);
  const formRef = useRef(null);
  const fetchBarredVenues = async () => {
    setIsLoading(true);
    axios
      .post('/api/productions/venue/barred', {
        productionId: parseInt(inputs.production),
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

  const handleOnChange = async (e) => {
    const { id, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [id]: value,
    }));
    if (e.target.name === 'production') {
      // Load Venues for this production
      // setIsLoading(true)
      await axios
        .get(`/api/productions/read/venues/${e.target.value}`)
        .then((data) => data?.data)
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

  const productionOptions = productions.map((production) => ({
    text: `${production.ShowCode}/${production.Code} | ${production.ShowName}`,
    value: production.Id,
  }));
  const venueOptions = useMemo(
    () =>
      venues.map((venue) => ({
        name: `${dateToSimple(new Date(venue.booking.FirstDate))} - ${venue.Name}`,
        value: String(venue.Id),
      })),
    [venues],
  );

  return (
    <>
      <StyledDialog
        className="w-4/5 max-w-full h-[90vh] relative"
        open={visible}
        onClose={onClose}
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
              label="Production"
              name="production"
              value={inputs.production}
              options={[{ value: 0, text: '-- Select Production --' }, ...productionOptions]}
              onChange={handleOnChange}
              required
            />
            <FormTypeahead
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
