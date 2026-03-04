// ============================================
// ENVIRONMENT CONFIGURATION
// ============================================

export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  appName: 'Smart City Governance Portal',
  version: '1.0.0',
  features: {
    enableNotifications: true,
    enableAnalytics: true,
    enableChat: false
  },
  api: {
    timeout: 30000,
    retryAttempts: 3
  }
};
