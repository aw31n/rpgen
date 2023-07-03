import axios from 'axios';
import { getRefreshToken, isAccessTokenExpired, setAuthUser } from './auth';
import { API_BASE_URL } from './constants';
import Cookies from 'js-cookie';
import { enqueueSnackbar } from 'notistack';

const useAxios = () => {
    const accessToken = Cookies.get('access_token');
    const refreshToken = Cookies.get('refresh_token');

    const axiosInstance = axios.create({
        baseURL: API_BASE_URL,
        headers: { Authorization: `Bearer ${accessToken}`, 'X-CSRFToken':Cookies.get('csrftoken') },
    });

    axiosInstance.interceptors.request.use(async (req) => {
        if (!isAccessTokenExpired(accessToken)) return req;

        try {
            const response = await getRefreshToken(refreshToken);

            setAuthUser(response.access, response.refresh);

            req.headers.Authorization = `Bearer ${response.data.access}`;
            return req;
        }
        catch (e) {
            console.log("AXIOS ERROR", e)
            enqueueSnackbar("Token expired. Please log in", { variant: "error"} );
            throw e
        }
    });

    return axiosInstance;
};

export default useAxios;