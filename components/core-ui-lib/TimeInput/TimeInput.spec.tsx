import { screen, render, fireEvent } from '@testing-library/react';
import TimeInput from './TimeInput';

describe('TimeInput Component', () => {
  test('renders without errors', () => {
    const onChange = jest.fn();
    render(<TimeInput value={{ hrs: '10', min: '20' }} onChange={onChange} />);

    expect(screen.getByTestId('hourInput')).toBeInTheDocument();
    expect(screen.getByTestId('minInput')).toBeInTheDocument();
  });

  test('updates hour and minute inputs correctly', () => {
    const onChange = jest.fn();
    render(<TimeInput value={{ hrs: '10', min: '20' }} onChange={onChange} />);

    const hourInput = screen.getByTestId('hourInput');
    const minInput = screen.getByTestId('minInput');

    fireEvent.change(hourInput, { target: { value: '15' } });
    fireEvent.change(minInput, { target: { value: '45' } });

    expect(hourInput.value).toBe('15');
    expect(minInput.value).toBe('45');
  });

  test('handles onBlur event correctly', () => {
    const onChange = jest.fn();
    const onBlur = jest.fn();
    render(<TimeInput value={{ hrs: '10', min: '20' }} onChange={onChange} onBlur={onBlur} />);

    const hourInput = screen.getByTestId('hourInput');
    const minInput = screen.getByTestId('minInput');

    fireEvent.blur(hourInput);
    fireEvent.blur(minInput);

    expect(onBlur).toHaveBeenCalledTimes(2);
    expect(onBlur).toHaveBeenCalledWith({ hrs: '10', min: '20' });
  });

  test('handles disabled state correctly', () => {
    const handleChange = jest.fn();
    render(<TimeInput value={{ hrs: '12', min: '30' }} onChange={handleChange} disabled />);
    const textEl = screen.getByText(/12 : 30/i);
    expect(textEl).toHaveClass('!bg-disabled-input');
  });
});
