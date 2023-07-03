import axios from 'axios';
import { API_BASE_URL } from './constants';

// Only for local development!!


const apiInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 5000, // timeout after 5 seconds
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

export default apiInstance;