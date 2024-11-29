import { getBarredVenuesColDefs, styleProps } from 'components/bookings/table/tableConfig';
import Button from 'components/core-ui-lib/Button';
import Table from 'components/core-ui-lib/Table';
import TextArea from 'components/core-ui-lib/TextArea';
import TextInput from 'components/core-ui-lib/TextInput';
import { initialVenueBarringRules } from 'config/venue';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { venueOptionsSelector } from 'state/booking/selectors/venueOptionsSelector';
import { UiBarredVenue, UiTransformedVenue } from 'utils/venue';

interface VenueBarringFormProps {
  venue: Partial<UiTransformedVenue>;
  validationErrors?: Record<string, string>;
  onChange: (data: any) => void;
  updateValidationErrrors?: (key: string, value: string) => void;
  disabled?: boolean;
}

const VenueBarringForm = ({
  venue,
  onChange,
  validationErrors,
  updateValidationErrrors,
  disabled,
}: VenueBarringFormProps) => {
  const [formData, setFormData] = useState<Partial<UiTransformedVenue>>({ ...initialVenueBarringRules, ...venue });
  const [barredVenueTableRows, setBarredVenueTableRows] = useState<UiBarredVenue[]>(venue?.barredVenues || []);
  const venueOptions = useRecoilValue(venueOptionsSelector([venue?.id]));
  const [selectedVenueIds, setSelectedVenueIds] = useState<number[]>(
    venue?.barredVenues.map((venue) => venue.barredVenueId) || [],
  );
  const [columnDefs, setColumnDefs] = useState([]);
  useEffect(() => {
    setColumnDefs(getBarredVenuesColDefs(venueOptions, selectedVenueIds));
  }, [venueOptions, selectedVenueIds]);
  const handleInputChange = (field: string, value: any) => {
    const updatedFormData = {
      ...venue,
      [field]: value,
    };
    setFormData(updatedFormData);
    onChange(updatedFormData);
    if (validationErrors?.[field]) {
      updateValidationErrrors(field, null);
    }
  };
  const addNewBarredVenue = () => {
    setBarredVenueTableRows((prev) => [...prev, { barredVenueId: null }]);
  };
  const onCellClicked = (e) => {
    const { column, rowIndex } = e;
    if (column.colId === 'delete') {
      setSelectedVenueIds(selectedVenueIds.filter((id) => id !== e.node.data.barredVenueId));
      const updatedBarredVenueTableRows = [
        ...barredVenueTableRows.slice(0, rowIndex),
        ...barredVenueTableRows.slice(rowIndex + 1),
      ];
      setBarredVenueTableRows(updatedBarredVenueTableRows);
      const barredVenues = updatedBarredVenueTableRows.filter((x) => !x.barredVenueId);
      handleInputChange('barredVenues', barredVenues);
    }
  };
  const handleCellValueChange = (e) => {
    const { column, value, rowIndex } = e;
    const updatedBarredVenueRows = [...barredVenueTableRows];
    updatedBarredVenueRows[rowIndex][column.colId] = value;
    setBarredVenueTableRows(updatedBarredVenueRows);
    const updatedFormData = {
      ...venue,
      barredVenues: updatedBarredVenueRows,
    };
    onChange(updatedFormData);
    setSelectedVenueIds([...selectedVenueIds, value]);
  };
  return (
    <>
      <label className="grid grid-cols-[100px_minmax(100px,350px)]  gap-10   w-full">
        <p className="text-primary-input-text">Barring Clause</p>
        <TextArea
          testId="barring-clause"
          id="barringClause"
          placeholder="Enter Barring Clause"
          className="w-full max-h-32 min-h-[50px]  justify-between"
          value={formData.barringClause}
          onChange={(e) => handleInputChange('barringClause', e.target.value)}
          disabled={disabled}
        />
      </label>
      <div className="grid grid-cols-2 gap-7 ">
        <div className="flex flex-col gap-5 pt-5 ">
          <p className="text-primary-input-text">Barring Weeks</p>
          <div className="flex flex-col">
            <label htmlFor="" className="grid grid-cols-[100px_minmax(200px,30px)] gap-10 justify-items-start  w-full">
              <p className="text-primary-input-text">Pre Show</p>
              <TextInput
                testId="barring-preshow-weeks"
                id="preShow"
                placeholder="Enter Pre Show Weeks"
                type="number"
                className="w-full justify-between"
                value={formData.preShow + ''}
                onChange={(e) => handleInputChange('preShow', parseFloat(e.target.value))}
                disabled={disabled}
              />
            </label>
            {validationErrors.preShow && <small className="text-primary-red">{validationErrors.preShow}</small>}
          </div>
          <div className="flex flex-col">
            <label htmlFor="" className="grid grid-cols-[100px_minmax(200px,30px)] gap-10 justify-items-start  w-full">
              <p className="text-primary-input-text">Post Show</p>
              <TextInput
                testId="barring-postshow-weeks"
                id="address2"
                placeholder="Enter Post Show Weeks"
                type="number"
                className="w-full justify-between"
                value={formData.postShow + ''}
                onChange={(e) => handleInputChange('postShow', parseFloat(e.target.value))}
                disabled={disabled}
              />
            </label>
            {validationErrors.postShow && <small className="text-primary-red">{validationErrors.postShow}</small>}
          </div>
          <div className="flex flex-col">
            <label htmlFor="" className="grid grid-cols-[100px_minmax(300px,_1fr)] gap-10 justify-between  w-full">
              <p className="text-primary-input-text">Barring Miles</p>
              <TextInput
                testId="barring-miles"
                id="barringMiles"
                placeholder="Enter Barring Miles"
                type="number"
                className="w-full justify-between"
                inputClassName="w-full"
                value={formData.barringMiles + ''}
                onChange={(e) => handleInputChange('barringMiles', parseFloat(e.target.value))}
                disabled={disabled}
              />
            </label>
            {validationErrors.barringMiles && (
              <small className="text-primary-red">{validationErrors.barringMiles}</small>
            )}
          </div>
        </div>
        <div className=" ">
          <div className="flex justify-end pb-3">
            <Button
              onClick={addNewBarredVenue}
              testId="add-barred-venue-btn"
              text="Add Barred Venue"
              className="w-32"
              disabled={disabled}
            />
          </div>
          <Table
            testId="barred-venues-table"
            onCellClicked={onCellClicked}
            styleProps={styleProps}
            columnDefs={columnDefs}
            rowData={barredVenueTableRows}
            onCellValueChange={handleCellValueChange}
          />
        </div>
      </div>
    </>
  );
};

export default VenueBarringForm;
