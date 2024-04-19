import { render, screen } from '@testing-library/react';
import Select, { SelectProps, SelectOption } from './Select';

describe('Select Component', () => {
  const options: SelectOption[] = [
    { text: 'Option 1', value: '1' },
    { text: 'Option 2', value: '2' },
    { text: 'Option 3', value: '3' },
  ];

  const onChangeMock = jest.fn();

  const renderSelect = (props?: Partial<SelectProps>) => {
    return render(<Select options={options} onChange={onChangeMock} {...props} />);
  };

  test('renders correctly with basic props', () => {
    renderSelect();
    expect(screen.getByTestId('form-select')).toBeInTheDocument();
  });

  test('renders label', () => {
    render(<Select options={options} label="Label" placeholder="Placeholder" onChange={onChangeMock} />);
    expect(screen.getByText('Label')).toBeInTheDocument();
  });

  // test('displays selected option after selection', () => {
  //   renderSelect({ value: '2' });
  //   const selectedOption = screen.getByText('Option 2');
  //   expect(selectedOption).toBeInTheDocument();
  // });
});
