import { useEffect, useRef } from 'react';
import axios from 'axios';

const useAxiosCancelToken = () => {
  const cancelTokenSource = useRef(null);
  useEffect(() => {
    cancelTokenSource.current = axios.CancelToken.source();
    return () => {
      if (cancelTokenSource.current) {
        cancelTokenSource.current.cancel('Component unmounted: Request canceled.');
      }
    };
  }, []);
  return cancelTokenSource.current ? cancelTokenSource.current.token : undefined;
};

export default useAxiosCancelToken;
