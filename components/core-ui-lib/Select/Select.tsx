import React, { forwardRef, useEffect, useMemo, useState } from 'react';
import WindowedSelect, {
  components,
  StylesConfig,
  OptionProps,
  DropdownIndicatorProps,
  IndicatorsContainerProps,
  MultiValueProps,
  ActionMeta,
} from 'react-windowed-select';
import { WithTestId } from 'types';
import Icon from '../Icon';
import Label from '../Label';
import classNames from 'classnames';
import fuseFilter from 'utils/fuseFilter';

export type SelectOption = { text: string; value: string | number; [key: string]: any };

interface CustMultiValueProps extends MultiValueProps {
  data: SelectOption;
}

const COMP_HEIGHT = '1.9375rem';

export interface SelectProps extends WithTestId {
  value?: string | number | any[] | undefined | boolean;
  onChange: (value: string | number | (string | number)[]) => void;
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
  onBlur?: () => void;
}

const Option = (props: OptionProps & { testId?: string }) => {
  return (
    <components.Option
      data-testid={`${props.testId}-${(props.data as SelectOption)?.value}`}
      className="w-full"
      {...props}
    />
  );
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
    testId = 'core-ui-lib-select',
    label,
    inline = false,
    isSearchable = false,
    isClearable = true,
    isMulti = false,
    closeMenuOnSelect = true,
    onBlur,
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

  const [filteredOptions, setFilteredOptions] = React.useState<SelectOption[]>(null);
  const [selectedOption, setSelectedOption] = useState<SelectOption | SelectOption[]>({ text: '', value: '' });

  const handleOptionSelect = (o: SelectOption, actionMeta: ActionMeta<SelectOption>) => {
    const { action, option } = actionMeta;
    if (isMulti) {
      if (action === 'deselect-option' && option.value === 'select_all') {
        setSelectedOption([]);
        onChange([]);
        return;
      }

      if (action === 'select-option' && option.value === 'select_all') {
        setSelectedOption(options);
        onChange(options.map((option) => option.value));
        return;
      }
      const selectedValues = o.filter((item) => item.value !== 'select_all');
      setSelectedOption(selectedValues);
      onChange(selectedValues.map((option) => option.value));
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
    const { data, index } = props;
    if (isMulti && index > 0) {
      return null;
    }
    if (isMulti && selectedOption.length > 1) {
      return <components.MultiValue {...props}>Multiple</components.MultiValue>;
    }
    return <components.MultiValue {...props}>{data.text}</components.MultiValue>;
  };

  const customComponents = {
    Option: (option) => (renderOption ? renderOption(option) : <Option testId={`${testId}-option`} {...option} />),
    IndicatorSeparator: null,
    IndicatorsContainer,
    MultiValueRemove,
    DropdownIndicator,
    MultiValue,
  };

  return (
    <div
      className={classNames(
        `border border-primary-border rounded-md flex items-center text-sm`,
        { 'shadow-sm-shadow': !inline },
        className,
      )}
    >
      {label && (
        <div className="border-r min-w-fit border-primary-border px-3">
          <Label testId={`${testId ? `${testId}-label` : 'core-ui-lib-select-label'}`} text={label} />
        </div>
      )}
      <div className="w-full h-full" data-testid={`${testId ? `${testId}` : 'core-ui-lib-select'}`}>
        <WindowedSelect
          ref={ref}
          className="w-full"
          onInputChange={(inputValue) => {
            if (inputValue) {
              setFilteredOptions(fuseFilter(options, inputValue, ['text']).reverse());
            } else {
              setFilteredOptions(options);
            }
          }}
          onChange={handleOptionSelect}
          value={selectedOption}
          components={customComponents}
          getOptionLabel={(props: SelectOption) => props.text}
          windowThreshold={50}
          isDisabled={disabled}
          closeMenuOnSelect={closeMenuOnSelect}
          options={options}
          styles={colourStyles}
          placeholder={placeholder}
          isSearchable={isSearchable}
          isClearable={isClearable}
          isMulti={isMulti}
          hideSelectedOptions={false}
          onBlur={onBlur}
          filterOption={(option, _inputValue) => {
            if (filteredOptions === null) {
              return true;
            }
            return filteredOptions.map((item) => item.value).includes(option.value);
          }}
        />
      </div>
    </div>
  );
});
