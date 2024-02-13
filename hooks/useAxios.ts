import { useState, useCallback, useRef, useEffect } from 'react';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';

type FetchRequest = {
  url: string;
  method: 'GET' | 'POST';
  data?: any;
  config?: AxiosRequestConfig;
};

type UseAxiosReturn = {
  data: any | null;
  loading: boolean;
  error: AxiosError<any> | null;
  fetchData: (request: FetchRequest) => Promise<void>;
  cancelRequest: () => void;
};

const useAxios = (): UseAxiosReturn => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const cancelRef = useRef(null);
  useEffect(() => {
    return () => cancelRef.current?.('Component unMounted');
  }, []);
  const fetchData = useCallback(async ({ url, method = 'POST', data, config = {} }: FetchRequest) => {
    setLoading(true);
    setError(null);
    try {
      const CancelToken = axios.CancelToken;
      const response = await axios({
        url,
        method,
        data,
        ...config,
        cancelToken: new CancelToken(function executor(c) {
          cancelRef.current = c;
        }),
      });
      setData(response.data);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Request canceled', error.message);
      } else {
        setError(error);
      }
    } finally {
      setLoading(false);
    }
  }, []);
  const cancelRequest = useCallback(() => {
    if (cancelRef.current) cancelRef.current?.('Operation canceled by the user.');
  }, []);

  return { data, loading, error, fetchData, cancelRequest };
};

export default useAxios;
