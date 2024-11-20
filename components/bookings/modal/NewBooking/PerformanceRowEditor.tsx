import { useState } from 'react';
import { FormInputCheckbox } from 'components/global/forms/FormInputCheckbox';
import { FormInputNumeric } from 'components/global/forms/FormInputNumeric';
import { FormInputTime } from 'components/global/forms/FormInputTime';
import { formatDate } from 'services/dateService';

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
      <div className="col-span-6 border-r border-primary-navy px-2 text-sm font-normal flex items-center my-2">
        {formatDate(date, 'EEEE d MMMM yyyy')}
      </div>
      <div className="col-span-2 border-r border-primary-navy flex items-center justify-center my-2">
        <FormInputCheckbox
          name="PerformanceAvailability"
          onChange={onPerformanceAvailabilityChange}
          value={hasPerformance}
        />
      </div>
      <div className="col-span-2 border-r border-primary-navy px-3 flex items-center justify-center my-2">
        <FormInputNumeric
          className="w-16"
          disabled={!hasPerformance}
          name="NumberOfPerformances"
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
