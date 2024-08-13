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
  console.log(data);
  const handleOnFocus = () => {
    if (document.activeElement !== inputRef.current) {
      inputRef && inputRef?.current?.focus();
    }
  };

  useEffect(() => {
    setIsDisabled(!data.perf);

    if (data.noPerf) {
      console.log(data.times);
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
      console.log(performanceTimes);
    } else {
      setValue('');
      setPerformanceTimes([]);
    }
  }, [data.perf, data.noPerf, data.times, setPerformanceTimes]);

  const handleInput = (e) => {
    console.log(e);
    console.log('INPUTTTTTT');
    const { name, value, attributes } = e.target;
    try {
      console.log('setting times');
      setPerformanceTimes((prevTimes) => {
        const arrIndex = parseInt(attributes['data-index'].value);
        const newTime = prevTimes[arrIndex];
        newTime[name] = value;
        prevTimes[arrIndex] = newTime;
        console.log(prevTimes);
        setValue(prevTimes.map(({ hrs, min }) => `${hrs}:${min}`).join(';'));
        return prevTimes;
      });
    } catch (exception) {
      console.log(exception);
    }
  };

  const handleTimeChange = (index: number, newTime: Time) => {
    console.log('time change ');
    console.log(newTime);
    const updatedTimes = [...performanceTimes];
    updatedTimes[index] = newTime;

    setPerformanceTimes(updatedTimes);
    setValue(updatedTimes.map(({ hrs, min }) => `${hrs}:${min}`).join(';'));
  };
  console.log(performanceTimes);
  return (
    <BaseCellRenderer eGridCell={eGridCell} onFocus={handleOnFocus}>
      {isDisabled ? (
        ''
      ) : (
        <div className="flex flex-col px-2 gap-1">
          {data.noPerf > 0 &&
            performanceTimes.map((time, index) => (
              <TimeInput
                key={index}
                index={index}
                ref={inputRef}
                onChange={(e) => handleTimeChange(index, e)}
                value={time}
                className="bg-white h-10"
                onInput={handleInput}
              />
            ))}
        </div>
      )}
    </BaseCellRenderer>
  );
};

export default PerformanceTimesRenderer;
