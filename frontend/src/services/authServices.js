import API_BASE_URL from '../config/api';

const authService = {
  // Register user (mock implementation)
  async register(userData) {
    console.log('Registering user:', userData);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock successful response
    const mockUser = {
      id: '1',
      name: userData.name,
      email: userData.email,
      companyName: userData.companyName,
      createdAt: new Date().toISOString(),
    };
    
    // Store in localStorage for persistence (mock)
    localStorage.setItem('user', JSON.stringify(mockUser));
    localStorage.setItem('token', 'mock-jwt-token-for-sprint-1');
    
    return {
      user: mockUser,
      token: 'mock-jwt-token-for-sprint-1',
      message: 'Registration successful!',
    };
  },

  // Login (calls backend)
  async login(email, password) {
    console.log('[authService] login called', { apiUrl: `${API_BASE_URL}/auth/login`, email });
    try {
      const body = { email, password };
      console.log('[authService] sending request', body);
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      console.log('[authService] response status', res.status);
      const text = await res.text().catch(() => '');
      let data = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch (e) {
        console.warn('[authService] failed to parse response JSON', text);
      }

      console.log('[authService] response body', data);

      if (!res.ok) {
        // Throw similar structure to axios error so callers (AuthContext) can read err.response?.data?.message
        throw { response: { data: { message: data.message || 'Login failed', raw: text } } };
      }

      const { user, token, message } = data;

      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        console.log('[authService] stored user in localStorage', user);
      }
      if (token) {
        localStorage.setItem('token', token);
        console.log('[authService] stored token in localStorage', token ? `${token.substring(0, 10)}...` : token);
      }

      return { user, token, message };
    } catch (err) {
      console.error('[authService] login error', err);
      if (err.response?.data) throw err;
      // Handle network errors (Failed to fetch, CORS, etc.)
      const errorMessage = err.message === 'Failed to fetch' 
        ? 'Cannot connect to server. Please make sure the backend is running on http://localhost:5000'
        : err.message || 'Network error during login';
      throw { response: { data: { message: errorMessage } } };
    }
  },

  // Logout
  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  },

  // Get current user from localStorage
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // profile update
  async updateProfile(userData) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const updatedUser = {
      ...userData,
      updatedAt: new Date().toISOString(),
    };
    
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    return {
      user: updatedUser,
      message: 'Profile updated successfully!',
    };
  },
};

export default authService;