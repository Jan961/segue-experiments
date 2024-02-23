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
    // Handle the change event here

    let newValue = event.target.value.replace(/\D/g, ''); // Remove non-numeric characters
    if (newValue === '') {
      newValue = '0';
    }
    // limit from 0-9
    // newValue = newValue.length > 0 ? newValue[0] : '0';
    newValue = Math.min(9, Math.max(0, parseInt(newValue, 10))).toString();

    setIsNoPerf(parseInt(newValue));

    // console.log('event.target.value :>> ', event.target.value);
    // setIsNoPerf(event.target.value);
    // / Take only the first character, default to '0' if empty
    props.node.setDataValue('noPerf', parseInt(newValue));

    // You can perform any logic based on the new value
    console.log('New value:', event.target.value);
  };
  return (
    <>
      {isDisabled ? (
        <div className={`text-center border-2 mx-auto border-gray fo rounded-sm line text-sm p-0 m-0 w-5 h-5`}></div>
      ) : (
        <>
          <input
            type="text"
            inputMode="numeric"
            value={isNoPerf}
            onChange={handleChange}
            className="text-center border-2 mx-auto border-primary-input-text focus:border-primary-input-text rounded-sm line text-sm p-0 m-0 w-5 h-5 flex focus:!ring-0 "
          />
          {/* {props.value} */}
        </>
      )}
    </>
  );
};

export default NoPerfRender;
