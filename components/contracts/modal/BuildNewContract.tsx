import { Button, Label, notify } from 'components/core-ui-lib';
import PopupModal from 'components/core-ui-lib/PopupModal';

import { ContractPersonDataForm } from '../ContractPersonDataForm';
import { useCallback, useEffect, useState } from 'react';
import { ContractPreviewDetailsForm } from '../ContractPreviewDetailsDataForm';
import { noop } from 'utils';
import ContractDetails from './ContractDetails';
import axios from 'axios';
import LoadingOverlay from 'components/shows/LoadingOverlay';
import { IContractSchedule } from '../types';
import useAxiosCancelToken from 'hooks/useCancelToken';
import { useRouter } from 'next/router';

export interface BuildNewContractProps {
  contractSchedule?: Partial<IContractSchedule>;
  visible: boolean;
  contractId?: number;
  isEdit?: boolean;
  onClose: () => void;
}

export const BuildNewContract = ({
  visible,
  contractSchedule,
  contractId,
  isEdit = false,
  onClose = noop,
}: BuildNewContractProps) => {
  const [mainButtonSelection, setMainButtonSelection] = useState({ name: true, details: false, preview: false });
  const [contractPerson, setContractPerson] = useState(null);
  const [contractDetails, setContractDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const cancelToken = useAxiosCancelToken();
  const fetchPersonDetails = useCallback(
    async (id: number) => {
      setLoading(true);
      try {
        const response = await axios.get('/api/person/' + id, { cancelToken });
        setContractPerson(response.data);
      } catch (error) {
        onClose();
        notify.error('Error fetching person details. Please try again');
      }
      setLoading(false);
    },
    [setContractPerson, cancelToken],
  );

  const fetchContractDetails = useCallback(
    async (id: number) => {
      setLoading(true);
      try {
        const response = await axios.get('/api/company-contracts/read/' + id, { cancelToken });
        setContractDetails(response.data?.contractDetails);
      } catch (error) {
        onClose();
        notify.error('Error fetching contract details. Please try again');
      }
      setLoading(false);
    },
    [setContractDetails, cancelToken],
  );

  useEffect(() => {
    if (contractSchedule.personId) {
      fetchPersonDetails(contractSchedule.personId);
    }
    if (isEdit && contractId) {
      fetchContractDetails(contractId);
    }
  }, [contractSchedule.personId, isEdit, contractId]);

  const handleButtons = (key: string) => {
    const buttons = { name: false, details: false, preview: false };
    buttons[key] = true;
    setMainButtonSelection(buttons);
  };

  const onSave = async () => {
    try {
      const promise = axios.post('/api/contracts/create', { ...contractSchedule, contractDetails });
      notify.promise(promise, {
        loading: 'Saving Contract...',
        success: 'Contracted saved successfully',
        error: 'Error saving contract',
      });
      router.replace(router.asPath);
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <PopupModal
      show={visible}
      title="Contract Details"
      titleClass="text-xl text-primary-navy font-bold -mt-2"
      hasOverflow={false}
      onClose={onClose}
      hasOverlay={true}
    >
      <div className="w-[82vw]">
        <div className="text-xl text-primary-navy font-bold w-[50vw]">PROD CODE</div>
        <div className="text-xl text-primary-navy font-bold w-[50vw]">Department</div>
      </div>
      <div className="flex justify-center w-[100%] pt-2 pb-2">
        <div
          className="w-[24vw] border-solid border-2 border-primary-navy text-center rounded cursor-pointer"
          style={{ background: mainButtonSelection.name ? '#0093C0' : 'white' }}
          onClick={() => handleButtons('name')}
        >
          First Name Details
        </div>
        <div
          className="w-[24vw] border-solid border-2 border-primary-navy text-center rounded cursor-pointer"
          style={{ background: mainButtonSelection.details ? '#0093C0' : 'white' }}
          onClick={() => handleButtons('details')}
        >
          Contract Details
        </div>
        <div
          className="w-[24vw] border-solid border-2 border-primary-navy text-center rounded cursor-pointer"
          style={{ background: mainButtonSelection.preview ? '#0093C0' : 'white' }}
          onClick={() => handleButtons('preview')}
        >
          Contract Preview
        </div>
      </div>
      <div className="border-solid border-2 border-primary-navy rounded p-2 max-h-[70vh] overflow-scroll">
        {loading && (
          <div className="w-full h-96">
            <LoadingOverlay />
          </div>
        )}
        {mainButtonSelection.name && contractPerson && (
          <ContractPersonDataForm person={contractPerson} height="h-[70vh]" updateFormData={noop} />
        )}
        {mainButtonSelection.details && (
          <div className="flex flex-col gap-8 px-16">
            <Label className="!text-base !font-bold" text="Complete the below to generate the contract" />
            <ContractDetails contract={contractDetails} onChange={setContractDetails} />
          </div>
        )}
        {mainButtonSelection.preview && (
          <ContractPreviewDetailsForm
            contractPerson={contractPerson}
            contractSchedule={contractSchedule}
            contractDetails={contractDetails}
            height="h-[70vh]"
          />
        )}
      </div>

      <div className="w-full mt-4 flex justify-end items-center">
        <Button className="w-33" variant="secondary" text="Cancel" onClick={onClose} />
        <Button className="ml-4 w-33" variant="primary" text="Save and Return to Contracts" onClick={onSave} />
      </div>
    </PopupModal>
  );
};
