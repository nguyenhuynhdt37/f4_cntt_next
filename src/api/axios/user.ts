import axiosInstance from "./store";

interface IUserParams {
    page: number;
    size: number;
    search?: string;
    sortField?: string;
    sortDirection?: string;
}

interface ICreateUser {
    username: string;
    password: string;
    email: string;
    fullName: string;
    role?: string;
    avatar?: File | null;
    isActive?: boolean;
}

interface IUpdateUser {
    id?: string | number;
    email?: string;
    fullName?: string;
    password?: string;
    avatar?: File | null;
    isActive?: boolean;

}

interface IUpdateProfile {
    fullName: string;
    email: string;
    phone: string;
    address: string;
}

interface IChangePassword {
    currentPassword: string;
    newPassword: string;
}

export const register = async (userData: ICreateUser): Promise<any> => {
    try {
        // Nếu có avatar, sử dụng FormData để gửi file
        const formData = new FormData();
        formData.append('username', userData.username);
        formData.append('password', userData.password);
        formData.append('email', userData.email);
        formData.append('fullName', userData.fullName);
        if (userData.avatar) {
            formData.append('avatar', userData.avatar);
        }

        const res = await axiosInstance.post(
            '/admin/users',
            formData,
            {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            },
        );
        return res.data;
    } catch (error: any) {
        throw error;
    }
};

export const getUser = async ({ page, size, search, sortField, sortDirection }: IUserParams) => {
    try {
        const response = await axiosInstance.get('/admin/users', {
            params: { page, size, search, sortField, sortDirection },
        });
        return response.data;
    } catch (error: any) {
        console.error('Lỗi khi gọi API lấy danh sách người dùng:', error);
        throw error.response?.data || { message: 'Lỗi không xác định' };
    }
};

export const getUserById = async (id: string) => {
    try {
        const response = await axiosInstance.get(`/admin/users/${id}`);
        return response.data;
    } catch (error: any) {
        console.error('Lỗi khi gọi API lấy thông tin người dùng:', error);
        throw error.response?.data || { message: 'Lỗi không xác định' };
    }
};

export const updateUser = async (id: string, userData: IUpdateUser) => {
    try {
        // Luôn sử dụng FormData để phù hợp với [FromForm] trong backend
        const formData = new FormData();

        // Thêm ID để backend có thể kiểm tra
        formData.append('id', id);

        // Thêm các trường cập nhật khác
        if (userData.email) formData.append('email', userData.email);
        if (userData.fullName) formData.append('fullName', userData.fullName);
        if (userData.password) formData.append('password', userData.password);
        if (userData.isActive !== undefined) formData.append('isActive', String(userData.isActive));

        // Thêm avatar nếu có
        if (userData.avatar) {
            formData.append('avatar', userData.avatar);
        }

        const response = await axiosInstance.put(`/admin/users/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;

    } catch (error: any) {
        console.error('Lỗi khi cập nhật thông tin người dùng:', error);
        throw error.response?.data || { message: 'Lỗi không xác định' };
    }
};

export const updateProfile = async (profileData: IUpdateProfile): Promise<any> => {
    try {
        const res = await axiosInstance.put(
            '/user/profile',
            profileData,
            {
                withCredentials: true,
            }
        );
        return res.data;
    } catch (error) {
        throw error;
    }
};

export const getCurrentUser = async (): Promise<any> => {
    try {
        const res = await axiosInstance.get('/user/profile', {
            withCredentials: true,
        });
        return res.data;
    } catch (error) {
        throw error;
    }
};

export const changePassword = async (passwordData: IChangePassword): Promise<any> => {
    try {
        const res = await axiosInstance.put(
            '/user/change-password',
            passwordData,
            {
                withCredentials: true,
            }
        );
        return res.data;
    } catch (error) {
        throw error;
    }
};

export const toggleActive = async (id: string) => {
    try {
        const response = await axiosInstance.put(`/admin/users/${id}/toogle`);
        return response.data;
    } catch (error: any) {
        console.error('Lỗi khi thay đổi trạng thái người dùng:', error);
        throw error.response?.data || { message: 'Lỗi không xác định' };
    }
};

export const deleteUser = async (id: string) => {
    try {
        const response = await axiosInstance.delete(`/admin/users/${id}`);
        return response.data;
    } catch (error: any) {
        console.error('Lỗi khi xóa người dùng:', error);
        throw error.response?.data || { message: 'Lỗi không xác định' };
    }
};
