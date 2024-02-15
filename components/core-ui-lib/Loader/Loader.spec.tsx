// import React from 'react';
// import { render } from '@testing-library/react';
// import Loader from './Loader';

// describe('Loader Component', () => {
//   test('renders loader with default variant', () => {
//     const { container } = render(<Loader />);
//     const loader = container.querySelector('.animate-spin');
//     expect(loader).toBeInTheDocument();
//     expect(loader).toHaveAttribute('width', '18px');
//     expect(loader).toHaveAttribute('height', '18px');
//   });

//   test('renders loader with custom variant and text', () => {
//     const { container } = render(<Loader text="Loading..." variant="lg" />);
//     const loaderText = container.querySelector('.text-lg');
//     expect(loaderText).toBeInTheDocument();
//     expect(loaderText.textContent).toBe('Loading...');
//     const loaderIcon = container.querySelector('.animate-spin');
//     expect(loaderIcon).toBeInTheDocument();
//     expect(loaderIcon).toHaveAttribute('width', '22px');
//     expect(loaderIcon).toHaveAttribute('height', '22px');
//   });
// });
