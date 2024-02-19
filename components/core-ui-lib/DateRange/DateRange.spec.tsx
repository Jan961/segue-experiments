import { render, screen } from '@testing-library/react';
import DateRange from './DateRange';

describe('DateRange Component', () => {
  test('renders with default props', () => {
    const handleChange = jest.fn();
    const value = {
      from: new Date('2024-02-11'),
      to: new Date('2024-02-15'),
    };
    render(<DateRange value={value} onChange={handleChange} />);
    expect(screen.getByTestId('form-typeahead')).toBeInTheDocument();
  });

  test('renders with provided label', () => {
    const handleChange = jest.fn();
    const value = {
      from: new Date('2024-02-11'),
      to: new Date('2024-02-15'),
    };
    render(<DateRange label="Select Date Range" value={value} onChange={handleChange} />);
    expect(screen.getByText('Select Date Range')).toBeInTheDocument();
  });
});
