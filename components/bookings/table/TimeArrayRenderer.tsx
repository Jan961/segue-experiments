// TimeArrayRender.tsx
import { CustomCellRendererProps } from 'ag-grid-react';
import TimeInput from 'components/core-ui-lib/TimeInput';
import { Time } from 'components/core-ui-lib/TimeInput/TimeInput';
import { useEffect, useState } from 'react';

const TimeArrayRenderer = ({ data, setValue }: CustomCellRendererProps) => {
  const [performanceTimes, setPerformanceTimes] = useState<Time[]>([]);
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    setIsDisabled(!data.perf);

    if (data.noPerf) {
      const newTimes = Array(data.noPerf).fill({ hrs: '', min: '', sec: '' });
      setPerformanceTimes(newTimes);
    } else {
      setPerformanceTimes([]);
    }
  }, [data]);

  const handleTimeChange = (index: number, newTime: Time) => {
    const updatedTimes = [...performanceTimes];
    updatedTimes[index] = newTime;

    setPerformanceTimes(updatedTimes);
    setValue(updatedTimes.map(({ hrs, min }) => `${hrs}:${min}`).join(','));
  };

  return (
    <>
      {isDisabled ? (
        ''
      ) : (
        <div className={`flex flex-col px-2 gap-1`}>
          {data.noPerf > 0 &&
            performanceTimes.map((time, index) => (
              <TimeInput
                key={index}
                onChange={(e) => handleTimeChange(index, e)}
                value={time}
                className="bg-white h-10"
              />
            ))}
        </div>
      )}
    </>
  );
};

export default TimeArrayRenderer;
