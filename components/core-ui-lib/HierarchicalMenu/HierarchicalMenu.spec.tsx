// import React from 'react';
// import { render, fireEvent } from '@testing-library/react';
// import HierarchicalMenu from './HierarchicalMenu';

// describe('HierarchicalMenu Component', () => {
//   test('renders with default props', () => {
//     const { container } = render(<HierarchicalMenu options={[]} />);
//     expect(container).toBeInTheDocument();
//   });

//   test('renders menu items correctly', () => {
//     const options = [
//       { value: '1', label: 'Option 1' },
//       { value: '2', label: 'Option 2', options: [{ value: '2.1', label: 'Option 2.1' }] },
//     ];
//     const { getByText } = render(<HierarchicalMenu options={options} />);
//     expect(getByText('Option 1')).toBeInTheDocument();
//     expect(getByText('Option 2')).toBeInTheDocument();
//     expect(getByText('Option 2.1')).toBeInTheDocument();
//   });

//   test('calls onClick handler when a menu item is clicked', () => {
//     const options = [{ value: '1', label: 'Option 1' }];
//     const handleClick = jest.fn();
//     const { getByText } = render(<HierarchicalMenu options={options} onClick={handleClick} />);
//     fireEvent.click(getByText('Option 1'));
//     expect(handleClick).toHaveBeenCalledTimes(1);
//   });

//   test('calls onToggle handler when a menu item is toggled', () => {
//     const options = [{ value: '1', label: 'Option 1' }];
//     const handleToggle = jest.fn();
//     const { getByText } = render(<HierarchicalMenu options={options} onToggle={handleToggle} />);
//     fireEvent.click(getByText('Option 1'));
//     expect(handleToggle).toHaveBeenCalledTimes(1);
//   });

//   // Add more tests as needed...
// });
