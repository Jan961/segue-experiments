import { useEffect, useState } from 'react';
import { ICellRendererParams } from 'ag-grid-community';
import TextInputRenderer from 'components/core-ui-lib/Table/renderers/TextInputRenderer';
import { isNullOrEmpty } from 'utils';

const ROW_HEIGHT = 35;
const MARGIN = 9;

const NoPerfRenderer = ({ eGridCell, value, setValue, data, api, node }: ICellRendererParams) => {
  const [isDisabled, setIsDisabled] = useState(true);
  const [noOfPerfs, setNoOfPerfs] = useState<string>(value);

  const updateRowHeight = (height: number) => {
    node.setRowHeight(height);
    api.onRowHeightChanged();
  };

  useEffect(() => {
    if (data.perf) {
      handleChange(isNullOrEmpty(value) ? 1 : value);
    } else if (!data.perf) {
      handleChange('');
      updateRowHeight(ROW_HEIGHT + MARGIN);
    } else {
      handleChange(`${value}`);
      updateRowHeight(value * ROW_HEIGHT + MARGIN);
    }
    setIsDisabled(!data.perf);
  }, [data.perf]);

  const handleChange = (newValue) => {
    // changed the param name from event to newValue as this function in fact handles event.target.value
    if (isNullOrEmpty(newValue)) {
      setNoOfPerfs('');
      setValue(0);
      updateRowHeight(ROW_HEIGHT + MARGIN);
      node.setData({ ...data, noPerf: 0 });
    } else {
      newValue = Math.min(9, Math.max(1, parseInt(newValue, 10))).toString();
      const intValue = parseInt(newValue);
      if (!isNaN(intValue) && intValue > 0) {
        data.noPerf = intValue;
        setNoOfPerfs(newValue);
        setValue(intValue);
        updateRowHeight(intValue > 1 ? intValue * ROW_HEIGHT + MARGIN : ROW_HEIGHT + MARGIN);
        node.setData({ ...data, noPerf: intValue });
      }
    }
  };
  return (
    <div className="mt-2.5 w-full flex justify-center">
      <TextInputRenderer
        eGridCell={eGridCell}
        value={noOfPerfs}
        onChange={handleChange}
        disabled={isDisabled}
        pattern={/^\d{0,1}$/}
        className="w-[1.2rem] !h-[1.2rem] !text-center border-2 border-primary-input-text focus:border-primary-input-text rounded-sm line text-sm !p-0 focus:!ring-0"
      />
    </div>
  );
};

export default NoPerfRenderer;
