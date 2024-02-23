import React, { useEffect, useMemo, useRef, useState } from 'react';
import WindowedSelect, {
  components,
  createFilter,
  StylesConfig,
  OptionProps,
  DropdownIndicatorProps,
  IndicatorsContainerProps,
} from 'react-windowed-select';
import { WithTestId } from 'types';
import Icon from '../Icon';
import Label from '../Label';
import classNames from 'classnames';

const Option = (props: OptionProps) => {
  return <components.Option className="w-full" {...props} />;
};

const IndicatorsContainer = (props: IndicatorsContainerProps) => {
  return (
    <div className="p-0">
      <components.IndicatorsContainer {...props} />
    </div>
  );
};

const DropdownIndicator = (props: DropdownIndicatorProps) => {
  return (
    <components.DropdownIndicator {...props} className="px-1">
      <Icon iconName="chevron-down" variant="xs" />
    </components.DropdownIndicator>
  );
};

export type TypeaheadOption = { text: string; value: string | number; [key: string]: any };

const COMP_HEIGHT = '1.9375rem';

export interface TypeaheadProps extends WithTestId {
  value?: string | number | undefined;
  onChange: (value: string | number) => void;
  renderOption?: (option: TypeaheadOption) => React.ReactElement;
  options: TypeaheadOption[];
  className?: string;
  placeholder?: string;
  name?: string;
  disabled?: boolean;
  label?: string;
}

export default function Typeahead({
  value,
  onChange,
  options,
  className,
  renderOption,
  placeholder = '',
  disabled = false,
  testId,
  label,
}: TypeaheadProps) {
  const inputRef = useRef(null);

  const colourStyles: StylesConfig = useMemo(
    () => ({
      control: (styles) => ({
        ...styles,
        fontWeight: 'bold',
        fontSize: '1rem',
        lineHeight: '1.5rem',
        backgroundColor: '#FFF',
        padding: '0 4px 0 4px',
        border: 0,
        // This line disable the blue border
        boxShadow: 'none',
        minHeight: COMP_HEIGHT,
        height: COMP_HEIGHT,
      }),
      option: (styles, { isDisabled, isSelected }) => {
        return {
          ...styles,
          fontSize: '1rem',
          lineHeight: '1.5rem',
          backgroundColor: isDisabled ? undefined : isSelected ? '#21345BCC' : undefined,
          color: isDisabled ? '#ccc' : isSelected ? '#FFF' : '#617293',
          cursor: isDisabled ? 'not-allowed' : 'default',
          ':active': {
            ...styles[':active'],
            backgroundColor: !isDisabled ? (isSelected ? '#FDCE74' : '#41A29A') : undefined,
          },
          ':hover': {
            ...styles[':active'],
            color: '#FFF',
            backgroundColor: '#21345B99',
          },
        };
      },
      valueContainer: (styles) => ({
        ...styles,
        height: COMP_HEIGHT,
        padding: '0 6px',
      }),
      input: (styles) => ({ ...styles, color: '#617293', margin: '0px' }),
      placeholder: (styles) => ({ ...styles }),
      singleValue: (styles) => ({ ...styles, color: '#617293' }),
      indicatorsContainer: (styles) => ({
        ...styles,
        height: COMP_HEIGHT,
      }),
      menu: (styles) => ({ ...styles, zIndex: 20 }),
    }),
    [],
  );

  const [selectedOption, setSelectedOption] = useState<TypeaheadOption>({ text: '', value: '' });

  const onInputFocus = () => {
    inputRef.current?.Select?.focus();
  };

  const handleOptionSelect = (o: TypeaheadOption) => {
    setSelectedOption(o);
    onChange(o.value);
  };

  useEffect(() => {
    setSelectedOption(value && options ? options.find((o) => value === o.value) : null);
  }, [value, options]);

  const customFilter = createFilter({ ignoreAccents: false });

  const customComponents = {
    Option: (option) => (renderOption ? renderOption(option) : <Option {...option} />),
    IndicatorSeparator: null,
    IndicatorsContainer,
    DropdownIndicator,
  };

  return (
    <div
      className={classNames(
        `shadow-sm-shadow border border-primary-border rounded-md flex items-center text-sm`,
        className,
      )}
      data-testid={`${testId ? `form-typeahead-${testId}` : 'form-typeahead'}`}
    >
      {label && (
        <div className="border-r border-primary-border px-3">
          <Label text={label} />
        </div>
      )}

      <WindowedSelect
        ref={inputRef}
        className="w-full"
        onChange={handleOptionSelect}
        value={selectedOption}
        components={customComponents}
        getOptionLabel={(props: TypeaheadOption) => props.text}
        windowThreshold={50}
        isDisabled={disabled}
        filterOption={customFilter}
        options={options}
        onFocus={onInputFocus}
        styles={colourStyles}
        placeholder={placeholder}
      />
    </div>
  );
}
