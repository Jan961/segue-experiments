// import { render, fireEvent } from '@testing-library/react';
// import DateInput from './DateInput';

// describe('DateInput component', () => {
//   const onChangeMock = jest.fn();

//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   test('calls onChange with correct date for valid input', () => {
//     const { getByTestId } = render(<DateInput onChange={onChangeMock} />);
//     const inputElement = getByTestId('date-input') as HTMLInputElement;
//     fireEvent.change(inputElement, { target: { value: '15/02/2022' } });
//     fireEvent.blur(inputElement);
//     expect(onChangeMock).toHaveBeenCalledWith(new Date(2022, 1, 15));
//   });
// // Write some more test after clear the code flow
// });

/// id and test-id are not pass on the this function
