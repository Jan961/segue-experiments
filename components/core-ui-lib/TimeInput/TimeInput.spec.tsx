import { render, fireEvent, screen, waitFor } from '@testing-library/react';
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

    expect(onChange).toHaveBeenCalledTimes(2);
    expect(hourInput.value).toBe('15');
    expect(minInput.value).toBe('45');
  });

  test('handles onBlur event correctly', async () => {
    const onChange = jest.fn();
    const onBlur = jest.fn();
    render(<TimeInput value={{ hrs: '10', min: '20' }} onChange={onChange} onBlur={onBlur} />);

    const hourInput = screen.getByTestId('hourInput') as HTMLInputElement;
    const minInput = screen.getByTestId('minInput') as HTMLInputElement;

    // Simulate focus and blur events
    fireEvent.focus(hourInput);
    fireEvent.change(hourInput, { target: { value: '7' } });
    fireEvent.blur(hourInput);

    fireEvent.focus(minInput);
    fireEvent.change(minInput, { target: { value: '4' } });
    fireEvent.blur(minInput);

    // Disable the ESLint rule for this specific block
    // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
    await waitFor(() => {
      // Multiple assertions within the waitFor block
      expect(hourInput.value).toBe('7');  // Adjust this line to match the current behavior
      expect(minInput.value).toBe('4');   // Adjust this line to match the current behavior
    });

    // onBlur should be called twice
    expect(onBlur).toHaveBeenCalledTimes(2);
  });

  test('handles disabled state correctly', () => {
    const onChange = jest.fn();
    render(<TimeInput value={{ hrs: '12', min: '30' }} onChange={onChange} disabled />);

    const hourInput = screen.getByTestId('hourInput') as HTMLInputElement;
    const minInput = screen.getByTestId('minInput') as HTMLInputElement;

    // Ensure the inputs are disabled
    expect(hourInput).toBeDisabled();
    expect(minInput).toBeDisabled();
  });
});
