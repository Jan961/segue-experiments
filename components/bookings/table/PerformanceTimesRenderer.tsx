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
  }, [data.perf, data.noPerf, data.times, setPerformanceTimes]);

  const handleInput = (e) => {
    const { name, value, attributes } = e.target;
    try {
      setPerformanceTimes((prevTimes) => {
        const arrIndex = parseInt(attributes['data-index'].value);
        const newTime = prevTimes[arrIndex];
        const filteredValue = value.replace(/^\D/, '');
        const valLen = filteredValue.length;
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
    } catch (exception) {
      console.log(exception);
    }
  };

  const handleBlur = () => {
    console.log('BLURRR');

    setPerformanceTimes((prevTimes) => {
      prevTimes.map(({ hrs, min }) => {
        if (hrs.length === 0) return ``;
        const paddedHrs = hrs.length > 0 ? `${'0'.repeat(2 - hrs.length)}${hrs}` : hrs;
        const paddedMin = min.length > 0 ? `${'0'.repeat(2 - min.length)}${min}` : min;
        return `${paddedHrs}:${paddedMin}`;
      });
      return prevTimes;
    });
    setValue(
      performanceTimes
        .map(({ hrs, min }) => {
          if (hrs.length === 0) return ``;
          const paddedHrs = hrs.length > 0 ? `${'0'.repeat(2 - hrs.length)}${hrs}` : hrs;
          const paddedMin = min.length > 0 ? `${'0'.repeat(2 - min.length)}${min}` : min;
          return `${paddedHrs}:${paddedMin}`;
        })
        .join(';'),
    );
  };

  const handleTimeChange = () => {
    console.log('TIME CHANGE');
    setPerformanceTimes((prevTimes) => {
      prevTimes.map(({ hrs, min }) => {
        if (hrs.length === 0) return ``;
        const paddedHrs = hrs.length > 0 ? `${'0'.repeat(2 - hrs.length)}${hrs}` : hrs;
        const paddedMin = min.length > 0 ? `${'0'.repeat(2 - min.length)}${min}` : min;
        return `${paddedHrs}:${paddedMin}`;
      });
      return prevTimes;
    });
    setValue(
      performanceTimes
        .map(({ hrs, min }) => {
          return `${hrs}:${min}`;
        })
        .join(';'),
    );
  };
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
                onChange={handleTimeChange}
                value={time}
                className="bg-white h-10"
                onInput={handleInput}
                onBlur={handleBlur}
              />
            ))}
        </div>
      )}
    </BaseCellRenderer>
  );
};

export default PerformanceTimesRenderer;
