import { render, screen } from '@testing-library/react';
import { FormInputCheckbox } from '../FormInputCheckbox';
import userEvent from '@testing-library/user-event';

const mockOnChange = jest.fn();

describe('Tests for FormInputCheckbox', () => {
  beforeEach(() => {
    mockOnChange.mockClear();
  });
  it('Renders checkbox currectly', async () => {
    render(<FormInputCheckbox label="Test checkbox" value={false} onChange={mockOnChange} />);
    expect(screen.getByText('Test checkbox')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('checkbox'));
    expect(mockOnChange).toHaveBeenCalled();
  });

  it('Renders checkbox disabled', async () => {
    render(<FormInputCheckbox label="Test checkbox" disabled value={false} onChange={mockOnChange} />);
    expect(screen.getByText('Test checkbox')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('checkbox'));
    expect(mockOnChange).not.toHaveBeenCalled();
  });
});
