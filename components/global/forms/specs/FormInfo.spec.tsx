import { render, screen } from '@testing-library/react';
import { FormInfo } from '../FormInfo';

describe('Tests for FormInfo', () => {
  it('Renders children correctly', () => {
    render(
      <FormInfo>
        <div>Test Content</div>
      </FormInfo>
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('Applies correct styling for DANGER intent', () => {
    const { container } = render(
      <FormInfo intent="DANGER">
        <div>Test Content</div>
      </FormInfo>
    );
    expect(container.firstChild).toHaveClass('bg-red-200');
  });

  it('Applies correct styling for WARNING intent', () => {
    const { container } = render(
      <FormInfo intent="WARNING">
        <div>Test Content</div>
      </FormInfo>
    );
    expect(container.firstChild).toHaveClass('bg-amber-200');
  });

  it('Displays header when provided', () => {
    render(
      <FormInfo header="Test Header">
        <div>Test Content</div>
      </FormInfo>
    );
    expect(screen.getByText('Test Header')).toBeInTheDocument();
  });

  it('Applies custom class name when provided', () => {
    const { container } = render(
      <FormInfo className="custom-class">
        <div>Test Content</div>
      </FormInfo>
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
