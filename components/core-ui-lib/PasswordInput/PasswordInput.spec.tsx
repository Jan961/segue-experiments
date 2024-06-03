import { fireEvent, render, screen } from '@testing-library/react';
import PasswordInput from './PasswordInput';
import userEvent from '@testing-library/user-event';

const handleChange = jest.fn();

describe('PasswordInput Component', () => {
  // Test rendering with default props
  test('renders with default props', async () => {
    render(<PasswordInput onChange={handleChange} />);
    const inputElement = screen.getByTestId('password-input');
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute('type', 'password');
    const icon = screen.getByTestId('password-input-icon');
    expect(icon).toBeInTheDocument();
    await userEvent.click(icon);
    expect(inputElement).toHaveAttribute('type', 'text');
    fireEvent.click(icon);
    fireEvent.change(inputElement, { target: { value: 'abcd1234' } });
    expect(handleChange).toHaveBeenCalled();
  });
});
