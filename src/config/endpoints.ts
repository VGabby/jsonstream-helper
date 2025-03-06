
/**
 * Configuration file for API endpoints
 * This file centralizes all endpoint URLs used in the application
 */

// Environment types
export type Environment = 'production' | 'development' | 'staging';

// Base URLs for different environments
export const BASE_URLS: Record<Environment, string> = {
  production: 'http://production.aiprop.xyz',
  development: 'http://develop.aiprop.xyz',
  staging: 'http://staging.aiprop.xyz',
};

// Current environment - can be set based on deployment or local configuration
// Default to development for local development
export const CURRENT_ENVIRONMENT: Environment = 
  (import.meta.env.VITE_ENVIRONMENT as Environment) || 'development';

// Get the current base URL based on environment
export const getBaseUrl = (): string => {
  return BASE_URLS[CURRENT_ENVIRONMENT];
};

// API endpoint paths (to be appended to base URL)
export const API_ENDPOINTS = {
  users: '/api/users',
  products: '/api/products',
  analytics: '/api/analytics',
  orders: '/api/orders',
};

// Function to get the full URL for a specific endpoint
export const getEndpointUrl = (endpoint: keyof typeof API_ENDPOINTS): string => {
  return `${getBaseUrl()}${API_ENDPOINTS[endpoint]}`;
};

// For testing purposes - get all environment URLs for a specific endpoint
export const getAllEnvironmentUrls = (endpoint: keyof typeof API_ENDPOINTS): Record<Environment, string> => {
  const urls: Record<Environment, string> = {} as Record<Environment, string>;
  
  Object.keys(BASE_URLS).forEach((env) => {
    const environment = env as Environment;
    urls[environment] = `${BASE_URLS[environment]}${API_ENDPOINTS[endpoint]}`;
  });
  
  return urls;
};
