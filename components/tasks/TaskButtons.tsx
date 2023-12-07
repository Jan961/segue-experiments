import { useState } from 'react';

interface props {
  openBulkModal: (key: string) => void;
}
function TaskButtons({ openBulkModal }: props) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className="options">
      <div className="flex relative inline-block text-left">
        <div>
          <button
            onClick={toggleDropdown}
            type="button"
            className="inline-flex items-center rounded-md border bg-white mr-3 px-3 py-2 text-sm leading-4 shadow-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 hover:font-bold"
            id="menu-button"
            aria-expanded="true"
            aria-haspopup="true"
          >
            Bulk Actions
            <svg
              className="-mr-1 ml-2 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        {isOpen && (
          <div
            className="absolute left-0 z-10 w-56 origin-bottom-right bottom-full mb-2 divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="menu-button"
          >
            <div className="py-1" role="none">
              <button
                onClick={() => openBulkModal('reassign')}
                className="text-gray-700 group flex items-center px-4 py-2 text-sm"
                role="menuitem"
                id="menu-item-0"
              >
                <i className="fa-solid fa-handshake-angle"></i>
                Re-assign
              </button>
              <button
                onClick={() => openBulkModal('setstatus')}
                className="text-gray-700 group flex items-center px-4 py-2 text-sm"
                role="menuitem"
                id="menu-item-1"
              >
                <i className="fa-solid fa-certificate"></i>
                Set Status
              </button>
            </div>
            <div className="py-1" role="none">
              <button
                onClick={() => openBulkModal('priority')}
                className="text-gray-700 group flex items-center px-4 py-2 text-sm"
                role="menuitem"
                id="menu-item-2"
              >
                <i className="fa-solid fa-sort"></i>
                Priority
              </button>
              <button
                onClick={() => openBulkModal('progress')}
                className="text-gray-700 group flex items-center px-4 py-2 text-sm"
                role="menuitem"
                id="menu-item-3"
              >
                <i className="fa-solid fa-bars-progress"></i>
                Progress
              </button>
            </div>
            <div className="py-1" role="none">
              <button
                onClick={() => openBulkModal('followup')}
                className="text-gray-700 group flex items-center px-4 py-2 text-sm"
                role="menuitem"
                id="menu-item-4"
              >
                <i className="fa-solid fa-check-double"></i>
                Follow-up
              </button>
            </div>
          </div>
        )}

        <button
          type="button"
          className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Apply
        </button>
      </div>
    </div>
  );
}

export default TaskButtons;
