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

interface BuildNewContractProps {
  contractSchedule: Partial<IContractSchedule>;
  openNewPersonContract: boolean;
  onClose: () => void;
}

export const BuildNewContract = ({ openNewPersonContract, contractSchedule, onClose }: BuildNewContractProps) => {
  const [mainButtonSelection, setMainButtonSelection] = useState({ name: true, details: false, preview: false });
  const [contractPerson, setContractPerson] = useState(null);
  const [contractDetails, setContractDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const fetchPersonDetails = useCallback(
    async (id: number, signal: any) => {
      setLoading(true);
      const response = await axios.get('/api/person/' + id, { signal });
      setContractPerson(response.data);
      setLoading(false);
    },
    [setContractPerson],
  );

  useEffect(() => {
    const abortController = new AbortController();
    if (contractSchedule.personId) {
      notify.promise(fetchPersonDetails(contractSchedule.personId, abortController.signal), {
        loading: 'Loading...',
        success: 'Success',
        error: 'Error',
      });
    }
    return () => abortController.abort();
  }, [contractSchedule.personId]);

  const handleButtons = (key: string) => {
    const buttons = { name: false, details: false, preview: false };
    buttons[key] = true;
    setMainButtonSelection(buttons);
  };

  return (
    <PopupModal
      show={openNewPersonContract}
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
      <div className="border-solid border-2 border-primary-navy  rounded p-2 max-h-[70vh] overflow-scroll">
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
        {mainButtonSelection.preview && <ContractPreviewDetailsForm height="h-[70vh]" />}
      </div>

      <div className="w-full mt-4 flex justify-end items-center">
        <Button className="w-33" variant="secondary" text="Cancel" onClick={onClose} />
        <Button className="ml-4 w-33" variant="primary" text="Save and Return to Contracts" onClick={onClose} />
      </div>
    </PopupModal>
  );
};
