import { ApiResponse } from '@/types';

class ApiClient {
  private baseUrl = '';

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    timeoutMs = 15000
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const controller = new AbortController();
    const externalSignal = options.signal;
    const onExternalAbort = () => controller.abort();
    if (externalSignal) {
      if (externalSignal.aborted) {
        return { success: false, error: 'Request aborted' };
      }
      externalSignal.addEventListener('abort', onExternalAbort, { once: true });
    }

    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const res = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        return {
          success: false,
          error: res.ok ? 'Invalid server response' : `HTTP ${res.status}`,
        };
      }

      const json = await res.json();
      return json;
    } catch (err: any) {
      if (err?.name === 'AbortError') {
        return {
          success: false,
          error: externalSignal?.aborted ? 'Request aborted' : 'การเชื่อมต่อใช้เวลานานเกินไป กรุณาลองใหม่',
        };
      }
      return {
        success: false,
        error: err.message || 'Network request failed',
      };
    } finally {
      clearTimeout(timeoutId);
      if (externalSignal) {
        externalSignal.removeEventListener('abort', onExternalAbort);
      }
    }
  }

  // Auth
  public async login(body: { email?: string; identifier?: string; password: string }) {
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
  public async getPets(signal?: AbortSignal) {
    return this.request<any[]>('/api/pets', { method: 'GET', signal });
  }

  public async getPet(id: string, signal?: AbortSignal) {
    return this.request<any>(`/api/pets/${id}`, { method: 'GET', signal });
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

  public async getPetHistory(id: string, from?: string, to?: string, signal?: AbortSignal) {
    const params = new URLSearchParams();
    if (from) params.set('from', from);
    if (to) params.set('to', to);
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request<any[]>(`/api/pets/${id}/history${query}`, { method: 'GET', signal });
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
