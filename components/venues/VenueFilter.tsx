import Button from 'components/core-ui-lib/Button';
import Select from 'components/core-ui-lib/Select';

// import { SearchBox } from 'components/global/SearchBox';
import GlobalToolbar from 'components/toolbar';
import { useRecoilState } from 'recoil';
import { filterVenueState } from 'state/booking/filterVenueState';

export default function VenueFilter() {
  const [venueFilter, setVenueFilter] = useRecoilState(filterVenueState);
  const onChange = (e: any) => {
    setVenueFilter({ ...venueFilter, [e.target.id]: e.target.value });
  };
  return (
    <>
      <div className="w-full flex items-center justify-between flex-wrap">
        <div className="mx-0">
          <div className="px-4">
            <GlobalToolbar
              title="Venues"
              //   searchFilter={venueFilter.town}
              //   setSearchFilter={(town) => setVenueFilter({ town })}
              titleClassName="text-primary-orange"
            ></GlobalToolbar>
          </div>
          <Select
            onChange={(value) => onChange({ target: { id: 'status', value } })}
            //   disabled={!ProductionId}
            value={venueFilter.town}
            className="bg-white w-52"
            label="Town"
            placeHolder="Select Town"
            //   options={allStatusOptions}
          />
          <Select
            onChange={(value) => onChange({ target: { id: 'status', value } })}
            //   disabled={!ProductionId}
            value={venueFilter.town}
            className="bg-white w-52"
            label="On Production"
            placeHolder="Select Production"
            //   options={allStatusOptions}
          />
          <Select
            onChange={(value) => onChange({ target: { id: 'status', value } })}
            //   disabled={!ProductionId}
            value={venueFilter.town}
            className="bg-white w-52"
            label="Country"
            placeHolder="Select Country"
            //   options={allStatusOptions}
          />
          {/* <SearchBox /> */}
          <Button text="Clear Filters" className="text-sm leading-8 w-[100px]" />
          <Button text="Add New" className="text-sm leading-8 w-[100px]" />
        </div>
      </div>
    </>
  );
}
