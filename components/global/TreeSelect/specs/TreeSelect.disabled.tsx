import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TreeSelect from '../index';

const carOptions = [
  {
    id: '1',
    label: 'Car',
    value: 'car',
    checked: false,
    options: [
      { id: 'bentley', value: 'bentley', label: 'Bentley', checked: false, seqNo: 1 },
      { id: 'ferrari', value: 'ferrari', label: 'Ferrari', checked: true, seqNo: 1 },
      {
        id: 'mercedes',
        value: 'mercedes',
        label: 'Mercedes',
        checked: false,
        options: [{ id: 'mercedes_suv', value: 'mercedes_suv', label: 'Mercedes SUV', checked: false, seqNo: 1 }],
        seqNo: 1,
      },
    ],
    seqNo: 1,
  },
];
const mockOnChange = jest.fn();

const expected = [
  {
    checked: false,
    groupHeader: true,
    id: '1',
    isPartiallySelected: true,
    label: 'Car',
    value: 'car',
    options: [
      { checked: false, id: 'bentley', label: 'Bentley', value: 'bentley', seqNo: 1 },
      { checked: true, id: 'ferrari', label: 'Ferrari', value: 'ferrari', seqNo: 1 },
      {
        checked: true,
        id: 'mercedes',
        isPartiallySelected: false,
        label: 'Mercedes',
        options: [{ checked: true, id: 'mercedes_suv', label: 'Mercedes SUV', value: 'mercedes_suv', seqNo: 1 }],
        value: 'mercedes',
        seqNo: 1,
      },
    ],
    seqNo: 1,
  },
];

describe('Tests for TreeSelect', () => {
  it('Renders component correctly', () => {
    render(<TreeSelect options={carOptions} onChange={mockOnChange} />);
    expect(screen.getByText('Car')).toBeInTheDocument();
    expect(screen.getByTestId('tree-item-close')).toBeInTheDocument();
    expect(screen.queryByText('Bentley')).not.toBeInTheDocument();
  });

  it('Displays sub-items correctly', async () => {
    render(<TreeSelect options={carOptions} onChange={mockOnChange} />);
    const closeIcon = screen.getByTestId('tree-item-close');
    expect(closeIcon).toBeInTheDocument();
    fireEvent.click(closeIcon);

    expect(screen.getByText('Bentley')).toBeInTheDocument();
    expect(screen.getByTestId('tree-item-open')).toBeInTheDocument();
    const ferrariCheckBox = screen.getByTestId('form-input-checkbox-ferrari') as HTMLInputElement;
    expect(ferrariCheckBox.checked).toEqual(true);
    const mercCheckBox = screen.getByTestId('form-input-checkbox-mercedes') as HTMLInputElement;
    expect(mercCheckBox.checked).toEqual(false);
    await userEvent.click(mercCheckBox);

    expect(mockOnChange).toHaveBeenCalledWith(expected);
  });
});
