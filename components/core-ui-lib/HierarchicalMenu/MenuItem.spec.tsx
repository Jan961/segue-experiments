import { render, fireEvent, screen } from '@testing-library/react';
import MenuItem from './MenuItem';

describe('MenuItem Component', () => {
  const mockOnClick = jest.fn();
  const mockOnToggle = jest.fn();

  const option = {
    label: 'Test Option',
    value: 'test',
    options: [],
    groupHeader: false,
    icon: {
      default: { iconName: 'search', stroke: 'black', fill: 'white' },
      active: { iconName: 'search', stroke: 'black', fill: 'white' },
    },
    expanded: true,
  };

  test('renders the label and icon correctly', () => {
    render(<MenuItem option={option} onClick={mockOnClick} onToggle={mockOnToggle} />);
    const labelElement = screen.getByText('Test Option');
    const iconElement = screen.getByTestId('search-icon');
    expect(labelElement).toBeInTheDocument();
    expect(iconElement).toBeInTheDocument();
  });

  test('invokes onClick handler when the item is clicked', () => {
    render(<MenuItem option={option} onClick={mockOnClick} onToggle={mockOnToggle} />);
    const labelElement = screen.getByText('Test Option');
    fireEvent.click(labelElement);
    expect(mockOnClick).toHaveBeenCalledWith(option);
  });

  test('invokes onToggle handler when the disclosure button is clicked', () => {
    render(<MenuItem option={option} onClick={mockOnClick} onToggle={mockOnToggle} />);
    const disclosureButton = screen.getByTestId('tree-item-open');
    fireEvent.click(disclosureButton);
    expect(mockOnToggle).toHaveBeenCalledWith({ ...option, expanded: !option.expanded });
  });

  // Add more tests as needed...
});
