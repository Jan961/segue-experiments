import { render, screen } from '@testing-library/react';
import Icon, { IconName } from './Icon';

describe('Icon Component', () => {
  test('renders the correct icon based on the iconName prop', () => {
    const iconNames: IconName[] = [
      'search',
      'chevron-down',
      'check',
      'minus',
      'edit',
      'delete',
      'calendar',
      'spin',
      'pin-open',
      'pin-close',
      'note',
      'note-filled',
      'home',
      'bookings',
      'marketing',
      'tasks',
      'contracts',
      'touring-management',
      'production-management',
      'system-admin',
      'menu',
      'exit',
      'excel',
      'cross',
    ];

    iconNames.forEach((iconName) => {
      render(<Icon iconName={iconName} />);
      const iconElement = screen.getByTestId(`${iconName}-icon`);
      expect(iconElement).toBeInTheDocument();
    });
  });

  test('does not render when the iconName prop is invalid', () => {
    render(<Icon iconName="invalid-icon" />);
    const iconElement = screen.queryByTestId('invalid-icon-icon');
    expect(iconElement).toBeNull();
  });

  // Add more tests as needed...
});
