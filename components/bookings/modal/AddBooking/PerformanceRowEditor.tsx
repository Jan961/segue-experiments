import { useState } from 'react';
import moment from 'moment';
import { FormInputCheckbox } from 'components/global/forms/FormInputCheckbox';
import { FormInputNumeric } from 'components/global/forms/FormInputNumeric';
import { FormInputTime } from 'components/global/forms/FormInputTime';

const PerformanceRowEditor = ({
  date,
  onPerformanceDataChange,
}: {
  date: string;
  onPerformanceDataChange: (date: string, key: string, value: any) => void;
}) => {
  const [hasPerformance, setHasPerformance] = useState<boolean>(false);
  const [performanceCount, setPerformanceCount] = useState<number>(0);
  const [performanceTimes, setPerformanceTimes] = useState<{ [key: string]: string }>({});
  const onPerformanceAvailabilityChange = (e: any) => {
    setHasPerformance(e?.target?.value);
    onPerformanceDataChange(date, 'hasPerformance', e?.target?.value);
  };
  const onPerformanceCountChange = (value: number) => {
    setPerformanceCount(value);
    onPerformanceDataChange(date, 'performanceTimes', Object.values(performanceTimes).slice(0, value));
  };
  const onPerformanceTimesChange = (e: any, index: number) => {
    const updatedTimes = { ...performanceTimes, [index]: e.target.value };
    setPerformanceTimes(updatedTimes);
    onPerformanceDataChange(date, 'performanceTimes', Object.values(updatedTimes));
  };
  return (
    <div className="grid grid-cols-12 text-primary-navy border-b border-primary-navy">
      <div className="col-span-6 border-r border-primary-navy p-2 text-sm font-normal">
        {moment(date).format('dddd D MMMM YYYY')}
      </div>
      <div className="col-span-2 border-r border-primary-navy p-2">
        <FormInputCheckbox
          name="PerformanceAvailability"
          onChange={onPerformanceAvailabilityChange}
          value={hasPerformance}
        />
      </div>
      <div className="col-span-2 border-r border-primary-navy p-2">
        <FormInputNumeric
          disabled={!hasPerformance}
          name={'NumberOfPerformances'}
          value={performanceCount}
          onChange={onPerformanceCountChange}
        />
      </div>
      <div className="col-span-2 flex flex-wrap p-2 gap-2">
        {performanceCount > 0 &&
          new Array(performanceCount)
            .fill(0)
            .map((_, i) => (
              <FormInputTime key={i} onChange={(e) => onPerformanceTimesChange(e, i)} value={performanceTimes[i]} />
            ))}
      </div>
    </div>
  );
};

export default PerformanceRowEditor;
