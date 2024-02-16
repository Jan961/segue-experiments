import { render, fireEvent, screen } from '@testing-library/react';
import DateRange from './DateRange';

describe('DateRange Component', () => {
  test('renders with default props', () => {
    const handleChange = jest.fn();

    render(<DateRange onChange={handleChange} />);
    const container = screen.getByTestId('date-range-container');
    expect(container).toBeInTheDocument();
  });

  test('renders with provided label', () => {
    const handleChange = jest.fn();
    render(<DateRange label="Select Date Range" onChange={handleChange} />);
    const label = screen.getByText('Select Date Range');
    expect(label).toBeInTheDocument();
  });

  test('calls onChange handler when date is selected', () => {
    const handleChange = jest.fn();
    render(<DateRange label="Select Date Range" onChange={handleChange} />);
    const fromDateInput = screen.getByLabelText('From Date');
    const toDateInput = screen.getByLabelText('To Date');

    fireEvent.change(fromDateInput, { target: { value: '2022-01-01' } });
    fireEvent.change(toDateInput, { target: { value: '2022-01-10' } });

    expect(handleChange).toHaveBeenCalledTimes(2);
  });
});
