import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Determine a sensible BASE_URL depending on environment so the app works
// on web, emulator and physical device during local development.
function resolveBaseUrl() {
  // If running in a web browser (Expo web or React Native Web), use window.location
  if (typeof window !== 'undefined' && window.location && window.location.hostname) {
    const host = window.location.hostname;
    const protocol = window.location.protocol;
    return `${protocol}//${host}:3000/api`;
  }

  // If Expo provides debuggerHost (metro), extract IP portion: e.g. "192.168.1.10:8081"
  const debuggerHost = (Constants as any).manifest?.debuggerHost || (Constants as any).expoConfig?.extra?.debuggerHost;
  if (debuggerHost && typeof debuggerHost === 'string') {
    const ip = debuggerHost.split(':')[0];
    return `http://${ip}:3000/api`;
  }

  // Android emulator (classic) uses 10.0.2.2 to reach host machine
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000/api';
  }

  // Default to localhost for iOS simulator and general fallback
  return 'http://localhost:3000/api';
}

// Production fallback (keeps previous production URL if desired)
const PROD_URL = 'https://api-od.csepsnacet.in/api';
const BASE_URL = process.env.NODE_ENV === 'production' ? PROD_URL : resolveBaseUrl();

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to all requests if available
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (email: string, password: string, pushToken?: string) => {
  try {
    const payload = { email, password };
    
    // Add push token to payload if available
    if (pushToken) {
      Object.assign(payload, { pushToken });
    }
    
    const response = await api.post('/auth/login', payload);
    if (response.data?.token) {
      await AsyncStorage.setItem('token', response.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

export const forgotPassword = async (email: string) => {
  try {
    const response = await api.post('/auth/forgotPassword', { email });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to process request');
  }
};

export const verifyForgotPassword = async (email: string, otp: string) => {
  try {
    const response = await api.post('/auth/verifyForgotPassword', { email, otp });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to verify OTP');
  }
};

export const resetPassword = async (email: string, otp: string, password: string) => {
  try {
    const response = await api.post('/auth/resetPassword', { email, otp, password });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to reset password');
  }
};

export const changePassword = async (oldPassword: string, newPassword: string) => {
  try {
    const response = await api.post('/auth/changePassword', { oldPassword, newPassword });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to change password');
  }
};

export const verifyEmail = async (email: string, otp: string) => {
  try {
    const response = await api.post('/auth/verifyEmail', { email, otp });
    if (response.data?.token) {
      await AsyncStorage.setItem('token', response.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error: any) {
    // console.log(error)
    throw new Error(error.response?.data?.message || 'Failed to verify email');
  }
};

export const logout = async () => {
  try {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    return true;
  } catch (error) {
    return false;
  }
};

export const getCurrentUser = async () => {
  try {
    const userStr = await AsyncStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const isAuthenticated = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    return !!token;
  } catch (error) {
    return false;
  }
};

export const updatePushToken = async (pushToken: string) => {
  try {
    const response = await api.post('/auth/user/push-token', { pushToken });
    return response.data;
  } catch (error: any) {
    console.error('Error updating push token:', error);
    throw new Error(error.response?.data?.message || 'Failed to update push token');
  }
}; 