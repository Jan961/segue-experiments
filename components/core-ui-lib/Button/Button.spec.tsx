import { render, screen, fireEvent } from '@testing-library/react';
import Button, { ButtonProps } from './Button';

describe('Button component', () => {
  test('renders correctly with default props', () => {
    const onClickMock = jest.fn();
    const buttonText = 'Click me';
    const buttonId = 'myButton';

    render(<Button id={buttonId} text={buttonText} onClick={onClickMock} />);

    const buttonElement = screen.getByRole('button', { name: buttonText });

    // Assert button renders with correct text
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveTextContent(buttonText);

    // Assert button renders with correct ID
    expect(buttonElement).toHaveAttribute('id', buttonId);

    // Assert button renders with default variant class
    expect(buttonElement).toHaveClass('bg-primary-navy');

    // Simulate button click
    fireEvent.click(buttonElement);

    // Assert onClick function is called
    expect(onClickMock).toHaveBeenCalled();
  });

  test('renders correctly with custom classNames', () => {
    const buttonText = 'Click me';
    const customClassName = 'w-16';

    render(<Button text={buttonText} className={customClassName} />);

    const buttonElement = screen.getByRole('button', { name: buttonText });

    // Assert button renders with custom className
    expect(buttonElement).toHaveClass(customClassName);
  });

  test('renders correctly with secondary variant', () => {
    const buttonText = 'Click me';
    const buttonVariant: ButtonProps['variant'] = 'secondary';

    render(<Button text={buttonText} variant={buttonVariant} />);

    const buttonElement = screen.getByRole('button', { name: buttonText });

    // Assert button renders with secondary variant class
    expect(buttonElement).toHaveClass('bg-primary-white');
  });

  test('renders correctly with disabled state', () => {
    const onClickMock = jest.fn();
    const buttonText = 'Click me';
    const disabled = true;

    render(<Button text={buttonText} disabled={disabled} onClick={onClickMock} />);

    const buttonElement = screen.getByRole('button', { name: buttonText });

    // Assert button is disabled
    expect(buttonElement).toBeDisabled();

    // Assert button onClick function is not called when disabled
    fireEvent.click(buttonElement);
    expect(onClickMock).not.toHaveBeenCalled();
  });

  // Add more test cases as needed to cover different variants, states, and props
});

// // This test suite covers:
// Rendering the button with default props and asserting its correctness.
// Rendering the button with custom classNames and checking if they are applied correctly.
// Rendering the button with a secondary variant and asserting the correct variant class.
// Rendering the button with the disabled state and ensuring it is disabled and that the onClick function is not called when clicked.
