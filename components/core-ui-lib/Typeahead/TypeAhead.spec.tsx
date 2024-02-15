// import React from 'react';
// import { render, fireEvent } from '@testing-library/react';
// import Typeahead, { TypeaheadProps } from './Typeahead';

// const options = [
//   { text: 'Option 1', value: 1 },
//   { text: 'Option 2', value: 2 },
//   { text: 'Option 3', value: 3 },
// ];

// const renderTypeahead = (props: Partial<TypeaheadProps> = {}) => {
//   const defaultProps: TypeaheadProps = {
//     value: undefined,
//     onChange: jest.fn(),
//     options: options,
//     placeholder: 'Search...',
//   };
//   return render(<Typeahead {...defaultProps} {...props} />);
// };

// describe('Typeahead Component', () => {
//   test('renders typeahead input with placeholder', () => {
//     const { getByPlaceholderText } = renderTypeahead();
//     const inputElement = getByPlaceholderText('Search...');
//     expect(inputElement).toBeInTheDocument();
//   });

// //  Collaborate with developer i wrote more scenerio

// });
