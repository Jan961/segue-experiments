import { useEffect } from 'react';

const AccountManager = (WrappedComponent) => {
  const HOC = (props) => {
    useEffect(() => {
      console.log('Component Mounted');
      return () => {
        console.log('Component Unmounted');
      };
    }, []);

    return <WrappedComponent {...props} />;
  };

  return HOC;
};

export default AccountManager;
