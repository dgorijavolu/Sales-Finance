// Global Configuration for Finance Dashboard Application
// This file contains shared settings used across all dashboard pages

window.FinanceDashboardConfig = {
  // Microsoft Graph API Authentication Configuration
  msalConfig: {
    auth: {
      clientId: "57343fc8-1f4e-40ab-87f4-3f86782b469a", 
      authority: "https://login.microsoftonline.com/e1c5d9ee-a951-451e-8432-642c23d40071", 
      redirectUri: window.location.origin + window.location.pathname
    },
    cache: {
      cacheLocation: "localStorage",
      storeAuthStateInCookie: false
    }
  },

  // File Access Configuration
  fileConfig: {
    ownerEmail: "bkoya@evoketechnologies.com", // Email of the file owner
    fileName: "TGD_Reference.xlsm", // Primary file name to search for
    alternativeFileNames: [
      "TGD_Reference.xlsm",  // Include primary name in alternatives
      "TGD_Reference.xlsx",
      "TGD_Reference.xls"
    ]
  },

  // Sheet Names for Different Pages
  sheetNames: {
    dashboard: "EXPORT_SALES",
    softexBrc: "Softex_Brc", 
    writeOff: "WRITE-OFF",
    orBranch: "OR Branch",           // For OR Branch page
    orSubsidiaries: "OR Entities",   // For OR Subsidiaries page
    irm: "EXP_REA"                   // For IRM page
  },

  // Authentication State Configuration
  authConfig: {
    stateKey: 'finance_dashboard_auth_state',
    tokenExpiryHours: 24, // Token expires after 24 hours
    requiredScopes: ['User.Read', 'Files.Read', 'Files.Read.All', 'Sites.Read.All']
  },

  // Button Text Constants
  buttonText: {
    GET_DATA: 'Get Data',
    REFRESH: 'Refresh', 
    SIGNING_IN: 'Signing in...',
    LOADING_DATA: 'Loading Data...',
    SIGN_IN: 'Sign In',
    SIGN_OUT: 'Sign Out'
  },

  // Status Messages
  statusMessages: {
    SIGNING_IN: 'Signing in...',
    LOADING_DATA: 'Loading data...',
    SIGN_IN_SUCCESS: 'Signed in successfully! Data loaded.',
    SIGN_OUT_SUCCESS: 'Signed out successfully.',
    DATA_LOADED: 'Data loaded successfully',
    FILE_NOT_FOUND: 'Excel file not found/You do not have access to it',
    AUTHENTICATION_REQUIRED: 'Not authenticated'
  },

  // API Configuration
  apiConfig: {
    graphBaseUrl: 'https://graph.microsoft.com/v1.0',
    endpoints: {
      userInfo: '/me',
      sharedItems: '/me/drive/sharedWithMe',
      userDriveSearch: '/me/drive/root/search',
      driveItemContent: '/me/drive/items/{itemId}/content'
    }
  },

  // Error Messages
  errorMessages: {
    fileNotFound: (fileName, ownerEmail) => 
      `File '${fileName}' not found. Please ensure:\n` +
      `1. File exists in ${ownerEmail}'s OneDrive\n` +
      `2. File is shared with your account\n` +
      `3. You have appropriate permissions\n` +
      `4. File name is correct\n\n` +
      `Check browser console for detailed logs.`,
    
    sheetNotFound: (sheetName, availableSheets) =>
      `Sheet '${sheetName}' not found in the Excel file. Available sheets: ${availableSheets.join(', ')}`,
    
    authenticationFailed: 'Authentication failed. Please try signing in again.',
    
    tokenExpired: 'Your session has expired. Please sign in again.'
  },

  // Debug Configuration
  debug: {
    enabled: true, // Set to false in production
    logLevel: 'info' // 'debug', 'info', 'warn', 'error'
  }
};

// Utility functions for configuration access
window.FinanceDashboardConfig.getSheetName = function(pageName) {
  return this.sheetNames[pageName] || this.sheetNames.dashboard;
};

window.FinanceDashboardConfig.getFileSearchNames = function() {
  return this.fileConfig.alternativeFileNames;
};

window.FinanceDashboardConfig.getOwnerEmail = function() {
  return this.fileConfig.ownerEmail;
};

window.FinanceDashboardConfig.getPrimaryFileName = function() {
  return this.fileConfig.fileName;
};

window.FinanceDashboardConfig.getMsalConfig = function() {
  return this.msalConfig;
};

window.FinanceDashboardConfig.getAuthConfig = function() {
  return {
    authStateKey: this.authConfig.stateKey,
    tokenExpiryHours: this.authConfig.tokenExpiryHours,
    requiredScopes: this.authConfig.requiredScopes
  };
};

window.FinanceDashboardConfig.getButtonText = function() {
  return this.buttonText;
};

window.FinanceDashboardConfig.getFileConfig = function() {
  return {
    fileName: this.fileConfig.fileName,
    alternativeNames: this.fileConfig.alternativeFileNames,
    fileOwnerEmail: this.fileConfig.ownerEmail
  };
};

// Log configuration load
if (window.FinanceDashboardConfig.debug.enabled) {
  console.log('Finance Dashboard Configuration loaded:', {
    owner: window.FinanceDashboardConfig.fileConfig.ownerEmail,
    primaryFile: window.FinanceDashboardConfig.fileConfig.fileName,
    sheets: Object.keys(window.FinanceDashboardConfig.sheetNames)
  });
}
