// import React from 'react';
// import { render } from '@testing-library/react';
// import Label from './Label';

// describe('Label Component', () => {
//   test('renders label with default props', () => {
//     const { getByText } = render(<Label text="Hello" />);
//     const labelElement = getByText('Hello');
//     expect(labelElement).toBeInTheDocument();
//     expect(labelElement).toHaveClass('text-primary-label');
//     expect(labelElement).toHaveClass('text-sm');
//     expect(labelElement).toHaveClass('leading-8');
//     expect(labelElement).toHaveClass('font-normal');
//   });

//   test('renders label with custom variant and className', () => {
//     const { getByText } = render(<Label text="Custom Label" variant="lg" className="custom-class" />);
//     const labelElement = getByText('Custom Label');
//     expect(labelElement).toBeInTheDocument();
//     expect(labelElement).toHaveClass('text-primary-label');
//     expect(labelElement).toHaveClass('text-lg');
//     expect(labelElement).toHaveClass('custom-class');
//   });

//   test('renders label with provided text', () => {
//     const { getByText } = render(<Label text="This is a label" />);
//     expect(getByText('This is a label')).toBeInTheDocument();
//   });
// });
