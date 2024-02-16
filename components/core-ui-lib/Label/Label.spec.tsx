import { render, screen } from '@testing-library/react';
import Label from './Label';

describe('Label Component', () => {
  test('renders label with default props', () => {
    render(<Label text="Hello" />);
    const labelElement = screen.getByText('Hello');
    expect(labelElement).toBeInTheDocument();
    expect(labelElement).toHaveClass('text-primary-label');
    expect(labelElement).toHaveClass('text-sm');
    expect(labelElement).toHaveClass('leading-8');
    expect(labelElement).toHaveClass('font-normal');
  });

  test('renders label with custom variant and className', () => {
    render(<Label text="Custom Label" variant="lg" className="custom-class" />);
    const labelElement = screen.getByText('Custom Label');
    expect(labelElement).toBeInTheDocument();
    expect(labelElement).toHaveClass('text-primary-label');
    expect(labelElement).toHaveClass('text-lg');
    expect(labelElement).toHaveClass('custom-class');
  });

  test('renders label with provided text', () => {
    render(<Label text="This is a label" />);
    expect(screen.getByText('This is a label')).toBeInTheDocument();
  });
});
