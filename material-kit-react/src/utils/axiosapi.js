// eslint-disable-next-line import/no-extraneous-dependencies
import axios from 'axios';

// config
import { HOST_API_URL } from '../config-global';

// ----------------------------------------------------------------------
// https://stackoverflow.com/questions/43051291/attach-authorization-header-for-all-axios-requests for common use of token - TODO

const axiosInstance = axios.create({ baseURL: HOST_API_URL });

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;
