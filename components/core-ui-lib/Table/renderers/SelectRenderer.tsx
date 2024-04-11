import Select from 'components/core-ui-lib/Select';
import {
  useEffect,
  useRef,
  // useState
} from 'react';
import BaseCellRenderer from './BaseCellRenderer';
import { SelectProps } from 'components/core-ui-lib/Select/Select';

interface SelectRendererProps extends SelectProps {
  id?: string;
  eGridCell: HTMLElement;
}

const SelectRenderer = ({ eGridCell, ...props }: SelectRendererProps) => {
  const selectRef = useRef(null);
  // const [value, setValue] = useState(props.value);

  useEffect(() => {
    // setValue(props.value);
  }, [props.value]);

  const handleOnFocus = () => {
    selectRef.current.focus();
  };

  // const handleChange = (newValue) => {
  //   setValue(newValue);
  //   if (props.onChange) {
  //     props.onChange(newValue);
  //   }
  // };

  return (
    <div className="pl-1 pr-2 mt-1">
      <BaseCellRenderer eGridCell={eGridCell} onFocus={handleOnFocus}>
        <Select ref={selectRef} isClearable={false} {...props} />
      </BaseCellRenderer>
    </div>
  );
};
export default SelectRenderer;
