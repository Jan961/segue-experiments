import { render, fireEvent, screen } from '@testing-library/react';
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

    const hourInput = screen.getByTestId('hourInput') as HTMLInputElement;
    const minInput = screen.getByTestId('minInput') as HTMLInputElement;

    fireEvent.change(hourInput, { target: { value: '15' } });
    fireEvent.change(minInput, { target: { value: '45' } });

    expect(hourInput.value).toBe('15');
    expect(minInput.value).toBe('45');
  });

  test('handles onBlur event correctly', () => {
    const onChange = jest.fn();
    const onBlur = jest.fn();
    render(<TimeInput value={{ hrs: '10', min: '20' }} onChange={onChange} onBlur={onBlur} />);

    const hourInput = screen.getByTestId('hourInput') as HTMLInputElement;
    const minInput = screen.getByTestId('minInput') as HTMLInputElement;

    fireEvent.change(hourInput, { target: { value: '12' } });
    fireEvent.change(minInput, { target: { value: '34' } });

    // Simulate focus and blur events
    fireEvent.focus(hourInput);
    fireEvent.blur(minInput);

    // onBlur should be called once with the final time object
    expect(onBlur).toHaveBeenCalledTimes(2);
    expect(onBlur).toHaveBeenCalledWith({ hrs: '12', min: '34', sec: '' });
  });

  test('handles disabled state correctly', () => {
    const onChange = jest.fn();
    render(<TimeInput value={{ hrs: '12', min: '30' }} onChange={onChange} disabled />);

    // Check that the Label is rendered instead of the inputs
    const label = screen.getByText('12 : 30');
    expect(label).toBeInTheDocument();

    // Ensure that inputs are not present in the DOM
    expect(screen.queryByTestId('hourInput')).toBeNull();
    expect(screen.queryByTestId('minInput')).toBeNull();
  });
});
