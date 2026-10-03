import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

const api = axios.create({
  baseURL: BACKEND_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("bhoomi_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle blocked/deleted users
    if (error.response?.status === 401 || error.response?.status === 403) {
      const code = error.response?.data?.code;
      const message = error.response?.data?.message;

      if (code === "USER_BLOCKED") {
        // User blocked by admin
        sessionStorage.removeItem("bhoomi_user");
        sessionStorage.removeItem("bhoomi_token");
        alert(message || "🚫 Your account has been blocked by admin");
        window.location.href = "/login";
        return Promise.reject(error);
      }

      if (code === "USER_DELETED") {
        // User deleted by admin
        sessionStorage.removeItem("bhoomi_user");
        sessionStorage.removeItem("bhoomi_token");
        alert(message || "❌ Your account has been deleted by admin");
        window.location.href = "/login";
        return Promise.reject(error);
      }

      // Default 401 handling (token expired etc.)
      if (error.response?.status === 401) {
        sessionStorage.removeItem("bhoomi_user");
        sessionStorage.removeItem("bhoomi_token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// Land Records APIs
export const landRecordsAPI = {
  getAll: () => api.get("/api/land-records"),
  getById: (id) => api.get(`/api/land-records/${id}`),
  getStats: () => api.get("/api/land-records/stats"),
  getVillages: () => api.get("/api/land-records/villages"),
  getLandTypes: () => api.get("/api/land-records/land-types"),
  searchByVillage: (village) => api.get(`/api/land-records/search/village/${village}`),
  searchBySurveyNo: (surveyNo) => api.get(`/api/land-records/search/survey/${surveyNo}`),
  searchByLandType: (landType) => api.get(`/api/land-records/search/land-type/${landType}`),
};

// Prediction APIs
export const predictionAPI = {
  predict: (data) => api.post("/api/predictions/predict", data),
  getModelInfo: () => api.get("/api/predictions/model-info"),
  getValidValues: () => api.get("/api/predictions/valid-values"),
  getHealth: () => api.get("/api/predictions/health"),
};

// Document APIs
export const documentAPI = {
  getDocuments: (recordId) => api.get(`/api/documents/record/${recordId}`),
  getDocumentType: (recordId) => api.get(`/api/documents/type/${recordId}`),
  getSatbara: (recordId) => api.get(`/api/documents/satbara/${recordId}`),
  getEightA: (recordId) => api.get(`/api/documents/eight-a/${recordId}`),
  getPropertyCard: (recordId) => api.get(`/api/documents/property-card/${recordId}`),
};

// User Activity APIs
export const userActivityAPI = {
  addHistory: (userId, recordId) => api.post(`/api/user-activity/history/${userId}/${recordId}`),
  getMyLands: (userId) => api.get(`/api/user-activity/my-lands/${userId}`),
  addDownload: (data) => api.post("/api/user-activity/download", data),
  getDownloads: (userId) => api.get(`/api/user-activity/downloads/${userId}`),
  addPrediction: (data) => api.post("/api/user-activity/prediction", data),
  getPredictions: (userId) => api.get(`/api/user-activity/predictions/${userId}`),
  getDashboardStats: (userId) => api.get(`/api/user-activity/dashboard-stats/${userId}`),
};

// Auth Additional APIs
export const authAPI = {
  changePassword: (data) => api.post("/api/auth/change-password", data),
  updateProfile: (data) => api.post("/api/auth/update-profile", data),
};

// ✅ ADMIN APIs (UPDATED)
export const adminAPI = {
  // Dashboard
  getDashboardStats: () => api.get("/api/admin/dashboard-stats"),
  
  // Land Records CRUD
  getAllLandRecords: () => api.get("/api/admin/land-records"),
  createLandRecord: (data) => api.post("/api/admin/land-records", data),
  updateLandRecord: (id, data) => api.put(`/api/admin/land-records/${id}`, data),
  deleteLandRecord: (id) => api.delete(`/api/admin/land-records/${id}`),
  
  // Satbara CRUD
  getAllSatbara: () => api.get("/api/admin/satbara"),
  generateSatbara: (recordId, data) => api.post(`/api/admin/satbara/generate/${recordId}`, data),
  deleteSatbara: (id) => api.delete(`/api/admin/satbara/${id}`),
  
  // 8A CRUD
  getAllEightA: () => api.get("/api/admin/eight-a"),
  generateEightA: (recordId, data) => api.post(`/api/admin/eight-a/generate/${recordId}`, data),
  deleteEightA: (id) => api.delete(`/api/admin/eight-a/${id}`),
  
  // Property Cards CRUD
  getAllPropertyCards: () => api.get("/api/admin/property-cards"),
  generatePropertyCard: (recordId, data) => api.post(`/api/admin/property-cards/generate/${recordId}`, data),
  deletePropertyCard: (id) => api.delete(`/api/admin/property-cards/${id}`),
  
  // Users - UPDATED
  getAllUsers: () => api.get("/api/admin/users"),
  blockUser: (userId) => api.put(`/api/admin/users/${userId}/block`),
  unblockUser: (userId) => api.put(`/api/admin/users/${userId}/unblock`),
  deleteUser: (userId) => api.delete(`/api/admin/users/${userId}`),
  
  // Settings
  updateAdminSettings: (userId, data) => api.put(`/api/admin/settings/${userId}`, data),
getActivities: () => api.get("/api/admin/activities"),
};

// ✅ NOTIFICATION APIs
export const notificationAPI = {
  getAll: (userId) => api.get(`/api/notifications/${userId}`),
  getUnreadCount: (userId) => api.get(`/api/notifications/${userId}/unread-count`),
  markAsRead: (id) => api.put(`/api/notifications/${id}/read`),
  markAllAsRead: (userId) => api.put(`/api/notifications/${userId}/read-all`),
  delete: (id) => api.delete(`/api/notifications/${id}`),
};

// ✅ CONTACT APIs
export const contactAPI = {
  send: (data) => api.post("/api/contact", data),
  getAllAdmin: () => api.get("/api/contact/admin/all"),
  getUnreadCount: () => api.get("/api/contact/admin/unread-count"),
  markAsRead: (id) => api.put(`/api/contact/admin/${id}/mark-read`),
  reply: (id, replyText) => api.put(`/api/contact/admin/${id}/reply`, { reply: replyText }),
  markResolved: (id) => api.put(`/api/contact/admin/${id}/resolve`),
  delete: (id) => api.delete(`/api/contact/admin/${id}`),
};

export default api;