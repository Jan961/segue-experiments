import { render, screen, fireEvent } from '@testing-library/react';
import TextInput from './TextInput';

describe('TextInput Component', () => {
  // Test rendering with default props
  test('renders with default props', () => {
    render(<TextInput />);
    const inputElement = screen.getByRole('textbox');
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).not.toHaveAttribute('id');
    expect(inputElement).toHaveAttribute('type', 'text');
    expect(inputElement).toHaveClass(
      'block',
      'w-fit-content',
      'pl-2',
      '!border',
      'text-sm',
      'shadow-input-shadow',
      'text-primary-input-text',
      'rounded-md',
      'outline-none',
      'focus:ring-2',
      'focus:ring-primary-input-text',
      'ring-inset',
    );
  });

  // Test rendering with custom props
  test('renders with custom props', () => {
    const handleChange = jest.fn();
    const placeholder = 'Enter value';
    render(<TextInput id="testInput" value="test value" onChange={handleChange} placeholder={placeholder} />);
    const inputElement = screen.getByRole('textbox');
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute('id', 'testInput');
    expect(inputElement).toHaveAttribute('value', 'test value');
    expect(inputElement).toHaveAttribute('placeholder', placeholder);
    fireEvent.change(inputElement, { target: { value: 'updated value' } });
    expect(handleChange).toHaveBeenCalled();
  });

  // Test error state
  test('renders with error state', () => {
    render(<TextInput error="Invalid input" />);
    const inputElement = screen.getByRole('textbox');
    expect(inputElement).toHaveClass('!border-primary-red');
  });

  // Test icon presence
  test('renders with icon', () => {
    render(<TextInput iconName={'search'} />);
    const iconElement = screen.getByRole('img');
    expect(iconElement).toBeInTheDocument();
  });

  // Test user interactions
  test('calls onClick handler', () => {
    const handleClick = jest.fn();
    render(<TextInput onClick={handleClick} />);
    const inputElement = screen.getByRole('textbox');
    fireEvent.click(inputElement);
    expect(handleClick).toHaveBeenCalled();
  });

  test('calls onFocus and onBlur handlers', () => {
    const handleFocus = jest.fn();
    const handleBlur = jest.fn();
    render(<TextInput onFocus={handleFocus} onBlur={handleBlur} />);
    const inputElement = screen.getByRole('textbox');
    fireEvent.focus(inputElement);
    expect(handleFocus).toHaveBeenCalled();
    fireEvent.blur(inputElement);
    expect(handleBlur).toHaveBeenCalled();
  });
});
