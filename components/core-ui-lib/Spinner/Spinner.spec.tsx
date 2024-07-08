import { render, screen } from '@testing-library/react';
import Spinner from './Spinner';

describe('Spinner Component', () => {
  test('renders with default size (md)', () => {
    render(<Spinner size="md" />);
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('h-12 w-12');
  });

  test('renders with small size (sm)', () => {
    render(<Spinner size="sm" />);
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('h-8 w-8');
  });

  test('renders with large size (lg)', () => {
    render(<Spinner size="lg" />);
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('h-32 w-32');
  });

  test('applies additional className', () => {
    const customClass = 'bg-red-500';
    render(<Spinner size="lg" testId="test" className={customClass} />);
    const spinnerContainer = screen.getByTestId('core-ui-lib-spinner-test');
    expect(spinnerContainer).toHaveClass(customClass);
  });

  test('has correct aria attributes', () => {
    render(<Spinner size="lg" />);
    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
  });

  test('contains loading text for accessibility', () => {
    render(<Spinner size="lg" />);
    const spinner = screen.getByText('Loading...');
    expect(spinner).toHaveTextContent('Loading...');
  });
});
