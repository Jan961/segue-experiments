import toast, { Toaster } from 'react-hot-toast';
import { ToasterProps } from './interface';
const Notifications = ({ toastOptions = {}, reverseOrder = false, ...props }: ToasterProps) => {
  return <Toaster position="top-center" reverseOrder={reverseOrder} toastOptions={toastOptions} {...props} />;
};

export default Notifications;

export const notify = {
  success: (message, options = {}) => {
    toast.success(message, options);
  },
  error: (message, options = {}) => {
    toast.error(message, options);
  },
  warning: (message, options = {}) => {
    toast(message, {
      icon: '⚠️',
      ...options,
    });
  },
  promise: (promise, options) => {
    toast.promise(promise, options);
  },
};
