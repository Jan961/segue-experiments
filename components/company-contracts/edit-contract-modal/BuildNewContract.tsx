import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Button, notify } from 'components/core-ui-lib';
import PopupModal from 'components/core-ui-lib/PopupModal';
import { noop } from 'utils';
import useAxiosCancelToken from 'hooks/useCancelToken';
import { PersonDetailsTab } from './tabs/PersonDetailsTab';
import { PreviewTab } from './tabs/PreviewTab';
import ContractDetailsTab from './tabs/ContractDetailsTab';
import LoadingOverlay from 'components/shows/LoadingOverlay';
import { IContractSchedule, IScheduleDay } from '../../contracts/types';
import { useRecoilValue } from 'recoil';
import { productionJumpState } from 'state/booking/productionJumpState';
import ScheduleTab from './tabs/ScheduleTab';
import { ERROR_CODES } from 'config/apiConfig';
import { contractDepartmentState } from 'state/contracts/contractDepartmentState';
import { getDepartmentNameByID } from '../utils';
import { TemplateFormRow, TemplateFormRowPopulated, ContractData } from '../types';
import { contractTemplateState } from 'state/contracts/contractTemplateState';
import { getFileUrl } from 'lib/s3';
import { populateContractData, populateTemplateWithValues } from './utils';

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
  const [activeViewIndex, setActiveViewIndex] = useState(0);
  const [schedule, setSchedule] = useState<IScheduleDay[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const cancelToken = useAxiosCancelToken();
  const departmentMap = useRecoilValue(contractDepartmentState);
  const selectedProduction = useMemo(
    () => productions.find(({ Id }) => Id === contractSchedule.production),
    [contractSchedule?.production, productions],
  );
  const personName = useMemo(() => {
    const { personDetails } = contractPerson || {};
    const { firstName, lastName } = personDetails || {};
    return firstName || lastName ? `${firstName} ${lastName}` : 'Person';
  }, [contractPerson]);

  const selectedTemplateID = contractSchedule.templateId;
  const templateMap = useRecoilValue(contractTemplateState);
  const [docXTemplateFile, setDocXTemplateFile] = useState<File>(null);

  const [templateFormStructure, setTemplateFormStructure] = useState<TemplateFormRow[]>(null);
  const [formData, setFormData] = useState<TemplateFormRowPopulated[]>(null);
  const [contractData, setContractData] = useState<ContractData[]>(null);

  useEffect(() => {
    const fetchTemplateDocument = async () => {
      try {
        const selectedTemplateLocation = getFileUrl(
          Object.values(templateMap).find((template) => template.id === selectedTemplateID).location,
        );
        const response = await axios.get(
          `/api/file/download?location=${encodeURIComponent(selectedTemplateLocation)}`,
          {
            responseType: 'arraybuffer',
          },
        );
        const file = new File([response.data], 'template.docx', {
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        });
        setDocXTemplateFile(file);
      } catch (err) {
        console.error(err, 'Error - failed to fetch template document.');
      }
    };

    const fetchTemplateFormStructure = async (): Promise<TemplateFormRow[]> => {
      try {
        const response = await axios.get('/api/company-contracts/read-template/' + contractSchedule.templateId);
        if (response.data) {
          return response.data;
        }
      } catch (err) {
        console.error(err, 'Error - failed to fetch template form structure.');
      }
    };

    const fetchContractData = async (): Promise<ContractData[]> => {
      try {
        if (!contractId) return [];
        const response = await axios.get('/api/company-contracts/read-data/' + contractId);
        if (response.data) {
          return response.data;
        }
      } catch (err) {
        console.error(err, 'Error - failed to fetch contract data.');
      }
    };

    const populateTemplateFormWithValues = async () => {
      const templateFormStructure = await fetchTemplateFormStructure();
      setTemplateFormStructure(templateFormStructure);
      const contractData = await fetchContractData();
      if (templateFormStructure) {
        const contractDataPopulated = populateContractData(templateFormStructure, contractData);
        setContractData(contractDataPopulated);
        const formData = populateTemplateWithValues(templateFormStructure, contractDataPopulated);
        setFormData(formData);
      }
    };

    const fetchContractSchedule = async (productionId) => {
      try {
        const { data: schedule } = await axios.post('/api/reports/schedule-report', {
          ProductionId: productionId,
          format: 'json',
        });
        setSchedule(schedule.rows);
      } catch (error) {
        console.log('Error fetching contract schedule', error);
      }
    };

    const fetchPersonDetails = async (id: number) => {
      try {
        const response = await axios.get('/api/person/' + id, { cancelToken });
        setContractPerson(response.data);
      } catch (error) {
        onClose();
        notify.error('Error fetching person details. Please try again');
      }
    };

    const loadContract = async () => {
      setLoading(true);
      await fetchPersonDetails(contractSchedule.personId);
      await fetchTemplateDocument();
      await populateTemplateFormWithValues();
      await fetchContractSchedule(contractSchedule.production);
      setLoading(false);
    };

    loadContract();
  }, []);

  const updatePersonDetails = async () => {
    const id = contractSchedule.personId;
    await axios.post('/api/person/update/' + id, contractPerson);
  };

  const createContract = async () => {
    await axios.post('/api/company-contracts/create/contract/', {
      production: contractSchedule.production,
      department: contractSchedule.department,
      role: contractSchedule.role,
      personId: contractSchedule.personId,
      contractData,
      accScheduleJson: schedule,
      templateId: contractSchedule.templateId,
    });
  };

  const updateContract = async () => {
    await axios.post('/api/company-contracts/update-data/', {
      contractId,
      contractData,
    });
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
      if (error?.response?.data?.code === ERROR_CODES.VALIDATION_ERROR) {
        const errors = error.response?.data?.errors || [];
        errors.map((error) => notify.error(error));
      }
    }
  };

  const goToNext = useCallback(() => {
    if (activeViewIndex === 3) {
      return;
    }
    setActiveViewIndex((index) => index + 1);
  }, [activeViewIndex]);

  const updateSchedule = (updatedSchedule: IScheduleDay[]) => {
    setSchedule(updatedSchedule);
  };

  return (
    <PopupModal
      show={visible}
      title="Contract Details"
      titleClass="text-xl text-primary-navy font-bold -mt-2"
      panelClass="h-[95vh] w-[100vw]"
      hasOverflow={false}
      onClose={onClose}
    >
      <div className="flex flex-col justify-between ">
        <div>
          <div className="">
            <div className="text-xl text-primary-navy font-bold w-[50vw]">
              Production - {`${selectedProduction.ShowCode}${selectedProduction.Code}`}
            </div>
            <div className="text-xl text-primary-navy font-bold w-[50vw]">
              Department - {getDepartmentNameByID(contractSchedule.department, departmentMap)}
            </div>
          </div>

          <div className="flex justify-center w-[100%] pt-2 pb-2">
            <div
              className="w-[24vw] border-solid border-2 border-primary-navy text-center rounded cursor-pointer"
              style={{ background: activeViewIndex === 0 ? '#0093C0' : 'white' }}
              onClick={() => setActiveViewIndex(0)}
            >
              {personName} Details
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
              Schedule
            </div>
            <div
              className="w-[24vw] border-solid border-2 border-primary-navy text-center rounded cursor-pointer"
              style={{ background: activeViewIndex === 3 ? '#0093C0' : 'white' }}
              onClick={() => setActiveViewIndex(3)}
            >
              Contract Preview
            </div>
          </div>

          <div className="border-solid border-2 border-primary-navy rounded p-2 h-[70vh] overflow-y-scroll">
            {activeViewIndex === 0 && contractPerson && (
              <div className="flex flex-col gap-8 px-16">
                <PersonDetailsTab person={contractPerson} updateFormData={setContractPerson} height="" />
              </div>
            )}
            {activeViewIndex === 1 && (
              <div className="flex flex-col gap-8 px-16">
                <ContractDetailsTab
                  formData={formData}
                  setFormData={setFormData}
                  contractData={contractData}
                  templateFormStructure={templateFormStructure}
                  setContractData={setContractData}
                />
              </div>
            )}
            {activeViewIndex === 2 && (
              <div className="flex flex-col gap-8">
                <ScheduleTab updateSchedule={updateSchedule} schedule={schedule} />
              </div>
            )}
            {activeViewIndex === 3 && (
              <PreviewTab
                templateFile={docXTemplateFile}
                formData={formData}
                personDetails={contractPerson}
                productionInfo={selectedProduction}
                productionSchedule={schedule}
              />
            )}
          </div>
        </div>

        <div className="w-full mt-4 flex justify-end items-center">
          <Button className="w-33" variant="secondary" text="Cancel" onClick={onClose} />
          {activeViewIndex !== 3 && <Button className="ml-4 w-33" variant="primary" text="Next" onClick={goToNext} />}
          <Button className="ml-4 w-33" variant="primary" text="Save and Close" onClick={onSave} />
        </div>

        {loading && (
          <div className="w-full h-96">
            <LoadingOverlay />
          </div>
        )}
      </div>
    </PopupModal>
  );
};
