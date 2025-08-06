# Finance Dashboard Configuration Management

## Overview
This project now uses a centralized configuration system to manage common settings across all dashboard pages. This eliminates code duplication and makes maintenance much easier.

## Configuration File: `config.js`

All shared settings are now stored in `config.js` including:
- **File Access Settings**: Owner email, file names, alternative file names
- **Authentication Settings**: MSAL configuration, scopes, state keys
- **Sheet Names**: Different sheet names for each dashboard page
- **Button Text**: Standardized button labels and status messages
- **API Configuration**: Graph API endpoints and base URLs

## Benefits

### ✅ **Single Source of Truth**
- All configuration in one place (`config.js`)
- No more hunting through multiple files to update settings

### ✅ **Easy Maintenance**
- Change file name or owner email in **one place** instead of 3+ files
- Add new dashboard pages with minimal configuration

### ✅ **Consistent Behavior**
- All pages use the same authentication flow
- Standardized error messages and button text

### ✅ **Reduced Errors**
- No risk of forgetting to update a file
- Type-safe configuration access through utility functions

## Usage Examples

### Changing File Owner or File Name
```javascript
// In config.js - change once, affects all pages
fileConfig: {
  ownerEmail: "newowner@company.com",  // ← Change here
  fileName: "New Data File.xlsm",      // ← Change here
  alternativeFileNames: [
    "New Data File.xlsm",
    "New Data File.xlsx", 
    "New Data File.xls"
  ]
}
```

### Adding a New Dashboard Page
```javascript
// In config.js - add new sheet name
sheetNames: {
  dashboard: "EXPORT_SALES",
  softexBrc: "Softex_Brc", 
  writeOff: "WRITE-OFF",
  newPage: "NEW_SHEET_NAME"  // ← Add here
}

// In your new HTML file
const sheetName = config.getSheetName('newPage');
```

### Updating Authentication Settings
```javascript
// In config.js - change once, affects all pages
msalConfig: {
  auth: {
    clientId: "new-client-id",           // ← Change here
    authority: "new-authority-url",      // ← Change here
    redirectUri: window.location.origin + window.location.pathname
  }
}
```

## File Structure

```
Finance Dashboard/
├── config.js           # ← Centralized configuration
├── dashboard.html       # ← Updated to use config.js
├── softex-brc.html     # ← Updated to use config.js
├── write-off.html      # ← Updated to use config.js
└── README.md           # ← This file
```

## How Pages Access Configuration

Each page includes the configuration and accesses it through utility functions:

```html
<!-- Include configuration -->
<script src="config.js"></script>

<script>
// Access configuration through utility functions
const config = window.FinanceDashboardConfig;
const fileName = config.getPrimaryFileName();        // "Sample Data.xlsm"
const ownerEmail = config.getOwnerEmail();           // "bkoya@evoketechnologies.com"
const sheetName = config.getSheetName('dashboard');  // "EXPORT_SALES"
const buttonText = config.buttonText;               // All button labels
</script>
```

## Migration Summary

### Before (Duplicated Configuration)
```javascript
// In dashboard.html
const FILEOWNER_EMAIL = "bkoya@evoketechnologies.com";
const FILE_NAME = "Sample Data.xlsm";

// In softex-brc.html  
const targetFileName = 'Sample Data.xlsm';

// In write-off.html
const FILEOWNER_EMAIL = "bkoya@evoketechnologies.com";
const TARGET_FILE_NAME = 'Sample Data.xlsm';
```

### After (Centralized Configuration)
```javascript
// In config.js (ONE PLACE)
fileConfig: {
  ownerEmail: "bkoya@evoketechnologies.com",
  fileName: "Sample Data.xlsm",
  alternativeFileNames: ["Sample Data.xlsm", "Sample Data.xlsx", "Sample Data.xls"]
}

// In all HTML files
const fileName = config.getPrimaryFileName();
const ownerEmail = config.getOwnerEmail();
```

## Debug Features

The configuration includes debug settings that can be enabled/disabled:

```javascript
debug: {
  enabled: true,        // Set to false in production
  logLevel: 'info'      // 'debug', 'info', 'warn', 'error'
}
```

When debug is enabled, you'll see configuration load logs in the browser console.

## Next Steps

1. **Test all pages** to ensure they work with the new configuration
2. **Add more settings** to the configuration as needed
3. **Consider environment-specific configs** (dev/staging/production)
4. **Document any new configuration options** added in the future

---

**Result**: Changing the file name or owner email now requires updating **ONE file** instead of **3+ files**! 🎉
