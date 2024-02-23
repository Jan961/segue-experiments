// TimeArrayRender.tsx
import { CustomCellRendererProps } from 'ag-grid-react';
import TimeInput from 'components/core-ui-lib/TimeInput';
import { useEffect, useState } from 'react';

const TimeArrayRender = (props: CustomCellRendererProps & { noPerfValue: number }) => {
  const [isPerformanceArrayTime, setPerformanceArrayTime] = useState<string[]>([]);
  const [isDisabled, setIsDisabled] = useState(true);
  useEffect(() => {
    setIsDisabled(!props.data.perf);
  }, [props.data.dayType, props.data.perf]);

  useEffect(() => {
    console.log(' >>>>>>Time:>> ');
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
      console.log('newTimes :>> ', newTimes);
      return newTimes;
    });
  };

  return (
    <>
      {isDisabled ? (
        ''
      ) : (
        <>
          <div
            className={`flex flex-col p-2 gap-2   ${
              props.data.noPerf > 1 ? '' : 'overflow-y-hidden'
            } overflow-x-hidden ${isDisabled ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}
          >
            {props.data.noPerf > 0 &&
              isPerformanceArrayTime.map((time, index) => (
                <TimeInput
                  key={index}
                  onChange={(e) => handleTimeChange(index, e)}
                  value={time}
                  className="bg-white border-none "
                />
              ))}
          </div>
        </>
      )}
    </>
  );
};

export default TimeArrayRender;
