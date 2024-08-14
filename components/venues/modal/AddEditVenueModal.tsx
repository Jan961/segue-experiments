import { useCallback, useMemo, useState } from 'react';
import Button from 'components/core-ui-lib/Button';
import PopupModal from 'components/core-ui-lib/PopupModal';
import { SelectOption } from 'components/core-ui-lib/Select/Select';
import TextArea from 'components/core-ui-lib/TextArea/TextArea';
import ConfirmationDialog from 'components/core-ui-lib/ConfirmationDialog';
import { initialVenueState } from 'config/venue';
import schema from './addEditVenuesValidationSchema';
import MainVenueForm from './MainVenueForm';
import VenueAddressForm from './VenueAddressForm';
import VenueTechnicalDetailsForm from './VenueTechnicalDetailsForm';
import VenueBarringForm from './VenueBarringForm';
import axios from 'axios';
import { UiTransformedVenue } from 'utils/venue';
import { debug } from 'utils/logging';
import VenueContactForm from './VenueContactsForm';
import { ConfVariant } from 'components/core-ui-lib/ConfirmationDialog/ConfirmationDialog';
import Loader from 'components/core-ui-lib/Loader';
import useAxiosCancelToken from 'hooks/useCancelToken';
import { isNullOrEmpty } from 'utils';
import { headlessUploadMultiple } from 'requests/upload';

interface AddEditVenueModalProps {
  visible: boolean;
  venueFamilyOptionList: SelectOption[];
  countryOptions: SelectOption[];
  venueRoleOptionList: SelectOption[];
  venue?: UiTransformedVenue;
  onClose: (isSuccess?: boolean) => void;
  fetchVenues: (payload?: any) => Promise<void>;
  setIsLoading: (bool: boolean) => void;
}

export default function AddEditVenueModal({
  venue,
  visible,
  venueFamilyOptionList,
  venueRoleOptionList,
  countryOptions,
  onClose,
  fetchVenues,
  setIsLoading,
}: AddEditVenueModalProps) {
  const [formData, setFormData] = useState({ ...initialVenueState, ...(venue || {}) });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const hasErrors = useMemo(() => Object.values(validationErrors).some((x) => x), [validationErrors]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [fileList, setFileList] = useState<FormData[]>([]);
  const [deleteList, setDeleteList] = useState<number[]>([]);
  const cancelToken = useAxiosCancelToken();
  const handleInputChange = (field: string, value: any) => {
    let sanitizedValue = value;
    if (field === 'venueCode') {
      sanitizedValue = sanitizedValue?.replace(/[^a-zA-Z]/g, '').toUpperCase();
    }
    setFormData({
      ...formData,
      [field]: sanitizedValue,
    });
  };

  const createVenue = async (venue: UiTransformedVenue) => {
    try {
      const { data } = await axios.post('/api/venue/create', venue, { cancelToken });
      onClose(true);
      return data;
    } catch (e) {
      debug('Error creating venue', e);
    }
  };

  const updateVenue = async (venue: UiTransformedVenue) => {
    try {
      const { data } = await axios.post('/api/venue/update/' + venue.id, venue, { cancelToken });
      onClose(true);
      return data;
    } catch (e) {
      debug('Error updating venue', e);
    }
  };

  const handleSaveAndClose = async () => {
    setIsSaving(true);
    setIsLoading(true);
    const isValid = await validateVenue(formData);
    if (isValid) {
      const apiResponse = formData.id ? await updateVenue(formData) : await createVenue(formData);
      await deleteFiles();
      await saveFiles(apiResponse);
    }
    await fetchVenues();
    setIsLoading(false);
    setIsSaving(false);
  };

  const deleteFiles = async () => {
    await Promise.all(
      deleteList.map(async (file) => {
        try {
          await axios.post('/api/venue/techSpecs/delete', { fileId: file });
        } catch (exception) {
          console.log(exception);
        }
      }),
    );
  };

  async function validateVenue(data: UiTransformedVenue) {
    try {
      await schema.validate({ ...data }, { abortEarly: false });
      return true;
    } catch (validationErrors) {
      const errors = {};
      validationErrors.inner.forEach((error) => {
        errors[error.path] = error.message;
      });
      setValidationErrors(errors);
      console.log('validation Errors', errors);
      return false;
    }
  }

  const onChange = (data = {}) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const updateValidationErrors = (key: string, value: string) => {
    setValidationErrors((prev) => ({ ...prev, [key]: value }));
  };

  const toggleDeleteConfirmation = useCallback(() => {
    setShowDeleteConfirmation((status) => !status);
  }, [setShowDeleteConfirmation]);

  const deleteVenue = useCallback(async () => {
    toggleDeleteConfirmation();
    setIsDeleting(true);
    try {
      await axios.post('/api/venue/delete/' + venue.id, {}, { cancelToken });
      onClose(true);
    } catch (e) {
      debug('Error updating venue', e);
    }
    setIsDeleting(false);
  }, [onClose, toggleDeleteConfirmation, venue.id]);

  const saveFiles = async (venueResponse) => {
    const callBack = async (response) => {
      if (!isNullOrEmpty(response)) {
        const fileRec = {
          FileId: response.data.id,
          VenueId: venueResponse.Id,
          Description: 'Tech Spec',
        };
        await axios.post('/api/venue/techSpecs/create', fileRec);
      }
    };
    const newFileList = [];

    const fileArr = fileList.map((file: any) => file?.file);
    for (const file of fileArr) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('path', 'techSpecs');
      newFileList.push(formData);
    }
    await headlessUploadMultiple(newFileList, callBack, false);
  };
  return (
    <>
      <PopupModal
        onClose={onClose}
        title="Add / Edit Venue"
        show={visible}
        panelClass="relative h-[95vh] overflow-x-auto pb-4"
        titleClass="text-xl text-primary-navy"
      >
        <form className="w-[1026px]">
          <h2 className="text-xl text-primary-navy font-bold">Main</h2>
          <div className="grid grid-cols-2 gap-5">
            <MainVenueForm
              venue={formData}
              venueFamilyOptionList={venueFamilyOptionList}
              onChange={onChange}
              validationErrors={validationErrors}
              updateValidationErrrors={updateValidationErrors}
            />
          </div>
          <h2 className="text-xl text-primary-navy font-bold pt-7">Addresses</h2>
          <div className="grid grid-cols-2 gap-5">
            <VenueAddressForm
              countryOptions={countryOptions}
              venue={formData}
              onChange={onChange}
              validationErrors={validationErrors}
              updateValidationErrrors={updateValidationErrors}
            />
          </div>
          <div className="pt-7">
            <VenueContactForm
              venueRoleOptionList={venueRoleOptionList}
              venue={formData}
              contactsList={formData.venueContacts}
              onChange={onChange}
            />
          </div>
          <div className="pt-7">
            <h2 className="text-xl text-primary-navy font-bold ">Technical</h2>
            <VenueTechnicalDetailsForm
              venue={formData}
              onChange={onChange}
              validationErrors={validationErrors}
              updateValidationErrrors={updateValidationErrors}
              setFileList={setFileList}
              setDeleteList={setDeleteList}
            />
            <div className="pt-7 ">
              <h2 className="text-xl text-primary-navy font-bold ">Barring</h2>
              <VenueBarringForm
                venue={formData}
                validationErrors={validationErrors}
                onChange={onChange}
                updateValidationErrrors={updateValidationErrors}
              />
            </div>
            <div className="pt-7">
              <h2 className="text-xl text-primary-navy font-bold  pb-2">Confidential Warning Notes</h2>
              <TextArea
                testId="confidential-warning-notes"
                id="confidentialNotes"
                placeholder="Notes Field"
                className="w-full max-h-40 min-h-[50px] justify-between"
                value={formData.confidentialNotes}
                onChange={(e) => handleInputChange('confidentialNotes', e.target.value)}
              />
            </div>
            <div className="flex gap-4 pt-4 float-right">
              <Button
                onClick={onClose}
                variant="secondary"
                testId="add-venues-cancel-btn"
                text="Cancel"
                className="w-32"
              />
              <Button
                disabled={!venue?.id || isDeleting || isSaving}
                onClick={toggleDeleteConfirmation}
                variant="tertiary"
                text={isDeleting ? 'Deleting Venue...' : 'Delete Venue'}
                className="w-32"
              >
                {isDeleting && <Loader variant="lg" iconProps={{ stroke: '#FFF' }} />}
              </Button>
              <Button
                testId="add-venues-save-and-close-btn"
                disabled={isSaving || isDeleting}
                text={isSaving ? 'Saving...' : 'Save and Close'}
                className="w-32 mb-4"
                onClick={handleSaveAndClose}
              >
                {isSaving && <Loader variant="lg" iconProps={{ stroke: '#FFF' }} />}
              </Button>
            </div>
          </div>
          <div className="flex justify-end float-right w-full">
            {hasErrors && <p className="text-primary-red pb-3">Please fill all required fields</p>}
          </div>
        </form>
        <ConfirmationDialog
          variant={ConfVariant.Delete}
          show={showDeleteConfirmation}
          onYesClick={deleteVenue}
          onNoClick={toggleDeleteConfirmation}
          hasOverlay={false}
        />
      </PopupModal>
    </>
  );
}
