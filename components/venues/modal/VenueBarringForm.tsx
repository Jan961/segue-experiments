import TextArea from 'components/core-ui-lib/TextArea';
import TextInput from 'components/core-ui-lib/TextInput';
import { initialVenueBarringRules } from 'config/venue';
import { useState } from 'react';
import { UiTransformedVenue } from 'utils/venue';

interface VenueBarringFormProps {
  venue: Partial<UiTransformedVenue>;
  validationErrors?: Record<string, string>;
  onChange: (data: any) => void;
  updateValidationErrrors?: (key: string, value: string) => void;
}

const VenueBarringForm = ({ venue, onChange, validationErrors, updateValidationErrrors }: VenueBarringFormProps) => {
  const [formData, setFormData] = useState<Partial<UiTransformedVenue>>({ ...initialVenueBarringRules, ...venue });
  const handleInputChange = (field: string, value: any) => {
    const updatedFormData = {
      ...formData,
      [field]: value,
    };
    setFormData(updatedFormData);
    onChange(updatedFormData);
    if (validationErrors?.[field]) {
      updateValidationErrrors(field, null);
    }
  };
  // const addNewBarredVenue = () => {
  //   console.log('Adding new venue is in Progress	');
  // };
  return (
    <>
      <label className="grid grid-cols-[95px_minmax(100px,350px)]  gap-10   w-full">
        <p className="text-primary-input-text">Barring Clause</p>
        <TextArea
          id="barringClause"
          placeholder="Enter Barring Clause"
          className="w-full max-h-32 min-h-[50px]  justify-between"
          value={formData.barringClause}
          onChange={(e) => handleInputChange('barringClause', e.target.value)}
        />
      </label>
      <div className="grid grid-cols-2 gap-7 ">
        <div className="flex flex-col gap-5 pt-5 ">
          <p className="text-primary-input-text">Barring Weeks</p>
          <div className="flex flex-col">
            <label htmlFor="" className="grid grid-cols-[90px_minmax(200px,30px)] gap-10 justify-items-start  w-full">
              <p className="text-primary-input-text">Pre Show</p>
              <TextInput
                id="preShow"
                placeholder="Enter Pre Show Weeks"
                type="number"
                className="w-full justify-between"
                value={formData.preShow}
                onChange={(e) => handleInputChange('preShow', parseFloat(e.target.value))}
              />
            </label>
            {validationErrors.preShow && <small className="text-primary-red">{validationErrors.preShow}</small>}
          </div>
          <div className="flex flex-col">
            <label htmlFor="" className="grid grid-cols-[90px_minmax(200px,30px)] gap-10 justify-items-start  w-full">
              <p className="text-primary-input-text">Post Show</p>
              <TextInput
                id="address2"
                placeholder="Enter Post Show Weeks"
                type="number"
                className="w-full justify-between"
                value={formData.postShow}
                onChange={(e) => handleInputChange('postShow', parseFloat(e.target.value))}
              />
            </label>
            {validationErrors.postShow && <small className="text-primary-red">{validationErrors.postShow}</small>}
          </div>
          <div className="flex flex-col">
            <label htmlFor="" className="grid grid-cols-[90px_minmax(300px,_1fr)] gap-10 justify-between  w-full">
              <p className="text-primary-input-text">Barring Miles</p>
              <TextInput
                id="barringMiles"
                placeholder="Enter Barring Miles"
                type="number"
                className="w-full justify-between"
                inputClassName="w-full"
                value={formData.barringMiles}
                onChange={(e) => handleInputChange('barringMiles', parseFloat(e.target.value))}
              />
            </label>
            {validationErrors.barringMiles && (
              <small className="text-primary-red">{validationErrors.barringMiles}</small>
            )}
          </div>
        </div>
        {/* <div className=" ">
          <div className="flex justify-end pb-3">
            <Button onClick={addNewBarredVenue} text="Add Barred Venue" className="w-32" />
          </div>
          <Table styleProps={styleProps} columnDefs={barredVenues} rowData={[]} />
        </div> */}
      </div>
    </>
  );
};

export default VenueBarringForm;
