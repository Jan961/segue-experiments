import { useEffect, useState } from 'react';
import { ICellRendererParams } from 'ag-grid-community';

const NoPerfRenderer = ({ value, data, api, node }: ICellRendererParams) => {
  const [isDisabled, setIsDisabled] = useState(true);
  const [noOfPerfs, setNoOfPerfs] = useState<string | number>(value);

  useEffect(() => {
    setIsDisabled(!data.perf);
  }, [data.perf]);

  const handleChange = (event: any) => {
    let newValue = event.target.value.replace(/\D/g, ''); // Remove non-numeric characters
    if (newValue === '') {
      setNoOfPerfs(null);
      node.setData({ ...data, noPerf: 0 });
      node.setRowHeight(43);
      api.onRowHeightChanged();
    } else {
      newValue = Math.min(9, Math.max(1, parseInt(newValue, 10))).toString();
      const intValue = parseInt(newValue);
      if (!isNaN(intValue) && intValue > 0) {
        setNoOfPerfs(intValue);
        node.setData({ ...data, noPerf: intValue });
        node.setRowHeight(intValue > 1 ? intValue * 35 + 9 : 43);
        api.onRowHeightChanged();
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
