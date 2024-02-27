// TimeArrayRender.tsx
import { CustomCellRendererProps } from 'ag-grid-react';
import TimeInput from 'components/core-ui-lib/TimeInput';
import { useEffect, useState } from 'react';

const TimeArrayRender = (props: CustomCellRendererProps) => {
  const { data } = props;
  const [isPerformanceArrayTime, setPerformanceArrayTime] = useState<string[]>([]);
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    setIsDisabled(!data.perf);
  }, [data.perf]);

  useEffect(() => {
    setPerformanceArrayTime((prevTimes) => {
      const newTimes = Array(props.data.noPerf)
        .fill('')
        .map((_, index) => prevTimes[index] || '');
      return newTimes;
    });
  }, [props.data.noPerf]);

  const handleTimeChange = (index: number, newTime: string) => {
    setPerformanceArrayTime((prevTimes) => {
      const newTimes = [...prevTimes];
      newTimes[index] = newTime;
      return newTimes;
    });
  };

  return (
    <>
      {isDisabled ? (
        ''
      ) : (
        <div className={`flex flex-col px-2 gap-1`}>
          {props.data.noPerf > 0 &&
            isPerformanceArrayTime.map((time, index) => (
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

export default TimeArrayRender;
