import { render, fireEvent, screen } from '@testing-library/react';
import Select from './Select';

describe('Select Component', () => {
  test('renders with default props', () => {
    render(<Select />);
    const selectButton = screen.getByRole('button', { name: /select/i });
    expect(selectButton).toBeInTheDocument();
    expect(selectButton).not.toBeDisabled();
  });

  test('renders with provided props', () => {
    const handleChange = jest.fn();
    const options = [
      { text: 'Option 1', value: 'option1' },
      { text: 'Option 2', value: 'option2' },
      { text: 'Option 3', value: 'option3' },
    ];
    render(
      <Select
        value="option2"
        options={options}
        disabled={true}
        onChange={handleChange}
        placeHolder="Select an option"
        label="Select Option"
      />,
    );
    const selectButton = screen.getByRole('button', { name: /select/i });
    fireEvent.click(selectButton);
    // Additional assertions for the rendered dropdown menu can be added here
  });

  test('calls onChange handler when an option is selected', () => {
    const handleChange = jest.fn();
    const options = [
      { text: 'Option 1', value: 'option1' },
      { text: 'Option 2', value: 'option2' },
      { text: 'Option 3', value: 'option3' },
    ];
    render(<Select value="" options={options} onChange={handleChange} />);
    const selectButton = screen.getByRole('button', { name: /select/i });
    fireEvent.click(selectButton);
    const option2 = screen.getByText('Option 2');
    fireEvent.click(option2);
    expect(handleChange).toHaveBeenCalledWith('option2');
  });
});
