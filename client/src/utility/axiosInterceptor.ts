import axios from 'axios';

const axiosInterceptor = axios.create();

const getAccessToken = () => sessionStorage.getItem('token');

axiosInterceptor.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      // eslint-disable-next-line no-param-reassign
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

export default axiosInterceptor;
