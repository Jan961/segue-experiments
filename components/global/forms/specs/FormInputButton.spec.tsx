import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormInputButton } from '../FormInputButton';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';

const mockOnClick = jest.fn();

describe('Tests for FormInputButton', () => {
  beforeEach(() => {
    mockOnClick.mockClear();
  });

  it('Renders button with provided text', () => {
    render(<FormInputButton text="Click Me" />);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('Button click triggers provided onClick function', async () => {
    render(<FormInputButton text="Click Me" onClick={mockOnClick} />);
    await userEvent.click(screen.getByText('Click Me'));
    expect(mockOnClick).toHaveBeenCalled();
  });

  it('Renders button as disabled', () => {
    render(<FormInputButton text="Click Me" disabled />);
    const button = screen.getByTestId('form-input-button');
    expect(button).toBeDisabled();
  });

  it('Displays loading spinner when loading is true', () => {
    render(<FormInputButton text="Loading..." loading />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('Displays icon when provided', () => {
    render(<FormInputButton text="Coffee" icon={faCoffee} />);
  });

  it('Applies custom class name when provided', () => {
    const { container } = render(<FormInputButton className="custom-class" />);
    const { firstChild } = container;
    expect(firstChild).toHaveClass('custom-class');
  });

  it('Applies DANGER styling when intent is DANGER', () => {
    const { container } = render(<FormInputButton intent="DANGER" />);
    const { firstChild } = container;
    expect(firstChild).toHaveClass('bg-red-500');
  });

  it('Applies PRIMARY styling when intent is PRIMARY', () => {
    const { container } = render(<FormInputButton intent="PRIMARY" />);
    const { firstChild } = container;
    expect(firstChild).toHaveClass('bg-primary-blue');
  });
});
