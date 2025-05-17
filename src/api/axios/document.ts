import axiosInstance from "./store";

// Interface for document search parameters
export interface IDocumentParams {
    page: number;
    size: number;
    search?: string;
    authorId?: number;
    publisherId?: number;
    categoryId?: number;
    sortField?: string;
    sortDirection?: string;
    status?: string;  // 0=Pending, 1=Approved, 2=Rejected
}

// Interface for document upload request
export interface IDocumentUpload {
    title: string;
    description: string;
    authorId: number;
    publisherId: number;
    categoryId: number;
    file: File;
    isApproved: boolean;
    isPremium: boolean;
}

// Interface for document update request
export interface IDocumentUpdate {
    id: number;
    title?: string;
    description?: string;
    authorId?: number;
    publisherId?: number;
    categoryId?: number;
    file?: File;
    isApproved?: boolean;
    isPremium?: boolean;
}

// Interface for document rating submission
export interface IRating {
    documentId: number;
    score: number;
}

// Interface for document comment submission
export interface IComment {
    documentId: number;
    content: string;
}

// Interface for document status update
export interface IStatusUpdate {
    status: number; // 0=Pending, 1=Approved, 2=Rejected
}

// Get all documents with pagination and filters
export const getDocuments = async (params: IDocumentParams) => {
    try {
        const response = await axiosInstance.get('/admin/documents', {
            params
        });
        // Nếu dữ liệu API trả về không có cấu trúc giống với Document type của chúng ta, 
        // chúng ta có thể chuyển đổi cấu trúc ở đây
        return response.data;
    } catch (error: any) {
        console.error('Lỗi khi lấy danh sách tài liệu:', error);
        throw error.response?.data || { message: 'Lỗi không xác định khi lấy danh sách tài liệu' };
    }
};

// Get document details by ID
export const getDocumentById = async (id: number | string) => {
    try {
        const response = await axiosInstance.get(`/admin/documents/${id}`);
        // Ánh xạ tên trường từ API response
        return response.data;
    } catch (error: any) {
        console.error(`Lỗi khi lấy thông tin tài liệu #${id}:`, error);
        throw error.response?.data || { message: 'Lỗi không xác định khi lấy thông tin tài liệu' };
    }
};

// Upload a new document
export const uploadDocument = async (documentData: IDocumentUpload) => {
    try {
        const formData = new FormData();
        formData.append('title', documentData.title);
        formData.append('description', documentData.description);
        formData.append('authorId', documentData.authorId.toString());
        formData.append('publisherId', documentData.publisherId.toString());
        formData.append('categoryId', documentData.categoryId.toString());
        formData.append('file', documentData.file);
        formData.append('isApproved', documentData.isApproved.toString());
        formData.append('isPremium', documentData.isPremium.toString());

        const response = await axiosInstance.post('/admin/documents', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error: any) {
        console.error('Lỗi khi tải lên tài liệu:', error);
        throw error.response?.data || { message: 'Lỗi không xác định khi tải lên tài liệu' };
    }
};

// Update an existing document
export const updateDocument = async (id: number | string, documentData: IDocumentUpdate) => {
    try {
        const formData = new FormData();
        if (documentData.title) formData.append('title', documentData.title);
        if (documentData.description) formData.append('description', documentData.description);
        if (documentData.authorId) formData.append('authorId', documentData.authorId.toString());
        if (documentData.publisherId) formData.append('publisherId', documentData.publisherId.toString());
        if (documentData.categoryId) formData.append('categoryId', documentData.categoryId.toString());
        if (documentData.file) formData.append('file', documentData.file);
        if (documentData.isApproved !== undefined) formData.append('isApproved', documentData.isApproved.toString());
        if (documentData.isPremium !== undefined) formData.append('isPremium', documentData.isPremium.toString());

        const response = await axiosInstance.put(`/admin/documents/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error: any) {
        console.error(`Lỗi khi cập nhật tài liệu #${id}:`, error);
        throw error.response?.data || { message: 'Lỗi không xác định khi cập nhật tài liệu' };
    }
};

// Delete a document
export const deleteDocument = async (id: number | string) => {
    try {
        const response = await axiosInstance.delete(`/admin/documents/${id}`);
        return response.data;
    } catch (error: any) {
        console.error(`Lỗi khi xóa tài liệu #${id}:`, error);
        throw error.response?.data || { message: 'Lỗi không xác định khi xóa tài liệu' };
    }
};

/**
 * @deprecated Sử dụng updateDocumentStatus thay thế
 * Hàm này được giữ lại để đảm bảo tương thích với code cũ
 */
export const toggleDocumentApproval = async (id: number | string) => {
    try {
        console.warn('toggleDocumentApproval is deprecated. Use updateDocumentStatus instead.');
        const response = await axiosInstance.put(`/admin/documents/${id}/approve`);
        return response.data;
    } catch (error: any) {
        console.error(`Lỗi khi thay đổi trạng thái phê duyệt tài liệu #${id}:`, error);
        throw error.response?.data || { message: 'Lỗi không xác định khi thay đổi trạng thái phê duyệt' };
    }
};

// Update document approval status (0=Pending, 1=Approved, 2=Rejected)
export const updateDocumentStatus = async (id: number | string, status: number) => {
    try {
        const statusData: IStatusUpdate = { status };
        const response = await axiosInstance.put(`/admin/documents/${id}/status`, statusData);
        return response.data;
    } catch (error: any) {
        console.error(`Lỗi khi cập nhật trạng thái tài liệu #${id}:`, error);
        throw error.response?.data || { message: 'Lỗi không xác định khi cập nhật trạng thái tài liệu' };
    }
};

// Toggle document premium status
export const toggleDocumentPremium = async (id: number | string) => {
    try {
        const response = await axiosInstance.put(`/admin/documents/${id}/toggle-premium`);
        return response.data;
    } catch (error: any) {
        console.error(`Lỗi khi thay đổi trạng thái premium tài liệu #${id}:`, error);
        throw error.response?.data || { message: 'Lỗi không xác định khi thay đổi trạng thái premium' };
    }
};

// Get document comments
export const getDocumentComments = async (documentId: number | string) => {
    try {
        const response = await axiosInstance.get(`/admin/documents/${documentId}/comments`);
        return response.data;
    } catch (error: any) {
        console.error(`Lỗi khi lấy bình luận cho tài liệu #${documentId}:`, error);
        throw error.response?.data || { message: 'Lỗi không xác định khi lấy bình luận' };
    }
};

// Delete a document comment
export const deleteComment = async (documentId: number | string, commentId: number | string) => {
    try {
        const response = await axiosInstance.delete(`/admin/documents/${documentId}/comments/${commentId}`);
        return response.data;
    } catch (error: any) {
        console.error(`Lỗi khi xóa bình luận #${commentId}:`, error);
        throw error.response?.data || { message: 'Lỗi không xác định khi xóa bình luận' };
    }
};
