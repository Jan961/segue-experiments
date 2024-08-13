import { render, screen, fireEvent } from '@testing-library/react';
import RadioGroup, { Direction } from './RadioGroup';

const options = [
  { text: 'Option 1', value: '1' },
  { text: 'Option 2', value: '2' },
  { text: 'Option 3', value: '3' },
];

describe('RadioGroup', () => {
  const handleChange = jest.fn();
  test('renders radio buttons correctly', () => {
    render(<RadioGroup options={options} direction={Direction.HORIZONTAL} value="1" onChange={handleChange} />);
    options.forEach((option) => expect(screen.getByLabelText(option.text)).toBeInTheDocument());
  });

  test('renders with the correct initial value', () => {
    const handleChange = jest.fn();
    render(<RadioGroup options={options} direction={Direction.HORIZONTAL} value="2" onChange={handleChange} />);
    expect(screen.getByLabelText('Option 2')).toBeChecked();
  });

  test('calls onChange when a radio button is clicked', () => {
    render(<RadioGroup options={options} direction={Direction.HORIZONTAL} value="1" onChange={handleChange} />);

    fireEvent.click(screen.getByLabelText('Option 2'));
    expect(handleChange).toHaveBeenCalledWith('2');
  });

  test('changes the selected value when a radio button is clicked', () => {
    const { rerender } = render(
      <RadioGroup options={options} direction={Direction.HORIZONTAL} value="1" onChange={handleChange} />,
    );

    fireEvent.click(screen.getByLabelText('Option 2'));
    expect(handleChange).toHaveBeenCalledWith('2');

    rerender(<RadioGroup options={options} direction={Direction.HORIZONTAL} value="2" onChange={handleChange} />);
    expect(screen.getByLabelText('Option 2')).toBeChecked();
  });

  test('renders radio buttons vertically when direction is vertical', () => {
    render(
      <RadioGroup
        testId="radio-group"
        options={options}
        direction={Direction.VERTICAL}
        value="1"
        onChange={handleChange}
      />,
    );
    const radioGroupDiv = screen.getByTestId('radio-group');
    expect(radioGroupDiv).toHaveClass('flex-col');
  });

  test('renders radio buttons horizontally when direction is horizontal', () => {
    render(
      <RadioGroup
        testId="radio-group"
        options={options}
        direction={Direction.HORIZONTAL}
        value="1"
        onChange={handleChange}
      />,
    );
    const radioGroupDiv = screen.getByTestId('radio-group');
    expect(radioGroupDiv).toHaveClass('flex-row');
  });
});
