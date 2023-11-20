import { Combobox } from '@headlessui/react';
import { useState } from 'react';

export interface TypeaheadProps {
  value: string | number | undefined;
  onChange: (value: string | number) => void;
  options: { value: string | number; name: string }[];
}

export default function Typeahead({ value, onChange, options }: TypeaheadProps) {
  // const [selectedPerson, setSelectedPerson] = useState(people[0]);
  const [query, setQuery] = useState<string>('');

  const filteredOptions =
    query === ''
      ? options
      : options.filter(({ name }) => {
          return name.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <Combobox value={value} onChange={onChange}>
      <Combobox.Input onChange={(event) => setQuery(event.target.value)} />
      <Combobox.Options>
        {filteredOptions.map(({ name, value }) => (
          <Combobox.Option key={value} value={value}>
            {name}
          </Combobox.Option>
        ))}
      </Combobox.Options>
    </Combobox>
  );
}
