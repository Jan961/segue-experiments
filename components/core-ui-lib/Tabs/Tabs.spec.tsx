/* eslint-disable react/no-children-prop */
import { render, fireEvent, screen } from '@testing-library/react';
import Tabs from './Tabs';

describe('Tabs Component', () => {
  const tabs = ['Tab 1', 'Tab 2', 'Tab 3'];
  const children = [
    <div key="1">Content for Tab 1</div>,
    <div key="2">Content for Tab 2</div>,
    <div key="3">Content for Tab 3</div>,
  ];

  test('renders Tabs component with provided tabs', () => {
    render(<Tabs tabs={tabs} children={children} />);
    const tabButtons = screen.getAllByRole('button');
    expect(tabButtons.length).toBe(3);
    tabs.forEach((tab, index) => {
      expect(tabButtons[index]).toHaveTextContent(tab);
    });
  });

  test('renders default selected tab with default styles', () => {
    render(<Tabs tabs={tabs} children={children} />);
    const selectedTab = screen.getByText('Tab 1');
    expect(selectedTab).toHaveClass('w-[155px]');
  });

  test('calls onChange callback when tab is clicked', () => {
    const onChangeMock = jest.fn();
    render(<Tabs tabs={tabs} onChange={onChangeMock} children={children} />);
    const tab2 = screen.getByText('Tab 2');
    fireEvent.click(tab2);
    expect(onChangeMock).toHaveBeenCalledWith(1); // Tab index is 0-based
  });

  test('renders custom selected tab with provided class', () => {
    const customClass = 'custom-selected-tab';
    render(<Tabs tabs={tabs} selectedTabClass={customClass} children={children} />);
    const selectedTab = screen.getByText('Tab 1');
    expect(selectedTab).toHaveClass(customClass);
  });

  test('disabled state disables all tabs', () => {
    render(<Tabs tabs={tabs} disabled={true} children={children} />);
    const tabButtons = screen.getAllByRole('button');
    tabButtons.forEach(button => {
      expect(button).toBeDisabled();
    });
  });

  // Add more test cases as needed
});
