// import { render, fireEvent } from '@testing-library/react';
// import Checkbox from './Checkbox';

// describe('Checkbox Component', () => {
//   test('renders checkbox correctly', () => {
//     const { getByTestId } = render(<Checkbox id="1" onChange={() => {}} testId="1" />);
//     const checkbox = getByTestId('core-ui-lib-checkbox-1');
//     expect(checkbox).toBeInTheDocument();
//   });

//   test('handles onChange event correctly', () => {
//     let isChecked = false;
//     const handleChange = () => {
//       isChecked = !isChecked;
//     };
//     const { getByTestId } = render(<Checkbox id="2" onChange={handleChange} testId="2" />);
//     const checkbox = getByTestId('core-ui-lib-checkbox-2');
//     fireEvent.click(checkbox);
//     expect(isChecked).toBe(true);
//   });

//   test('disables checkbox when disabled prop is true', () => {
//     const { getByTestId } = render(<Checkbox id="3" onChange={() => {}} disabled testId="3" />);
//     const checkbox = getByTestId('core-ui-lib-checkbox-3') as HTMLInputElement;
//     expect(checkbox.disabled).toBe(true);
//   });
//   test('sets intermediate state when showIntermediate prop is true', () => {
//     const { getByTestId } = render(<Checkbox id="4" onChange={() => {}} showIntermediate testId="4" />);
//     const checkbox = getByTestId('core-ui-lib-checkbox-4') as HTMLInputElement;
//     expect(checkbox.indeterminate).toBe(true);
//   });

//   test('displays label text when label prop is provided', () => {
//     const labelText = 'Checkbox Label';
//     const { getByText } = render(<Checkbox id="5" onChange={() => {}} label={labelText} testId="5" />);
//     const label = getByText(labelText);
//     expect(label).toBeInTheDocument();
//   });
// });
