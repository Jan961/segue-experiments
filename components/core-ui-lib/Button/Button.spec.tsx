import { render, fireEvent, screen } from '@testing-library/react';
import Button from './Button';

describe('Button Component', () => {
  test('renders button correctly', () => {
    const onClickHandler = jest.fn();

    render(<Button id="1" text="Click Me" onClick={onClickHandler} disabled={false} />);

    const button = screen.getByText('Click Me');
    expect(button).toBeInTheDocument();
  });

  test('handles onClick event correctly', () => {
    const onClickHandler = jest.fn();

    render(<Button id="2" text="Click Me" onClick={onClickHandler} disabled={false} />);

    const button = screen.getByText('Click Me');
    fireEvent.click(button);

    expect(onClickHandler).toHaveBeenCalledTimes(1);
  });

  test('disables button when disabled prop is true', () => {
    const onClickHandler = jest.fn();

    render(<Button id="3" text="Click Me" onClick={onClickHandler} disabled={true} />);

    const button = screen.getByTestId('3');
    expect(button).toHaveAttribute('disabled');
  });
});
