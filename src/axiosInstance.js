// axiosInstance.js
import axios from 'axios';

// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_API_URL
});

// Common error handling function
const handleError = (error) => {
    if (error.response) {
        // The request was made, and the server responded with a status code
        // that falls outside of the range of 2xx
        console.error('Server responded with an error:', error.response.data);
        switch (error.response.status) {
            case 401: // Unauthorized
                console.error('Unauthorized access - maybe redirect to login');
                // Redirect to login or show a message
                break;
            case 403: // Forbidden
                console.error('Access forbidden');
                break;
            case 404: // Not Found
                console.error('The requested resource was not found');
                break;
            case 500: // Internal Server Error
                console.error('Internal server error', error.response.data.message);
                break;
            case 422: // validation error
                const validationErrors = error.response.data.errors.reduce((acc, error) => {
                                        acc[error.path] = error.msg;
                                        return acc;
                                    }, {});

                return Promise.reject({ validationErrors });
                break;
            default:
                console.error('An error occurred:', error.message);
        }
    } else if (error.request) {
        // The request was made, but no response was received
        console.error('No response received from server:', error.request);
    } else {
        // Something happened while setting up the request
        console.error('Error setting up the request:', error.message);
    }

    // Optionally return a custom error object/message
    return Promise.reject(error);
};

// Add a request interceptor to add headers dynamically
axiosInstance.interceptors.request.use(
    config => {
        const token = localStorage.getItem(process.env.REACT_APP_AUTH_TOKEN_KEY); // Get token from storage
        if (token) {
            config.headers[process.env.REACT_APP_AUTH_TOKEN_KEY] = `${token}`;
        }

        if (config.data instanceof FormData) {
            config.headers['Content-Type'] = 'multipart/form-data';
        }else {
            config.headers['Content-Type'] = 'application/json';
        }

        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle errors globally
axiosInstance.interceptors.response.use(
    response => response, // If the request succeeds, just return the response
    error => handleError(error) // Handle errors
);

export default axiosInstance;
