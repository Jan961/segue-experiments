import { useEffect, useState } from 'react';
import { ICellRendererParams } from 'ag-grid-community';

const ROW_HEIGHT = 35;
const MARGIN = 9;

const NoPerfRenderer = ({ value, setValue, data, api, node }: ICellRendererParams) => {
  const [isDisabled, setIsDisabled] = useState(true);
  const [noOfPerfs, setNoOfPerfs] = useState<string | number>(value);

  const updateRowHeight = (height: number) => {
    node.setRowHeight(height);
    api.onRowHeightChanged();
  };

  useEffect(() => {
    if (!data.perf) {
      setValue(null);
      setNoOfPerfs(null);
      updateRowHeight(ROW_HEIGHT + MARGIN);
    }
    setIsDisabled(!data.perf);
  }, [data]);

  const handleChange = (event: any) => {
    let newValue = event.target.value.replace(/\D/g, ''); // Remove non-numeric characters
    if (newValue === '') {
      setNoOfPerfs(null);
      setValue(0);
      updateRowHeight(ROW_HEIGHT + MARGIN);
      node.setData({ ...data, noOfPerfs: 0 });
    } else {
      newValue = Math.min(9, Math.max(1, parseInt(newValue, 10))).toString();
      const intValue = parseInt(newValue);
      if (!isNaN(intValue) && intValue > 0) {
        setNoOfPerfs(intValue);
        setValue(intValue);
        updateRowHeight(intValue > 1 ? intValue * ROW_HEIGHT + MARGIN : ROW_HEIGHT + MARGIN);
        node.setData({ ...data, noOfPerfs: intValue });
      }
    }
  };
  return (
    <>
      {isDisabled ? (
        <div
          className={`text-center border-2 mx-auto border-primary-input-text rounded-sm line text-sm p-0 w-[1.1875rem] h-[1.1875rem]`}
        ></div>
      ) : (
        <>
          <input
            type="text"
            inputMode="numeric"
            min={1}
            max={9}
            value={noOfPerfs}
            onChange={handleChange}
            className="text-center border-2 border-primary-input-text focus:border-primary-input-text rounded-sm line text-sm p-0 w-[1.1875rem] h-[1.1875rem] flex focus:!ring-0 "
          />
        </>
      )}
    </>
  );
};

export default NoPerfRenderer;
