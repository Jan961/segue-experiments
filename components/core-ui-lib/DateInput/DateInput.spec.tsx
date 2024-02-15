// import React from 'react';
// import { render, fireEvent, screen } from '@testing-library/react';
// import DateInput from './DateInput';

// describe('DateInput Component', () => {
//   test('renders without crashing', () => {
//     render(<DateInput onChange={() => {}} />);
//     const dateInput = screen.getByTestId('date-input');
//     expect(dateInput).toBeInTheDocument();
//   });

//   test('updates value when set via props or imperatively', () => {
//     const onChange = jest.fn();
//     const { rerender } = render(<DateInput onChange={onChange} value={new Date('2022-01-01')} />);
//     let dateInput = screen.getByDisplayValue('01/01/22');
//     expect(dateInput).toBeInTheDocument();

//     rerender(<DateInput onChange={onChange} value={new Date('2023-01-01')} />);
//     dateInput = screen.getByDisplayValue('01/01/23');
//     expect(dateInput).toBeInTheDocument();
//   });

//   test('handles user input correctly', () => {
//     const onChange = jest.fn();
//     render(<DateInput onChange={onChange} />);
//     const dateInput = screen.getByTestId('date-input');
//     fireEvent.change(dateInput, { target: { value: '01/01/24' } });
//     expect(dateInput).toHaveValue('01/01/24');
//   });

//   test('handles input blur correctly', () => {
//     const onChange = jest.fn();
//     render(<DateInput onChange={onChange} />);
//     const dateInput = screen.getByTestId('date-input');
//     fireEvent.blur(dateInput);
//     expect(onChange).toHaveBeenCalledWith(null);
//   });
// });
