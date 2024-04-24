import { render, screen } from '@testing-library/react';
import Loader from './Loader';

describe('Loader Component', () => {
  test('renders loader with default variant', () => {
    const text = 'Loading...';
    render(<Loader text={text} />);
    const loaderTextElement = screen.getByText(text);
    const spinIconElement = screen.getByTestId('spinIcon');

    // Check if the text is rendered
    expect(loaderTextElement).toBeInTheDocument();
    // Check if the default variant 'sm' is applied to the text
    expect(loaderTextElement).toHaveClass('text-primary-label', 'text-sm');

    // Check if the SpinIcon is rendered
    expect(spinIconElement).toBeInTheDocument();
    expect(spinIconElement).toHaveAttribute('width', '18px');
    expect(spinIconElement).toHaveAttribute('height', '18px');
  });

  test('renders loader with custom variant and additional className', () => {
    const text = 'Loading...';
    const customVariant = 'lg';
    render(<Loader text={text} variant={customVariant} />);
    const loaderTextElement = screen.getByText(text);
    const spinIconElement = screen.getByTestId('spinIcon');

    expect(loaderTextElement).toBeInTheDocument();
    expect(loaderTextElement).toHaveClass('text-primary-label', 'text-lg');

    expect(spinIconElement).toBeInTheDocument();
    // Check if the custom variant 'lg' is applied to the SpinIcon
    expect(spinIconElement).toHaveAttribute('width', '22px');
    expect(spinIconElement).toHaveAttribute('height', '22px');
  });
});
