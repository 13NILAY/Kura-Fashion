import axios from '../api/axios';
import useAuth from './useAuth';

const useRefreshToken = () => {
    const { setAuthInfo } = useAuth();

    const refresh = async () => {
        try {
            const response = await axios.get('/refresh', {
                withCredentials: true
            });

            const { email, roles, accessToken } = response.data;
            setAuthInfo({ accessToken }, email, roles);
            
            return accessToken;
        } catch (err) {
            console.error('Refresh token error:', err);
            throw err; // Propagate the error for handling in PersistLogin
        }
    };
    return refresh;
};

export default useRefreshToken;
