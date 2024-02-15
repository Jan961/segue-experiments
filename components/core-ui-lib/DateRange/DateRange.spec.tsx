// import React from 'react';
// import { render, fireEvent } from '@testing-library/react';
// import DateRange from './DateRange';

// describe('DateRange Component', () => {
//   test.only('renders with default props', () => {
//     const handleChange = jest.fn();
//     const value:any = {
//       from:'2024-02-05',
//       to : "2024-02-15"
//       }
//     const { container } = render(<DateRange value={value} onChange={handleChange} />);
//     expect(container).toBeInTheDocument();
//   });

//   test('renders with provided label', () => {
//     const handleChange = jest.fn();
//     const { getByText } = render(<DateRange label="Select Date Range" onChange={handleChange} />);
//     expect(getByText('Select Date Range')).toBeInTheDocument();
//   });

//   test('calls onChange handler when date is selected', () => {
//     const handleChange = jest.fn();
//     const { getByLabelText } = render(<DateRange label="Select Date Range" onChange={handleChange} />);
//     const fromDateInput = getByLabelText('From Date');
//     const toDateInput = getByLabelText('To Date');

//     fireEvent.change(fromDateInput, { target: { value: '2022-01-01' } });
//     fireEvent.change(toDateInput, { target: { value: '2022-01-10' } });

//     expect(handleChange).toHaveBeenCalledTimes(2);
//   });
// });
