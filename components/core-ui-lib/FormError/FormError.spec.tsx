import { render, screen } from '@testing-library/react';
import FormError from './FormError';

describe('FormError', () => {
  it('renders error message correctly', () => {
    const errorMessage = 'Test Error Message';
    render(<FormError error={errorMessage} testId="form-error" />);
    const formError = screen.getByTestId('form-error');
    expect(formError).toHaveTextContent(errorMessage);
  });

  it('applies correct class based on variant', () => {
    const errorMessage = 'Test Error Message';
    render(<FormError error={errorMessage} variant="sm" testId="form-error" />);
    const formError = screen.getByTestId('form-error');
    expect(formError).toHaveClass('text-primary-red font-calibri text-sm');
  });

  it('applies default variant when none provided', () => {
    const errorMessage = 'Test Error Message';
    render(<FormError error={errorMessage} testId="form-error" />);
    const formError = screen.getByTestId('form-error');
    expect(formError).toHaveClass('text-primary-red font-calibri text-xs');
  });

  it('accepts additional class names where provided', () => {
    const errorMessage = 'Test Error Message';
    render(<FormError error={errorMessage} testId="form-error" className="absolute mt-10" />);
    const formError = screen.getByTestId('form-error');
    expect(formError).toHaveClass('text-primary-red font-calibri text-xs');
    expect(formError).toHaveClass('absolute mt-10');
  });
});
