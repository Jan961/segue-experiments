import { render, fireEvent, screen } from '@testing-library/react';
import DateInput from './DateInput';

describe('DateInput Component', () => {
  const handleChange = jest.fn();
  test('renders without crashing', () => {
    render(<DateInput onChange={handleChange} />);
  });

  test('updates value when input changes', () => {
    const handleChange = jest.fn();
    render(<DateInput onChange={handleChange} />);
    const input = screen.getByTestId('date-input');
    fireEvent.change(input, { target: { value: '20/03/22' } });
    expect(input).toHaveAttribute('value', '20/03/22');
  });

  test('renders with provided props', () => {
    const handleChange = jest.fn();
    const inputClass = 'custom-input';
    const error = 'Invalid date';
    const minDate = new Date('2022-01-01');
    const maxDate = new Date('2022-12-31');
    const placeholder = 'Select date';

    render(
      <DateInput
        onChange={handleChange}
        inputClass={inputClass}
        error={error}
        minDate={minDate}
        maxDate={maxDate}
        placeholder={placeholder}
      />,
    );

    const dateInput = screen.getByTestId('date-input');
    expect(dateInput).toHaveClass(inputClass);
  });

  test('clears input value when blurred with empty value', () => {
    const handleChange = jest.fn();
    render(<DateInput onChange={handleChange} />);
    const input = screen.getByTestId('date-input');
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.blur(input);
    expect(handleChange).toHaveBeenCalledWith(null);
  });
});
