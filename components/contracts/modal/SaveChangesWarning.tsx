

// components/WarningModal.tsx
import React from 'react';

interface WarningModalProps {
  onContinueWithoutSaving: () => void;
  onCancel: (boolean:boolean) => void;
}

const SaveChangesWarning: React.FC<WarningModalProps> = ({ onContinueWithoutSaving, onCancel }) => {

  return (
    <div className="w-70 z-10 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-1/2 px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div>
            <h3 className="text-lg text-center leading-6 font-medium text-gray-900" id="modal-title">
              Unsaved Changes
            </h3>
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
              onClick={() =>onCancel(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaveChangesWarning;
