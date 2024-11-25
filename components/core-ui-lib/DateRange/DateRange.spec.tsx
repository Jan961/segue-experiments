import { render, screen } from '@testing-library/react';
import DateRange from './DateRange';
import { newDate } from 'services/dateService';

describe('DateRange Component', () => {
  const handleChange = jest.fn();
  const value = {
    from: newDate('2024-02-11'),
    to: newDate('2024-02-15'),
  };

  test('renders with default props', () => {
    render(<DateRange value={value} onChange={handleChange} />);
    expect(screen.getByTestId('form-typeahead')).toBeInTheDocument();
  });

  test('renders with provided label', () => {
    render(<DateRange label="Select Date Range" value={value} onChange={handleChange} />);
    expect(screen.getByText('Select Date Range')).toBeInTheDocument();
  });

  test('renders with disabled state and checks inputs using testId', () => {
    render(<DateRange value={value} onChange={handleChange} disabled={true} testId="test-id" />);

    // Construct the expected data-testid values for the DateInput components
    const fromDateTestId = `test-id-start-date-input`;
    const toDateTestId = `test-id-end-date-input`;

    // Select the components using the constructed testId
    const fromDateInput = screen.getByTestId(fromDateTestId);
    const toDateInput = screen.getByTestId(toDateTestId);

    // Check if the DateInput components are disabled
    /* eslint-disable testing-library/no-node-access */
    expect(fromDateInput.querySelector('input')).toBeDisabled();
    expect(toDateInput.querySelector('input')).toBeDisabled();
  });
});
