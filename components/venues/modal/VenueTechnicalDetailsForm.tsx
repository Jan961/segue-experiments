import Button from 'components/core-ui-lib/Button';
import TextArea from 'components/core-ui-lib/TextArea';
import TextInput from 'components/core-ui-lib/TextInput';
import { initialVenueTechnicalDetails } from 'config/Venue';
import { useState } from 'react';

type VenueTechnicalDetailsFormProps = {
  validationErrors?: Record<string, string>;
  onChange: (data: any) => void;
};
const VenueTechnicalDetailsForm = ({ validationErrors, onChange }: VenueTechnicalDetailsFormProps) => {
  const [formData, setFormData] = useState(initialVenueTechnicalDetails);
  const handleInputChange = (field: string, value: any) => {
    const updatedFormData = {
      ...formData,
      [field]: value,
    };
    setFormData(updatedFormData);
    onChange(updatedFormData);
  };
  return (
    <>
      <div className="flex flex-row  justify-between">
        <div className="flex flex-col">
          <label htmlFor="" className="flex flex-row gap-10 justify-between  w-[700px]">
            <p className="text-primary-input-text">Tech Specs URL</p>
            <TextInput
              placeholder="Enter Tech Specs URL"
              type=""
              className="w-full justify-between"
              inputClassName="w-full"
              value={formData.techSpecsUrl}
              onChange={(e) => handleInputChange('techSpecsUrl', e.target.value)}
            />
          </label>
          {validationErrors.techSpecsUrl && <small className="text-primary-red">{validationErrors.techSpecsUrl}</small>}
        </div>
        <Button text="Upload Venue Tech Spec" />
      </div>
      <div className="grid grid-cols-2 gap-5 pt-5">
        <div className="flex flex-col gap-5">
          <label htmlFor="" className="grid grid-cols-[90px_minmax(300px,_1fr)] gap-10 justify-between  w-full">
            <p className="text-primary-input-text">LX Desk</p>
            <TextInput
              placeholder="Enter Tech LX Desk"
              type=""
              className="w-full justify-between"
              inputClassName="w-full"
              value={formData.techLXDesk}
              onChange={(e) => handleInputChange('techLXDesk', e.target.value)}
            />
          </label>
          <label htmlFor="" className="grid grid-cols-[90px_minmax(300px,_1fr)] gap-10 justify-between  w-full">
            <p className="text-primary-input-text">LX Notes</p>
            <TextArea
              placeholder="Notes Field"
              className="!w-[380px] max-h-40 min-h-[50px]  justify-between"
              value={formData.techLXNotes}
              onChange={(e) => handleInputChange('techLXNotes', e.target.value)}
            />
          </label>
          <label htmlFor="" className="grid grid-cols-[90px_minmax(300px,_1fr)] gap-10 justify-between  w-full">
            <p className="text-primary-input-text">Stage Size</p>
            <TextInput
              placeholder="Enter Stage Size"
              type=""
              className="w-full justify-between"
              inputClassName="w-full"
              value={formData.stageSize}
              onChange={(e) => handleInputChange('stageSize', e.target.value)}
            />
          </label>
        </div>
        <div className="flex flex-col gap-5">
          <label htmlFor="" className="grid grid-cols-[90px_minmax(300px,_1fr)] gap-10 justify-between  w-full">
            <p className="text-primary-input-text">Sound Desk</p>
            <TextInput
              id="soundDesk"
              placeholder="Enter Sound Desk"
              type=""
              className="w-full justify-between"
              inputClassName="w-full"
              value={formData.soundDesk}
              onChange={(e) => handleInputChange('soundDesk', e.target.value)}
            />
          </label>
          <label htmlFor="" className="grid grid-cols-[90px_minmax(300px,_1fr)] gap-10 justify-between  w-full">
            <p className="text-primary-input-text">Sound Notes</p>
            <TextArea
              id="soundNotes"
              placeholder="Notes Field"
              className="!w-[380px] max-h-40 min-h-[50px]  justify-between"
              value={formData.soundNotes}
              onChange={(e) => handleInputChange('soundNotes', e.target.value)}
            />
          </label>
          <label htmlFor="" className="grid grid-cols-[90px_minmax(300px,_1fr)] gap-10 justify-between  w-full">
            <p className="text-primary-input-text">Grid Height</p>
            <TextInput
              id="gridHeight"
              placeholder="Enter Grid Height"
              type=""
              className="w-full justify-between"
              inputClassName="w-full"
              value={formData.gridHeight}
              onChange={(e) => handleInputChange('gridHeight', e.target.value)}
            />
          </label>
        </div>
        <label className="grid grid-cols-[90px_minmax(100px,_1fr)] col-span-2 gap-10 justify-between  w-full">
          <p className="text-primary-input-text">Flags</p>
          <TextArea
            id="flags"
            placeholder="Notes Field"
            className="w-full max-h-40 min-h-[50px]  justify-between"
            value={formData.flags}
            onChange={(e) => handleInputChange('flags', e.target.value)}
          />
        </label>
      </div>
    </>
  );
};

export default VenueTechnicalDetailsForm;
