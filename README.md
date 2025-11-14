# Smartlead Outlook Add-in

An Outlook Web add-in that allows you to add email contacts as leads to your Smartlead campaigns directly from Outlook.

## Features

- Extract email contacts from Outlook messages
- View all your Smartlead campaigns
- Add contacts to campaigns with a single click
- Handles both new and existing leads
- Secure API key storage in browser localStorage

## Prerequisites

Before you begin, ensure you have:

- Node.js (v14 or higher) installed
- npm or yarn package manager
- A Smartlead account with API access
- Outlook Web (Office 365) or Outlook Desktop (Windows/Mac)

## Installation

### 1. Install Dependencies

```bash
cd smartlead-outlook-addin
npm install
```

### 2. Generate SSL Certificates

Outlook add-ins require HTTPS for development. Generate self-signed certificates:

```bash
npx office-addin-dev-certs install
```

This will create SSL certificates for localhost development.

### 3. Update Manifest

Before deploying, update the `manifest.xml` file:

1. Generate a new GUID for the `<Id>` field
2. Update `<ProviderName>` with your company name
3. For production, replace `https://localhost:3000` with your production URL

You can generate a GUID using:
```bash
npx office-addin-manifest generate-id
```

## Configuration

### Get Your Smartlead API Key

1. Log in to your Smartlead account
2. Navigate to Settings → API
3. Copy your API key

### Configure the Add-in

The add-in will prompt you to enter your API key the first time you use it. The key is stored securely in your browser's localStorage.

## Development

### Start the Development Server

```bash
npm start
```

This will:
- Start webpack dev server on `https://localhost:3000`
- Enable hot reloading for development
- Serve the add-in with SSL

### Sideload the Add-in

#### For Outlook Web:

1. Open Outlook Web (outlook.office.com)
2. Open any email message
3. Click the three dots (...) menu
4. Select "Get Add-ins"
5. Click "My add-ins" in the left sidebar
6. At the bottom, click "Add a custom add-in"
7. Select "Add from file"
8. Upload the `manifest.xml` file from your project
9. Click "Install"

The add-in should now appear in your Outlook ribbon when viewing messages.

#### For Outlook Desktop:

1. Open Outlook Desktop
2. Go to Insert → Get Add-ins
3. Click "My add-ins"
4. Under "Custom add-ins", click "Add a custom add-in"
5. Select "Add from file"
6. Browse to and select your `manifest.xml`
7. Click "OK"

### Testing the Add-in

1. Open any email in Outlook Web
2. Click the "Add to Smartlead" button in the ribbon
3. The task pane will open showing the sender's email
4. Select a campaign from the dropdown
5. Click "Add to Campaign"

## Building for Production

### 1. Update Manifest for Production

In `manifest.xml`, replace all instances of `https://localhost:3000` with your production URL.

### 2. Build the Project

```bash
npm run build
```

This creates optimized production files in the `dist/` directory.

### 3. Deploy

Deploy the contents of the `dist/` directory to your web server. Ensure:
- HTTPS is enabled
- All files are accessible
- CORS is configured if needed

### 4. Update Manifest URLs

Update all URLs in `manifest.xml` to point to your production server.

### 5. Distribute the Add-in

You can distribute your add-in by:

**Option 1: Internal Deployment**
- Share the manifest file with users
- Users sideload it as described above

**Option 2: Office Store**
- Submit to Microsoft AppSource
- Follow Microsoft's certification process
- Users can install from the Office Store

**Option 3: Centralized Deployment (for Organizations)**
- Use Microsoft 365 admin center
- Deploy to all users in your organization
- Requires admin privileges

## Project Structure

```
smartlead-outlook-addin/
├── assets/                     # Add-in icons
├── src/
│   ├── taskpane/
│   │   ├── components/
│   │   │   ├── App.tsx        # Main application component
│   │   │   └── Settings.tsx   # Settings/API key management
│   │   ├── taskpane.tsx       # Task pane entry point
│   │   ├── taskpane.html      # HTML template
│   │   └── taskpane.css       # Styles
│   ├── services/
│   │   └── smartlead.ts       # Smartlead API integration
│   └── types/
│       └── index.ts           # TypeScript type definitions
├── manifest.xml               # Add-in manifest
├── webpack.config.js          # Webpack configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Project dependencies
```

## How It Works

1. **Email Extraction**: When you open an email, the add-in uses Office.js APIs to extract the sender's email address and display name.

2. **Campaign Loading**: The add-in calls the Smartlead API to fetch all your active campaigns.

3. **Lead Addition**: When you select a campaign and click "Add to Campaign", the add-in:
   - Creates a lead object with the email and parsed name
   - Calls the Smartlead API to add the lead to the selected campaign
   - If the lead already exists, it will be updated

4. **API Integration**: All Smartlead API calls are made through the `SmartleadService` class, which handles authentication and error handling.

## Smartlead API Endpoints Used

- `GET /api/v1/campaigns` - Fetch all campaigns
- `POST /api/v1/campaigns/{id}/leads` - Add/update lead in campaign

## Security Considerations

### Current Implementation

The add-in currently stores the API key in browser localStorage. This is convenient for development but has security considerations:

- ✅ Keys are stored per-browser
- ⚠️ Keys are accessible via JavaScript
- ⚠️ Keys are not encrypted

### Recommended for Production

For production deployments, consider:

1. **Backend Proxy Server**
   - Create a backend service that handles Smartlead API calls
   - Store API keys securely on the server
   - Add authentication for your users
   - The add-in calls your backend instead of Smartlead directly

2. **User Authentication**
   - Implement OAuth or similar authentication
   - Each user has their own Smartlead API key
   - Keys are associated with user accounts

3. **Environment Variables**
   - For single-user/single-org deployments
   - Store API key in environment variables
   - Build-time injection into the app

## Troubleshooting

### Add-in Doesn't Appear

- Ensure you're using HTTPS (required for Office add-ins)
- Check that manifest.xml URLs match your dev server
- Verify the manifest is valid: `npm run validate`
- Clear Office cache and reload

### API Errors

- Verify your Smartlead API key is correct
- Check your Smartlead account has active campaigns
- Review browser console for detailed error messages
- Ensure your Smartlead plan includes API access

### Development Server Issues

- Ensure port 3000 is not in use
- Verify SSL certificates are installed
- Check firewall settings
- Try clearing webpack cache: `rm -rf dist/`

### CORS Errors

If you see CORS errors:
- Smartlead API should support CORS for browser requests
- For production, consider using a backend proxy
- Check network tab for detailed error messages

## Customization

### Adding Custom Fields

To add custom fields to leads:

1. Update the `SmartleadLead` interface in `src/types/index.ts`
2. Add form fields in `src/taskpane/components/App.tsx`
3. Include the fields in the lead object when calling `addLeadToCampaign`

### Styling

Modify `src/taskpane/taskpane.css` to customize the appearance. The add-in uses a clean, Office-inspired design.

### Additional Smartlead Features

The `SmartleadService` class can be extended to support more Smartlead API features:
- Get lead details
- Update lead information
- Remove leads from campaigns
- Track campaign analytics

## API Reference

### SmartleadService

```typescript
class SmartleadService {
  constructor(apiKey: string)

  // Get all campaigns
  async getCampaigns(): Promise<SmartleadCampaign[]>

  // Add or update a lead in a campaign
  async addLeadToCampaign(
    campaignId: number,
    lead: SmartleadLead
  ): Promise<boolean>

  // Check if a lead exists
  async checkLeadExists(email: string): Promise<boolean>
}
```

## Support

For issues with:
- **This add-in**: Contact developer@bettrhq.com or check the troubleshooting section above
- **Smartlead API**: Visit [Smartlead API Documentation](https://api.smartlead.ai/)
- **Office Add-ins**: Visit [Microsoft Office Add-ins Documentation](https://docs.microsoft.com/en-us/office/dev/add-ins/)

## About

This add-in is built and maintained by [Better Software](https://bettrhq.com), a product of Jalan Technology Consulting Private Limited.

For inquiries, contact: developer@bettrhq.com

## License

MIT

© 2025 Jalan Technology Consulting Private Limited. All rights reserved.

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Roadmap

Potential future enhancements:
- [ ] Bulk import multiple contacts
- [ ] Custom field mapping
- [ ] Campaign creation from Outlook
- [ ] Lead activity tracking
- [ ] Advanced filtering and search
- [ ] Support for Outlook mobile
- [ ] Teams integration
