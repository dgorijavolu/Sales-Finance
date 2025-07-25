# OneDrive File Sharing Setup for Organization

## Step-by-Step Guide to Enable Organizational Access

### Method 1: Using OneDrive Share Link (RECOMMENDED)

#### Step 1: Share Your File (Choose Your Access Level)

**Option A: Specific People Only (MOST SECURE)**
1. Go to OneDrive web interface: [https://onedrive.live.com](https://onedrive.live.com)
2. Navigate to your `Final 1.xlsx` file
3. Right-click the file → Select "Share"
4. In the share dialog:
   - Click "Specific people" (not "People in organization")
   - Enter email addresses of authorized users (e.g., manager@evoke.com, finance@evoke.com)
   - Set permissions to "Can view" (read-only)
   - Uncheck "Allow editing"
   - Click "Send" or "Copy link"

**Option B: Everyone in Organization (LESS SECURE)**
1. Go to OneDrive web interface: [https://onedrive.live.com](https://onedrive.live.com)
2. Navigate to your `Final 1.xlsx` file
3. Right-click the file → Select "Share"
4. In the share dialog:
   - Set permissions to **"People in Evoke Technologies Private Limited can view"**
   - Make sure "Allow editing" is **UNCHECKED** (read-only access)
   - Click "Apply"
5. Copy the generated share link

#### Step 2: Get File ID from Share Link
**Option A: Using Microsoft Graph Explorer**
1. Go to [Microsoft Graph Explorer](https://developer.microsoft.com/en-us/graph/graph-explorer)
2. Sign in with your organizational account
3. Run this query to find your file:
   ```
   GET https://graph.microsoft.com/v1.0/me/drive/root/search(q='Final 1.xlsx')
   ```
4. Look for your file in the results and copy the `"id"` field

**Option B: Using Direct File Path**
1. In Microsoft Graph Explorer, try:
   ```
   GET https://graph.microsoft.com/v1.0/me/drive/root:/Desktop/Final%201.xlsx
   ```
2. If successful, copy the `"id"` field from the response

#### Step 3: Update Your Code
1. Open `index.html`
2. Find the line: `const fileId = "YOUR_FILE_ID_HERE";`
3. Replace `"YOUR_FILE_ID_HERE"` with the actual file ID you copied
4. Save the file

### Method 2: Application-Level Access Control

If you want to control who can access the application itself (not just the file), you have these options:

#### Option A: Azure AD Group-Based Access
1. **Create a Security Group in Azure AD**:
   - Go to Azure Portal → Azure Active Directory → Groups
   - Create new group (e.g., "Finance Dashboard Users")
   - Add specific users to this group

2. **Update Application Registration**:
   - In Azure Portal → App Registrations → Your App
   - Go to "Authentication" → "Supported account types"
   - Choose "Accounts in this organizational directory only"
   - Add group claims in "Token configuration"

3. **Add Group Check in Your Code**:
   ```javascript
   // Add this to your signIn function
   async function signIn() {
     try {
       const loginResponse = await msalInstance.loginPopup({
         scopes: ["Files.Read", "Sites.Read.All", "GroupMember.Read.All"],
         prompt: "select_account"
       });

       // Check if user is in authorized group
       const isAuthorized = await checkUserAuthorization(loginResponse.accessToken);
       if (!isAuthorized) {
         alert("Access denied. You are not authorized to use this application.");
         return;
       }

       // Continue with normal flow...
     } catch (error) {
       console.error("Sign-in error:", error);
     }
   }

   async function checkUserAuthorization(accessToken) {
     try {
       // Get user's group memberships
       const response = await fetch('https://graph.microsoft.com/v1.0/me/memberOf', {
         headers: { Authorization: `Bearer ${accessToken}` }
       });
       
       const data = await response.json();
       const authorizedGroupId = "YOUR_GROUP_ID_HERE"; // Replace with actual group ID
       
       return data.value.some(group => group.id === authorizedGroupId);
     } catch (error) {
       console.error("Authorization check failed:", error);
       return false;
     }
   }
   ```

#### Option B: Email-Based Access Control (Simple)
```javascript
// Add this to your signIn function
const AUTHORIZED_USERS = [
  "user1@evoke.com",
  "user2@evoke.com", 
  "manager@evoke.com",
  "finance.team@evoke.com"
];

async function signIn() {
  try {
    const loginResponse = await msalInstance.loginPopup({
      scopes: ["Files.Read", "Sites.Read.All"],
      prompt: "select_account"
    });

    // Check if user email is authorized
    const userEmail = loginResponse.account.username;
    if (!AUTHORIZED_USERS.includes(userEmail)) {
      alert(`Access denied. Your email (${userEmail}) is not authorized to use this application.`);
      return;
    }

    // Continue with normal flow...
  } catch (error) {
    console.error("Sign-in error:", error);
  }
}
```

#### Option C: Role-Based Access (Advanced)
```javascript
// Define roles and permissions
const USER_ROLES = {
  "manager@evoke.com": "admin",
  "finance1@evoke.com": "viewer", 
  "finance2@evoke.com": "viewer",
  "ceo@evoke.com": "admin"
};

async function signIn() {
  try {
    const loginResponse = await msalInstance.loginPopup({
      scopes: ["Files.Read", "Sites.Read.All"],
      prompt: "select_account"
    });

    const userEmail = loginResponse.account.username;
    const userRole = USER_ROLES[userEmail];

    if (!userRole) {
      alert(`Access denied. You are not authorized to use this application.`);
      return;
    }

    // Set UI based on role
    if (userRole === "viewer") {
      // Hide admin features, show read-only view
      document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'none');
    }

    // Continue with normal flow...
  } catch (error) {
    console.error("Sign-in error:", error);
  }
}
```

### Method 3: SharePoint with Restricted Access (RECOMMENDED FOR ENTERPRISE)

SharePoint offers the best enterprise-level security with granular permissions:

#### Step 1: Create a SharePoint Site or Library
1. **Create a new SharePoint site** or use existing one
2. **Create a document library** called "Finance Dashboards" 
3. **Upload your Excel file** to this library

#### Step 2: Set Library Permissions
1. Go to Library Settings → Permissions
2. **Remove "Everyone" or organization-wide access**
3. **Add specific users/groups**:
   - Finance Team (Read access)
   - Manager (Full control)
   - Dashboard Users (Read access)

#### Step 3: Get SharePoint File Information
1. In Microsoft Graph Explorer:
   ```
   GET https://graph.microsoft.com/v1.0/sites?search=evoke
   ```
2. Find your site and copy the `"id"`

3. Get drive information:
   ```
   GET https://graph.microsoft.com/v1.0/sites/{site-id}/drives
   ```

4. Get file information:
   ```
   GET https://graph.microsoft.com/v1.0/sites/{site-id}/drives/{drive-id}/root:/Final%201.xlsx
   ```

#### Step 4: Update Your Code for SharePoint
```javascript
// Use SharePoint approach in your loadDataFromOneDrive function
const siteId = "YOUR_SITE_ID";
const driveId = "YOUR_DRIVE_ID"; 
const fileName = "Final 1.xlsx";
const apiUrl = `https://graph.microsoft.com/v1.0/sites/${siteId}/drives/${driveId}/root:/${fileName}:/content`;
```

### Method 4: Troubleshooting File Not Found

If you're getting "file not found" errors, try these diagnostic steps:

#### Check File Location
```
GET https://graph.microsoft.com/v1.0/me/drive/root/children
```
This shows all files/folders in your OneDrive root.

#### Search for the File
```
GET https://graph.microsoft.com/v1.0/me/drive/root/search(q='xlsx')
```
This searches for all Excel files in your OneDrive.

#### Check Permissions
```
GET https://graph.microsoft.com/v1.0/me/drive/root:/Desktop/Final%201.xlsx:/permissions
```
This shows who has access to your file.

### Final Code Update

Once you have the file ID, your code should look like this:

```javascript
// ACTIVE: Shared OneDrive file (works for everyone in organization)
const fileId = "01ABCDEF123456789"; // Your actual file ID here
const apiUrl = `https://graph.microsoft.com/v1.0/me/drive/items/${fileId}/content`;
```

### Testing the Solution

1. **Test with yourself first**: Make sure the file ID works when you access it
2. **Test with a colleague**: Ask someone else in your organization to test the application
3. **Verify permissions**: Ensure the file sharing permissions are set correctly

### Security Recommendations by Use Case

| Use Case | Recommended Method | Security Level |
|----------|-------------------|----------------|
| **Small team (2-5 people)** | OneDrive with specific email sharing + Email-based access control | High |
| **Department (5-20 people)** | Azure AD Group + OneDrive file sharing | Very High |
| **Multiple departments** | SharePoint with library permissions | Enterprise |
| **External partners** | SharePoint with guest access | Controlled |

### Common Issues and Solutions

| Issue | Solution |
|-------|----------|
| "Access denied" for authorized users | Check file sharing permissions and user email spelling |
| File not found (404) | Verify file path, sharing settings, and Graph API permissions |
| User not in authorized list | Add user email to AUTHORIZED_USERS array or Azure AD group |
| Authentication failed | Check Azure AD app registration and redirect URIs |
| SharePoint access denied | Verify site permissions and user access to SharePoint |

### Implementation Priority

1. **Start with**: OneDrive + Email-based access control (easiest)
2. **Upgrade to**: Azure AD Group-based access (more scalable)  
3. **Enterprise**: SharePoint with library permissions (most secure)

### Testing Your Restricted Access

1. **Test with authorized user**: Ensure they can access both app and file
2. **Test with unauthorized user**: Verify they get "Access denied" message
3. **Test permission changes**: Add/remove users and verify changes take effect
4. **Test different scenarios**: Different roles, expired sessions, etc.

### Important Notes

- **File ID is permanent**: Once you get the file ID, it won't change unless you delete and recreate the file
- **Permissions matter**: Make sure file is shared with "People in your organization"
- **Read-only access**: For security, keep the file as read-only for dashboard users
- **Backup approach**: Keep the personal OneDrive code commented out as a fallback

### Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify your Azure AD app registration permissions
3. Test the Graph API calls in Microsoft Graph Explorer first
4. Ensure your organization allows OneDrive file sharing
