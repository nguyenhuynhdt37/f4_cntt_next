import axiosInstance from "./store";

interface LoginParams {
    username: string;
    password: string;
}

export const login = async ({ username, password }: LoginParams): Promise<any> => {
    try {
        const res = await axiosInstance.post(
            '/Auth/login',
            {
                username,
                password,
            }
        );
        return res.data;
    } catch (error: any) {
        throw error;
    }
};

export const register = async ({ username, password, email, phone, roleId }: any): Promise<any> => {
    try {
        const res = await axiosInstance.post(
            '/Auth/register',
            { username, password, email, phone, roleId },
            { withCredentials: true },
        );
        return res.data;
    } catch (error: any) {
        throw error;
    }
};