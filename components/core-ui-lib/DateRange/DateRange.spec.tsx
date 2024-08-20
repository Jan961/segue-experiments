import { render, screen } from '@testing-library/react';
import DateRange from './DateRange';

describe('DateRange Component', () => {
  const handleChange = jest.fn();
  const value = {
    from: new Date('2024-02-11'),
    to: new Date('2024-02-15'),
  };

  test('renders with default props', () => {
    render(<DateRange value={value} onChange={handleChange} />);
    expect(screen.getByTestId('form-typeahead')).toBeInTheDocument();
  });

  test('renders with provided label', () => {
    render(<DateRange label="Select Date Range" value={value} onChange={handleChange} />);
    expect(screen.getByText('Select Date Range')).toBeInTheDocument();
  });

  test('renders with disabled state', () => {
    render(<DateRange value={value} onChange={handleChange} disabled />);

    // Check if the component has the disabled class applied
    const dateRangeContainer = screen.getByTestId('form-typeahead');
    expect(dateRangeContainer).toHaveClass('!bg-disabled-input', '!cursor-not-allowed', '!pointer-events-none');

    // Check if the DateInput components are disabled
    const fromDateInput = screen.getByTestId('form-typeahead-start-date-input');
    const toDateInput = screen.getByTestId('form-typeahead-end-date-input');
    expect(fromDateInput).toBeDisabled();
    expect(toDateInput).toBeDisabled();
  });
});
