import { render, fireEvent, screen } from '@testing-library/react';
import DateInput from './DateInput';

describe('DateInput Component', () => {
  const handleChange = jest.fn();

  test('renders without crashing', () => {
    render(<DateInput onChange={handleChange} />);
  });

  test('updates value when input changes', () => {
    render(<DateInput onChange={handleChange} />);
    const input = screen.getByTestId('date-input');
    fireEvent.change(input, { target: { value: '20/03/22' } });
    expect(input).toHaveAttribute('value', '20/03/22');
  });

  test('renders with provided props', () => {
    const inputClass = 'custom-input';
    const error = 'Invalid date';
    const minDate = new Date('2022-01-01');
    const maxDate = new Date('2022-12-31');
    const placeholder = 'Select date';
    const position = '';

    render(
      <DateInput
        onChange={handleChange}
        inputClass={inputClass}
        error={error}
        minDate={minDate}
        maxDate={maxDate}
        placeholder={placeholder}
        position={position}
      />,
    );

    const dateInput = screen.getByTestId('date-input');
    expect(dateInput).toHaveClass(inputClass);
  });

  test('clears input value when blurred with empty value', () => {
    render(<DateInput onChange={handleChange} />);
    const input = screen.getByTestId('date-input');
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.blur(input);
    expect(handleChange).toHaveBeenCalledWith(null);
  });

  test('renders label when provided', () => {
    const label = 'Start Date';
    render(<DateInput onChange={handleChange} label={label} />);
    const labelText = screen.getByText(label);
    expect(labelText).toBeInTheDocument();
  });

  test('applies custom class to label when labelClassName is provided', () => {
    const labelClassName = 'custom-label-class';
    render(<DateInput onChange={handleChange} label="Start Date" labelClassName={labelClassName} />);
    const label = screen.getByText('Start Date');
    expect(label).toHaveClass(labelClassName);
  });

  test('renders with disabled state', () => {
    render(<DateInput onChange={handleChange} disabled={true} />);

    // Check if the input field is disabled
    const input = screen.getByTestId('date-input');
    expect(input).toBeDisabled();
  });
});
