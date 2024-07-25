import Button from 'components/core-ui-lib/Button';
import TextArea from 'components/core-ui-lib/TextArea';
import TextInput from 'components/core-ui-lib/TextInput';
import { initialVenueTechnicalDetails } from 'config/venue';
import { useEffect, useState } from 'react';
import { UiTransformedVenue } from 'utils/venue';
import { UploadModal } from 'components/core-ui-lib';
import { UploadedFile } from 'components/core-ui-lib/UploadModal/interface';
import { techSpecsFileFormats } from '../techSpecsFileFormats';

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
}: VenueTechnicalDetailsFormProps) => {
  const [formData, setFormData] = useState<Partial<UiTransformedVenue>>({ ...initialVenueTechnicalDetails, ...venue });
  const [uploadVisible, setUploadVisible] = useState<boolean>(false);
  const [fileWidgets, setFileWidgets] = useState<UploadedFile[]>([]);
  useEffect(() => {
    const loadWidgets = async () => {
      await makeWidgets();
    };
    loadWidgets();
  }, [fileList]);

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
    fileList.forEach((file) => {
      const tempFile = file.get('file');
      if (tempFile?.size && tempFile.name) {
        const widget: UploadedFile = {
          size: tempFile.size,
          name: tempFile.name,
          imageUrl: URL.createObjectURL(tempFile),
        };

        newFileWidgets.push(widget);
      }
    });

    for (const file of venue.files) {
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
      newFileWidgets.push(widget);
    }
    setFileWidgets(newFileWidgets);
  };

  return (
    <>
      {uploadVisible && (
        <UploadModal
          title="Upload Tech Specs"
          visible={uploadVisible}
          info="Upload or view this venues tech specs. You can upload a maximum of 30 files each with a maxiumum file size of 15MB."
          allowedFormats={techSpecsFileFormats}
          onClose={() => {
            setUploadVisible(false);
          }}
          onSave={onSave}
          value={fileWidgets}
          isMultiple={true}
          maxFiles={30}
          maxFileSize={15360 * 1024}
          customHandleFileDelete={async (file) => {
            if (file?.fileLocation && file?.fileId) {
              setFilesToDelete((prevFilesToDelete) => [...prevFilesToDelete, file]);
            } else {
              const fileIndex = fileList.findIndex((files) => {
                const tempFile = files.get('file');
                return tempFile.name === file.name;
              });
              if (fileIndex !== -1) {
                const updatedFileList = [...fileList];
                updatedFileList.splice(fileIndex, 1);
                setFileList(updatedFileList);
              }
            }
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
          text={fileWidgets.length > 0 ? 'View/ Edit Tech Specs' : 'Upload Tech Specs'}
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
