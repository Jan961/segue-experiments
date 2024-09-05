import { Button, PopupModal } from 'components/core-ui-lib';
import { UploadedFile } from 'components/core-ui-lib/UploadModal/interface';
import { UploadParamType , SpreadsheetData } from 'types/SpreadsheetValidationTypes';

interface SpreadsheetModalProps {
  visible: boolean;
  onClose: () => void;
  closeUploadModal: () => void;
  handleUpload: (
    selectedFiles: UploadedFile[],
    spreadsheetData: SpreadsheetData,
    onProgress: (file: File, uploadProgress: number) => void,
    onError: (file: File, errorMessage: string) => void,
    onUploadingImage: (file: File, imageUrl: string) => void,
  ) => void;
  uploadParams: UploadParamType;
  uploadedFile: UploadedFile[];
  prodCode: string | null;
}

const SpreadsheetConfirmationModal = ({
  visible,
  onClose,
  handleUpload,
  uploadParams,
  uploadedFile,
  closeUploadModal,
  prodCode,
}: SpreadsheetModalProps) => {
  const statusMessage = () => {
    if (uploadParams.spreadsheetIssues.spreadsheetErrorOccurred) {
      return (
        <div>
          <p>There have been errors found in this data.</p>
          <p>Please download the annotated spreadsheet, correct the errors, then upload your data.</p>
        </div>
      );
    }

    if (uploadParams.spreadsheetIssues.spreadsheetWarningOccurred) {
      return (
        <div>
          <p>There have been warnings found in this data.</p>
          <p>
            Please download the spreadsheet, correct the warnings or enter a Y into the `Ignore Warnings` column for
            that row, then upload your data.
          </p>
        </div>
      );
    }

    if (uploadParams.spreadsheetIssues.spreadsheetFormatIssue) {
      return (
        <div>
          <p>There have been formatting issues found in this data.</p>
          <p>
            Please verify that the spreadsheet data is correctly formatted according to the provided template. This
            includes:
          </p>
          <ul className="list-disc ml-5">
            <li>The Worksheet with Sales data is named &quot;Sales&quot; (Case Sensitive)</li>
            <li>Ensuring the headers match those in the example template. </li>
            <li>The data starts at cell A1</li>
            <li>All formatting aligns with the example template</li>
          </ul>
        </div>
      );
    }

    return (
      <div>
        <p>
          This date will be uploaded to {prodCode}. Any existing sales data will be overwritten. Do you wish to proceed?
        </p>
      </div>
    );
  };

  const buttonOptions = () => {
    if (
      !uploadParams.spreadsheetIssues.spreadsheetErrorOccurred &&
      !uploadParams.spreadsheetIssues.spreadsheetWarningOccurred &&
      !uploadParams.spreadsheetIssues.spreadsheetFormatIssue
    ) {
      return (
        <>
          <Button
            className="w-[128px] mt-3"
            text="No"
            variant="secondary"
            onClick={() => {
              closeModals();
            }}
          />
          <Button
            className="w-[128px] mt-3"
            text="Yes"
            onClick={() => {
              handleUpload(
                uploadedFile,
                uploadParams.spreadsheetData,
                uploadParams.onProgress,
                uploadParams.onError,
                uploadParams.onUploadingImage,
              );
              closeModals();
            }}
          />
        </>
      );
    } else {
      return (
        <>
          <Button
            className="w-[128px] mt-3"
            text="Close"
            variant="secondary"
            onClick={() => {
              closeModals();
            }}
          />
          <Button
            className="w-[128px] mt-3"
            text="Redownload"
            onClick={() => {
              downloadSpreadsheet();
              closeModals();
            }}
          />
        </>
      );
    }
  };

  const downloadSpreadsheet = () => {
    const file = uploadedFile[0].file;
    const url = URL.createObjectURL(file);

    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const closeModals = () => {
    onClose();
    closeUploadModal();
  };

  return (
    <PopupModal show={visible} title="Load Sales History" onClose={closeModals} panelClass="w-1/4">
      {statusMessage()}
      <div className="flex gap-x-2 justify-end">{buttonOptions()}</div>
    </PopupModal>
  );
};

export default SpreadsheetConfirmationModal;
