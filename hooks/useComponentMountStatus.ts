import { useEffect, useState } from 'react';

const useComponentMountStatus = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);
  return isMounted;
};

export default useComponentMountStatus;
