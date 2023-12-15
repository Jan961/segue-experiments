import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FormTypeahead, { TypeaheadOption } from '../FormTypeahead';

const mockOnChange = jest.fn();

const options: TypeaheadOption[] = [
  { name: 'One', value: '1' },
  { name: 'Two', value: '2' },
  { name: 'Three', value: '3' },
];

describe('Tests for FormTypeahead', () => {
  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('Renders component with provided options', async () => {
    render(<FormTypeahead options={options} onChange={mockOnChange} />);
    const input = screen.getByTestId('form-typeahead');
    expect(input).toBeInTheDocument();
    const button = within(input).getByRole('button');
    await userEvent.click(button);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getByText(options[0].name)).toBeInTheDocument();
    const firstOption = screen.getByRole('option', { name: 'One' });
    await userEvent.click(firstOption);
    expect(mockOnChange).toHaveBeenCalledWith('1');
  });

  it('Renders component disabled', async () => {
    render(<FormTypeahead options={options} onChange={mockOnChange} disabled />);
    const input = screen.getByTestId('form-typeahead');
    expect(input).toBeInTheDocument();
    const button = within(input).getByRole('button');
    await userEvent.click(button);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });
});
