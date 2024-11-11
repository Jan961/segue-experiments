import { Button, PopupModal } from 'components/core-ui-lib';
import { UploadedFile } from 'components/core-ui-lib/UploadModal/interface';
import { UploadParamType } from 'types/SpreadsheetValidationTypes';
import TextBoxConfirmation from './TextBoxConfirmation/TextBoxConfirmation';
import { useState } from 'react';
import LoadingOverlay from 'components/core-ui-lib/LoadingOverlay';

interface SpreadsheetModalProps {
  visible: boolean;
  onClose: () => void;
  closeUploadModal: () => void;
  handleUpload: () => void;
  uploadParams: UploadParamType;
  uploadedFile: UploadedFile[];
  prodShowCode: string | null;
}

const SpreadsheetConfirmationModal = ({
  visible,
  onClose,
  handleUpload,
  uploadParams,
  uploadedFile,
  closeUploadModal,
  prodShowCode,
}: SpreadsheetModalProps) => {
  const [validConfirmationMessage, setValidConfirmationMessage] = useState<boolean>(null);
  const [displayErrorMessage, setDisplayErrorMessage] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);

  const statusMessage = () => {
    if (uploadParams.spreadsheetIssues.spreadsheetErrorOccurred) {
      return (
        <div>
          <p>There have been errors found in this data.</p>
          <p>Please download the annotated spreadsheet, correct the errors, then upload your data.</p>
          <div className="flex gap-x-2 justify-end">{failureButtons()}</div>
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
          <div className="flex gap-x-2 justify-end">{failureButtons()}</div>
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
          <div className="flex gap-x-2 justify-end">{failureButtons()}</div>
        </div>
      );
    }

    return (
      <div>
        <p className="mb-5">
          This data will be uploaded to {prodShowCode}. Any existing Booking/Sales data for {prodShowCode} will be{' '}
          <strong className="text-primary-red">OVERWRITTEN</strong>. Do you wish to proceed?
        </p>
        <div className="mb-5">
          <TextBoxConfirmation requiredMessage={prodShowCode} setValid={setValidConfirmationMessage} />
          {displayErrorMessage && (
            <p className="text-primary-red absolute">Please enter the text exactly as displayed to confirm.</p>
          )}
        </div>
        <div className="flex gap-x-2 justify-end">{proceedButtons()}</div>
      </div>
    );
  };

  const failureButtons = () => {
    return (
      <>
        <Button className="w-[128px] mt-3" text="Close" variant="secondary" onClick={closeModals} />
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
  };

  const proceedButtons = () => {
    return (
      <>
        <Button className="w-[128px] mt-3" text="No" variant="secondary" onClick={closeModals} />
        <Button
          className="w-[128px] mt-3"
          text="Upload"
          onClick={async () => {
            if (validConfirmationMessage) {
              setIsLoading(true);
              await handleUpload();
              setIsLoading(false);
              closeModals();
            } else {
              setDisplayErrorMessage(true);
            }
          }}
        />
      </>
    );
  };

  const closeModals = () => {
    onClose();
    closeUploadModal();
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

  return (
    <PopupModal show={visible} title="Load Sales History" onClose={closeModals} panelClass="w-1/3">
      {statusMessage()}
      {isLoading && <LoadingOverlay />}
    </PopupModal>
  );
};

export default SpreadsheetConfirmationModal;
