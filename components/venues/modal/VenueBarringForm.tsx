import { barredVenues, styleProps } from 'components/bookings/table/tableConfig';
import Button from 'components/core-ui-lib/Button';
import Table from 'components/core-ui-lib/Table';
import TextArea from 'components/core-ui-lib/TextArea';
import TextInput from 'components/core-ui-lib/TextInput';
import { initialVenueBarringRules } from 'config/Venue';
import { useState } from 'react';

type VenueBarringFormProps = {
  onChange: (data: any) => void;
};
const VenueBarringForm = ({ onChange }: VenueBarringFormProps) => {
  const [formData, setFormData] = useState(initialVenueBarringRules);
  const handleInputChange = (field: string, value: any) => {
    const updatedFormData = {
      ...formData,
      [field]: value,
    };
    setFormData(updatedFormData);
    onChange(updatedFormData);
  };
  const addNewBarredVenue = () => {
    console.log('Adding new venue is in Progress	');
  };
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
          <label htmlFor="" className="grid grid-cols-[90px_minmax(200px,30px)] gap-10 justify-items-start  w-full">
            <p className="text-primary-input-text">Pre Show</p>
            <TextInput
              id="preShow"
              placeholder="Enter Pre Show Weeks"
              type="number"
              className="w-full justify-between"
              value={formData.preShow}
              onChange={(e) => handleInputChange('preShow', e.target.value)}
            />
          </label>
          <label htmlFor="" className="grid grid-cols-[90px_minmax(200px,30px)] gap-10 justify-items-start  w-full">
            <p className="text-primary-input-text">Post Show</p>
            <TextInput
              id="address2"
              placeholder="Enter Post Show Weeks"
              type="number"
              className="w-full justify-between"
              value={formData.postShow}
              onChange={(e) => handleInputChange('postShow', e.target.value)}
            />
          </label>
          <label htmlFor="" className="grid grid-cols-[90px_minmax(300px,_1fr)] gap-10 justify-between  w-full">
            <p className="text-primary-input-text">Barring Miles</p>
            <TextInput
              id="barringMiles"
              placeholder="Enter Barring Miles"
              type="number"
              className="w-full justify-between"
              inputClassName="w-full"
              value={formData.barringMiles}
              onChange={(e) => handleInputChange('barringMiles', e.target.value)}
            />
          </label>
        </div>
        <div className=" ">
          <div className="flex justify-end pb-3">
            <Button onClick={addNewBarredVenue} text="Add Barred Venue" className="w-32" />
          </div>
          <Table styleProps={styleProps} columnDefs={barredVenues} rowData={[]} />
        </div>
      </div>
    </>
  );
};

export default VenueBarringForm;
