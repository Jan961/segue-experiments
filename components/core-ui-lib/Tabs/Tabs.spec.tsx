import { fireEvent, screen } from '@testing-library/react';

describe('Tabs Component', () => {
  test('switches tab content when tab is clicked', async () => {
    // Initially, only the content of the first tab should be visible
    expect(screen.getByText('Content for Tab 1')).toBeInTheDocument();
    expect(screen.queryByText('Content for Tab 2')).not.toBeInTheDocument();
    expect(screen.queryByText('Content for Tab 3')).not.toBeInTheDocument();

    // Click on the second tab
    fireEvent.click(screen.getByText('Tab 2'));

    // Now, the content of the second tab should be visible
    expect(screen.queryByText('Content for Tab 1')).not.toBeInTheDocument();
    expect(screen.getByText('Content for Tab 2')).toBeInTheDocument();
    expect(screen.queryByText('Content for Tab 3')).not.toBeInTheDocument();
  });

  // Add more tests as needed...
});
