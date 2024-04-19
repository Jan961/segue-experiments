import { render, screen } from '@testing-library/react';
import Label from './Label';

describe('Label Component', () => {
  test('Render Label component', () => {
    render(<Label text={'Label text'} />);
    const labelEl = screen.getByText('Label text');
    expect(labelEl).toBeInTheDocument();
    // Check if the default variant 'sm' class is applied
    expect(labelEl).toHaveClass('text-primary-label', 'text-sm', 'leading-8', 'font-normal');
  });

  test('renders label with custom variant and additional className', () => {
    const labelText = 'Test Label';
    const customVariant = 'lg';
    const customClassName = 'custom-class';
    render(<Label text={labelText} variant={customVariant} className={customClassName} />);
    const labelElement = screen.getByText(labelText);
    expect(labelElement).toBeInTheDocument();
    // Check if the custom variant and additional className are applied
    expect(labelElement).toHaveClass('text-primary-label', 'text-lg', customClassName);
  });
});
