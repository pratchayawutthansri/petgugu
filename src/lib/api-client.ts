import { ApiResponse } from '@/types';

class ApiClient {
  private baseUrl = '';

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    try {
      const res = await fetch(url, {
        ...options,
        headers,
      });

      const json = await res.json();
      return json;
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'Network request failed',
      };
    }
  }

  // Auth
  public async login(body: { email: string; password: string }) {
    return this.request<{ user: any; token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  public async signup(body: any) {
    return this.request<{ user: any; token: string }>('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  public async logout() {
    return this.request('/api/auth/logout', {
      method: 'POST',
    });
  }

  public async getMe() {
    return this.request<{ user: any }>('/api/auth/me', {
      method: 'GET',
    });
  }

  // Pets
  public async getPets() {
    return this.request<any[]>('/api/pets', { method: 'GET' });
  }

  public async getPet(id: string) {
    return this.request<any>(`/api/pets/${id}`, { method: 'GET' });
  }

  public async createPet(body: any) {
    return this.request<any>('/api/pets', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  public async updatePet(id: string, body: any) {
    return this.request<any>(`/api/pets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  public async deletePet(id: string) {
    return this.request<any>(`/api/pets/${id}`, {
      method: 'DELETE',
    });
  }

  public async getPetHistory(id: string, from?: string, to?: string) {
    const params = new URLSearchParams();
    if (from) params.set('from', from);
    if (to) params.set('to', to);
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request<any[]>(`/api/pets/${id}/history${query}`, { method: 'GET' });
  }

  // User
  public async getUser() {
    return this.request<any>('/api/user', { method: 'GET' });
  }

  public async updateUser(body: any) {
    return this.request<any>('/api/user', {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  // Public QR Profile
  public async getPublicPetProfile(qrId: string) {
    return this.request<any>(`/api/pet/${qrId}`, { method: 'GET' });
  }

  public async submitFoundReport(qrId: string, body: any) {
    return this.request<any>(`/api/pet/${qrId}/report`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  // IoT Telemetry
  public async postLocation(body: any) {
    return this.request<any>('/api/iot/location', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  public async postDeviceHeartbeat(body: any, deviceKey: string) {
    return this.request<any>('/api/iot/heartbeat', {
      method: 'POST',
      headers: { 'X-Device-Key': deviceKey },
      body: JSON.stringify(body),
    });
  }

  public async getDeviceConfig(deviceId: string, deviceKey: string) {
    return this.request<any>(`/api/iot/config?deviceId=${encodeURIComponent(deviceId)}`, {
      method: 'GET',
      headers: { 'X-Device-Key': deviceKey },
    });
  }
}

export const api = new ApiClient();
