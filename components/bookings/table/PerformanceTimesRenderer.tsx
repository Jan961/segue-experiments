// TimeArrayRender.tsx
import { CustomCellRendererProps } from 'ag-grid-react';
import BaseCellRenderer from 'components/core-ui-lib/Table/renderers/BaseCellRenderer';
import TimeInput from 'components/core-ui-lib/TimeInput';
import { Time } from 'components/core-ui-lib/TimeInput/TimeInput';
import { BaseSyntheticEvent, useEffect, useRef, useState } from 'react';
import { isNullOrEmpty } from 'utils';

const PerformanceTimesRenderer = ({ data, setValue, eGridCell }: CustomCellRendererProps) => {
  const [performanceTimes, setPerformanceTimes] = useState<Time[]>([]);
  const [isDisabled, setIsDisabled] = useState(true);
  const cellRef = useRef(null);
  const [focussedIndex, setFocussedIndex] = useState<number>(0);

  //  Stores an array of refs for each of the elements that are rendered in the return
  const inputRefs = useRef<HTMLDivElement[]>([]);
  const setInputRef = (element: HTMLDivElement | null, index: number) => {
    if (element) {
      inputRefs.current[index] = element;
    }
  };

  //  This logic handles going through stepping through the refs to go to the Time input field above or below the current one
  const goToNextTimeField = (goDownField: boolean, e?: BaseSyntheticEvent) => {
    const currentlyFocussed = (isNullOrEmpty(e) ? document.activeElement : e.target).parentNode.parentNode;
    if (goDownField) {
      if (inputRefs.current.length > focussedIndex) {
        e.preventDefault();
        currentlyFocussed?.childNodes[focussedIndex + 1]?.firstChild?.focus();
      }
    } else {
      if (focussedIndex > 0) {
        e.preventDefault();
        currentlyFocussed?.childNodes[focussedIndex - 1]?.firstChild?.focus();
      }
    }
  };

  const handleOnFocus = () => {
    const cellTargetDiv = cellRef?.current?.childNodes[0];
    const currentlyFocussed = document.activeElement?.firstChild?.firstChild;
    //  If the focus is on the AGGrid cell (the initial state when tabbing into the field)
    if (cellTargetDiv === currentlyFocussed) {
      cellTargetDiv?.firstChild?.firstChild?.focus();
    } else {
      //  Find the index of the first hour field
      const childNodes = cellTargetDiv?.childNodes;
      if (!isNullOrEmpty(childNodes)) {
        childNodes.forEach((node, index) => {
          if (node === document.activeElement?.parentNode) {
            setFocussedIndex(index);
          }
        });
      }
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

          const hrLength = 2 - hrs.length;
          const minLength = 2 - min.length;

          const paddedHrs = hrs.length > 0 ? `${'0'.repeat(hrLength >= 0 ? hrLength : 0)}${hrs}` : hrs;
          const paddedMin = min.length > 0 ? `${'0'.repeat(minLength >= 0 ? minLength : 0)}${min}` : min;
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
                inputFieldJump={goToNextTimeField}
              />
            ))}
        </div>
      )}
    </BaseCellRenderer>
  );
};

export default PerformanceTimesRenderer;
