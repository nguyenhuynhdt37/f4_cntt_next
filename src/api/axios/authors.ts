import axiosInstance from "./store";

interface IAuthorParams {
    page?: number;
    size?: number;
    sort?: string;
    search?: string;
    sortField?: string;
    sortDirection?: string;
}

export const getListAuthor = async ({ page, size, search, sortDirection, sortField }: IAuthorParams) => {
    try {
        const response = await axiosInstance.get(`/authors`, {
            params: {
                page,
                size,
                search,
                sortDirection,
                sortField,
            },
        });
        return response.data;
    } catch (error: any) {
        console.error('Lỗi khi gọi API lấy danh sách tác giả:', error);
        throw error.response?.data || { message: 'Lỗi không xác định' };
    }
};

export const getAuthorById = async (id: number) => {
    try {
        const response = await axiosInstance.get(`/authors/${id}`);
        return response.data;
    } catch (error: any) {
        console.error('Lỗi khi gọi API lấy thông tin tác giả:', error);
        throw error.response?.data || { message: 'Lỗi không xác định' };
    }
};

interface ICreateAuthor {
    name: string;
    description: string;
    isActive: boolean;
}

export const createAuthor = async (authorData: ICreateAuthor) => {
    try {
        const response = await axiosInstance.post(`/authors`, authorData);
        return response.data;
    } catch (error: any) {
        console.error('Lỗi khi tạo tác giả mới:', error);
        throw error.response?.data || { message: 'Lỗi không xác định' };
    }
};

interface IUpdateAuthor {
    name: string;
    description: string;
}

export const updateAuthor = async (id: number, updateData: IUpdateAuthor) => {
    try {
        const response = await axiosInstance.put(`/authors/${id}`, updateData);
        return response.data;
    } catch (error: any) {
        console.error('Lỗi khi cập nhật thông tin tác giả:', error);
        throw error.response?.data || { message: 'Lỗi không xác định' };
    }
};

export const toggleActive = async (id: number) => {
    try {
        const response = await axiosInstance.put(`/authors/${id}/toggle`);
        return response.data;
    } catch (error: any) {
        console.error('Lỗi khi thay đổi trạng thái tác giả:', error);
        throw error.response?.data || { message: 'Lỗi không xác định' };
    }
};

export const deleteAuthor = async (id: number) => {
    try {
        const response = await axiosInstance.delete(`/authors/${id}`);
        return response.data;
    } catch (error: any) {
        console.error('Lỗi khi xóa tác giả:', error);
        throw error.response?.data || { message: 'Lỗi không xác định' };
    }
};
