import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Button, Label, notify } from 'components/core-ui-lib';
import PopupModal from 'components/core-ui-lib/PopupModal';
import { noop } from 'utils';
import useAxiosCancelToken from 'hooks/useCancelToken';

import { ContractPersonDataForm } from '../ContractPersonDataForm';
import { ContractPreviewDetailsForm } from '../ContractPreviewDetailsDataForm';
import ContractDetails from './ContractDetails';
import LoadingOverlay from 'components/shows/LoadingOverlay';
import { IContractSchedule } from '../types';
import { useRecoilValue } from 'recoil';
import { productionJumpState } from 'state/booking/productionJumpState';
import { transformContractData } from 'transformers/contracts';

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
  const { productions } = useRecoilValue(productionJumpState);
  const [contractPerson, setContractPerson] = useState(null);
  const [contractDetails, setContractDetails] = useState({});
  const [activeViewIndex, setActiveViewIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const selectedProduction = useMemo(
    () => productions.find(({ Id }) => Id === contractSchedule.production),
    [contractSchedule?.production, productions],
  );
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

  const createContract = useCallback(
    async () => axios.post('/api/company-contracts/create', { ...contractSchedule, contractDetails }),
    [contractSchedule, contractDetails],
  );

  const updateContract = async () =>
    axios.post(
      '/api/company-contracts/update/' + contractId,
      transformContractData({
        ...contractSchedule,
        ...contractDetails,
      }),
    );

  const updatePersonDetails = async () => {
    const id = contractSchedule.personId;
    return axios.post('/api/person/update/' + id, contractPerson);
  };

  const onSave = async () => {
    try {
      let promise;
      if (isEdit) {
        await updatePersonDetails();
        promise = updateContract();
      } else {
        promise = createContract();
      }
      notify.promise(
        promise.then(() => {
          router.replace(router.asPath);
          onClose();
        }),
        {
          loading: 'Saving Contract...',
          success: 'Contracted saved successfully',
          error: 'Error saving contract',
        },
      );
    } catch (error) {
      console.log('Error creating/updating contracts', error);
    }
  };

  const goToNext = useCallback(() => {
    if (activeViewIndex === 2) {
      return;
    }
    setActiveViewIndex((index) => index + 1);
  }, [activeViewIndex]);

  return (
    <PopupModal
      show={visible}
      title="Contract Details"
      titleClass="text-xl text-primary-navy font-bold -mt-2"
      hasOverflow={false}
      onClose={onClose}
    >
      <div>
        <div className="w-[82vw]">
          <div className="text-xl text-primary-navy font-bold w-[50vw]">{`${selectedProduction.ShowCode}${selectedProduction.Code}`}</div>
          <div className="text-xl text-primary-navy font-bold w-[50vw]">Department</div>
        </div>
        <div className="flex justify-center w-[100%] pt-2 pb-2">
          <div
            className="w-[24vw] border-solid border-2 border-primary-navy text-center rounded cursor-pointer"
            style={{ background: activeViewIndex === 0 ? '#0093C0' : 'white' }}
            onClick={() => setActiveViewIndex(0)}
          >
            First Name Details
          </div>
          <div
            className="w-[24vw] border-solid border-2 border-primary-navy text-center rounded cursor-pointer"
            style={{ background: activeViewIndex === 1 ? '#0093C0' : 'white' }}
            onClick={() => setActiveViewIndex(1)}
          >
            Contract Details
          </div>
          <div
            className="w-[24vw] border-solid border-2 border-primary-navy text-center rounded cursor-pointer"
            style={{ background: activeViewIndex === 2 ? '#0093C0' : 'white' }}
            onClick={() => setActiveViewIndex(2)}
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
          {activeViewIndex === 0 && contractPerson && (
            <ContractPersonDataForm person={contractPerson} height="h-[70vh]" updateFormData={setContractPerson} />
          )}
          {activeViewIndex === 1 && (
            <div className="flex flex-col gap-8 px-16">
              <Label className="!text-base !font-bold" text="Complete the below to generate the contract" />
              <ContractDetails contract={contractDetails} onChange={setContractDetails} />
            </div>
          )}
          {activeViewIndex === 2 && (
            <ContractPreviewDetailsForm
              contractPerson={contractPerson}
              contractSchedule={contractSchedule}
              contractDetails={contractDetails}
              production={selectedProduction}
              height="70vh"
            />
          )}
        </div>

        <div className="w-full mt-4 flex justify-end items-center">
          <Button className="w-33" variant="secondary" text="Cancel" onClick={onClose} />
          <Button
            className="ml-4 w-33"
            variant="primary"
            text={activeViewIndex === 2 ? 'Save and Return to Contracts' : 'Save and next'}
            onClick={activeViewIndex === 2 ? onSave : goToNext}
          />
        </div>
      </div>
    </PopupModal>
  );
};
