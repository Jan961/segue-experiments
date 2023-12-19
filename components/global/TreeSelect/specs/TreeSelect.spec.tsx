import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TreeSelect from '../index';

const carOptions = [
  {
    id: '1',
    name: 'Car',
    options: [
      { id: 'bentley', value: 'bentley', label: 'Bentley', checked: false },
      { id: 'ferrari', value: 'ferrari', label: 'Ferrari', checked: true },
      { id: 'mercedes', value: 'mercedes', label: 'Mercedes', checked: false },
    ],
  },
];
const mockOnChange = jest.fn();

describe('Tests for TreeSelect', () => {
  it('Renders component correctly', () => {
    render(<TreeSelect options={carOptions} onChange={mockOnChange} />);
    expect(screen.getByText('Car')).toBeInTheDocument();
    expect(screen.getByTestId('tree-item-close')).toBeInTheDocument();
    expect(screen.queryByText('Bentley')).not.toBeInTheDocument();
  });

  it('Displays sub-items correctly', async () => {
    render(<TreeSelect options={carOptions} onChange={mockOnChange} />);
    const plusIcon = screen.getByTestId('tree-item-close');
    expect(plusIcon).toBeInTheDocument();
    fireEvent.click(plusIcon);

    expect(screen.getByText('Bentley')).toBeInTheDocument();
    expect(screen.getByTestId('tree-item-open')).toBeInTheDocument();
    const ferrariCheckBox = screen.getByTestId('tree-item-checkbox-ferrari') as HTMLInputElement;
    expect(ferrariCheckBox.checked).toEqual(true);
    const mercCheckBox = screen.getByTestId('tree-item-checkbox-mercedes') as HTMLInputElement;
    expect(mercCheckBox.checked).toEqual(false);
    await userEvent.click(mercCheckBox);
    const expected = { ...carOptions[0].options[2], checked: true, parentId: '1' };
    expect(mockOnChange).toHaveBeenCalledWith(expected);
  });
});
