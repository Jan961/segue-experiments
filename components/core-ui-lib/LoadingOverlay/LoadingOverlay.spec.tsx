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
    const spinner = within(overlay).getByRole('status');
    expect(spinner).toBeInTheDocument();
    // Check if the default size 'lg' is applied to the spinner
    expect(spinner).toHaveClass('h-32 w-32');
  });

  test('renders loading overlay with loader and custom classNames', () => {
    render(<LoadingOverlay spinner={false} className="top-20 left-20 right-20 bottom-20" loaderVariant="lg" />);
    const overlay = screen.getByTestId('loading-overlay');
    expect(overlay).toBeInTheDocument();

    // Check if loader is rendered
    const loader = screen.getByTestId('core-ui-lib-loader');
    expect(loader).toBeInTheDocument();

    // Check if the default classes are applied to the loader
    expect(loader).toHaveClass('flex items-center gap-2 ml-2');

    // spin icon
    const spinIcon = within(loader).getByTestId('spinIcon');

    // Check if the default iconProps are applied to the loader
    expect(spinIcon).toHaveAttribute('stroke', '#FFF');

    // Check if the custom variant 'lg' is applied to the loader
    expect(spinIcon).toHaveAttribute('height', '22px');
  });
});
