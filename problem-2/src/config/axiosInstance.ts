// biome-ignore lint/style/useImportType: <explanation>
import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";

const axiosInstance = axios.create({
	baseURL: "https://interview.switcheo.com",
	headers: {
		Accept: "application/json",
		"Content-Type": "application/json",
	},
	timeout: 3000,
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
	(configure: InternalAxiosRequestConfig) => {
		// Do something before request is sent
		const newConfigure = { ...configure };
		return newConfigure;
	},
	(error) => Promise.reject(error),
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
	(response: AxiosResponse) => {
		// Any status code that lie within the range of 2xx cause this function to trigger
		return response.data; // Just get data from response
	},
	(error) => {
		// Any status codes that falls outside the range of 2xx cause this function to trigger
		// Do something with response error (ex: show toast)
		return Promise.reject(error);
	},
);

export default axiosInstance;
