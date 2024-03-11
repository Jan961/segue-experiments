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
        <div className=" w-full flex flex-row ">
          <div className="px-4">
            <GlobalToolbar
              title={'Venues'}
              searchFilter={venueFilter.town}
              setSearchFilter={(town) => setVenueFilter({ town })}
              titleClassName="text-primary-orange"
            ></GlobalToolbar>
          </div>
          <div className="px-4 flex  gap-4 flex-wrap  py-1 w-full">
            <div className="w-full flex flex-row gap-5">
              <Select
                onChange={(value) => onChange({ target: { id: 'status', value } })}
                //   disabled={!ProductionId}
                value={venueFilter.town}
                className="bg-white w-full"
                label="Town"
                placeHolder="Select Town"
                //   options={allStatusOptions}
              />
              <Select
                onChange={(value) => onChange({ target: { id: 'status', value } })}
                //   disabled={!ProductionId}
                value={venueFilter.town}
                className="bg-white w-full"
                label="On Production"
                placeHolder="Select Production"
                //   options={allStatusOptions}
              />
            </div>
            <Select
              onChange={(value) => onChange({ target: { id: 'status', value } })}
              //   disabled={!ProductionId}
              value={venueFilter.town}
              className="bg-white w-[460px] h-fit"
              label="Country"
              placeHolder="Select Country"
              //   options={allStatusOptions}
            />
            {/* <SearchBox /> */}
            <div className=" flex flex-col gap-3 ">
              <Button text="Clear Filters" className="text-sm leading-8 w-[100px]" />
              <Button text="Add New" className="text-sm leading-8 w-[100px]" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
