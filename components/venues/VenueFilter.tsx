import Button from 'components/core-ui-lib/Button';
import Select, { SelectOption } from 'components/core-ui-lib/Select/Select';
import TextInput from 'components/core-ui-lib/TextInput';
import { useRecoilValue } from 'recoil';
import { productionOptionsSelector } from 'state/booking/selectors/productionOptionsSelector';
import { defaultVenueFilters } from 'config/bookings';
import { VenueFilters } from 'pages/bookings/venues';
import { accessBookingsHome } from 'state/account/selectors/permissionSelector';

export default function VenueFilter({
  countryOptions,
  townOptions,
  onFilterChange,
  filters,
  showVenueModal,
}: {
  filters: VenueFilters;
  countryOptions: SelectOption[];
  townOptions: SelectOption[];
  onFilterChange: (change: Partial<VenueFilters>) => void;
  showVenueModal: () => void;
}) {
  const permissions = useRecoilValue(accessBookingsHome);
  const productionOptions = useRecoilValue(productionOptionsSelector(true));
  const onChange = (e: any) => {
    onFilterChange({ ...filters, [e.target.id]: e.target.value });
  };
  const onClearFilters = () => {
    onFilterChange(defaultVenueFilters);
  };

  return (
    <>
      <div className="w-full flex items-center justify-between flex-wrap">
        <div className=" w-full flex flex-row ">
          <div className="flex  gap-4 flex-wrap  py-1 w-full">
            <div className="w-full flex flex-row items-center gap-5">
              <h1 className="text-4xl font-bold text-primary-orange">Venues</h1>
              <Select
                testId="venues-select-town"
                onChange={(value) => onChange({ target: { id: 'town', value } })}
                value={filters.town}
                className="bg-white w-full font-bold h-fit"
                label="Town"
                placeholder="Select Town"
                options={townOptions}
                isSearchable
              />

              <Select
                testId="venues-select-production"
                onChange={(value) => onChange({ target: { id: 'productionId', value } })}
                value={filters.productionId}
                className="bg-white w-full font-bold h-fit"
                label="On Production"
                placeholder="Select Production"
                options={productionOptions}
                isSearchable
              />
            </div>
            <div className="flex items-start gap-4 w-full">
              <Select
                testId="venues-select-country"
                onChange={(value) => onChange({ target: { id: 'country', value: parseInt(value as string, 10) } })}
                value={filters.country}
                className="bg-white !w-[400px] h-fit font-bold"
                label="Country"
                placeholder="Select Country"
                options={countryOptions}
                isSearchable
              />
              <TextInput
                testId="venues-search-input"
                id="search"
                placeholder="Search venues..."
                className="w-[470px] !align-top"
                iconName="search"
                value={filters.search}
                onChange={onChange}
              />
              <div className="flex flex-col gap-3">
                <Button
                  testId="venues-clear-filters-btn"
                  text="Clear Filters"
                  className="w-[120px]"
                  onClick={onClearFilters}
                />
                <Button
                  testId="venues-add-new-btn"
                  onClick={showVenueModal}
                  text="Add New"
                  className="w-[120px]"
                  disabled={!permissions.includes('ADD_NEW_VENUE')}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
