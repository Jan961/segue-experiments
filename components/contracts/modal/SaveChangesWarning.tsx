import React from 'react';

interface WarningModalProps {
  onContinueWithoutSaving: (e: any) => void;
  onCancel: (e: any) => void;
}

const SaveChangesWarning: React.FC<WarningModalProps> = ({ onContinueWithoutSaving, onCancel }) => {
  return (
    <>
      <div>
        <div className="mt-2">
          <p className="text-sm text-gray-500">
            You have unsaved changes to the contract. If you continue without saving, you will lose these changes.
          </p>
        </div>
      </div>
      <div className="mt-5 sm:mt-6">
        <button
          type="button"
          className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm"
          onClick={onContinueWithoutSaving}
        >
          Continue without saving
        </button>
        <button
          type="button"
          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </>
  );
};

export default SaveChangesWarning;
