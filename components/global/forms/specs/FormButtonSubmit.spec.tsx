import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormButtonSubmit } from '../FormButtonSubmit';

const mockOnClick = jest.fn();

describe('Tests for FormButtonSubmit', () => {
  beforeEach(() => {
    mockOnClick.mockClear();
  });

  it('Renders button with provided text', () => {
    render(<FormButtonSubmit text="Submit" />);
    expect(screen.getByText('Submit')).toBeInTheDocument();
  });

  it('Button click triggers provided onClick function', async () => {
    render(<FormButtonSubmit text="Submit" onClick={mockOnClick} />);
    await userEvent.click(screen.getByText('Submit'));
    expect(mockOnClick).toHaveBeenCalled();
  });

  it('Renders button as disabled', () => {
    render(<FormButtonSubmit text="Submit" disabled />);
    const button = screen.getByText('Submit');
    expect(button).toBeDisabled();
  });

  it('Displays loading spinner when loading is true', () => {
    render(<FormButtonSubmit text="Submit" loading />);
    expect(screen.getByText('Submit')).toBeInTheDocument();
    // Assuming the spinner is represented by a FontAwesomeIcon with icon="spinner"
    expect(screen.getByRole('img', { name: 'spinner' })).toBeInTheDocument();
  });

  it('Button renders with DANGER style when intent is DANGER', () => {
    render(<FormButtonSubmit text="Delete" intent="DANGER" />);
    const button = screen.getByText('Delete');
    // Check for DANGER-specific classes, assuming they change the background color
    expect(button).toHaveClass('bg-red-500');
  });
});
