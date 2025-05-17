import axiosInstance from "./store";

interface LoginParams {
    username: string;
    password: string;
    captchaToken: string | null;
}

export const login = async ({ username, password, captchaToken }: LoginParams): Promise<any> => {
    try {
        const res = await axiosInstance.post(
            '/Auth/login',
            {
                username,
                password,
                captchaToken,
            }
        );
        return res.data;
    } catch (error: any) {
        throw error;
    }
};

export const logOut = async (): Promise<any> => {
    try {
        const res = await axiosInstance.post('/Auth/logout', {});
        return res.data;
    } catch (error: any) {
        throw error;
    }
};
export const getProfile = async (): Promise<any> => {
    try {
        const res = await axiosInstance.get('/admin/users/profile');
        return res.data;
    } catch (error: any) {
        throw error;
    }
};

export const register = async ({ username, password, email, fullName }: any): Promise<any> => {
    try {

        const res = await axiosInstance.post(
            '/Auth/register',
            { username, password, email, fullName },
            { withCredentials: true },
        );
        return res.data;
    } catch (error: any) {
        throw error;
    }
};
export const createUser = async ({ id, username, password, email, fullName }: any): Promise<any> => {
    try {

        const res = await axiosInstance.post(
            '/Auth/register',
            { username, password, email, fullName, id },
            { withCredentials: true },
        );
        return res.data;
    } catch (error: any) {
        throw error;
    }
};