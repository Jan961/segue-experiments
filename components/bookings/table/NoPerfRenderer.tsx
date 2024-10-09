import { useEffect, useState } from 'react';
import { ICellRendererParams } from 'ag-grid-community';
import TextInputRenderer from 'components/core-ui-lib/Table/renderers/TextInputRenderer';

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
    if (!data.perf) {
      setValue(null);
      setNoOfPerfs('');
      updateRowHeight(ROW_HEIGHT + MARGIN);
    } else if (value > 0) {
      updateRowHeight(value * ROW_HEIGHT + MARGIN);
    }
    setIsDisabled(!data.perf);
  }, [data.perf, value]);

  const handleChange = (event) => {
    let newValue = event || null;

    if (newValue === null) {
      setNoOfPerfs('');
      setValue(0);
      updateRowHeight(ROW_HEIGHT + MARGIN);
      node.setData({ ...data, noOfPerfs: 0 });
    } else {
      newValue = Math.min(9, Math.max(1, parseInt(newValue, 10))).toString();
      const intValue = parseInt(newValue);
      if (!isNaN(intValue) && intValue > 0) {
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
