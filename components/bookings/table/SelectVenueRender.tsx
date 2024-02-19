import Select from 'components/core-ui-lib/Select';

export default function SelectVenueRender() {
  return (
    <div className="w-[98%] h-full mx-auto  ">
      <Select
        // options={mappedDayTypeOptions}
        // value={props.value}
        className="!shadow-none border-none"
        buttonClass=" border border-primary-border !text-red-500"
      />
    </div>
  );
}
