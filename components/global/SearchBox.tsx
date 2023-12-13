import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface SearchBoxProps {
  onChange: (e: any) => void;
  value: string;
  placeholder?: string;
}

export const SearchBox = ({ onChange, value, placeholder }: SearchBoxProps) => {
  return (
    <label htmlFor="search" className="inline-block flex-1">
      <span className="sr-only">Quick search</span>
      <div className="relative">
        <input
          className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder={placeholder ?? 'Search'}
          onChange={onChange}
          type="text"
          name="search"
          id="search"
          value={value}
        />
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <FontAwesomeIcon icon={faSearch as IconProp} className="text-gray-400" />
        </div>
      </div>
    </label>
  );
};
