// noinspection TypeScriptValidateTypes

import React, { useEffect } from 'react';
import formatDate from 'utils/formatDate';
import formatInputDate from 'utils/dateInputFormat';
import FileUploadButton from 'components/files/FileUploadButton';
import { IAttachedFile, IBookingDetails, IContractDetails, IFileData } from 'interfaces';
import SaveChangesWarning from './modal/SaveChangesWarning';
import { loggingService } from '../../services/loggingService';
import classNames from 'classnames';
import { StyledDialog } from 'components/global/StyledDialog';
import { Spinner } from 'components/global/Spinner';

export const Label = (props: any) => {
  return (
    <span {...props} className={classNames(`${props.className} text-primary-pink font-bold w-full`)}>
      {props.children}
    </span>
  );
};

async function updateBooking(bookingId: number, bookingDetails: IBookingDetails) {
  try {
    const bookingAddress = () => `/api/contracts/update/booking/${bookingId}`;
    const response = await fetch(bookingAddress(), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingDetails),
    });
    if (response.ok) {
      await response.json();
      return { success: true };
    }
  } catch (error) {
    console.error('problem updating booking');
  }
}
// async function updateContract(bookingId: number, contractDetails: IContractDetails) {
//   try {
//     const contractUpdateAddress = () => `/api/contracts/update/contract/${bookingId}`;
//     const response = await fetch(contractUpdateAddress(), {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(contractDetails),
//     });
//     if (response.ok) {
//       loggingService.logAction('Contracts', 'Update Address');

//       const parsedResponse = await response.json();
//       return { success: true, contractData: parsedResponse };
//     }
//   } catch (error) {
//     loggingService.logError(error);
//     console.error('problem updating contract');
//   }
// }

async function createContract(bookingId: number, contractDetails: IContractDetails) {
  try {
    const bookingAddress = () => `/api/contracts/create/${bookingId}`;
    const response = await fetch(bookingAddress(), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contractDetails),
    });
    if (response.ok) {
      loggingService.logAction('Contracts', 'Create Contract');
      const parsedResponse = await response.json();
      return { success: true, contractData: parsedResponse };
    }
  } catch (error) {
    loggingService.logError(error);
    console.error('problem creating contract');
  }
}

async function uploadNewFile(file: IFileData, bookingId: number) {
  try {
    if (file.fileContent.length > 0) {
      const uploadFileApi = () => `/api/files/upload/contractFile/${bookingId}`;
      const response = await fetch(uploadFileApi(), {
        method: 'POST',
        body: JSON.stringify(file),
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        loggingService.logAction('Contracts', 'New File Uploaded');
        const parsedResponse = await response.json();
        return parsedResponse;
      } else {
        throw new Error();
      }
    }
  } catch (error) {
    loggingService.logError(error);
    console.error(error);
  }
}

function convertFileBuffer(file) {
  if (file.AttachedFile) {
    return (
      <a
        className="w-auto align-middle my-2 h-10 text-sm text-primary-pink ml-4 px-2 border-gray-800 border-1 bg-white hover:bg-primary-pink hover:text-white rounded-md transition-all duration-200 ease--in-out"
        href={`/api/files/download/${file.AttachedFile.FileId}`}
        target={'_blank'}
        rel="noreferrer"
      >
        <span className="font-bold">{file.AttachedFile.OriginalFilename}</span>
      </a>
    );
  }
  return <p>upload a file</p>;
}
interface IProps {
  activeContract: number;
  incrementActiveContractIndex: () => void;
}

const ContractDetailsForm = ({ activeContract, incrementActiveContractIndex }: IProps) => {
  const [activeContractBookingId, setActiveContractBookingId] = React.useState<number>(0);
  const [activeContractData, setActiveContractData] = React.useState([]);
  const [contractExists, setContractExists] = React.useState(false);
  const [bookingDetails, setBookingDetails] = React.useState<IBookingDetails>();
  const [contractDetails, setContractDetails] = React.useState<IContractDetails>();
  const [savedFiles, setSavedFiles] = React.useState<IAttachedFile[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [changed, setChanged] = React.useState<boolean>(false);
  const [saveChangesBookingId, setSaveChangesBookingId] = React.useState<number>(undefined);
  const [fileData, setFileData] = React.useState<IFileData>({
    description: '',
    originalFilename: '',
    fileDT: new Date(),
    fileContent: new Uint8Array(),
  });

  const bookingApiRoute = () => `/api/contracts/read/noContract/${activeContractBookingId}`;

  async function fetchBookingData() {
    setLoading(true);
    setChanged(false);
    const result = await fetch(bookingApiRoute());
    const parsedResults = await result.json();
    if (parsedResults.length > 0) {
      setActiveContractData(parsedResults);
      if (parsedResults[0].Contract.length > 0) {
        setContractExists(true);
      } else {
        setContractExists(false);
      }
    } else {
      console.error('error: problem finding booking in database');
    }
    setLoading(false);
  }

  async function formSaveHandler(e) {
    e.preventDefault();
    updateBooking(activeContractBookingId, bookingDetails);
    if (!contractExists) {
      const createdContract = await createContract(activeContractBookingId, contractDetails);
      if (createdContract) {
        setContractExists(true);

        uploadNewFile(fileData, activeContractBookingId);
      }
    } else {
      uploadNewFile(fileData, activeContractBookingId);
    }
  }
  useEffect(() => {
    if (activeContractData.length > 0) {
      const c = activeContractData[0];
      setBookingDetails({
        ShowDate: c.ShowDate,
        VenueContractStatus: c.VenueContractStatus,
        DealType: c.DealType,
        ContractSignedDate: formatInputDate(c.ContractSignedDate),
        ContractSignedBy: c.ContractSignedBy,
        BankDetailsReceived: c.BankDetailsReceived,
        RoyaltyPC: c.RoyaltyPC,
        CrewNotes: c.CrewNotes,
        MarketingDealNotes: c.MarketingDealNotes,
        TicketPriceNotes: c.TicketPriceNotes,
        BarringExemptions: c.BarringExemptions,
        ContractNotes: c.ContractNotes,
        GP: c.GP,
        ContractReturnDate: formatInputDate(c.ContractReturnDate),
        ContractReceivedBackDate: formatInputDate(c.ContractReceivedBackDate),
        ContractCheckedBy: c.ContractCheckedBy,
      });
      if (contractExists) {
        const firstContract = c.Contract[0];
        setContractDetails({
          BarringClauseBreaches: firstContract.BarringClauseBreaches,
          Artifacts: firstContract.Artifacts,
        });
        if (firstContract.ContractArtifacts.length > 0) {
          setSavedFiles(firstContract.ContractArtifacts);
        }
      } else {
        setContractDetails({
          BarringClauseBreaches: null,
          Artifacts: null,
        });
      }
    }
  }, [activeContractData]);

  useEffect(() => {
    if (activeContractBookingId === 0 || !changed) {
      setActiveContractBookingId(activeContract);
    } else {
      setSaveChangesBookingId(activeContract);
    }
  }, [activeContract]);

  useEffect(() => {
    activeContractBookingId !== 0 && fetchBookingData();
  }, [activeContractBookingId]);

  function formDataHandler(objKey: any, value: any, type: string) {
    setChanged(true);

    if (type === 'contract') {
      setContractDetails({ ...contractDetails, [objKey]: value });
    } else {
      setBookingDetails((prevBookingDetails) => ({
        ...prevBookingDetails,
        [objKey]: value,
      }));
    }
  }
  function refreshBookingDetails() {
    setBookingDetails({
      ShowDate: null,
      VenueContractStatus: null,
      DealType: null,
      ContractSignedDate: null,
      ContractSignedBy: null,
      BankDetailsReceived: null,
      RoyaltyPC: null,
      CrewNotes: null,
      MarketingDealNotes: null,
      TicketPriceNotes: null,
      BarringExemptions: null,
      ContractNotes: null,
      GP: null,
      ContractReturnDate: null,
      ContractReceivedBackDate: null,
      ContractCheckedBy: null,
    });
    setContractDetails({
      BarringClauseBreaches: null,
      Artifacts: null,
    });
  }

  const cancelNavigation = () => {
    setSaveChangesBookingId(undefined);
  };

  const continueWithoutSaving = () => {
    refreshBookingDetails();
    setActiveContractBookingId(saveChangesBookingId);
    setSaveChangesBookingId(undefined);
  };

  function saveAndProceed(e) {
    e.preventDefault();
    incrementActiveContractIndex();
  }

  const contract = activeContractData[0];

  if (loading) return <Spinner size="lg" className="mx-auto mt-20" />;

  if (bookingDetails) {
    return (
      <>
        <StyledDialog open={!!saveChangesBookingId} title="Unsaved Changes" onClose={cancelNavigation}>
          <SaveChangesWarning onCancel={cancelNavigation} onContinueWithoutSaving={continueWithoutSaving} />
        </StyledDialog>

        <div className="w-6/12 lg:w-7/12 xl:w-8/12 p-4 border-l-2 ">
          <div className="flex flex-row pb-6 mb-6 border-b-2">
            <div className="flex gap-4 text-xl">
              <div className="font-bold">
                <span className="text-primary-pink font-bold">Show Date:&nbsp;</span>
                <span className="font-bold text-primary-purple">{formatDate(contract.FirstDate)}</span>
              </div>
              <div className="font-bold">
                <span className="text-primary-pink font-bold">Performances:&nbsp;</span>
                <span className="font-bold text-primary-purple">{contract.Performance.length}</span>
              </div>
              <p className="font-bold whitespace-nowrap">
                <span className="text-primary-pink font-bold">Venue Name: </span>
                <span className="font-bold whitespace-nowrap text-primary-purple">
                  {contract.Venue ? contract.Venue.Name : '-'}
                </span>
              </p>
            </div>
          </div>
          <form>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="grid grid-cols-2 gap-2">
                <label htmlFor="status" className="text-primary-pink whitespace-nowrap font-bold">
                  Run days:{' '}
                </label>
                <select
                  className="border-none rounded-md"
                  value={bookingDetails.VenueContractStatus}
                  onChange={(e) => formDataHandler('VenueContractStatus', e.currentTarget.value, '')}
                >
                  <option value="NC">NO CONTRACT</option>
                  <option value="CRNR">CONTRACT RECEIVED NOT RETURNED</option>
                  <option value="CRQR">CONTRACT RECEIVED QUESTIONS RAISED</option>
                  <option value="CSAR">CONTRACT SIGNED & RETURNED</option>
                  <option value="CSBP">CONTRACT SIGNED BOTH PARTIES AND UPLOADED</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 mt-2 gap-8">
              <div className="grid grid-cols-2 gap-2">
                <Label htmlFor="checkedby">Checked By:</Label>
                <select className="border-none rounded-md">
                  <option>Peter Carlyle</option>
                </select>

                <Label htmlFor="checkedby">Returned to Venue: </Label>
                <input
                  className="border-none rounded-md w-full"
                  type={'date'}
                  value={bookingDetails.ContractReturnDate}
                  onChange={(e) => formDataHandler('ContractReturnDate', e.currentTarget.value, '')}
                />
                <Label htmlFor="checkedby">Returned by Venue: </Label>
                <input
                  className="w-full border-none rounded-md"
                  type={'date'}
                  value={bookingDetails.ContractReceivedBackDate}
                  onChange={(e) => formDataHandler('ContractReceivedBackDate', e.currentTarget.value, '')}
                />
                <Label htmlFor="checkedby">Deal Type: </Label>
                <select
                  className="border-none rounded-md"
                  value={bookingDetails.DealType}
                  onChange={(e) => formDataHandler('DealType', e.currentTarget.value, '')}
                >
                  <option value="NULL">None</option>
                  <option value="SPLT">Split</option>
                  <option value="GUA">Guarantee</option>
                  <option value="CS">Call Single</option>
                  <option value="CM">Call Multiple</option>
                  <option value="FCAS">First Call Against Split</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Label htmlFor="signedon">Signed on:</Label>
                <input
                  id="signedon"
                  type="date"
                  value={bookingDetails.ContractSignedDate}
                  className="w-full border-none rounded-md"
                  onChange={(e) => formDataHandler('ContractSignedDate', e.currentTarget.value, '')}
                />
                <Label htmlFor="checkedby">Signed By:</Label>
                <select className="border-none rounded-md">
                  <option>Peter Carlyle</option>
                </select>
                <Label>Return Note By:</Label>
                <select className="border-none rounded-md">
                  <option>-</option>
                  <option>PeterCarlyle</option>
                </select>
                <Label>Bank Details Sent</Label>
                <select className="border-none rounded-md">
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-8 mt-2">
              <div>
                <Label>Artifacts</Label>
                <div className="mt-2">
                  {savedFiles && savedFiles.map((file) => convertFileBuffer(file))}
                  <FileUploadButton disabled fileData={fileData} setFileData={setFileData} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Label>Gross Potential: </Label>
                <input
                  className="w-full border-none rounded-md"
                  type={'text'}
                  onChange={(e) => formDataHandler('GP', e.currentTarget.value, '')}
                  value={bookingDetails.GP}
                />
                <Label>Royalty: </Label>
                <input
                  className="w-full border-none rounded-md"
                  type={'text'}
                  onChange={(e) => formDataHandler('RoyaltyPC', e.currentTarget.value, '')}
                  value={bookingDetails.RoyaltyPC}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-2 mt-8">
              <div>
                <label htmlFor="date" className="sr-only text-primary-pink font-bold">
                  Crew Note
                </label>
                <textarea
                  placeholder="Crew Notes..."
                  id="date"
                  name="date"
                  className="border-gray-300 rounded-md w-full"
                  onChange={(e) => formDataHandler('CrewNotes', e.currentTarget.value, '')}
                  value={bookingDetails.CrewNotes}
                />
              </div>

              <div>
                <label htmlFor="date" className="sr-only text-primary-pink font-bold">
                  Marketing Deal
                </label>
                <textarea
                  placeholder="Marketing Deal..."
                  id="date"
                  name="date"
                  className="border-gray-300 rounded-md w-full"
                  onChange={(e) => formDataHandler('MarketingDealNotes', e.currentTarget.value, '')}
                  value={bookingDetails.MarketingDealNotes}
                />
              </div>

              <div className="flex items-center justify-between flex-row">
                <label htmlFor="date" className="sr-only text-primary-pink font-bold">
                  Ticket pricing Note
                </label>
                <textarea
                  placeholder="Ticket pricing notes..."
                  id="date"
                  name="date"
                  className="border-gray-300 rounded-md w-full"
                  onChange={(e) => formDataHandler('TicketPriceNotes', e.currentTarget.value, '')}
                  value={bookingDetails.TicketPriceNotes}
                />
              </div>

              <div className="flex items-center justify-between flex-row">
                <label htmlFor="date" className="sr-only text-primary-pink font-bold">
                  Barring clause breaches
                </label>
                <textarea
                  placeholder="Barring clause breaches..."
                  className="border-gray-300 rounded-md w-full"
                  onChange={(e) => formDataHandler('BarringClauseBreaches', e.currentTarget.value, 'contract')}
                  value={contractDetails.BarringClauseBreaches}
                />
              </div>

              <div>
                <label htmlFor="date" className="sr-only text-primary-pink font-bold">
                  Exemptions
                </label>
                <textarea
                  placeholder="Exemptions..."
                  id="date"
                  name="date"
                  className="border-gray-300 rounded-md w-full"
                  onChange={(e) => formDataHandler('BarringExemptions', e.currentTarget.value, '')}
                  value={bookingDetails.BarringExemptions}
                />
              </div>

              <div>
                <label htmlFor="date" className="sr-only flex-none text-primary-pink font-bold">
                  Contract Notes
                </label>
                <textarea
                  placeholder="Contract notes..."
                  id="date"
                  name="date"
                  className="border-gray-300 rounded-md w-full"
                  onChange={(e) => formDataHandler('ContractNotes', e.currentTarget.value, '')}
                  value={bookingDetails.ContractNotes}
                />
              </div>
            </div>
            <div className="my-8 flex w-full flex-row gap-8">
              <span className="font-medium">Weeks:</span>
              <div>
                <span className="text-primary-pink underline-offset-2 underline">Pre Show:</span>&nbsp;
                <span>12</span>
              </div>
              <div>
                <span className="text-primary-pink underline-offset-2 underline">Post Show:</span>&nbsp;
                <span>12</span>
              </div>
              <div>
                <span className="text-primary-pink underline-offset-2 underline">Miles:</span>&nbsp;
                <span>30</span>
              </div>
            </div>
            <div className="flex flex-row">
              <button className="w-auto h-10 text-primary-pink px-2 border-primary-pink border-2 bg-white hover:bg-primary-pink hover:text-white rounded-md transition-all duration-200 ease--in-out">
                Check Barring Clauses
              </button>
            </div>
            <div className="flex flex-row mt-12">
              <button
                onClick={(e) => formSaveHandler(e)}
                className="w-auto h-10 text-sm text-primary-pink px-2 border-primary-pink border-2 bg-white hover:bg-primary-pink hover:text-white rounded-md transition-all duration-200 ease--in-out"
              >
                Save Contract Details
              </button>
              <button
                onClick={saveAndProceed}
                className="w-auto h-10 text-sm text-white ml-4 px-2 border-primary-pink border-2 bg-primary-pink hover:bg-primary-pink hover:text-white rounded-md transition-all duration-200 ease--in-out"
              >
                Save proceed to next venue
              </button>
            </div>
          </form>
        </div>
      </>
    );
  } else {
    return (
      <div className="w-4/12 p-4 border-4 ">
        <h1>Select a booking</h1>
      </div>
    );
  }
};

export default ContractDetailsForm;
