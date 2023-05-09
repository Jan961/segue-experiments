// noinspection TypeScriptValidateTypes

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useRouter } from "next/router";
import formatDate from "utils/formatDate";
import formatFormDate from "utils/dateInputFormat";
import formatPerformanceTimes from "utils/formatPerformanceTimes";
import FileUploadButton from "components/files/FileUploadButton";
import {
  IAttachedFile,
  IBookingDetails,
  IContractDetails,
  IFileData,
} from "interfaces";
import ModalContainer from "./modal/ModalContainer";
import SaveChangesWarning from "./modal/SaveChangesWarning";
import {loggingService} from "../../services/loggingService";

let show = "ST1"; // This needs to be passed from the template
let tour = "22";
// @ts-ignore
let today = new Date();

async function updateBooking(
  bookingId: number,
  bookingDetails: IBookingDetails
) {
  try {
    let bookingAddress = () => `/api/contracts/update/booking/${bookingId}`;
    let response = await fetch(bookingAddress(), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookingDetails),
    });
    if (response.ok) {
      let parsedResponse = await response.json();
      return { success: true };
    }
  } catch (error) {
    console.error("problem updating booking");
  }
}
async function updateContract(
  bookingId: number,
  contractDetails: IContractDetails
) {
  try {
    let contractUpdateAddress = () =>
      `/api/contracts/update/contract/${bookingId}`;
    let response = await fetch(contractUpdateAddress(), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contractDetails),
    });
    if (response.ok) {
      loggingService.logAction("Contracts","Update Address")

      let parsedResponse = await response.json();
      return { success: true, contractData: parsedResponse };
    }
  } catch (error) {
    loggingService.logError( error)
    console.error("problem updating contract");
  }
}

async function createContract(
  bookingId: number,
  contractDetails: IContractDetails
) {
  try {
    let bookingAddress = () => `/api/contracts/create/${bookingId}`;
    let response = await fetch(bookingAddress(), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contractDetails),
    });
    if (response.ok) {
      loggingService.logAction("Contracts","Create Contract")
      let parsedResponse = await response.json();
      return { success: true, contractData: parsedResponse };
    }
  } catch (error) {
    loggingService.logError( error)
    console.error("problem creating contract");
  }
}

async function uploadNewFile(file: IFileData, bookingId: number) {
  try {
    if (file.fileContent.length > 0) {
      const uploadFileApi = () => `/api/files/upload/contractFile/${bookingId}`;
      const response = await fetch(uploadFileApi(), {
        method: "POST",
        body: JSON.stringify(file),
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        loggingService.logAction("Contracts","New File Uploaded")
        let parsedResponse = await response.json();
        return parsedResponse;
      } else {
        throw new Error();
      }
    }
  } catch (error) {
    loggingService.logError( error)
    console.error(error);
  }
}

function convertFileBuffer(file) {
  if (file.AttachedFile) {
    return (
      <a
      className="w-auto align-middle my-2 h-10 text-sm text-primary-pink ml-4 px-2 border-gray-800 border-1 bg-white hover:bg-primary-pink hover:text-white rounded-md transition-all duration-200 ease--in-out"
      href={`/api/files/download/${file.AttachedFile.FileId}`}
        target={"_blank"}
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

const ContractDetailsForm = ({
  activeContract,
  incrementActiveContractIndex,
}: IProps) => {
  const [activeContractBookingId, setActiveContractBookingId] =
    useState<number>(0);
  const [activeContractData, setActiveContractData] = useState([]);
  const [contractExists, setContractExists] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<IBookingDetails>();
  const [contractDetails, setContractDetails] = useState<IContractDetails>();
  const [savedFiles, setSavedFiles] = useState<IAttachedFile[]>([]);
  const [savedChangesModal, setSavedChangesModal] = useState<boolean>(false);
  const [fileData, setFileData] = useState<IFileData>({
    description: "",
    originalFilename: "",
    fileDT: new Date(),
    fileContent: new Uint8Array(),
  });

  let router = useRouter();
  const { showId } = router.query;

  const bookingApiRoute = () =>
    `/api/contracts/read/noContract/${activeContractBookingId}`;

  async function fetchBookingData() {
    const result = await fetch(bookingApiRoute());
    let parsedResults = await result.json();
    if (parsedResults.length > 0) {
      setActiveContractData(parsedResults);
      if (parsedResults[0].Contract.length > 0) {
        setContractExists(true);
      } else {
        setContractExists(false);
      }
    } else {
      console.error("error: problem finding booking in database");
    }
  }

  async function formSaveHandler(e) {
    e.preventDefault();
    updateBooking(activeContractBookingId, bookingDetails);
    if (!contractExists) {
      let createdContract = await createContract(
        activeContractBookingId,
        contractDetails
      );
      if (createdContract) {
        setContractExists(true);

        uploadNewFile(fileData, activeContractBookingId);
      }
    } else {
      let updatedContract = updateContract(
        activeContractBookingId,
        contractDetails
      );
      uploadNewFile(fileData, activeContractBookingId);
    }
  }

  useEffect(() => {
    if (activeContractData.length > 0) {
      setBookingDetails({
        ShowDate: activeContractData[0].ShowDate,
        VenueContractStatus: activeContractData[0].VenueContractStatus,
        DealType: activeContractData[0].DealType,
        ContractSignedDate: formatFormDate(
          activeContractData[0].ContractSignedDate
        ),
        ContractSignedBy: activeContractData[0].ContractSignedBy,
        BankDetailsReceived: activeContractData[0].BankDetailsReceived,
        RoyaltyPC: activeContractData[0].RoyaltyPC,
        CrewNotes: activeContractData[0].CrewNotes,
        MarketingDealNotes: activeContractData[0].MarketingDealNotes,
        TicketPriceNotes: activeContractData[0].TicketPriceNotes,
        BarringExemptions: activeContractData[0].BarringExemptions,
        ContractNotes: activeContractData[0].ContractNotes,
        GP: activeContractData[0].GP,
        ContractReturnDate: formatFormDate(
          activeContractData[0].ContractReturnDate
        ),
        ContractReceivedBackDate: formatFormDate(
          activeContractData[0].ContractReceivedBackDate
        ),
        ContractCheckedBy: activeContractData[0].ContractCheckedBy,
      });
      if (contractExists) {
        setContractDetails({
          BarringClauseBreaches:
            activeContractData[0].Contract[0].BarringClauseBreaches,
          Artifacts: activeContractData[0].Contract[0].Artifacts,
        });
        if (activeContractData[0].Contract[0].ContractArtifacts.length > 0) {
          setSavedFiles(activeContractData[0].Contract[0].ContractArtifacts);
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
    if (activeContractBookingId === 0) {
      setActiveContractBookingId(activeContract);
    } else {
      setSavedChangesModal(true);
    }
  }, [activeContract]);

  useEffect(() => {
    activeContractBookingId !== 0 && fetchBookingData();
  }, [activeContractBookingId]);

  function formDataHandler(objKey: any, value: any, type: string) {
    if (type === "contract") {
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
  function continueWithoutSaving() {
    refreshBookingDetails();
    //  setActiveContractBookingId(activeContract);
    setSavedChangesModal(false);
  }

  function saveAndProceed(e) {
    e.preventDefault();
    incrementActiveContractIndex();
  }


  
  if (bookingDetails) {
    return (
      <>
        <ModalContainer
          isOpen={savedChangesModal}
          onClose={setSavedChangesModal}
        >
          <SaveChangesWarning
            onCancel={setSavedChangesModal}
            onContinueWithoutSaving={continueWithoutSaving}
          />
        </ModalContainer>

        <div className="w-8/12 p-4 border-l-2 ">
          <div className="flex flex-row pb-6 mb-6 border-b-2">
            <div className={"grid grid-cols-2"}>
              
              <div className="font-bold">
                <span className="text-xl text-primary-pink font-bold">
                  Show Date:{" "}
                </span>
                <span className="font-bold text-primary-purple">
                  {formatDate(bookingDetails.ShowDate)}
                </span>
              </div>
              <div className="font-bold">
                <span className="text-xl text-primary-pink font-bold">
                  Performances:{" "}
                </span>
                <span className="font-bold text-primary-purple">
                  {formatPerformanceTimes(
                    activeContractData[0].Performance1Time,
                    activeContractData[0].Performance2Time
                  )}
                </span>
              </div>
          <p className="font-bold whitespace-nowrap text-xl">
            <span className=" text-primary-pink font-bold">Venue Name: </span>
            <span className="font-bold whitespace-nowrap text-primary-purple">
              {activeContractData[0].Venue
                ? activeContractData[0].Venue.Name
                : "-"}
            </span>
          </p>
                </div>
              </div>
          <form>
            <div className="grid grid-cols-2 my-4">
              {/* first grid OPEN */}
              <div className="grid grid-rows-5 gap-3">
              <div>
                <div className="flex-1 flex space-x-8">
                  <label
                    htmlFor="status"
                    className="text-primary-pink whitespace-nowrap font-bold"
                  >
                    Run days:{" "}
                  </label>
                  <select className="border-none rounded-md" 
                    value={bookingDetails.VenueContractStatus}
                    onChange={(e) =>
                      formDataHandler(
                        "VenueContractStatus",
                        e.currentTarget.value,
                        ""
                      )
                    }
                  >
                    <option value="NC">NO CONTRACT</option>
                    <option value="CRNR">CONTRACT RECEIVED NOT RETURNED</option>
                    <option value="CRQR">
                      CONTRACT RECEIVED QUESTIONS RAISED
                    </option>
                    <option value="CSAR">CONTRACT SIGNED & RETURNED</option>
                    <option value="CSBP">
                      CONTRACT SIGNED BOTH PARTIES AND UPLOADED
                    </option>
                  </select >
                  </div>

              </div>
              <div className="flex-1 flex items-center space-x-8">
                  <label
                    htmlFor="checkedby"
                    className="text-primary-pink font-bold w-32 pr-1"
                  >
                    Checked By:
                  </label>
                  <select className="border-none rounded-md"  >
                    <option>Peter Carlyle</option>
                  </select >
                </div>
                <div className="flex-1 flex items-center space-x-8">
                  <label
                    htmlFor="checkedby"
                    className="text-primary-pink font-bold inline-block w-32"
                  >
                    Returned to Venue:{" "}
                  </label>
                  <input
                    className="w-32 border-none rounded-md"
                    type={"date"}
                    value={bookingDetails.ContractReturnDate}
                    onChange={(e) =>
                      formDataHandler(
                        "ContractReturnDate",
                        e.currentTarget.value,
                        ""
                      )
                    }
                  />
                </div>
                <div className="flex flex-1 items-center space-x-8">
                  <label
                    htmlFor="checkedby "
                    className="text-primary-pink font-bold"
                  >
                    Returned by Venue:{" "}
                  </label>
                  <input
                    className="w-32 border-none rounded-md"

                    type={"date"}
                    value={bookingDetails.ContractReceivedBackDate}
                    onChange={(e) =>
                      formDataHandler(
                        "ContractReceivedBackDate",
                        e.currentTarget.value,
                        ""
                      )
                    }
                  />
                </div>
                <div className="flex flex-1 items-center space-x-8">
                  <label
                    htmlFor="checkedby"
                    className="text-primary-pink font-bold"
                  >
                    Deal Type:{" "}
                  </label>
                  <select className="border-none rounded-md" 
                    value={bookingDetails.DealType}
                    onChange={(e) =>
                      formDataHandler("DealType", e.currentTarget.value, "")
                    }
                  >
                    <option value="NULL">none</option>
                    <option value="SPLT">split</option>
                    <option value="GUA">guarantee</option>
                    <option value="CS">call single</option>
                    <option value="CM">call multiple</option>
                    <option value="FCAS">first call against split</option>
                  </select >
                </div>
                  
                </div>
              {/* first grid CLOSE */}
              {/* 2nd grid open */}

                <div className="grid grid-rows-5 gap-3">
                <div>&nbsp;</div>
              <div className="flex flex-1 space-x-8 items-center">
                  <label
                    htmlFor="signedon"
                    className="text-primary-pink font-bold w-32 pr-1"
                  >
                    Signed on:
                  </label>
                  <input
                    id="signedon"
                    type="date"
                    value={bookingDetails.ContractSignedDate}
                    onChange={(e) =>
                      formDataHandler(
                        "ContractSignedDate",
                        e.currentTarget.value,
                        ""
                      )
                    }
                    className="w-44 border-none rounded-md"
                  />
                </div>
                <div className="flex-1 flex space-x-8 items-center">
                  <label
                    htmlFor="checkedby"
                    className="text-primary-pink font-bold w-32 pr-1"
                  >
                    Signed By:
                  </label>
                  <select className="border-none rounded-md"  >
                    <option>Peter Carlyle</option>
                  </select >
                </div>
                <div className="flex flex-1 items-center space-x-8">
                  <label className="text-primary-pink font-bold">Return Note By: </label>
                  <select className="border-none rounded-md" >
                    <option>-</option>
                    <option>PeterCarlyle</option>
                  </select >
                </div>
                <div className="flex flex-1 items-center space-x-8">
                  <label className="text-primary-pink font-bold">
                    Bank Details Sent
                  </label>
                  <select className="border-none rounded-md" >
                    <option>Yes</option>
                    <option>No</option>
                  </select >
                </div>
                </div>
              {/* 2nd grid close */}
          
            
            </div>
            <div className="flex flex-row my-4">
              <div className={"grid grid-cols-2 space-x-8"}>
                <div>
                  <span className="font-bold text-primary-pink">Artefacts</span>
                  {contractDetails.Artifacts && <p>contract.artifact</p>}
                 
                
                    <div className="flex flex-col">

                    {savedFiles &&
                      savedFiles.map((file) => convertFileBuffer(file))}
                          <FileUploadButton
                      fileData={fileData}
                      setFileData={setFileData}
                    />
                      </div>
                 
                </div>
                <div className="flex flex-col">
                  <div className={"flex flex-row space-x-8"}>
                    <label className=" w-24 text-primary-pink font-bold">
                      Gross Potential:{" "}
                    </label>
                    <input
                    className="w-32 border-1 border-gray-300 rounded-md"

                      type={"text"}
                      onChange={(e) =>
                        formDataHandler("GP", e.currentTarget.value, "")
                      }
                      value={bookingDetails.GP}
                    />
                  </div>
                  <div className={"flex flex-row space-x-8 mt-4"}>
                    <label className="w-24 text-primary-pink font-bold">
                      Royalty:{" "}
                    </label>
                    <input
                    className="w-32 border-1 border-gray-300 rounded-md"

                      type={"text"}
                      onChange={(e) =>
                        formDataHandler("RoyaltyPC", e.currentTarget.value, "")
                      }
                      value={bookingDetails.RoyaltyPC}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between flex-row">
              <label htmlFor="date" className="sr-only text-primary-pink font-bold">
                Crew Note
              </label>
              <input
              placeholder="Crew Notes..."
                type="text"
                id="date"
                name="date"
                className="flex rounded-md border-1 border-gray-300 flex-initial w-4/6 my-5"
                onChange={(e) =>
                  formDataHandler("CrewNotes", e.currentTarget.value, "")
                }
                value={bookingDetails.CrewNotes}
              />
            </div>

            <div className="flex items-center justify-between flex-row">
              <label htmlFor="date" className="sr-only text-primary-pink font-bold">
                Marketing Deal
              </label>
              <input
              placeholder="Marketing Deal..."
                type="text"
                id="date"
                name="date"
                className="flex rounded-md border-1 border-gray-300 flex-initial w-4/6 my-5"
                onChange={(e) =>
                  formDataHandler(
                    "MarketingDealNotes",
                    e.currentTarget.value,
                    ""
                  )
                }
                value={bookingDetails.MarketingDealNotes}
              />
            </div>

            <div className="flex items-center justify-between flex-row">
              <label htmlFor="date" className="sr-only text-primary-pink font-bold">
                Ticket pricing Note
              </label>
              <input
              placeholder="Ticket pricing notes..."
                type="text"
                id="date"
                name="date"
                className="flex rounded-md border-1 border-gray-300 flex-initial w-4/6 my-5"
                onChange={(e) =>
                  formDataHandler("TicketPriceNotes", e.currentTarget.value, "")
                }
                value={bookingDetails.TicketPriceNotes}
              />
            </div>

            <div className="flex items-center justify-between flex-row">
              <label htmlFor="date" className="sr-only text-primary-pink font-bold">
                Barring clause breaches
              </label>
              <input
              placeholder="Barring clause breaches..."

                type="text"
                className="flex rounded-md border-1 border-gray-300 flex-initial w-4/6 my-5"
                onChange={(e) =>
                  formDataHandler(
                    "BarringClauseBreaches",
                    e.currentTarget.value,
                    "contract"
                  )
                }
                value={contractDetails.BarringClauseBreaches}
              />
            </div>

            <div className="flex items-center justify-between flex-row">
              <label htmlFor="date" className="sr-only text-primary-pink font-bold">
                Exemptions
              </label>
              <input
              placeholder="Exemptions..."

                type="text"
                id="date"
                name="date"
                className="flex rounded-md border-1 border-gray-300  my-5 flex-initial w-4/6"
                onChange={(e) =>
                  formDataHandler(
                    "BarringExemptions",
                    e.currentTarget.value,
                    ""
                  )
                }
                value={bookingDetails.BarringExemptions}
              />
            </div>

            <div className="flex items-center justify-between flex-row">
              <label
                htmlFor="date"
                className="sr-only flex-none text-primary-pink font-bold"
              >
                Contract Notes
              </label>
              <input
              placeholder="Contract notes..."

                type="text"
                id="date"
                name="date"
                
                className=" rounded-md border-1 border-gray-300 flex flex-initial w-4/6"
                onChange={(e) =>
                  formDataHandler("ContractNotes", e.currentTarget.value, "")
                }
                value={bookingDetails.ContractNotes}
              />
            </div>
            <div className="my-8 flex w-full justify-around flex-row">
              <span className="font-medium">Weeks:</span>
              <div>
                <span className="text-primary-pink underline-offset-2 underline font-medium">Pre Show:</span>{" "}
                <span>12</span>
              </div>
              <div>
                <span className="text-primary-pink underline-offset-2 underline font-medium">Post Show:</span>{" "}
                <span>12</span>
              </div>
              <div>
                <span className="text-primary-pink underline-offset-2 underline font-medium">Miles:</span>{" "}
                <span>30</span>
              </div>
            </div>
            <div className="flex flex-row">
              <button
              className="w-auto h-10 text-primary-pink px-2 border-primary-pink border-2 bg-white hover:bg-primary-pink hover:text-white rounded-md transition-all duration-200 ease--in-out"
              >
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
        <h1>Select  a booking</h1>
      </div>
    );
  }
};

export default ContractDetailsForm;
