import { render, fireEvent, screen } from '@testing-library/react';
import DateInput from './DateInput';

describe('DateInput Component', () => {
  const onChangeMock = jest.fn();

  test('renders without crashing', () => {
    render(<DateInput onChange={onChangeMock} />);
    const dateInput = screen.getByTestId('date-input');
    expect(dateInput).toBeInTheDocument();
  });

  test('updates value when set via props or imperatively', () => {
    const { rerender } = render(<DateInput onChange={onChangeMock} value={new Date('2022-01-01')} />);
    let dateInput = screen.getByDisplayValue('01/01/22');
    expect(dateInput).toBeInTheDocument();

    rerender(<DateInput onChange={onChangeMock} value={new Date('2023-01-01')} />);
    dateInput = screen.getByDisplayValue('01/01/23');
    expect(dateInput).toBeInTheDocument();
  });

  test('handles user input correctly', () => {
    render(<DateInput onChange={onChangeMock} />);
    const dateInput = screen.getByTestId('date-input');
    fireEvent.change(dateInput, { target: { value: '01/01/24' } });
    expect(dateInput).toHaveValue('01/01/24');
  });

  test('handles input blur correctly', () => {
    render(<DateInput onChange={onChangeMock} />);
    const dateInput = screen.getByTestId('date-input');
    fireEvent.blur(dateInput);
    expect(onChangeMock).toHaveBeenCalledWith(null);
  });
});
