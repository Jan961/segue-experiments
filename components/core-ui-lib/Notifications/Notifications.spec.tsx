import React from 'react';
import { render, screen } from '@testing-library/react';
import Notifications, { notify } from './index';
import toast from 'react-hot-toast';

jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
  },
  Toaster: ({ children }: { children?: React.ReactNode }) => <div role="alert">{children}</div>,
}));

describe('Notifications Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('renders with default properties', () => {
      render(<Notifications />);
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('renders with custom properties', () => {
      const options = { duration: 4000, style: { background: 'blue', color: 'white' } };
      render(<Notifications toastOptions={options} reverseOrder={true} />);
    });
  });

  describe('Notification Functions', () => {
    it('displays a success toast', () => {
      const message = 'Success!';
      const options = { duration: 2000 };
      notify.success(message, options);
      expect(toast.success).toHaveBeenCalledWith(message, options);
    });

    it('displays an error toast', () => {
      const message = 'Error occurred';
      const options = { duration: 3000 };
      notify.error(message, options);
      expect(toast.error).toHaveBeenCalledWith(message, options);
    });
  });
});
