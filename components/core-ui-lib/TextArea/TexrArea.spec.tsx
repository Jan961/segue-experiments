// import React from 'react';
// import { render, fireEvent } from '@testing-library/react';
// import TextArea from './TextArea';

// describe('TextArea Component', () => {
//   test('renders with default props', () => {
//     const { container } = render(<TextArea />);
//     const textArea = container.querySelector('textarea');

//     expect(textArea).toBeInTheDocument();
//     expect(textArea).not.toBeDisabled();
//     expect(textArea).toHaveClass('block min-w-fit h-[1.9375rem] text-sm shadow-input-shadow text-primary-input-text rounded-md !border-primary-border outline-none focus:ring-2 focus:ring-primary-input-text ring-inset');
//   });

//   test('renders with provided props', () => {
//     const handleChange = jest.fn();
//     const { container } = render(
//       <TextArea
//         id="myTextArea"
//         value="Hello World"
//         disabled={true}
//         className="custom-class"
//         onChange={handleChange}
//         placeHolder="Enter text"
//       />
//     );
//     const textArea = container.querySelector('textarea');

//     expect(textArea).toBeInTheDocument();
//   });

//   test('calls onClick handler when textarea is clicked', () => {
//     const handleClick = jest.fn();
//     const { container } = render(<TextArea onClick={handleClick} />);
//     const textArea = container.querySelector('textarea');

//     fireEvent.click(textArea);
//     expect(handleClick).toHaveBeenCalledTimes(1);
//   });
// });
