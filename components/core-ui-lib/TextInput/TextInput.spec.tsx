// import React from 'react';
// import { render, fireEvent } from '@testing-library/react';
// import TextInput from './TextInput';

// describe('TextInput Component', () => {
//   test('renders input element with placeholder', () => {
//     const { getByPlaceholderText } = render(<TextInput placeHolder="Enter text" />);
//     const inputElement = getByPlaceholderText('Enter text');
//     expect(inputElement).toBeInTheDocument();
//   });

//   test('calls onChange when input value changes', () => {
//     const onChange = jest.fn();
//     const { getByPlaceholderText } = render(<TextInput placeHolder="Enter text" onChange={onChange} />);
//     const inputElement = getByPlaceholderText('Enter text');
//     fireEvent.change(inputElement, { target: { value: 'New value' } });
//     expect(onChange).toHaveBeenCalledTimes(1);
//   });

//   test('renders icon when iconName is provided', () => {
//     const { getByTestId } = render(<TextInput iconName="search" />);
//     const iconElement = getByTestId('icon');
//     expect(iconElement).toBeInTheDocument();
//   });

//   test('calls onClick when input is clicked', () => {
//     const onClick = jest.fn();
//     const { getByPlaceholderText } = render(<TextInput placeHolder="Enter text" onClick={onClick} />);
//     const inputElement = getByPlaceholderText('Enter text');
//     fireEvent.click(inputElement);
//     expect(onClick).toHaveBeenCalledTimes(1);
//   });

//   test('applies error style when error prop is provided', () => {
//     const { getByPlaceholderText } = render(<TextInput placeHolder="Enter text" error="Input error" />);
//     const inputElement = getByPlaceholderText('Enter text');
//     expect(inputElement).toHaveClass('!border-primary-red');
//   });

//   // Additional tests can be added for onBlur, onFocus, and other props
// });
