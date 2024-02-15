// import React from 'react';
// import { render, fireEvent } from '@testing-library/react';
// import Select from './Select';

// describe('Select Component', () => {
//   test('renders with default props', () => {
//     const { container, getByText } = render(<Select />);
//     const selectButton = container.querySelector('.Listbox.Button');
//      expect(selectButton).toBeInTheDocument();
//     expect(selectButton).not.toBeDisabled();
//   });

//   test('renders with provided props', () => {
//     const handleChange = jest.fn();
//     const options = [
//       { text: 'Option 1', value: 'option1' },
//       { text: 'Option 2', value: 'option2' },
//       { text: 'Option 3', value: 'option3' },
//     ];
//     const { container, getByText } = render(
//       <Select
//         value="option2"
//         options={options}
//         disabled={true}
//         onChange={handleChange}
//         placeHolder="Select an option"
//         label="Select Option"
//       />
//     );
//     const selectButton = container.querySelector('.Listbox.Button');

//   });

//   test('calls onChange handler when an option is selected', () => {
//     const handleChange = jest.fn();
//     const options = [
//       { text: 'Option 1', value: 'option1' },
//       { text: 'Option 2', value: 'option2' },
//       { text: 'Option 3', value: 'option3' },
//     ];
//     const { getByText } = render(
//       <Select value="" options={options} onChange={handleChange} />
//     );
//     const selectButton = getByText('Please select a value');

//     fireEvent.click(selectButton);
//     const option2 = getByText('Option 2');
//     fireEvent.click(option2);
//   });
// });
