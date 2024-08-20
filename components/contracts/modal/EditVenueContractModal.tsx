import PopupModal from 'components/core-ui-lib/PopupModal';
import classNames from 'classnames';
import Button from 'components/core-ui-lib/Button';
import Select from 'components/core-ui-lib/Select';
import DateInput from 'components/core-ui-lib/DateInput';
import TextArea from 'components/core-ui-lib/TextArea/TextArea';
import Checkbox from 'components/core-ui-lib/Checkbox';
import TextInput from 'components/core-ui-lib/TextInput';
import {
  allStatusOptions,
  contractsKeyStatusMap,
  dealTypeOptions,
  initialEditContractFormData,
} from 'config/contracts';
import { useRecoilValue } from 'recoil';
import { useRouter } from 'next/router';
import { currentProductionSelector } from 'state/booking/selectors/currentProductionSelector';
import { addEditContractsState } from 'state/contracts/contractsState';
import useAxios from 'hooks/useAxios';
import axios from 'axios';
import { bookingStatusMap } from 'config/bookings';
import { userState } from 'state/account/userState';
import { useEffect, useMemo, useState } from 'react';
import { Venue } from 'prisma/generated/prisma-client';
import {
  DealMemoContractFormData,
  DealMemoHoldType,
  SaveContractBookingFormState,
  SaveContractFormState,
  VenueContractFormData,
} from 'interfaces';
import ConfirmationDialog from 'components/core-ui-lib/ConfirmationDialog';
import { formattedDateWithDay, toISO } from 'services/dateService';
import { EditDealMemoContractModal } from './EditDealMemoContractModal';
import { isNullOrEmpty, transformToOptions } from 'utils';
import LoadingOverlay from 'components/shows/LoadingOverlay';
import { attachmentsColDefs, contractsStyleProps } from '../tableConfig';
import Table from 'components/core-ui-lib/Table';
import { UploadModal } from 'components/core-ui-lib';
import { attachmentMimeTypes } from 'components/core-ui-lib/UploadModal/interface';
import { headlessUploadMultiple } from 'requests/upload';
import { getFileUrl } from 'lib/s3';
import { ConfDialogVariant } from 'components/core-ui-lib/ConfirmationDialog/ConfirmationDialog';

const EditVenueContractModal = ({ visible, onClose }: { visible: boolean; onClose: () => void }) => {
  const productionJumpState = useRecoilValue(currentProductionSelector);
  const selectedTableCell = useRecoilValue(addEditContractsState);
  const [saveContractFormData, setSaveContractFormData] = useState<Partial<SaveContractFormState>>({});
  const [saveBookingFormData, setSaveBookingFormData] = useState<Partial<SaveContractBookingFormState>>({});
  const [editDealMemoModal, setEditDealMemoModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [venue, setVenue] = useState<Partial<Venue>>({});
  const [dealHoldType, setDealHoldType] = useState<Partial<DealMemoHoldType>>({});
  const [formData, setFormData] = useState<Partial<VenueContractFormData>>({
    ...initialEditContractFormData,
    ...selectedTableCell.contract,
  });
  const [demoModalData, setDemoModalData] = useState<Partial<DealMemoContractFormData>>({});
  const modalTitle = `${productionJumpState.ShowCode + productionJumpState.Code} | ${productionJumpState.ShowName} | ${
    selectedTableCell.contract.venue
  } | ${formattedDateWithDay(productionJumpState.StartDate)} - ${formattedDateWithDay(productionJumpState.EndDate)}`;
  const { fetchData } = useAxios();
  const router = useRouter();
  const { users } = useRecoilValue(userState);
  const userList = useMemo(
    () =>
      transformToOptions(
        Object.values(users),
        null,
        null,
        ({ FirstName, LastName }) => `${FirstName || ''} ${LastName || ''}`,
        ({ FirstName, LastName }) => `${FirstName || ''} ${LastName || ''}`,
      ),
    [users],
  );

  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [contractAttatchmentRows, setContractAttatchmentRows] = useState([]);
  const [filesForUpload, setFilesForUpload] = useState<FormData[]>([]);
  const [attachRow, setAttachRow] = useState();
  const [attachIndex, setAttachIndex] = useState();
  const [filesToDelete, setFilesToDelete] = useState([]);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState<boolean>(false);
  const [confirmationVariant, setConfirmationVariant] = useState<string>('cancel');

  const producerList = useMemo(() => {
    const list = {};
    Object.values(users).forEach((listData) => {
      list[`${listData.UserFirstName || ''} ${listData.UserLastName || ''}`] = `${listData.UserFirstName || ''} ${
        listData.UserLastName || ''
      }`;
    });
    return list;
  }, [users]);
  const callDealMemoApi = async () => {
    const demoModalData = await axios.get<DealMemoContractFormData>(
      `/api/dealMemo/getDealMemo/${selectedTableCell.contract.Id ? selectedTableCell.contract.Id : 1}`,
    );
    const getHoldType = await axios.get<DealMemoHoldType>('/api/dealMemo/hold-type/read');
    setDealHoldType(getHoldType.data as DealMemoHoldType);
    if (demoModalData.data && demoModalData.data.DeMoBookingId) {
      setDemoModalData(demoModalData.data as unknown as DealMemoContractFormData);
    }
    if (selectedTableCell.contract && selectedTableCell.contract.venueId) {
      const venueData = await axios.get(`/api/venue/${selectedTableCell.contract.venueId}`);
      setVenue(venueData.data as unknown as Venue);
    }
  };

  useEffect(() => {
    const callDealMemoData = async () => {
      setIsLoading(true);
      await callDealMemoApi();
      setIsLoading(false);
    };

    const fetchContractAttachments = async () => {
      try {
        const response = await axios.get(`/api/contracts/read/attachments/${selectedTableCell.contract.Id}`);
        const data = response.data;
        setContractAttatchmentRows([
          ...data.map((file) => {
            return {
              FileId: file.Id,
              FileOriginalFilename: file.OriginalFilename,
              FileUploadedDateTime: file.UploadDateTime,
              FileURL: getFileUrl(file.Location),
              FileUploaded: true,
              FileLocation: file.Location,
            };
          }),
        ]);
      } catch (error) {
        console.log(error, 'Error - failed to fetch contract file attachments');
      }
    };
    callDealMemoData();
    fetchContractAttachments();
  }, []);

  const editContractModalData = async (key: string, value, type: string) => {
    const updatedFormData = {
      ...formData,
      [key]: value,
    };
    setFormData(updatedFormData);
    if (type === 'booking') {
      setSaveBookingFormData({ ...saveBookingFormData, [key]: value });
    }
    if (type === 'contract') {
      setSaveContractFormData({ ...saveContractFormData, [key]: value });
    }
  };

  const handleFormData = async () => {
    const handleUpload = async () => {
      const bookingData = Object.keys(saveBookingFormData).length > 0;
      const contractData = Object.keys(saveContractFormData).length > 0;
      if (contractData) {
        await fetchData({
          url: `/api/contracts/update/venueContract/${selectedTableCell.contract.Id}`,
          method: 'PATCH',
          data: saveContractFormData,
        });
      }

      if (bookingData) {
        await fetchData({
          url: `/api/contracts/update/venueContractBooking/${selectedTableCell.contract.Id}`,
          method: 'PATCH',
          data: saveBookingFormData,
        });
      }
      setSaveBookingFormData({});
      setSaveContractFormData({});

      await saveFiles();
      await deleteFiles();

      onClose();
      router.replace(router.asPath);
    };

    setIsLoading(true);
    await handleUpload();
    setIsLoading(false);
  };

  const deleteFiles = async () => {
    try {
      await Promise.all(
        filesToDelete.map(async (file) => {
          await axios.delete(`/api/file/delete?location=${file.FileLocation}`);
          await axios.post(`/api/contracts/delete/attachments/${selectedTableCell.contract.Id}`, file);
        }),
      );
    } catch (error) {
      console.log(error, 'Error - failed to delete files from database');
    }
  };

  const saveFiles = async () => {
    const callBack = async (response) => {
      if (!isNullOrEmpty(response)) {
        const fileRec = {
          FileId: response.data.id,
          FileType: response.data.MediaType,
          Description: 'Contract Attachment',
          Type: 'Contract Attachment',
        };
        try {
          await axios.post(`/api/contracts/create/attachments/${selectedTableCell.contract.Id}`, fileRec);
        } catch (error) {
          console.log(error, 'Error - failed to update database with attachments');
        }
      }
    };
    await headlessUploadMultiple(filesForUpload, callBack);
  };

  const handleCancelForm = (cancel: boolean) => {
    if (cancel) {
      onClose();
    }
    if (Object.keys(saveBookingFormData).length > 0 || Object.keys(saveContractFormData).length > 0) {
      setConfirmationVariant('cancel');
      setShowConfirmationDialog(true);
    } else {
      onClose();
    }
  };

  const handleEditDealMemo = () => {
    setEditDealMemoModal(true);
  };

  const handleDemoFormClose = () => {
    setEditDealMemoModal(false);
    callDealMemoApi();
  };

  const onSave = async (files) => {
    const newFileList = [...filesForUpload];
    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file.file);
      formData.append('path', 'contracts/attachments');
      newFileList.push(formData);
    }
    setFilesForUpload(newFileList);

    setContractAttatchmentRows([
      ...files.map((file) => {
        return {
          FileOriginalFilename: file.name,
          FileUploadedDateTime: new Date(),
          FileURL: URL.createObjectURL(file.file),
          FileUploaded: false,
        };
      }),
      ...contractAttatchmentRows,
    ]);
    setShowUploadModal(false);
  };

  const handleCellClicked = (event) => {
    if (event.column.colId === 'ViewBtn') {
      const fileUrl = event.data.FileURL;
      window.open(fileUrl, '_blank');
    } else if (event.column.colId === 'icons') {
      setAttachRow(event.data);
      setAttachIndex(event.rowIndex);
      setConfirmationVariant('delete');
      setShowConfirmationDialog(true);
    }
  };

  const handleDeleteAttachment = async (data, rowIndex) => {
    if (data.FileUploaded) {
      setFilesToDelete([...filesToDelete, data]);
    }

    const newRows = [...contractAttatchmentRows];
    if (rowIndex !== -1) {
      newRows.splice(rowIndex, 1);
    }
    setContractAttatchmentRows(newRows);
    setShowConfirmationDialog(false);
  };

  const handleOnCancelYes = () => {
    if (confirmationVariant === 'cancel') {
      handleCancelForm(true);
    } else if (confirmationVariant === 'delete') {
      handleDeleteAttachment(attachRow, attachIndex);
    }
  };

  return (
    <PopupModal
      show={visible}
      title={modalTitle}
      titleClass={classNames('text-xl text-primary-navy font-bold -mt-2.5')}
      onClose={() => handleCancelForm(false)}
    >
      <div className="h-[80vh] w-auto overflow-y-scroll flex">
        <div className="h-[800px] flex">
          <div className="flex flex-col gap-y-3">
            <div className="w-[423px] rounded border-2 border-secondary mr-2 p-3 bg-primary-blue bg-opacity-15">
              <div className="flex">
                <div className="text-primary-input-text font-bold text-lg mr-8">Deal Memo</div>
                <div className="flex items-center">
                  <Button
                    className="w-32"
                    variant="primary"
                    text="Create/Edit Deal Memo"
                    onClick={handleEditDealMemo}
                  />
                  <Button className="ml-3 w-32" variant="primary" text="View as PDF" />
                </div>
              </div>
              <div className=" text-primary-input-text font-bold text-sm mt-1.5">Deal Memo Status</div>
              <Select
                options={allStatusOptions}
                className="bg-primary-white w-52"
                placeholder="Deal Memo Status"
                onChange={(value) => editContractModalData('dealMemoStatus', value, 'booking')}
                value={contractsKeyStatusMap[formData.StatusCode]}
                isClearable
                isSearchable
              />

              <div className=" text-primary-input-text font-bold text-sm mt-6">Completed By</div>
              <Select
                onChange={() => {
                  return null;
                }}
                className="bg-primary-white w-52"
                options={[{ text: 'Select Assignee', value: null }, ...userList]}
                isClearable
                isSearchable
              />

              <div className=" text-primary-input-text font-bold text-sm mt-6">Approved By</div>
              <Select
                onChange={() => {
                  return null;
                }}
                className="bg-primary-white w-52"
                options={[{ text: 'Select Assignee', value: null }, ...userList]}
                isClearable
                isSearchable
              />
              <div className="flex items-center mt-6">
                <div className=" text-primary-input-text font-bold text-sm">Date Issued</div>
                <DateInput
                  onChange={() => {
                    return null;
                  }}
                  value={formData.SignedDate}
                />

                <div className=" text-primary-input-text font-bold text-sm">Date Returned</div>

                <DateInput
                  onChange={() => {
                    return null;
                  }}
                  value={formData.SignedDate}
                />
              </div>

              <div className=" text-primary-input-text font-bold text-sm mt-6">Notes</div>
              <TextArea className="h-[125px] w-[400px]" value={formData.DealNotes} />
            </div>
            <div className="flex flex-col gap-y-2">
              <div className="w-[423px] flex justify-end">
                <Button
                  onClick={() => setShowUploadModal(!showUploadModal)}
                  className="mr-1 w-33"
                  variant="primary"
                  text="Add Attachments"
                />
              </div>
              <div className="w-[423px]">
                <Table
                  columnDefs={attachmentsColDefs}
                  rowData={contractAttatchmentRows}
                  styleProps={contractsStyleProps}
                  testId="tableVenueAttach"
                  tableHeight={435}
                  onCellClicked={(e) => handleCellClicked(e)}
                />
              </div>
            </div>
          </div>
          <div className="w-[652px] h-[980px] rounded border-2 border-secondary ml-2 p-3 bg-primary-blue bg-opacity-15">
            <div className="flex justify-between">
              <div className=" text-primary-input-text font-bold text-lg">Venue Contract</div>
              <div className="flex mr-2">
                <Button className="ml-4 w-33" variant="primary" text="View as PDF" />
              </div>
            </div>
            <div className="flex mt-2.5">
              <div className="w-1/5">
                <div className=" text-primary-input-text font-bold text-sm">Booking Status</div>
              </div>
              <div className="w-4/5">
                <div className=" text-primary-input-text text-sm">{bookingStatusMap[formData.status]}</div>
              </div>
            </div>
            <div className="flex mt-2.5">
              <div className=" text-primary-input-text font-bold text-sm">Perf / Day</div>
              <div className=" text-primary-input-text text-sm ml-5">{formData.performanceCount}</div>
              <div className=" text-primary-input-text font-bold text-sm ml-4">Times</div>
              <div className=" text-primary-input-text font-bold text-sm ml-2">1</div>
              <div className=" text-primary-input-text text-sm ml-1">
                {formData.performanceTimes && formData.performanceTimes.split(';')[0].split('?')[0]} -
                {formData.performanceTimes &&
                  formattedDateWithDay(formData.performanceTimes.split(';')[0].split('?')[1])}
              </div>
              <div className=" text-primary-input-text font-bold text-sm ml-2">2</div>
              <div className=" text-primary-input-text text-sm ml-1">
                {/* {formData.performanceTimes && formData.performanceTimes.split(';')[1]} */}
                {formData.performanceTimes &&
                  formData.performanceTimes.split(';')[1] &&
                  formData.performanceTimes.split(';')[1].split('?')[0]}{' '}
                -
                {formData.performanceTimes &&
                  formData.performanceTimes.split(';')[1] &&
                  formattedDateWithDay(formData.performanceTimes.split(';')[1].split('?')[1])}
              </div>
            </div>
            <div className="flex mt-2.5 items-center">
              <div className="w-1/5">
                <div className=" text-primary-input-text font-bold text-sm">Contract Status</div>
              </div>
              <div className="w-4/5 flex">
                <Select
                  onChange={(value) => editContractModalData('StatusCode', value, 'contract')}
                  className="bg-primary-white w-52"
                  value={formData.StatusCode}
                  placeholder="Contract Status"
                  options={allStatusOptions}
                  isClearable
                  isSearchable
                />
              </div>
            </div>
            <div className="flex mt-2.5 items-center">
              <div className="w-1/5">
                <div className=" text-primary-input-text font-bold text-sm">Signed By Producer</div>
              </div>
              <div className="w-4/5 flex justify-between">
                <Select
                  onChange={(value) => editContractModalData('SignedBy', value, 'contract')}
                  className="bg-primary-white w-52"
                  placeholder="User Name Dropdown"
                  options={[{ text: 'Select Assignee', value: null }, ...userList]}
                  isClearable
                  isSearchable
                  value={formData.SignedBy ? producerList[formData.SignedBy] : ''}
                />

                <div className="flex items-center">
                  <div className=" text-primary-input-text font-bold text-sm mr-2">Signed On</div>
                  <DateInput
                    onChange={(value) =>
                      formData.SignedDate.toString() !== toISO(value) &&
                      editContractModalData('SignedDate', value, 'contract')
                    }
                    position="!-left-24"
                    value={formData.SignedDate}
                  />
                </div>
              </div>
            </div>
            <div className="flex mt-2.5 items-center">
              <div className="w-1/5">
                <div className=" text-primary-input-text font-bold text-sm">Returned to Venue</div>
              </div>
              <div className="w-4/5 flex justify-between">
                <DateInput
                  onChange={(value) => {
                    formData.ReturnDate.toString() !== toISO(value) &&
                      editContractModalData('ReturnDate', value, 'contract');
                  }}
                  value={formData.ReturnDate}
                />
                <div className="flex items-center">
                  <div className=" text-primary-input-text font-bold text-sm mr-2">Returned from Venue</div>

                  <DateInput
                    onChange={(value) =>
                      formData.ReceivedBackDate.toString() !== toISO(value) &&
                      editContractModalData('ReceivedBackDate', value, 'contract')
                    }
                    value={formData.ReceivedBackDate}
                    className="z-[1000]"
                    position="!-left-24"
                  />
                </div>
              </div>
            </div>
            <div className="flex mt-4 mb-4 items-center">
              <div className="flex flex-1 items-center">
                <div className=" text-primary-input-text font-bold text-sm mr-5">Bank Details Sent</div>
                <Checkbox
                  className="flex flex-row-reverse"
                  labelClassName="!text-base"
                  id="includeExcludedVenues"
                  onChange={() => {
                    return null;
                  }}
                />
              </div>
              <div className="flex flex-1 items-center justify-center">
                <div className=" text-primary-input-text font-bold text-sm mr-5">Tech Spec Sent</div>
                <Checkbox
                  className="flex flex-row-reverse"
                  labelClassName="!text-base"
                  id="includeExcludedVenues"
                  onChange={() => {
                    return null;
                  }}
                />
              </div>
              <div className="flex flex-1 items-center justify-end">
                <div className=" text-primary-input-text font-bold text-sm mr-5">PRS Certificate Sent</div>
                <Checkbox
                  className="flex flex-row-reverse"
                  labelClassName="!text-base"
                  id="includeExcludedVenues"
                  onChange={() => {
                    return null;
                  }}
                />
              </div>
            </div>

            <div className="flex mt-2.5 items-center">
              <div className="w-1/5">
                <div className=" text-primary-input-text font-bold text-sm">Deal Type</div>
              </div>
              <div className="w-4/5 flex">
                <Select
                  onChange={(value) => editContractModalData('DealType', value, 'contract')}
                  className="bg-primary-white w-52"
                  value={formData.DealType ? formData.DealType : 'NULL'}
                  placeholder="Deal Type"
                  options={dealTypeOptions}
                  isClearable
                  isSearchable
                />
              </div>
            </div>
            <div className="flex mt-2.5 items-center">
              <div className="w-1/5">
                <div className=" text-primary-input-text font-bold text-sm">Notes</div>
              </div>

              <div className="w-4/5">
                <TextArea
                  className="mt-2.5 h-[58px] w-[498px]"
                  value={formData.bookingNotes}
                  onChange={(value) => editContractModalData('bookingNotes', value.target.value, 'booking')}
                />
              </div>
            </div>
            <div className="flex mt-2.5 items-center">
              <div className="w-1/5">
                <div className=" text-primary-input-text font-bold text-sm">Gross Potential</div>
              </div>
              <div className="w-4/5 flex items-center justify-between">
                <div className="flex  items-center">
                  <div className=" text-primary-input-text font-bold text-sm mr-1">£</div>
                  <TextInput id="venueText" className="w-[100px]" />
                </div>
                <div className="flex  items-center">
                  <div className=" text-primary-input-text font-bold text-sm mr-1">Royalty</div>
                  <TextInput
                    id="venueText"
                    className="w-[100px]"
                    value={formData.RoyaltyPercentage}
                    onChange={(value) => editContractModalData('RoyaltyPercentage', value.target.value, 'contract')}
                  />
                  <div className=" text-primary-input-text font-bold text-sm ml-1">%</div>
                </div>

                <div className="flex  items-center">
                  <div className=" text-primary-input-text font-bold text-sm mr-1">Promoter</div>
                  <TextInput id="venueText" className="w-[100px]" />
                  <div className=" text-primary-input-text font-bold text-sm ml-1">%</div>
                </div>
              </div>
            </div>
            <div className="flex mt-2.5 items-center">
              <div className="w-1/5">
                <div className=" text-primary-input-text font-bold text-sm">Ticket Pricing Notes</div>
              </div>
              <div className="w-4/5">
                <TextArea
                  className="mt-2.5 h-[58px] w-[498px]"
                  value={formData.TicketPriceNotes}
                  onChange={(value) => editContractModalData('TicketPriceNotes', value.target.value, 'booking')}
                  placeholder="Ticket Pricing Notes"
                />
              </div>
            </div>
            <div className="flex mt-2.5 items-center">
              <div className="w-1/5">
                <div className=" text-primary-input-text font-bold text-sm">Marketing Deal</div>
              </div>
              <div className="w-4/5">
                <TextArea
                  className="mt-2.5 h-[58px] w-[498px]"
                  value={formData.MarketingDealNotes}
                  onChange={(value) => editContractModalData('MarketingDealNotes', value.target.value, 'booking')}
                  placeholder="Marketing Deal"
                />
              </div>
            </div>
            <div className="flex mt-2.5 items-center">
              <div className="w-1/5">
                <div className=" text-primary-input-text font-bold text-sm">Crew Notes</div>
              </div>
              <div className="w-4/5">
                <TextArea
                  className="mt-2.5 h-[58px] w-[498px]"
                  value={formData.CrewNotes}
                  onChange={(value) => editContractModalData('CrewNotes', value.target.value, 'booking')}
                  placeholder="Crew Notes"
                />
              </div>
            </div>
            <div className="flex mt-2.5  ">
              <div className="w-1/5">
                <div className=" text-primary-input-text font-bold text-sm">Barring Clause</div>
              </div>
              <div className="w-4/5 flex">
                <div className="w-1/3 flex">
                  <div className=" text-primary-input-text font-bold text-sm mr-2">Pre Show</div>
                  <div className=" text-primary-input-text  text-sm">
                    {venue.BarringWeeksPre ? venue.BarringWeeksPre : '-'}
                  </div>
                </div>

                <div className="w-1/3 flex justify-center">
                  <div className=" text-primary-input-text font-bold text-sm mr-2">Post Show</div>
                  <div className=" text-primary-input-text  text-sm">
                    {venue.BarringWeeksPost ? venue.BarringWeeksPost : '-'}
                  </div>
                </div>
                <div className="w-1/3 flex justify-end">
                  <div className=" text-primary-input-text font-bold text-sm mr-2">Miles</div>
                  <div className=" text-primary-input-text  text-sm">
                    {venue.BarringMiles ? venue.BarringMiles : '-'}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex mt-2.5 items-center">
              <div className="w-1/5">
                <div className=" text-primary-input-text font-bold text-sm"> </div>
              </div>
              <div className="w-4/5 flex">
                <div className=" text-primary-input-text font-bold text-sm mr-2">Venues</div>
                <div className=" text-primary-input-text  text-sm ml-3">
                  {venue.BarringMiles ? venue.BarringMiles : '-'}
                </div>
              </div>
            </div>
            <div className="flex mt-2.5 items-center">
              <div className="w-1/5">
                <div className=" text-primary-input-text font-bold text-sm">Exceptions</div>
              </div>
              <div className="w-4/5">
                <TextArea
                  className="mt-2.5 h-[58px] w-[498px]"
                  value={formData.Exceptions}
                  onChange={(value) => editContractModalData('Exceptions', value.target.value, 'contract')}
                />
              </div>
            </div>
            <div className="flex mt-2.5 items-center">
              <div className="w-1/5">
                <div className=" text-primary-input-text font-bold text-sm">Contract Notes</div>
              </div>
              <div className="w-4/5">
                <TextArea
                  className="mt-2.5 h-[58px] w-[498px]"
                  value={formData.Notes}
                  onChange={(value) => editContractModalData('Notes', value.target.value, 'contract')}
                />
              </div>
            </div>
            <div className="flex mt-2.5 items-center">
              <div className="w-1/5">
                <div className=" text-primary-input-text font-bold text-sm">Merchandise Notes</div>
              </div>
              <div className="w-4/5">
                <TextArea
                  className="mt-2.5 h-[58px] w-[498px]"
                  value={formData.MerchandiseNotes}
                  onChange={(value) => editContractModalData('MerchandiseNotes', value.target.value, 'booking')}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full mt-4 flex justify-end items-center">
        <Button onClick={() => handleCancelForm(false)} className="w-33" variant="secondary" text="Cancel" />
        <Button onClick={handleFormData} className="ml-4 w-33" variant="primary" text="Save and Close" />
      </div>
      {showUploadModal && (
        <UploadModal
          visible={showUploadModal}
          title="Upload Venue Contract Attachments"
          info="Please upload your file by dragging it into the grey box below or by clicking the upload cloud."
          allowedFormats={attachmentMimeTypes.genericAttachment}
          onClose={() => setShowUploadModal(false)}
          maxFileSize={5120 * 1024} // 5MB
          onSave={onSave}
          maxFiles={30}
          isMultiple={true}
        />
      )}

      <ConfirmationDialog
        labelYes="Yes"
        labelNo="No"
        show={showConfirmationDialog}
        variant={confirmationVariant as ConfDialogVariant}
        onNoClick={() => setShowConfirmationDialog(false)}
        onYesClick={() => handleOnCancelYes()}
      />
      {editDealMemoModal && (
        <EditDealMemoContractModal
          visible={editDealMemoModal}
          onCloseDemoForm={() => handleDemoFormClose()}
          productionJumpState={productionJumpState}
          selectedTableCell={selectedTableCell}
          demoModalData={demoModalData}
          venueData={venue}
          dealHoldType={dealHoldType}
        />
      )}
      {isLoading && <LoadingOverlay />}
    </PopupModal>
  );
};

export default EditVenueContractModal;
