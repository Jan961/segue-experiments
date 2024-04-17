import { render, fireEvent, screen } from '@testing-library/react';
import Icon from './Icon';

describe('Icon Component', () => {
  test('Render Icon component', () => {
    render(<Icon iconName={'search'} />);
    const iconEl = screen.getByRole('img');
    expect(iconEl).toBeInTheDocument();
  });

  test('passes props to the rendered icon component', () => {
    render(<Icon iconName="search" stroke="red" strokeWidth="2" color="blue" fill="green" variant="xs" />);
    const searchIcon = screen.getByRole('img');
    expect(searchIcon).toHaveAttribute('stroke', 'red');
    expect(searchIcon).toHaveAttribute('stroke-width', '2');
    expect(searchIcon).toHaveAttribute('color', 'blue');
    expect(searchIcon).toHaveAttribute('fill', 'green');
    expect(searchIcon).toHaveAttribute('width', '15px');
    expect(searchIcon).toHaveAttribute('height', '15px');
  });

  test('calls onClick callback when icon is clicked', () => {
    const onClickMock = jest.fn();
    render(<Icon iconName="search" onClick={onClickMock} />);
    const iconEl = screen.getByRole('img');
    fireEvent.click(iconEl);
    expect(onClickMock).toHaveBeenCalled();
  });
});
