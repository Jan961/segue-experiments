import { render, screen, within } from '@testing-library/react';
import LoadingOverlay from './LoadingOverlay';

describe('LoadingOverlay Component', () => {
  test('renders loading overlay with spinner - the default', () => {
    render(<LoadingOverlay />);
    const overlay = screen.getByTestId('loading-overlay');

    // Check if the overlay is rendered
    expect(overlay).toBeInTheDocument();
    // Check if the default classes are applied to the overlay
    expect(overlay).toHaveClass('inset-0 absolute bg-white bg-opacity-50 z-50 flex justify-center items-center');

    // Check if the SpinIcon is rendered
    const spinner = within(overlay).getByTestId('core-ui-lib-spinner-undefined');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveAttribute('size', 'lg');
  });

  test('renders loading overlay with loader and custom classNames', () => {
    render(<LoadingOverlay spinner={false} className="top-20 left-20 right-20 bottom-20" loaderVariant="lg" />);
    const overlay = screen.getByTestId('loading-overlay');
    expect(overlay).toBeInTheDocument();

    // Check if loader is rendered
    const loader = screen.getByTestId('core-ui-lib-loader');
    expect(loader).toBeInTheDocument();

    // Check if the default classes are applied to the loader
    expect(loader).toHaveClass('ml-2');

    // Check if the default iconProps are applied to the loader
    expect(loader).toHaveProperty('iconProps', { stroke: '#FFF' });

    // Check if the custom variant 'lg' is applied to the loader
    expect(loader).toHaveAttribute('variant', 'lg');
  });
});
