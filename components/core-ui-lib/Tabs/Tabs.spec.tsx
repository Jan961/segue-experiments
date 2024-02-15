// import React from 'react';
// import { render, fireEvent } from '@testing-library/react';
// import Tabs from './Tabs';

// describe('Tabs Component', () => {
//   const tabs = ['Tab 1', 'Tab 2', 'Tab 3'];
//   const children = [
//     <div key="1">Content for Tab 1</div>,
//     <div key="2">Content for Tab 2</div>,
//     <div key="3">Content for Tab 3</div>,
//   ];

//   test('renders tabs with provided labels', () => {
//     const { getByText } = render(<Tabs tabs={tabs} children={children} />);

//     tabs.forEach(tab => {
//       const tabElement = getByText(tab);
//       expect(tabElement).toBeInTheDocument();
//     });
//   });

//   test('switches tab content when tab is clicked', async () => {
//     const { getByText, queryByText } = render(<Tabs tabs={tabs} children={children} />);

//     // Initially, only the content of the first tab should be visible
//     expect(queryByText('Content for Tab 1')).toBeInTheDocument();
//     expect(queryByText('Content for Tab 2')).not.toBeInTheDocument();
//     expect(queryByText('Content for Tab 3')).not.toBeInTheDocument();

//     // Click on the second tab
//     fireEvent.click(getByText('Tab 2'));

//     // Now, the content of the second tab should be visible
//     expect(queryByText('Content for Tab 1')).not.toBeInTheDocument();
//     expect(queryByText('Content for Tab 2')).toBeInTheDocument();
//     expect(queryByText('Content for Tab 3')).not.toBeInTheDocument();
//   });

//   // Add more tests as needed...
// });
