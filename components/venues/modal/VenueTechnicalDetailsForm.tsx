import TextArea from 'components/core-ui-lib/TextArea';
import TextInput from 'components/core-ui-lib/TextInput';
import { initialVenueTechnicalDetails } from 'config/venue';
import { useState } from 'react';
import { UiTransformedVenue } from 'utils/venue';

import { TechSpecTable } from '../techSpecsTable/TechSpecTable';

interface VenueTechnicalDetailsFormProps {
  venue: Partial<UiTransformedVenue>;
  validationErrors?: Record<string, string>;
  onChange: (data: any) => void;
  updateValidationErrrors?: (key: string, value: string) => void;
  setFileList: (data: any) => void;
  setDeleteList: (data: any) => void;
  disabled?: boolean;
}

const VenueTechnicalDetailsForm = ({
  venue,
  validationErrors,
  onChange,
  updateValidationErrrors,
  setFileList,
  setDeleteList,
  disabled,
}: VenueTechnicalDetailsFormProps) => {
  const [formData, setFormData] = useState<Partial<UiTransformedVenue>>({ ...initialVenueTechnicalDetails, ...venue });

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

  return (
    <>
      <div className="flex flex-row  justify-between">
        <div className="flex flex-col">
          <label
            htmlFor="techSpecsUrl"
            className="grid grid-cols-[100px_minmax(500px,_1fr)] gap-10 justify-between  w-full"
          >
            <div className="text-primary-input-text text-no-wrap whitespace-normal">Tech Specs URL</div>
            <TextInput
              testId="technical-techSpecsUrl"
              id="techSpecsUrl"
              placeholder="Enter Tech Specs URL"
              className="w-full justify-between"
              inputClassName="w-full"
              value={formData.techSpecsUrl}
              onChange={(e) => handleInputChange('techSpecsUrl', e.target.value)}
              disabled={disabled}
            />
          </label>
          {validationErrors.techSpecsUrl && <small className="text-primary-red">{validationErrors.techSpecsUrl}</small>}
        </div>
      </div>
      <TechSpecTable
        venueId={venue.id}
        setFilesToSend={setFileList}
        setFilesToDelete={setDeleteList}
        disabled={disabled}
      />
      <div className="grid grid-cols-2 gap-5 pt-5">
        <div className="flex flex-col gap-5">
          <label htmlFor="" className="grid grid-cols-[100px_minmax(300px,_1fr)] gap-10 justify-between  w-full">
            <p className="text-primary-input-text">LX Desk</p>
            <TextInput
              testId="technical-lx-desk"
              placeholder="Enter LX Desk"
              className="w-full justify-between"
              inputClassName="w-full"
              value={formData.techLXDesk}
              onChange={(e) => handleInputChange('techLXDesk', e.target.value)}
              disabled={disabled}
            />
          </label>
          <label htmlFor="" className="grid grid-cols-[100px_minmax(300px,_1fr)] gap-10 justify-between  w-full">
            <p className="text-primary-input-text">LX Notes</p>
            <TextArea
              testId="technical-lx-notes"
              placeholder="Notes Field"
              className="!w-full max-h-40 min-h-[50px]  justify-between"
              value={formData.techLXNotes}
              onChange={(e) => handleInputChange('techLXNotes', e.target.value)}
              disabled={disabled}
            />
          </label>
          <label htmlFor="" className="grid grid-cols-[100px_minmax(300px,_1fr)] gap-10 justify-between  w-full">
            <p className="text-primary-input-text">Stage Size</p>
            <TextInput
              testId="technical-stage-size"
              placeholder="Enter Stage Size"
              className="w-full justify-between"
              inputClassName="w-full"
              value={formData.stageSize}
              onChange={(e) => handleInputChange('stageSize', e.target.value)}
              disabled={disabled}
            />
          </label>
        </div>
        <div className="flex flex-col gap-5">
          <label htmlFor="" className="grid grid-cols-[100px_minmax(300px,_1fr)] gap-10 justify-between  w-full">
            <p className="text-primary-input-text">Sound Desk</p>
            <TextInput
              testId="technical-sound-desk"
              id="soundDesk"
              placeholder="Enter Sound Desk"
              className="w-full justify-between"
              inputClassName="w-full"
              value={formData.soundDesk}
              onChange={(e) => handleInputChange('soundDesk', e.target.value)}
              disabled={disabled}
            />
          </label>
          <label htmlFor="" className="grid grid-cols-[100px_minmax(300px,_1fr)] gap-10 justify-between  w-full">
            <p className="text-primary-input-text">Sound Notes</p>
            <TextArea
              testId="technical-sound-notes"
              id="soundNotes"
              placeholder="Notes Field"
              className="!w-full max-h-40 min-h-[50px]  justify-between"
              value={formData.soundNotes}
              onChange={(e) => handleInputChange('soundNotes', e.target.value)}
              disabled={disabled}
            />
          </label>
          <label htmlFor="" className="grid grid-cols-[100px_minmax(300px,_1fr)] gap-10 justify-between  w-full">
            <p className="text-primary-input-text">Grid Height</p>
            <TextInput
              testId="technical-grid-height"
              id="gridHeight"
              placeholder="Enter Grid Height"
              className="w-full justify-between"
              inputClassName="w-full"
              value={formData.gridHeight}
              onChange={(e) => handleInputChange('gridHeight', e.target.value)}
              disabled={disabled}
            />
          </label>
        </div>
        <label className="grid grid-cols-[100px_minmax(100px,_1fr)] col-span-2 gap-10 justify-between  w-full">
          <p className="text-primary-input-text">Flags</p>
          <TextArea
            testId="technical-flags-notes"
            id="flags"
            placeholder="Notes Field"
            className="w-full max-h-40 min-h-[50px]  justify-between"
            value={formData.flags}
            onChange={(e) => handleInputChange('flags', e.target.value)}
            disabled={disabled}
          />
        </label>
      </div>
    </>
  );
};

export default VenueTechnicalDetailsForm;
