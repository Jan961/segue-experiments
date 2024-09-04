// TimeArrayRender.tsx
import { CustomCellRendererProps } from 'ag-grid-react';
import BaseCellRenderer from 'components/core-ui-lib/Table/renderers/BaseCellRenderer';
import TimeInput from 'components/core-ui-lib/TimeInput';
import { Time } from 'components/core-ui-lib/TimeInput/TimeInput';
import { useEffect, useRef, useState } from 'react';

const PerformanceTimesRenderer = ({ data, setValue, eGridCell }: CustomCellRendererProps) => {
  const [performanceTimes, setPerformanceTimes] = useState<Time[]>([]);
  const [isDisabled, setIsDisabled] = useState(true);
  const cellRef = useRef(null);

  const inputRefs = useRef<HTMLDivElement[]>([]);
  const setInputRef = (element: HTMLDivElement | null, index: number) => {
    if (element) {
      inputRefs.current[index] = element;
    }
  };

  const handleOnFocus = () => {
    const cellTargetDiv = cellRef?.current?.childNodes[0];
    const currentlyFocussed = document.activeElement?.childNodes[0]?.childNodes[0];
    console.log('/////////////////////////');
    console.log(currentlyFocussed);
    console.log(cellTargetDiv);
    if (cellTargetDiv === currentlyFocussed) {
      // Example of focusing the first input in refs array
      console.log(cellTargetDiv.childNodes);
      cellTargetDiv.childNodes[0].childNodes[0]?.focus();
    } else {
      let currentIndex;
      const childNodes = cellTargetDiv.childNodes;
      childNodes.forEach((node, index) => {
        console.log(index);
        console.log(node);
        if (node === document.activeElement) {
          currentIndex = index;
        }
      });
      console.log(currentIndex);
      console.log(childNodes);
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
  }, [data.perf, data.noPerf, data.times, setPerformanceTimes]);

  const handleInput = (e) => {
    const { name, value, attributes } = e.target;
    try {
      const arrIndex = parseInt(attributes['data-index'].value);
      const filteredValue = value.replace(/^\D/, '');
      const valLen = filteredValue.length;

      setPerformanceTimes((prevTimes) => {
        const newTime = prevTimes[arrIndex];
        if (valLen < 3) {
          if (
            (name === 'hrs' && (parseInt(filteredValue) < 24 || valLen === 0)) ||
            (name === 'min' && (parseInt(filteredValue) < 60 || valLen === 0))
          ) {
            newTime[name] = filteredValue;
            prevTimes[arrIndex] = newTime;
          }
        }
        return prevTimes;
      });

      return { name, value: filteredValue };
    } catch (exception) {
      console.log(exception);
    }
  };
  const handleTimeChange = (e) => {
    setValue(
      performanceTimes
        .map(({ hrs, min }) => {
          return `${hrs}:${min}`;
        })
        .join(';'),
    );
    return e;
  };

  const handleBlur = () => {
    setValue(
      performanceTimes
        .map(({ hrs, min }) => {
          if (hrs.length === 0) return ``;
          const paddedHrs = hrs.length > 0 ? `${'0'.repeat(2 - hrs.length >= 0 ? 2 - hrs.length : 0)}${hrs}` : hrs;
          const paddedMin = min.length > 0 ? `${'0'.repeat(2 - min.length >= 0 ? 2 - min.length : 0)}${min}` : min;
          return `${paddedHrs}:${paddedMin}`;
        })
        .join(';'),
    );
  };

  return (
    <BaseCellRenderer eGridCell={eGridCell} onFocus={handleOnFocus} ref={cellRef}>
      {isDisabled ? (
        ''
      ) : (
        <div className="flex flex-col px-2 gap-1">
          {data.noPerf > 0 &&
            performanceTimes.map((time, index) => (
              <TimeInput
                key={index}
                index={index}
                ref={(element) => setInputRef(element, index)}
                onChange={handleTimeChange}
                value={time}
                className="bg-white h-10"
                onInput={handleInput}
                onBlur={handleBlur}
                onKeyDown={(e) => {
                  console.log(e);
                }}
              />
            ))}
        </div>
      )}
    </BaseCellRenderer>
  );
};

export default PerformanceTimesRenderer;
