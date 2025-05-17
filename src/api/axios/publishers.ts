import axiosInstance from "./store";

interface IPublisherParams {
    page: number;
    size: number;
    search: string;
    sortField: string;
    sortDirection: string;
}

export const getListPublisher = async ({ page, size, search, sortDirection, sortField }: IPublisherParams) => {
    try {
        const response = await axiosInstance.get(`/admin/publishers`, {
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
        console.error('Lỗi khi gọi API lấy danh sách nhà xuất bản:', error);
        throw error.response?.data || { message: 'Lỗi không xác định' };
    }
};

export const getPublisherById = async (id: number) => {
    try {
        const response = await axiosInstance.get(`/admin/publishers/${id}`);
        return response.data;
    } catch (error: any) {
        console.error('Lỗi khi gọi API lấy thông tin nhà xuất bản:', error);
        throw error.response?.data || { message: 'Lỗi không xác định' };
    }
};

interface ICreatePublisher {
    name: string;
}

export const createPublisher = async (publisherData: ICreatePublisher) => {
    try {
        const response = await axiosInstance.post(`/admin/publishers`, publisherData);
        return response.data;
    } catch (error: any) {
        console.error('Lỗi khi tạo nhà xuất bản mới:', error);
        throw error.response?.data || { message: 'Lỗi không xác định' };
    }
};

interface IUpdatePublisher {
    name: string;
}

export const updatePublisher = async (id: number, updateData: IUpdatePublisher) => {
    try {
        const response = await axiosInstance.put(`/admin/publishers/${id}`, updateData);
        return response.data;
    } catch (error: any) {
        console.error('Lỗi khi cập nhật thông tin nhà xuất bản:', error);
        throw error.response?.data || { message: 'Lỗi không xác định' };
    }
};

export const deletePublisher = async (id: number) => {
    try {
        const response = await axiosInstance.delete(`/admin/publishers/${id}`);
        return response.data;
    } catch (error: any) {
        console.error('Lỗi khi xóa nhà xuất bản:', error);
        throw error.response?.data || { message: 'Lỗi không xác định' };
    }
};
