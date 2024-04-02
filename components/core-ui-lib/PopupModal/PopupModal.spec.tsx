/* eslint-disable @typescript-eslint/no-empty-function */
import { render, fireEvent, screen } from '@testing-library/react';
import PopupModal from './PopupModal';

global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe('PopupModal Component', () => {
  test('renders PopupModal with title and children when show is true', () => {
    render(
      <PopupModal show={true} title="Modal Title">
        <p>Modal Content</p>
      </PopupModal>,
    );

    const titleElement = screen.getByText('Modal Title');
    expect(titleElement).toBeInTheDocument();

    const contentElement = screen.getByText('Modal Content');
    expect(contentElement).toBeInTheDocument();
  });

  test('does not render PopupModal when show is false', () => {
    render(
      <PopupModal show={false} title="Modal Title">
        <p>Modal Content</p>
      </PopupModal>,
    );

    const titleElement = screen.queryByText('Modal Title');
    expect(titleElement).toBeNull();

    const contentElement = screen.queryByText('Modal Content');
    expect(contentElement).toBeNull();
  });

  test('calls onClose when close icon is clicked', async () => {
    const onCloseMock = jest.fn();
    render(
      <PopupModal show={true} title="Modal Title" onClose={onCloseMock}>
        <p>Modal Content</p>
      </PopupModal>,
    );
    const closeIcon = screen.getByRole('img');
    fireEvent.click(closeIcon);
    expect(onCloseMock).toHaveBeenCalled();
  });
});
