import * as React from 'react';
import TourJumpMenu from '../global/nav/TourJumpMenu';

// This needs to be passed from the template
// let show = "ST1";
// let tour = "22";

interface props {
  title: string;
  searchFilter?: string;
  setSearchFilter?: (filter: string) => void;
  color?: string;
  tourJump?: boolean;
  filterComponent?: any;
  page?: string;
}

const GlobalToolbar = ({
  title,
  tourJump = true,
  color = 'text-primary-blue',
  filterComponent,
  children,
}: React.PropsWithChildren<props>) => {
  const [filtersOpen, setFiltersOpen] = React.useState(false);

  return (
    <div className="py-2 flex flex-row items-center gap-4 w-[1200px] ml-4">
      <h1 className={`text-3xl font-bold text-${color} text-primary-blue`}>{title}</h1>
      {filterComponent && (
        <div className="flex flex-row">
          <button
            className="border-gray-400 rounded-md drop-shadow-md px-2 py-1"
            onClick={() => setFiltersOpen(!filtersOpen)}
          >
            <span className="font-bold">Display Filters</span>
            <svg
              className="inline-block ml-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              width="20"
              height="20"
            >
              {filtersOpen ? (
                <path d="M5 6l5 5 5-5H5z" />
              ) : (
                <path fillRule="evenodd" d="M5 8h10l-5 5-5-5zm0 0h10l-5 5-5-5z" clipRule="evenodd" />
              )}
            </svg>
          </button>
        </div>
      )}
      {tourJump ? (
        <div className="bg-white drop-shadow-md inline-block rounded-md">
          <div className="rounded-l-md">
            <div className="flex items-center">
              <p className="mx-2">Set Tour</p>
              <TourJumpMenu />
            </div>
          </div>
        </div>
      ) : (
        <div> </div>
      )}
      {children}
      {filterComponent && filterComponent}
    </div>
  );
};

export default GlobalToolbar;
