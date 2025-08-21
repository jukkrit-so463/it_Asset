const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem('token');
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, { ...options, headers });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  }

  // Auth
  async login(username: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  async getProfile() {
    return this.request('/auth/profile');
  }

  // Assets
  async getAssets() {
    return this.request('/assets');
  }

  async getAsset(id: string) {
    return this.request(`/assets/${id}`);
  }

  async createAsset(assetData: any) {
    return this.request('/assets', {
      method: 'POST',
      body: JSON.stringify(assetData),
    });
  }

  async updateAsset(id: string, assetData: any) {
    return this.request(`/assets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(assetData),
    });
  }

  async deleteAsset(id: string) {
    return this.request(`/assets/${id}`, {
      method: 'DELETE',
    });
  }

  // Users
  async getUsers() {
    return this.request('/users');
  }

  async createUser(userData: any) {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Locations
  async getLocations() {
    return this.request('/locations');
  }

  async createLocation(locationData: any) {
    return this.request('/locations', {
      method: 'POST',
      body: JSON.stringify(locationData),
    });
  }

  // Dashboard
  async getDashboardStats() {
    return this.request('/dashboard/stats');
  }

  async getDashboardCharts() {
    return this.request('/dashboard/charts');
  }

  // Reports
  async getAssetsSummary(params?: any) {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.request(`/reports/assets-summary${queryString}`);
  }
}

export const apiService = new ApiService(API_BASE_URL);
