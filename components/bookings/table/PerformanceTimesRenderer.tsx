// TimeArrayRender.tsx
import { CustomCellRendererProps } from 'ag-grid-react';
import BaseCellRenderer from 'components/core-ui-lib/Table/renderers/BaseCellRenderer';
import TimeInput from 'components/core-ui-lib/TimeInput';
import { Time } from 'components/core-ui-lib/TimeInput/TimeInput';
import { useEffect, useRef, useState } from 'react';

const PerformanceTimesRenderer = ({ data, setValue, eGridCell }: CustomCellRendererProps) => {
  const [performanceTimes, setPerformanceTimes] = useState<Time[]>([]);
  const [isDisabled, setIsDisabled] = useState(true);
  const inputRef = useRef(null);

  const handleOnFocus = () => {
    if (document.activeElement !== inputRef.current) {
      inputRef && inputRef?.current?.focus();
    }
  };

  useEffect(() => {
    setIsDisabled(!data.perf);

    if (data.noPerf) {
      const times = data.times?.split(';');

      const newTimes = Array(data.noPerf)
        .fill('')
        .map((_, i) => {
          const time = times?.[i];
          if (time) {
            const [hrs = '', min = ''] = time.split(':');
            return { hrs, min };
          }
          return { hrs: '', min: '' };
        });
      setPerformanceTimes(newTimes);
    } else {
      setValue('');
      setPerformanceTimes([]);
    }
  }, [data.perf, data.noPerf]);

  const handleTimeChange = (index: number, newTime: Time) => {
    const updatedTimes = [...performanceTimes];
    updatedTimes[index] = newTime;

    setPerformanceTimes(updatedTimes);
    setValue(updatedTimes.map(({ hrs, min }) => `${hrs}:${min}`).join(';'));
  };

  return (
    <BaseCellRenderer eGridCell={eGridCell} onFocus={handleOnFocus}>
      {isDisabled ? (
        ''
      ) : (
        <div className={`flex flex-col px-2 gap-1`}>
          {data.noPerf > 0 &&
            performanceTimes.map((time, index) =>
              index === 0 ? (
                <TimeInput
                  key={index}
                  ref={inputRef}
                  onChange={(e) => handleTimeChange(index, e)}
                  value={time}
                  className="bg-white h-10"
                />
              ) : (
                <TimeInput
                  key={index}
                  onChange={(e) => handleTimeChange(index, e)}
                  value={time}
                  className="bg-white h-10"
                />
              ),
            )}
        </div>
      )}
    </BaseCellRenderer>
  );
};

export default PerformanceTimesRenderer;