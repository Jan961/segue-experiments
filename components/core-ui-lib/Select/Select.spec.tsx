import { render, fireEvent, screen } from '@testing-library/react';
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

  test('renders Select component with placeholder', () => {
    renderSelect();
    const placeholder = screen.getByText('Please select a value');
    expect(placeholder).toBeInTheDocument();
  });

  test('renders Select component with provided label', () => {
    renderSelect({ label: 'Select Label' });
    const label = screen.getByText('Select Label');
    expect(label).toBeInTheDocument();
  });

  test('renders options when Select is clicked', () => {
    renderSelect();
    const selectButton = screen.getByRole('button', { name: 'Please select a value' });
    fireEvent.click(selectButton);
    options.forEach((option) => {
      const optionElement = screen.getByText(option.text);
      expect(optionElement).toBeInTheDocument();
    });
  });

  test('calls onChange callback with selected value', () => {
    renderSelect();
    const selectButton = screen.getByRole('button', { name: 'Please select a value' });
    fireEvent.click(selectButton);
    const option2 = screen.getByText('Option 2');
    fireEvent.click(option2);
    expect(onChangeMock).toHaveBeenCalledWith('2');
  });

  test('displays selected option after selection', () => {
    renderSelect({ value: '2' });
    const selectedOption = screen.getByText('Option 2');
    expect(selectedOption).toBeInTheDocument();
  });

  test('disables Select when disabled prop is true', () => {
    renderSelect({ disabled: true });
    const selectButton = screen.getByRole('button', { name: 'Please select a value' });
    expect(selectButton).toBeDisabled();
  });

  // Add more test cases as needed
});
