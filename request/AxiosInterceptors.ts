import axios, { AxiosResponse, AxiosError, InternalAxiosRequestConfig, AxiosHeaders } from 'axios';
import { getTimezonOffset } from 'services/dateService';

/**
 * Axios Error Response Handler
 *
 * @param {AxiosError} error - axios error response object
 * TODO: error logger to be implemented in future
 */
const axiosResponseErrorHandler = (error: AxiosError): Promise<never> => Promise.reject(error);

/**
 * Axios Request Handler
 *
 * @param {InternalAxiosRequestConfig} request - axios request object
 */
const axiosRequestHandler = async (request: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
  const newReqParams: InternalAxiosRequestConfig = { ...request };
  const headers = request.headers as AxiosHeaders;
  headers.set('timezoneOffset', getTimezonOffset());
  newReqParams.headers = headers;
  return newReqParams;
};

// Adding a response interceptor to track API errors from the default axios instance
axios.interceptors.response.use((res: AxiosResponse) => res, axiosResponseErrorHandler);

// Adding a request interceptor to track API requests from the default axios instance
axios.interceptors.request.use(axiosRequestHandler);

const { create } = axios;

// Adding request and response interceptors to track APIs from all newly created instances
axios.create = (...args: Parameters<typeof create>): ReturnType<typeof create> => {
  const instance = create.apply(this, args);
  instance.interceptors.request.use(axiosRequestHandler);
  instance.interceptors.response.use((res: AxiosResponse) => res, axiosResponseErrorHandler);
  return instance;
};
