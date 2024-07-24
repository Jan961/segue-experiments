import Button from 'components/core-ui-lib/Button';
import TextArea from 'components/core-ui-lib/TextArea';
import TextInput from 'components/core-ui-lib/TextInput';
import { initialVenueTechnicalDetails } from 'config/venue';
import { useState } from 'react';
import { UiTransformedVenue } from 'utils/venue';
import { UploadModal } from '../../core-ui-lib';
import { UploadedFile } from '../../core-ui-lib/UploadModal/interface';

interface VenueTechnicalDetailsFormProps {
  venue: Partial<UiTransformedVenue>;
  validationErrors?: Record<string, string>;
  onChange: (data: any) => void;
  updateValidationErrrors?: (key: string, value: string) => void;
  fileList: any;
  setFileList: (data: any) => void;
  setFilesToDelete: (data: any) => void;
  filesToDelete: any;
}

const VenueTechnicalDetailsForm = ({
  venue,
  validationErrors,
  onChange,
  updateValidationErrrors,
  fileList,
  setFileList,
  setFilesToDelete,
  filesToDelete,
}: VenueTechnicalDetailsFormProps) => {
  const [formData, setFormData] = useState<Partial<UiTransformedVenue>>({ ...initialVenueTechnicalDetails, ...venue });
  const [uploadVisible, setUploadVisible] = useState<boolean>(false);
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

  const onSave = async (files) => {
    const newFileList = [...fileList];
    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file.file);
      formData.append('path', 'techSpecs');
      newFileList.push(formData);
    }
    setFileList(newFileList);
    setUploadVisible(false);
  };

  const makeWidgets = async () => {
    const newFileWidgets = [];

    // Process fileList
    fileList.forEach((file) => {
      const tempFile = file.get('file');
      if (tempFile !== 'undefined') {
        const widget: UploadedFile = {
          size: tempFile.size,
          name: tempFile.name,
          imageUrl: URL.createObjectURL(tempFile),
        };

        newFileWidgets.push(widget);
      }
    });

    // Process venue files
    for (const file of venue.files) {
      console.log(file);
      const response = await fetch(file.FileUrl);
      const blob = await response.blob();

      const tempFile = new File([blob], file.name, { type: blob.type });
      const widget: UploadedFile = {
        size: tempFile.size,
        name: tempFile.name,
        imageUrl: file.imageUrl,
        fileLocation: file.fileLocation,
        fileId: file.id,
      };
      console.log(widget);
      newFileWidgets.push(widget);
    }

    // Set the state once with the accumulated widgets
    setFileWidgets(newFileWidgets);
  };

  const [fileWidgets, setFileWidgets] = useState<UploadedFile[]>([]);

  // docs,spreadsheets
  // 10mb

  return (
    <>
      {uploadVisible && (
        <UploadModal
          title="Upload Tech Specs"
          visible={uploadVisible}
          info=""
          allowedFormats={['image/jpg', 'image/jpeg', 'document/pdf', 'image/png']}
          onClose={() => {
            setUploadVisible(false);
          }}
          onSave={onSave}
          value={fileWidgets}
          isMultiple={true}
          maxFiles={20}
          maxFileSize={10240 * 1024}
          customHandleFileDelete={async (file) => {
            console.log(file);
            if (file?.fileLocation && file?.fileId) {
              console.log('already uploaded');
              setFilesToDelete((prevFilesToDelete) => [...prevFilesToDelete, file]);
            } else {
              const fileIndex = fileList.findIndex((files) => {
                const tempFile = files.get('file');
                return tempFile.name === file.name;
              });
              if (fileIndex !== -1) {
                console.log('found');
                const updatedFileList = [...fileList];
                updatedFileList.splice(fileIndex, 1);
                setFileList(updatedFileList);
                console.log(updatedFileList);
              }
            }
            setTimeout(() => {
              console.log(filesToDelete); // Check the updated state here
            }, 0);
          }}
        />
      )}
      <div className="flex flex-row  justify-between">
        <div className="flex flex-col">
          <label
            htmlFor="techSpecsUrl"
            className="grid grid-cols-[100px_minmax(500px,_1fr)] gap-10 justify-between  w-full"
          >
            <div className="text-primary-input-text text-no-wrap whitespace-normal">Tech Specs URL</div>
            <TextInput
              id="techSpecsUrl"
              placeholder="Enter Tech Specs URL"
              className="w-full justify-between"
              inputClassName="w-full"
              value={formData.techSpecsUrl}
              onChange={(e) => handleInputChange('techSpecsUrl', e.target.value)}
            />
          </label>
          {validationErrors.techSpecsUrl && <small className="text-primary-red">{validationErrors.techSpecsUrl}</small>}
        </div>
        <Button
          text="Upload Venue Tech Spec"
          onClick={async () => {
            setFileWidgets([]);
            await makeWidgets();
            setUploadVisible(true);
          }}
        />
      </div>
      <div className="grid grid-cols-2 gap-5 pt-5">
        <div className="flex flex-col gap-5">
          <label htmlFor="" className="grid grid-cols-[100px_minmax(300px,_1fr)] gap-10 justify-between  w-full">
            <p className="text-primary-input-text">LX Desk</p>
            <TextInput
              placeholder="Enter LX Desk"
              className="w-full justify-between"
              inputClassName="w-full"
              value={formData.techLXDesk}
              onChange={(e) => handleInputChange('techLXDesk', e.target.value)}
            />
          </label>
          <label htmlFor="" className="grid grid-cols-[100px_minmax(300px,_1fr)] gap-10 justify-between  w-full">
            <p className="text-primary-input-text">LX Notes</p>
            <TextArea
              placeholder="Notes Field"
              className="!w-full max-h-40 min-h-[50px]  justify-between"
              value={formData.techLXNotes}
              onChange={(e) => handleInputChange('techLXNotes', e.target.value)}
            />
          </label>
          <label htmlFor="" className="grid grid-cols-[100px_minmax(300px,_1fr)] gap-10 justify-between  w-full">
            <p className="text-primary-input-text">Stage Size</p>
            <TextInput
              placeholder="Enter Stage Size"
              className="w-full justify-between"
              inputClassName="w-full"
              value={formData.stageSize}
              onChange={(e) => handleInputChange('stageSize', e.target.value)}
            />
          </label>
        </div>
        <div className="flex flex-col gap-5">
          <label htmlFor="" className="grid grid-cols-[100px_minmax(300px,_1fr)] gap-10 justify-between  w-full">
            <p className="text-primary-input-text">Sound Desk</p>
            <TextInput
              id="soundDesk"
              placeholder="Enter Sound Desk"
              className="w-full justify-between"
              inputClassName="w-full"
              value={formData.soundDesk}
              onChange={(e) => handleInputChange('soundDesk', e.target.value)}
            />
          </label>
          <label htmlFor="" className="grid grid-cols-[100px_minmax(300px,_1fr)] gap-10 justify-between  w-full">
            <p className="text-primary-input-text">Sound Notes</p>
            <TextArea
              id="soundNotes"
              placeholder="Notes Field"
              className="!w-full max-h-40 min-h-[50px]  justify-between"
              value={formData.soundNotes}
              onChange={(e) => handleInputChange('soundNotes', e.target.value)}
            />
          </label>
          <label htmlFor="" className="grid grid-cols-[100px_minmax(300px,_1fr)] gap-10 justify-between  w-full">
            <p className="text-primary-input-text">Grid Height</p>
            <TextInput
              id="gridHeight"
              placeholder="Enter Grid Height"
              className="w-full justify-between"
              inputClassName="w-full"
              value={formData.gridHeight}
              onChange={(e) => handleInputChange('gridHeight', e.target.value)}
            />
          </label>
        </div>
        <label className="grid grid-cols-[100px_minmax(100px,_1fr)] col-span-2 gap-10 justify-between  w-full">
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
