import { useState, useRef, useMemo, useEffect } from 'react';
import Fuse from 'fuse.js';
import classNames from 'classnames';

type Option = {
  text: string;
  value: string | number;
};

type props = {
  options: Option[];
  placeholder: string;
  disabled?: boolean;
  selectedOption?: Option;
  value?: string | number;
  name?: string;
  label?: string;
  searchKeys?: string[];
  className?: string;
  dropdownClassName?: string;
  inputClassName?: string;
  onChange: (option: Option) => void;
};

const Typeahead = ({
  options,
  placeholder,
  onChange,
  disabled,
  value,
  name,
  label,
  className,
  inputClassName,
  dropdownClassName,
  searchKeys = [],
}: props) => {
  const [inputValue, setInputValue] = useState('');
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const fuse = useRef(new Fuse(options, { keys: ['text', ...searchKeys] }));
  const filteredOptions: Option[] = useMemo(() => {
    return inputValue === '' || value ? options : fuse.current.search(inputValue).map((result) => result.item);
  }, [inputValue, options]);
  useEffect(() => {
    fuse.current = new Fuse(options, { keys: ['text', ...searchKeys] });
  }, [options, searchKeys]);
  useEffect(() => {
    const selectedOption = options.find((option) => option.value === String(value));
    setInputValue(selectedOption?.text || '');
  }, [value]);
  const handleInputChange = (e: { target: { value: any } }) => {
    if (!e?.target?.value) {
      onChange?.({ text: '', value: '' });
    }
    setInputValue(e?.target?.value);
  };
  const handleSelectOption = (selectedOption: Option) => {
    setInputValue(selectedOption.text);
    onChange?.(selectedOption);
  };
  const handleInputFocus = () => {
    setDropdownOpen(true);
  };
  const handleInputBlur = () => {
    setTimeout(() => {
      setDropdownOpen(false);
    }, 200);
  };
  return (
    <div className={classNames('mb-2 w-full', className)}>
      <label htmlFor={name}>{label && <span className="text-sm mb-2 pr-2">{label}</span>}</label>
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        disabled={disabled}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        className={classNames(
          'w-full py-2 px-3 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm',
          inputClassName,
          { 'bg-gray-100 cursor-not-allowed': disabled },
        )}
      />
      {isDropdownOpen && filteredOptions.length > 0 && !disabled && (
        <ul
          className={classNames(
            'absolute z-10 mt-1 border rounded shadow bg-white max-h-[300px] overflow-y-auto',
            dropdownClassName,
          )}
          style={{ minWidth: inputRef.current.offsetWidth }}
        >
          {filteredOptions.map((option, index) => (
            <li
              key={index}
              onClick={() => handleSelectOption(option)}
              className="px-4 py-2 cursor-pointer hover:bg-blue-100"
            >
              {option.text}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Typeahead;
