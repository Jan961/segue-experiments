import { render, screen } from '@testing-library/react';
import Loader from './Loader';

describe('Loader Component', () => {
  test('renders loader with default variant', () => {
    render(<Loader />);
    const loader = screen.getByRole('status');
    expect(loader).toBeInTheDocument();
    expect(loader).toHaveClass('animate-spin');
    expect(loader).toHaveAttribute('width', '18px');
    expect(loader).toHaveAttribute('height', '18px');
  });

  test('renders loader with custom variant and text', () => {
    render(<Loader text="Loading..." variant="lg" />);
    const loaderText = screen.getByText('Loading...');
    expect(loaderText).toBeInTheDocument();
    expect(loaderText).toHaveClass('text-lg');
    const loaderIcon = screen.getByRole('status');
    expect(loaderIcon).toBeInTheDocument();
    expect(loaderIcon).toHaveClass('animate-spin');
    expect(loaderIcon).toHaveAttribute('width', '22px');
    expect(loaderIcon).toHaveAttribute('height', '22px');
  });
});
