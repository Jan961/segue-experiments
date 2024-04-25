import React, { forwardRef, useEffect, useMemo, useState } from 'react';
import { matchSorter } from 'match-sorter';
import WindowedSelect, {
  components,
  StylesConfig,
  OptionProps,
  DropdownIndicatorProps,
  IndicatorsContainerProps,
  MenuProps,
  MultiValueProps,
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

const MultiValueRemove = () => {
  return null;
};

const DropdownIndicator = (props: DropdownIndicatorProps) => {
  return (
    <components.DropdownIndicator {...props} className="px-1">
      <Icon iconName="chevron-down" variant="xs" />
    </components.DropdownIndicator>
  );
};

const formatOptionLabel = ({ text }, { context }) => {
  if (context === 'value') {
    return text;
  }
  return text;
};

export type SelectOption = { text: string; value: string | number; [key: string]: any };

interface CustMultiValueProps extends MultiValueProps {
  data: SelectOption;
}

const COMP_HEIGHT = '1.9375rem';

export interface SelectProps extends WithTestId {
  value?: string | number | any[] | undefined;
  onChange: (value: string | number) => void;
  renderOption?: (option: OptionProps) => React.ReactElement;
  customStyles?: Partial<StylesConfig>;
  options: SelectOption[];
  className?: string;
  placeholder?: string;
  name?: string;
  disabled?: boolean;
  label?: string;
  inline?: boolean;
  isSearchable?: boolean;
  isClearable?: boolean;
  isMulti?: boolean;
  closeMenuOnSelect?: boolean;
  customWidth?: string;
}

export default forwardRef(function Select(
  {
    value,
    onChange,
    options = [],
    className,
    renderOption,
    customStyles = {},
    placeholder = '',
    disabled = false,
    testId,
    label,
    inline = false,
    isSearchable = false,
    isClearable = true,
    isMulti = false,
    closeMenuOnSelect = true,
    customWidth = '258px',
  }: SelectProps,
  ref,
) {
  const colourStyles: StylesConfig = useMemo(
    () => ({
      ...{
        control: (styles, { isDisabled }) => ({
          ...styles,
          fontWeight: 'bold',
          fontSize: '1rem',
          lineHeight: '1.5rem',
          backgroundColor: isDisabled ? '#E9EBF0CC' : '#FFF',
          padding: '0 4px 0 4px',
          border: 0,
          // This line disable the blue border
          boxShadow: 'none',
          minHeight: COMP_HEIGHT,
          height: COMP_HEIGHT,
        }),
        option: (styles, { isDisabled, isSelected, isFocused }) => {
          return {
            ...styles,
            fontSize: '1rem',
            lineHeight: '1.5rem',
            backgroundColor: isDisabled
              ? undefined
              : isSelected
              ? '#21345BCC'
              : isFocused
              ? '#21345B99'
              : styles.backgroundColor,
            color: isDisabled ? '#ccc' : isSelected || isFocused ? '#FFF' : '#617293',
            cursor: isDisabled ? 'not-allowed' : 'default',
            ':active': {
              ...styles[':active'],
              backgroundColor: !isDisabled ? (isSelected ? '#FDCE74' : '#41A29A') : undefined,
            },
            ':hover': {
              ...styles[':hover'],
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
        placeholder: (styles) => ({ ...styles, color: '#617293' }),
        singleValue: (styles) => ({
          ...styles,
          color: '#617293',
          '::selection': {
            color: 'red',
            background: 'yellow',
          },
        }),
        clearIndicator: (styles) => ({
          ...styles,
          paddingLeft: '0 !important',
          paddingRight: '0 !important',
          paddingTop: '4px  !important',
          paddingBottom: '4px  !important',
          height: COMP_HEIGHT,
        }),
        menu: (styles) => ({ ...styles, zIndex: 20 }),
      },
      ...customStyles,
    }),
    [customStyles],
  );

  const [filteredOptions, setFilteredOptions] = React.useState<SelectOption[]>([]);
  const [selectedOption, setSelectedOption] = useState<SelectOption>({ text: '', value: '' });

  useEffect(() => {
    setFilteredOptions(options);
  }, [options]);

  const Menu = (props: MenuProps) => {
    return (
      <components.Menu className={`${props.isMulti && `!w-[${customWidth}]`}`} {...props}>
        {props.children}
      </components.Menu>
    );
  };

  const handleOptionSelect = (o: SelectOption) => {
    if (isMulti) {
      const latestSelectedOption = o[o.length - 1];
      if (
        latestSelectedOption.value === 'select_all' ||
        (o.length === options.length && latestSelectedOption.value !== 'select_all')
      ) {
        const selectedValues: any = options;
        setSelectedOption(selectedValues);
        onChange(selectedValues.map((option) => option.value));
      } else {
        const selectedValues = o.filter((item) => item.value !== 'select_all');
        setSelectedOption(selectedValues);
        onChange(selectedValues.map((option) => option.value));
      }
    } else {
      setSelectedOption(o);
      onChange(o ? o.value : null);
    }
  };

  useEffect(() => {
    if (isMulti && Array.isArray(value)) {
      if (options.length === value.length || (Array.isArray(value) && value.includes('select_all'))) {
        const selectedValues: any = options;
        setSelectedOption(selectedValues);
      } else {
        const selectedValues: any = options.filter((o: any) => value.includes(o.value));
        setSelectedOption(selectedValues);
      }
    } else {
      setSelectedOption(value && options ? options.find((o) => value === o.value) : null);
    }
  }, [value, options, isMulti]);

  const MultiValue = (props: CustMultiValueProps) => {
    const { data } = props;
    if (Array.isArray(selectedOption) && selectedOption.length > 1) {
      return <components.MultiValue {...props}>Multiple</components.MultiValue>;
    }
    return <components.MultiValue {...props}>{data.text}</components.MultiValue>;
  };

  const customComponents = {
    Option: (option) => (renderOption ? renderOption(option) : <Option {...option} />),
    IndicatorSeparator: null,
    IndicatorsContainer,
    MultiValueRemove,
    DropdownIndicator,
    Menu,
    MultiValue,
  };

  return (
    <div
      className={classNames(
        `border border-primary-border rounded-md flex items-center text-sm`,
        { 'shadow-sm-shadow': !inline },
        className,
      )}
      data-testid={`${testId ? `form-select-${testId}` : 'form-select'}`}
    >
      {label && (
        <div className="border-r min-w-fit border-primary-border px-3">
          <Label text={label} />
        </div>
      )}

      <WindowedSelect
        ref={ref}
        className="w-full"
        onInputChange={(inputValue) => {
          setFilteredOptions(matchSorter(options, inputValue, { keys: ['text'] }));
        }}
        onChange={handleOptionSelect}
        value={selectedOption}
        components={customComponents}
        getOptionLabel={(props: SelectOption) => props.text}
        windowThreshold={50}
        isDisabled={disabled}
        closeMenuOnSelect={closeMenuOnSelect}
        options={filteredOptions}
        styles={colourStyles}
        placeholder={placeholder}
        isSearchable={isSearchable}
        menuShouldBlockScroll={true}
        isClearable={isClearable}
        isMulti={isMulti}
        formatOptionLabel={formatOptionLabel}
        hideSelectedOptions={false}
      />
    </div>
  );
});
