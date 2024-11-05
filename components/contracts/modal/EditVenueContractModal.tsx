import PopupModal from 'components/core-ui-lib/PopupModal';
import classNames from 'classnames';
import Button from 'components/core-ui-lib/Button';
import Select from 'components/core-ui-lib/Select';
import DateInput from 'components/core-ui-lib/DateInput';
import TextArea from 'components/core-ui-lib/TextArea/TextArea';
import Checkbox from 'components/core-ui-lib/Checkbox';
import TextInput from 'components/core-ui-lib/TextInput';
import { statusOptions, dealTypeOptions, initialEditContractFormData } from 'config/contracts';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useRouter } from 'next/router';
import { addEditContractsState } from 'state/contracts/contractsState';
import axios from 'axios';
import { bookingStatusMap } from 'config/bookings';
import { userState } from 'state/account/userState';
import { useEffect, useMemo, useState } from 'react';
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
import { isNullOrEmpty, transformToOptions, checkDecimalStringFormat } from 'utils';
import LoadingOverlay from 'components/shows/LoadingOverlay';
import { attachmentsColDefs, contractsStyleProps } from '../tableConfig';
import Table from 'components/core-ui-lib/Table';
import { UploadModal } from 'components/core-ui-lib';
import { attachmentMimeTypes } from 'components/core-ui-lib/UploadModal/interface';
import { headlessUploadMultiple } from 'requests/upload';
import { getFileUrl } from 'lib/s3';
import { UiVenue, VenueData, transformVenues } from 'utils/venue';
import { ConfDialogVariant } from 'components/core-ui-lib/ConfirmationDialog/ConfirmationDialog';
import { formatDecimalOnBlur, parseAndSortDates } from '../utils';
import { currencyState } from 'state/global/currencyState';
import { dealMemoExport } from 'pages/api/deal-memo/export';
import { accountContactState } from 'state/contracts/accountContactState';
import { productionJumpState } from 'state/booking/productionJumpState';
import { accessVenueContracts } from 'state/account/selectors/permissionSelector';

export type UserAcc = {
  email: string;
  accountUserId: number;
};

const EditVenueContractModal = ({ visible, onClose }: { visible: boolean; onClose: () => void }) => {
  const permissions = useRecoilValue(accessVenueContracts);
  const selectedTableCell = useRecoilValue(addEditContractsState);
  const { productions } = useRecoilValue(productionJumpState);
  const currentProduction = productions.find((production) => production.Id === selectedTableCell.contract.productionId);
  const [saveContractFormData, setSaveContractFormData] = useState<Partial<SaveContractFormState>>({});
  const [saveBookingFormData, setSaveBookingFormData] = useState<Partial<SaveContractBookingFormState>>({});
  const [saveDealMemoFormData, setSaveDealMemoFormData] = useState<Partial<DealMemoContractFormData>>({});
  const [editDealMemoModal, setEditDealMemoModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [venue, setVenue] = useState<Partial<VenueData>>({});
  const [barredVenues, setBarredVenues] = useState<Partial<UiVenue>[]>([]);
  const [dealHoldType, setDealHoldType] = useState<Array<DealMemoHoldType>>([]);
  const accountContacts = useRecoilValue(accountContactState);
  const [formData, setFormData] = useState<Partial<VenueContractFormData>>({
    ...initialEditContractFormData,
    ...selectedTableCell.contract,
  });
  const [dealMemoFormData, setDealMemoFormData] = useState<Partial<DealMemoContractFormData>>({});
  const [demoModalData, setDemoModalData] = useState<Partial<DealMemoContractFormData>>({});
  const [modalTitle, setModalTitle] = useState<string>(
    `${selectedTableCell.contract.productionName.replace('- ', '')} | ${selectedTableCell.contract.venue} | `,
  );
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
  const [lastDates, setLastDates] = useState([]);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState<boolean>(false);
  const [confirmationVariant, setConfirmationVariant] = useState<string>('cancel');
  const [dealMemoCreated, setDealMemoCreated] = useState<boolean>(true);
  const [dealMemoButtonText, setDealMemoButtonText] = useState<string>('Deal Memo');

  const [currency, setCurrency] = useRecoilState(currencyState);
  const userAccList = useMemo(() => {
    return Object.values(users).map(({ AccUserId, Email = '' }) => ({
      accountUserId: AccUserId,
      email: Email || '',
    }));
  }, [users]);

  const [errors, setErrors] = useState({
    royaltyPerc: false,
    promoterPerc: false,
  });

  const producerList = useMemo(() => {
    const list = {};
    Object.values(users).forEach((listData) => {
      list[`${listData.FirstName || ''} ${listData.LastName || ''}`] = `${listData.FirstName || ''} ${
        listData.LastName || ''
      }`;
    });
    return list;
  }, [users]);

  const callDealMemoApi = async () => {
    const demoModalData = await axios.get<DealMemoContractFormData>(
      `/api/deal-memo/read/${selectedTableCell.contract.Id ? selectedTableCell.contract.Id : 1}`,
    );

    if (isNullOrEmpty(demoModalData.data)) {
      setDealMemoCreated(false);
      setDealMemoButtonText('Create Deal Memo');
    } else {
      setDealMemoCreated(true);
      setDealMemoButtonText('Edit Deal Memo');
    }

    const getHoldType = await axios.get(`/api/deal-memo/hold-type/read`);
    setDealHoldType(getHoldType.data as Array<DealMemoHoldType>);
    if (demoModalData.data && demoModalData.data.BookingId) {
      setDemoModalData(demoModalData.data as DealMemoContractFormData);
      setDealMemoFormData(demoModalData.data as DealMemoContractFormData);
    }

    if (selectedTableCell.contract && selectedTableCell.contract.venueId) {
      const venueData = await axios.get(`/api/venue/${selectedTableCell.contract.venueId}`);
      setVenue(venueData.data as VenueData);
    }
  };

  const fetchVenueData = async () => {
    try {
      if (selectedTableCell.contract && selectedTableCell.contract.venueId) {
        const { data } = await axios.get(`/api/venue/${selectedTableCell.contract.venueId}`);
        setVenue(data as VenueData);
        const barredVenues = await axios.get(`/api/venue/barredVenues/${selectedTableCell.contract.venueId}`);
        setBarredVenues(transformVenues(barredVenues.data));
      }
    } catch (error) {
      console.log(error, 'Error - failed to fetch Venue Data for current booking.');
    }
  };

  const fetchContractAttachments = async () => {
    try {
      const { data } = await axios.get(`/api/contracts/read/attachments/${selectedTableCell.contract.Id}`);
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

  const fetchLastDates = async () => {
    const productionId = selectedTableCell.contract.productionId;
    if (!productionId) return;
    try {
      const { data } = await axios(`/api/performances/lastDate/${productionId}`);
      setLastDates(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await callDealMemoApi();
      await fetchContractAttachments();
      await fetchLastDates();
      await fetchVenueData();
      setIsLoading(false);
    };

    loadData();
  }, []);

  useEffect(() => {
    const lastDate = lastDates.find((date) => date.BookingId === formData.Id)?.LastPerformanceDate;
    if (!lastDate) return;
    const formattedLastDate = formattedDateWithDay(lastDate);
    const lastPerformanceDate =
      formattedLastDate === formattedDateWithDay(formData.FirstDate) ? '' : `to ${formattedLastDate}`;
    const title = `${selectedTableCell.contract.productionName.replace('- ', '')} | 
    ${selectedTableCell.contract.venue} | ${formattedDateWithDay(formData.FirstDate)} ${lastPerformanceDate}`;
    setModalTitle(title);
  }, [lastDates]);

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

  useEffect(() => {
    getCurrency(selectedTableCell.contract.Id);
  }, [selectedTableCell.contract.Id]);

  const getCurrency = async (bookingId) => {
    try {
      const response = await axios.get(`/api/marketing/currency/booking/${bookingId}`);

      if (response.data && typeof response.data === 'object') {
        const currencyObject = response.data as { currency: string };
        setCurrency({ symbol: currencyObject.currency });
      }
    } catch (error) {
      console.error('Error retrieving currency:', error);
    }
  };

  const editDealMemoData = async (key: string, value) => {
    const updatedDealMemoFormData = {
      ...dealMemoFormData,
      [key]: value,
    };
    setDealMemoFormData(updatedDealMemoFormData);
    setSaveDealMemoFormData({ ...saveDealMemoFormData, [key]: value });
  };

  const handleFormData = async () => {
    const handleUpload = async () => {
      const bookingData = Object.keys(saveBookingFormData).length > 0;
      const contractData = Object.keys(saveContractFormData).length > 0;
      const dealMemoData = Object.keys(saveDealMemoFormData).length > 0;
      if (contractData) {
        await axios.patch(`/api/contracts/upsert/venueContract/${selectedTableCell.contract.Id}`, saveContractFormData);
      }

      if (bookingData) {
        await axios.patch(
          `/api/contracts/update/venueContractBooking/${selectedTableCell.contract.Id}`,
          saveBookingFormData,
        );
      }

      if (dealMemoData) {
        await axios.patch(`/api/contracts/update/dealMemo/${selectedTableCell.contract.Id}`, saveDealMemoFormData);
      }

      setSaveBookingFormData({});
      setSaveContractFormData({});
      setSaveDealMemoFormData({});

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
    if (
      Object.keys(saveBookingFormData).length > 0 ||
      Object.keys(saveContractFormData).length > 0 ||
      Object.keys(saveDealMemoFormData).length > 0 ||
      filesForUpload.length > 0
    ) {
      setConfirmationVariant('cancel');
      setShowConfirmationDialog(true);
    } else {
      onClose();
    }
  };

  const handleEditDealMemo = () => {
    if (permissions.includes('ACCESS_EDIT_DEAL_MEMO')) {
      setEditDealMemoModal(true);
    }
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

  const pdfExportDealMemo = () => {
    dealMemoExport({
      bookingId: selectedTableCell.contract.Id.toString(),
      production: currentProduction,
      contract: selectedTableCell.contract,
      venue,
      accContacts: accountContacts,
      users: userAccList,
      fileType: 'pdf',
    });
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
              <div className="flex justify-between">
                <div className="text-primary-input-text font-bold text-lg">Deal Memo</div>
                <div className="flex gap-x-2">
                  <Button className="w-32" variant="primary" text={dealMemoButtonText} onClick={handleEditDealMemo} />
                  <Button
                    className={`w-32 ${
                      dealMemoCreated ? '' : ' text-gray-500 pointer-events-none select-none opacity-25'
                    }`}
                    variant="primary"
                    text="Export to PDF"
                    onClick={pdfExportDealMemo}
                    sufixIconName="document-solid"
                  />
                </div>
              </div>
              <div className={`${dealMemoCreated ? '' : ' text-gray-500 pointer-events-none select-none opacity-50'}`}>
                <div className=" text-primary-input-text font-bold text-sm mt-1.5">Deal Memo Status</div>
                <Select
                  options={statusOptions}
                  className="bg-primary-white w-full"
                  placeholder="Select Deal Memo Status"
                  onChange={(value) => editDealMemoData('Status', value)}
                  value={dealMemoFormData.Status}
                  isClearable
                  isSearchable
                />

                <div className=" text-primary-input-text font-bold text-sm mt-6">Completed By</div>
                <Select
                  onChange={(value) => editDealMemoData('CompletedBy', value)}
                  value={dealMemoFormData.CompletedBy}
                  className="bg-primary-white w-full"
                  options={[...userList]}
                  isClearable
                  isSearchable
                  placeholder="Select User"
                />

                <div className=" text-primary-input-text font-bold text-sm mt-6">Approved By</div>
                <Select
                  onChange={(value) => editDealMemoData('ApprovedBy', value)}
                  value={dealMemoFormData.ApprovedBy}
                  className="bg-primary-white w-full"
                  options={[...userList]}
                  isClearable
                  isSearchable
                  placeholder="Select User"
                />
                <div className="flex items-center mt-6 justify-between px-3 select-none">
                  <div>
                    <div className=" text-primary-input-text font-bold text-sm">Date Issued</div>
                    <DateInput
                      onChange={(value) =>
                        value &&
                        dealMemoFormData.DateIssued?.toString() !== toISO(value) &&
                        editDealMemoData('DateIssued', value)
                      }
                      value={dealMemoFormData.DateIssued}
                    />
                  </div>

                  <div>
                    <div className=" text-primary-input-text font-bold text-sm">Date Returned</div>
                    <DateInput
                      onChange={(value) =>
                        value &&
                        dealMemoFormData.DateReturned?.toString() !== toISO(value) &&
                        editDealMemoData('DateReturned', value)
                      }
                      value={dealMemoFormData.DateReturned}
                    />
                  </div>
                </div>

                <div className=" text-primary-input-text font-bold text-sm mt-6">Notes</div>
                <TextArea
                  onChange={(e) => editDealMemoData('Notes', e.target.value)}
                  className="h-auto w-[400px]"
                  value={dealMemoFormData.Notes}
                />
              </div>
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
                  tableHeight={335}
                  onCellClicked={(e) => handleCellClicked(e)}
                />
              </div>
            </div>
          </div>
          <div className="w-[652px] h-fit rounded border-2 border-secondary ml-2 p-3 bg-primary-blue bg-opacity-15">
            {/* 
            NEEDS TO BE KEPT FOR NOW
            <div className="flex justify-between">
              <div className=" text-primary-input-text font-bold text-lg">Venue Contract</div>
              <div className="flex mr-2">
                <Button className="ml-4 w-33" variant="primary" text="Export to PDF" />
              </div>
            </div> */}
            <div className="flex mt-2.5">
              <div className="w-1/5">
                <div className=" text-primary-input-text font-bold text-sm">Booking Status</div>
              </div>
              <div className="w-4/5">
                <div className=" text-primary-input-text text-sm">{bookingStatusMap[formData.status]}</div>
              </div>
            </div>
            <div className="flex mt-2.5">
              <div className=" text-primary-input-text font-bold text-sm">Perf(s)</div>
              <div className=" text-primary-input-text text-sm ml-5">{formData.performanceCount}</div>
              <div className=" text-primary-input-text font-bold text-sm ml-4">Times</div>
              <div>
                {parseAndSortDates(formData.PerformanceTimes).map((dateTimeEntry, index) => {
                  return (
                    <div key={index} className="text-primary-input-text  text-sm ml-4">
                      {dateTimeEntry}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex mt-2.5 items-center">
              <div className="w-1/5">
                <div className=" text-primary-input-text font-bold text-sm">Contract Status</div>
              </div>
              <div className="w-4/5 flex">
                <Select
                  onChange={(value) => editContractModalData('StatusCode', value, 'contract')}
                  className="bg-primary-white w-full"
                  value={formData.StatusCode}
                  placeholder="Select Contract Status"
                  options={statusOptions}
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
                  placeholder="Select User"
                  options={[...userList]}
                  isClearable
                  isSearchable
                  value={formData.SignedBy ? producerList[formData.SignedBy] : ''}
                />

                <div className="flex items-center">
                  <div className=" text-primary-input-text font-bold text-sm mr-2">Signed On</div>
                  <DateInput
                    onChange={(value) => {
                      value &&
                        formData.SignedDate?.toString() !== toISO(value) &&
                        editContractModalData('SignedDate', value, 'contract');
                    }}
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
                    value &&
                      formData.ReturnDate?.toString() !== toISO(value) &&
                      editContractModalData('ReturnDate', value, 'contract');
                  }}
                  value={formData.ReturnDate}
                />
                <div className="flex items-center">
                  <div className=" text-primary-input-text font-bold text-sm mr-2">Returned from Venue</div>

                  <DateInput
                    onChange={(value) => {
                      value &&
                        formData.ReceivedBackDate?.toString() !== toISO(value) &&
                        editContractModalData('ReceivedBackDate', value, 'contract');
                    }}
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
                  onChange={(e) => {
                    editContractModalData('BankDetailsSent', e.target.value, 'contract');
                  }}
                  checked={formData.BankDetailsSent}
                />
              </div>
              <div className="flex flex-1 items-center justify-center">
                <div className=" text-primary-input-text font-bold text-sm mr-5">Tech Spec Sent</div>
                <Checkbox
                  className="flex flex-row-reverse"
                  labelClassName="!text-base"
                  id="includeExcludedVenues"
                  onChange={(e) => {
                    editContractModalData('TechSpecSent', e.target.value, 'contract');
                  }}
                  checked={formData.TechSpecSent}
                />
              </div>
              <div className="flex flex-1 items-center justify-end">
                <div className=" text-primary-input-text font-bold text-sm mr-5">PRS Certificate Sent</div>
                <Checkbox
                  className="flex flex-row-reverse"
                  labelClassName="!text-base"
                  id="includeExcludedVenues"
                  onChange={(e) => {
                    editContractModalData('PRSCertSent', e.target.value, 'contract');
                  }}
                  checked={formData.PRSCertSent}
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
                  className="bg-primary-white w-60"
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
                <div className=" text-primary-input-text font-bold text-sm">Details</div>
              </div>
              <div className="w-4/5">
                <TextArea
                  className="mt-2.5 h-auto w-[498px]"
                  value={formData.DealNotes}
                  onChange={(value) => editContractModalData('DealNotes', value.target.value, 'booking')}
                  placeholder="Enter Deal Details"
                />
              </div>
            </div>
            <div className="flex mt-2.5 items-center">
              <div className="w-1/5">
                <div className=" text-primary-input-text font-bold text-sm">Gross Potential</div>
              </div>
              <div className="w-4/5 flex items-center justify-between">
                <div className="flex  items-center">
                  <div className=" text-primary-input-text font-bold text-sm mr-1">{currency?.symbol}</div>
                  <TextInput
                    type="number"
                    className="w-[100px]"
                    value={formData.GP}
                    onChange={(e) => {
                      if (checkDecimalStringFormat(e.target.value, 10, 2)) {
                        editContractModalData('GP', e.target.value, 'contract');
                      }
                    }}
                    onBlur={(e) => {
                      editContractModalData('GP', formatDecimalOnBlur(e), 'contract');
                    }}
                  />
                </div>
                <div className="flex  items-center">
                  <div className=" text-primary-input-text font-bold text-sm mr-1">Royalty</div>
                  <TextInput
                    testId="deal-royalty-percentage"
                    className={classNames('w-[100px]', errors.royaltyPerc ? 'text-primary-red' : '')}
                    value={formData.RoyaltyPercentage}
                    type="number"
                    onChange={(e) => {
                      if (parseFloat(e.target.value) < 0 || parseFloat(e.target.value) > 100) {
                        setErrors({ ...errors, royaltyPerc: true });
                      } else {
                        setErrors({ ...errors, royaltyPerc: false });
                      }

                      editContractModalData('RoyaltyPercentage', e.target.value, 'contract');
                    }}
                  />{' '}
                  <div className=" text-primary-input-text font-bold text-sm ml-1">%</div>
                </div>
                <div className="flex  items-center">
                  <div className=" text-primary-input-text font-bold text-sm mr-1">Promoter</div>
                  <TextInput
                    testId="deal-promoter-percentage"
                    className={classNames('w-[100px]', errors.promoterPerc ? 'text-primary-red' : '')}
                    value={formData.PromoterPercent}
                    type="number"
                    onChange={(e) => {
                      if (parseFloat(e.target.value) < 0 || parseFloat(e.target.value) > 100) {
                        setErrors({ ...errors, promoterPerc: true });
                      } else {
                        setErrors({ ...errors, promoterPerc: false });
                      }
                      editContractModalData('PromoterPercent', e.target.value, 'contract');
                    }}
                  />{' '}
                  <div className=" text-primary-input-text font-bold text-sm ml-1">%</div>
                </div>
              </div>{' '}
            </div>
            {(errors.royaltyPerc || errors.promoterPerc) && (
              <div className="w-full flex items-center mt-2 text-primary-red ml-[124px]">
                Percentage value must be between 0 and 100
              </div>
            )}
            <div className="flex mt-2.5 items-center">
              <div className="w-1/5">
                <div className=" text-primary-input-text font-bold text-sm">Ticket Pricing Notes</div>
              </div>
              <div className="w-4/5">
                <TextArea
                  className="mt-2.5 h-auto w-[498px]"
                  value={formData.TicketPriceNotes}
                  onChange={(value) => editContractModalData('TicketPriceNotes', value.target.value, 'booking')}
                  placeholder="Enter Ticket Pricing Notes"
                />
              </div>
            </div>
            <div className="flex mt-2.5 items-center">
              <div className="w-1/5">
                <div className=" text-primary-input-text font-bold text-sm">Marketing Deal</div>
              </div>
              <div className="w-4/5">
                <TextArea
                  className="mt-2.5 h-auto w-[498px]"
                  value={formData.MarketingDealNotes}
                  onChange={(value) => editContractModalData('MarketingDealNotes', value.target.value, 'booking')}
                  placeholder="Enter Marketing Deal"
                />
              </div>
            </div>
            <div className="flex mt-2.5 items-center">
              <div className="w-1/5">
                <div className=" text-primary-input-text font-bold text-sm">Crew Notes</div>
              </div>
              <div className="w-4/5">
                <TextArea
                  className="mt-2.5 w-[498px] h-auto"
                  value={formData.CrewNotes}
                  onChange={(value) => editContractModalData('CrewNotes', value.target.value, 'booking')}
                  placeholder="Enter Crew Notes"
                />
              </div>
            </div>
            <div className="flex mt-2.5  ">
              <div className="w-1/5">
                <div className=" text-primary-input-text font-bold text-sm">Barring Clause</div>
              </div>
              <div className="w-4/5 flex gap-x-5">
                <div className="flex">
                  <div className=" text-primary-input-text font-bold text-sm mr-2">Pre Show</div>
                  <div className=" text-primary-input-text  text-sm">
                    {venue.BarringWeeksPre ? venue.BarringWeeksPre : '-'}
                  </div>
                </div>

                <div className="flex ">
                  <div className=" text-primary-input-text font-bold text-sm mr-2">Post Show</div>
                  <div className=" text-primary-input-text  text-sm">
                    {venue.BarringWeeksPost ? venue.BarringWeeksPost : '-'}
                  </div>
                </div>
                <div className="flex ">
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
                  {barredVenues && barredVenues.length > 0
                    ? barredVenues.map((venue) => {
                        return <div key={venue.id}>{venue.venueName}</div>;
                      })
                    : '-'}
                </div>
              </div>
            </div>
            <div className="flex mt-2.5 items-center">
              <div className="w-1/5">
                <div className=" text-primary-input-text font-bold text-sm">Exceptions</div>
              </div>
              <div className="w-4/5">
                <TextArea
                  className="mt-2.5 h-auto w-[498px]"
                  value={formData.Exceptions}
                  onChange={(value) => editContractModalData('Exceptions', value.target.value, 'contract')}
                  placeholder="Enter Exceptions Notes"
                />
              </div>
            </div>
            <div className="flex mt-2.5 items-center">
              <div className="w-1/5">
                <div className=" text-primary-input-text font-bold text-sm">Contract Notes</div>
              </div>
              <div className="w-4/5">
                <TextArea
                  className="mt-2.5 h-auto w-[498px]"
                  value={formData.Notes}
                  onChange={(value) => editContractModalData('Notes', value.target.value, 'contract')}
                  placeholder="Enter Contract Notes"
                />
              </div>
            </div>
            <div className="flex mt-2.5 items-center">
              <div className="w-1/5">
                <div className=" text-primary-input-text font-bold text-sm">Merchandise Notes</div>
              </div>
              <div className="w-4/5">
                <TextArea
                  className="mt-2.5 h-auto w-[498px]"
                  value={formData.MerchandiseNotes}
                  onChange={(value) => editContractModalData('MerchandiseNotes', value.target.value, 'booking')}
                  placeholder="Enter Merchandise Notes"
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
          currentProduction={currentProduction}
          selectedTableCell={selectedTableCell}
          demoModalData={demoModalData}
          venueData={venue}
          dealHoldType={dealHoldType}
          userAccList={userAccList}
        />
      )}
      {isLoading && <LoadingOverlay />}
    </PopupModal>
  );
};

export default EditVenueContractModal;
