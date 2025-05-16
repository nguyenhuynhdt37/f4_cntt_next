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
            },
            { withCredentials: true },
        );
        return res.data;
    } catch (error: any) {
        throw error;
    }
};