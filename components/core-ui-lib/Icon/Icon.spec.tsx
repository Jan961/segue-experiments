// import React from 'react';
// import { render } from '@testing-library/react';
// import Icon, { IconName } from './Icon';

// describe('Icon Component', () => {
//   test('renders the correct icon based on the iconName prop', () => {
//     const iconNames: IconName[] = [
//       'search',
//       'chevron-down',
//       'check',
//       'minus',
//       'edit',
//       'delete',
//       'calendar',
//       'spin',
//       'pin-open',
//       'pin-close',
//       'note',
//       'note-filled',
//       'home',
//       'bookings',
//       'marketing',
//       'tasks',
//       'contracts',
//       'touring-management',
//       'production-management',
//       'system-admin',
//       'menu',
//       'exit',
//       'excel',
//       'cross',
//     ];

//     iconNames.forEach((iconName) => {
//       const { getByTestId } = render(<Icon iconName={iconName} />);
//       const iconElement = getByTestId(`${iconName}-icon`);
//       expect(iconElement).toBeInTheDocument();
//     });
//   });

//   test('does not render when the iconName prop is invalid', () => {
//     const { container } = render(<Icon iconName="invalid-icon" />);
//     expect(container.firstChild).toBeNull();
//   });

//   // Add more tests as needed...
// });
