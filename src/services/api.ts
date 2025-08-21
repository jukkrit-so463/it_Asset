import { jwtDecode } from "jwt-decode";

// 1. สร้าง Interface กลางสำหรับ Response ของ API ทั้งหมด
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Type สำหรับ decoded token
interface DecodedToken {
  userId: number;
  username: string;
  role: 'admin' | 'user';
  iat: number;
  exp: number;
}

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const fullUrl = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem('token');
    const headers = new Headers(options.headers);

    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    try {
      const response = await fetch(fullUrl, { ...options, headers });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || 'เกิดข้อผิดพลาดในการติดต่อกับเซิร์ฟเวอร์');
      }

      const responseText = await response.text();
      return responseText ? JSON.parse(responseText) : ({} as T);
    } catch (error) {
      console.error('API Service Error:', error);
      throw error;
    }
  }

  // Auth Methods
  async login(credentials: { username: string, password: string }): Promise<{ token: string }> {
    return this.request<{ token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }
  logout(): void { localStorage.removeItem('token'); }
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;
    try {
      const decoded: DecodedToken = jwtDecode(token);
      return decoded.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  // 2. แก้ไข Return Type ของฟังก์ชัน CRUD ทั้งหมดให้ใช้ ApiResponse
  // Users
  getUsers() { return this.request<ApiResponse<any[]>>('/users'); }
  createUser(userData: any) { return this.request('/users', { method: 'POST', body: JSON.stringify(userData) }); }
  updateUser(id: string, userData: any) { return this.request(`/users/${id}`, { method: 'PUT', body: JSON.stringify(userData) }); }
  deleteUser(id: string) { return this.request(`/users/${id}`, { method: 'DELETE' }); }

  // Locations
  getLocations() { return this.request<ApiResponse<any[]>>('/locations'); }
  createLocation(locationData: any) { return this.request('/locations', { method: 'POST', body: JSON.stringify(locationData) }); }
  updateLocation(id: string, locationData: any) { return this.request(`/locations/${id}`, { method: 'PUT', body: JSON.stringify(locationData) }); }
  deleteLocation(id: string) { return this.request(`/locations/${id}`, { method: 'DELETE' }); }

  // Assets
  getAssets() { return this.request<ApiResponse<any[]>>('/assets'); }
  createAsset(assetData: any) { return this.request('/assets', { method: 'POST', body: JSON.stringify(assetData) }); }
  updateAsset(id: string, assetData: any) { return this.request(`/assets/${id}`, { method: 'PUT', body: JSON.stringify(assetData) }); }
  deleteAsset(id: string) { return this.request(`/assets/${id}`, { method: 'DELETE' }); }
}

export const apiService = new ApiService();