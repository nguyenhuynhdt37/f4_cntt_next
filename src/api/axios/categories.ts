import axiosInstance from "./store";

interface ICategoryParams {
    page?: number;
    size?: number;
    sort?: string;
    search?: string;
    sortField?: string;
    sortDirection?: string;
}
export const getListCategory = async ({ page, size, search, sortDirection, sortField }: ICategoryParams) => {
    try {
        const response = await axiosInstance.get(`/admin/categories`,
            {
                params: {
                    page,
                    size,
                    search,
                    sortDirection,
                    sortField,
                },
            }
        );
        return response.data;
    } catch (error: any) {
        console.error('Lỗi khi gọi API lấy người dùng:', error);
        throw error.response?.data || { message: 'Lỗi không xác định' };
    }
};

export const getCategoryById = async (id: number) => {
    try {
        const response = await axiosInstance.get(`/admin/categories/${id}`);
        return response.data;
    } catch (error: any) {
        console.error('Lỗi khi gọi API lấy người dùng:', error);
        throw error.response?.data || { message: 'Lỗi không xác định' };
    }
};

interface IUpdateCategory {
    name: string;
    description: string;
}

export const updateCateGoryID = async (id: number, updateCategory: IUpdateCategory) => {
    try {
        const response = await axiosInstance.put(`/admin/categories/${id}`, updateCategory);
        return response.data;
    } catch (error: any) {
        console.error('Lỗi khi gọi API lấy người dùng:', error);
        throw error.response?.data || { message: 'Lỗi không xác định' };
    }
};

export const togleActive = async (id: number) => {
    try {
        const response = await axiosInstance.put(`/admin/categories/${id}/toggle`);
        return response.data;
    } catch (error: any) {
        console.error('Lỗi khi gọi API lấy người dùng:', error);
        throw error.response?.data || { message: 'Lỗi không xác định' };
    }
};
export const addCategory = async (name: string, description: string, isActive: boolean) => {
    try {
        const response = await axiosInstance.post(`/admin/categories`, { name, description, isActive });
        return response.data;
    } catch (error: any) {
        console.error('Lỗi khi gọi API lấy người dùng:', error);
        throw error.response?.data || { message: 'Lỗi không xác định' };
    }
};
export const deleteCategory = async (id: number) => {
    try {
        const response = await axiosInstance.delete(`/admin/categories/${id}`);
        return response.data;
    } catch (error: any) {
        console.error('Lỗi khi gọi API lấy người dùng:', error);
        throw error.response?.data || { message: 'Lỗi không xác định' };
    }
};
