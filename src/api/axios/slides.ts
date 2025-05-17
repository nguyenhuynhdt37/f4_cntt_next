import axiosInstance from "./store";

// Interface for slide search parameters
export interface ISlideParams {
    page: number;
    size: number;
    search?: string;
    sortField?: string;
    sortDirection?: string;
}

// Interface for slide data
export interface ISlide {
    id: number;
    title: string;
    description: string;
    image: string;
    alt?: string;
    overlayImage?: string;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}

// Interface for slide creation request
export interface ISlideCreate {
    title: string;
    description: string;
    image: File;
    alt?: string;
    overlayImage?: File;
    isActive: boolean;
}

// Interface for slide update request
export interface ISlideUpdate {
    id: number;
    title?: string;
    description?: string;
    image?: File;
    alt?: string;
    overlayImage?: File;
    isActive?: boolean;
}

// Get all slides with pagination and filters
export const getSlides = async (params: ISlideParams) => {
    try {
        const response = await axiosInstance.get('/admin/slides', {
            params
        });
        return response.data;
    } catch (error: any) {
        console.error('Lỗi khi lấy danh sách slides:', error);
        throw error.response?.data || { message: 'Lỗi không xác định khi lấy danh sách slides' };
    }
};

// Get slide details by ID
export const getSlideById = async (id: number | string) => {
    try {
        const response = await axiosInstance.get(`/admin/slides/${id}`);
        return response.data;
    } catch (error: any) {
        console.error(`Lỗi khi lấy thông tin slide #${id}:`, error);
        throw error.response?.data || { message: 'Lỗi không xác định khi lấy thông tin slide' };
    }
};

// Create a new slide
export const createSlide = async (slideData: ISlideCreate) => {
    try {
        const formData = new FormData();
        formData.append('title', slideData.title);
        formData.append('description', slideData.description);
        formData.append('image', slideData.image);
        if (slideData.alt) formData.append('alt', slideData.alt);
        if (slideData.overlayImage) formData.append('overlayImage', slideData.overlayImage);
        formData.append('isActive', slideData.isActive.toString());

        const response = await axiosInstance.post('/admin/slides', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error: any) {
        console.error('Lỗi khi tạo slide mới:', error);
        throw error.response?.data || { message: 'Lỗi không xác định khi tạo slide mới' };
    }
};

// Update an existing slide
export const updateSlide = async (slideData: ISlideUpdate) => {
    try {
        const formData = new FormData();
        if (slideData.title) formData.append('title', slideData.title);
        if (slideData.description) formData.append('description', slideData.description);
        if (slideData.image) formData.append('image', slideData.image);
        if (slideData.alt) formData.append('alt', slideData.alt);
        if (slideData.overlayImage) formData.append('overlayImage', slideData.overlayImage);
        if (slideData.isActive !== undefined) formData.append('isActive', slideData.isActive.toString());

        const response = await axiosInstance.put(`/admin/slides/${slideData.id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error: any) {
        console.error(`Lỗi khi cập nhật slide #${slideData.id}:`, error);
        throw error.response?.data || { message: 'Lỗi không xác định khi cập nhật slide' };
    }
};

// Delete a slide
export const deleteSlide = async (id: number) => {
    try {
        const response = await axiosInstance.delete(`/admin/slides/${id}`);
        return response.data;
    } catch (error: any) {
        console.error(`Lỗi khi xóa slide #${id}:`, error);
        throw error.response?.data || { message: 'Lỗi không xác định khi xóa slide' };
    }
};

// Toggle slide active status
export const toggleActive = async (id: number) => {
    try {
        const response = await axiosInstance.put(`/admin/slides/${id}/toggle-active`);
        return response.data;
    } catch (error: any) {
        console.error(`Lỗi khi thay đổi trạng thái slide #${id}:`, error);
        throw error.response?.data || { message: 'Lỗi không xác định khi thay đổi trạng thái slide' };
    }
};
