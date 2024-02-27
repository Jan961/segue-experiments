import { CustomCellRendererProps } from 'ag-grid-react';
import { useEffect, useState } from 'react';

const NoPerfRender = (props: CustomCellRendererProps) => {
  const [isDisabled, setIsDisabled] = useState(true);
  const [isNoPerf, setIsNoPerf] = useState<string | number>(props.value);

  useEffect(() => {
    // Update the disabled state based on the value of props.data.dayType
    setIsDisabled(props.data.dayType !== 'Performance');
  }, [props.data.dayType]);

  const handleChange = (event: any) => {
    let newValue = event.target.value.replace(/\D/g, ''); // Remove non-numeric characters
    if (newValue === '') {
      newValue = '0';
    }
    // limit from 0-9
    newValue = Math.min(9, Math.max(0, parseInt(newValue, 10))).toString();
    const intValue = parseInt(newValue);
    setIsNoPerf(intValue);
    props.node.setData({ ...props.data, noPerf: intValue });
    props.node.setRowHeight(intValue > 1 ? intValue * 35 + 9 : 43);
    props.api.onRowHeightChanged();
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
            value={isNoPerf}
            onChange={handleChange}
            className="text-center border-2 border-primary-input-text focus:border-primary-input-text rounded-sm line text-sm p-0 w-[1.1875rem] h-[1.1875rem] flex focus:!ring-0 "
          />
        </>
      )}
    </>
  );
};

export default NoPerfRender;
