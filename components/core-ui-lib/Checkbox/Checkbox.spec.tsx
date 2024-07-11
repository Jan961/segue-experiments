import { render, fireEvent, screen } from '@testing-library/react';
import Checkbox from './Checkbox';

describe('Checkbox Component', () => {
  test('renders checkbox correctly', () => {
    const onChangeHandler = jest.fn();

    render(<Checkbox id="1" onChange={onChangeHandler} testId="checkbox-1" disabled />);
    expect(screen.getByTestId('checkbox-1')).toBeInTheDocument();
  });

  test('handles onChange event correctly', () => {
    let isChecked = false;
    const handleChange = () => {
      isChecked = !isChecked;
    };

    render(<Checkbox id="2" onChange={handleChange} testId="checkbox-2" disabled />);
    fireEvent.click(screen.getByTestId('checkbox-2'));
    expect(isChecked).toBe(true);
  });

  test('disables checkbox when disabled prop is true', () => {
    const onChangeHandler = jest.fn();

    render(<Checkbox id="3" onChange={onChangeHandler} disabled testId="checkbox-3" />);
    const checkbox = screen.getByTestId('checkbox-3') as HTMLInputElement;
    expect(checkbox.disabled).toBe(true);
  });
});
