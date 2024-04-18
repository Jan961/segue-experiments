import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Tabs from './Tabs'; // Adjust the import path to where your Tabs component is located.

describe('Tabs Component', () => {
  const mockTabs = ['Tab 1', 'Tab 2', 'Tab 3'];
  const mockChildren = [
    <div key="1">Content 1</div>,
    <div key="2">Content 2</div>,
    <div key="3">Content 3</div>
  ];
  const mockOnChange = jest.fn();

  it('renders without crashing', () => {
    render(<Tabs tabs={mockTabs} children={mockChildren} />);
    expect(screen.getByText('Tab 1')).toBeInTheDocument();
    expect(screen.getByText('Content 1')).toBeInTheDocument();
  });

  it('creates the correct number of tabs', () => {
    render(<Tabs tabs={mockTabs} children={mockChildren} />);
    mockTabs.forEach(tab => {
      expect(screen.getByText(tab)).toBeInTheDocument();
    });
  });

  it('does not call onChange when tabs are disabled', () => {
    render(<Tabs tabs={mockTabs} onChange={mockOnChange} disabled={true} children={mockChildren} />);
    const firstTab = screen.getByText('Tab 1');
    userEvent.click(firstTab);
    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it('does not apply selectedTabClass when tabs are disabled', () => {
    render(<Tabs tabs={mockTabs} selectedTabClass="selected" disabled={true} children={mockChildren} />);
    const firstTab = screen.getByText('Tab 1');
    userEvent.click(firstTab);
    expect(firstTab).not.toHaveClass('selected');
  });
});
