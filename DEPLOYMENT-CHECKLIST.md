# Deployment Checklist

Use this checklist to deploy your Smartlead Outlook add-in.

## Pre-Deployment

### Icons
- [ ] Create icon-16.png (16x16 pixels)
- [ ] Create icon-32.png (32x32 pixels)
- [ ] Create icon-64.png (64x64 pixels)
- [ ] Create icon-80.png (80x80 pixels)
- [ ] Place all icons in the `/assets` folder

**Icon Design Tips:**
- Use your company logo or a simple "S" for Smartlead
- Keep it simple and recognizable at small sizes
- Use transparent background (PNG format)
- Match your brand colors

### Manifest Configuration
- [ ] Generate a unique GUID for `<Id>` field
  ```bash
  npx office-addin-manifest generate-id
  ```
- [ ] Update `<ProviderName>` with your company name
- [ ] Update `<SupportUrl>` with your support page URL
- [ ] Verify `<DisplayName>` and `<Description>`

### Development Testing
- [ ] Test in Outlook Web (outlook.office.com)
- [ ] Test email extraction with various senders
- [ ] Test campaign loading
- [ ] Test adding leads to campaigns
- [ ] Test with existing leads
- [ ] Test error handling (invalid API key, no campaigns, etc.)
- [ ] Test Settings screen
- [ ] Validate manifest: `npm run validate`

## Production Deployment

### Option 1: Development/Testing (localhost)

**Quick setup for testing:**

1. [ ] Install SSL certificates:
   ```bash
   npx office-addin-dev-certs install
   ```

2. [ ] Start dev server:
   ```bash
   npm start
   ```

3. [ ] Sideload in Outlook Web (see QUICKSTART.md)

4. [ ] Test functionality

### Option 2: Web Server Deployment

**For internal company use:**

1. [ ] Build production files:
   ```bash
   npm run build
   ```

2. [ ] Update manifest.xml URLs:
   - Replace `https://localhost:3000` with your server URL
   - Example: `https://addins.yourcompany.com/smartlead`

3. [ ] Deploy `dist/` folder to your web server
   - Ensure HTTPS is enabled
   - Ensure all files are accessible
   - Test by visiting: `https://yourserver.com/taskpane.html`

4. [ ] Test manifest validation:
   ```bash
   npm run validate
   ```

5. [ ] Distribute manifest.xml to users
   - Users sideload via Outlook Web
   - Or use centralized deployment (see below)

### Option 3: Centralized Deployment (Microsoft 365 Admin)

**For organization-wide deployment:**

1. [ ] Complete Option 2 (web server deployment)

2. [ ] Access Microsoft 365 Admin Center
   - Go to https://admin.microsoft.com
   - Navigate to Settings → Integrated apps

3. [ ] Upload custom add-in
   - Click "Upload custom apps"
   - Select "Office Add-in"
   - Upload your manifest.xml

4. [ ] Configure deployment
   - Choose users/groups who can access
   - Set deployment options

5. [ ] Deploy to users
   - Add-in appears automatically in users' Outlook

### Option 4: Microsoft AppSource (Public Distribution)

**For public marketplace distribution:**

1. [ ] Complete production testing

2. [ ] Create Microsoft Partner Center account
   - Go to https://partner.microsoft.com

3. [ ] Prepare submission package
   - Production-ready manifest.xml
   - Test notes
   - Privacy policy URL
   - Support URL
   - Screenshots and marketing materials

4. [ ] Submit for certification
   - Follow Microsoft's review process
   - Address any feedback from reviewers

5. [ ] Publish to AppSource
   - Once approved, users can install from Office Store

## Security Considerations

### For Development/Testing
- [ ] API keys stored in localStorage (browser-based)
- [ ] HTTPS required (self-signed cert OK for dev)
- [ ] Note: This is sufficient for testing

### For Production (Recommended)
- [ ] Consider backend proxy server for API calls
- [ ] Implement user authentication
- [ ] Encrypt API keys in storage
- [ ] Add rate limiting
- [ ] Monitor API usage
- [ ] Implement error logging

**Backend Proxy Architecture:**
```
Outlook Add-in → Your Backend Server → Smartlead API
                 (stores API keys)
```

Benefits:
- API keys never exposed to client
- Better security
- Can add authentication
- Can implement caching
- Can add analytics

## Post-Deployment

### Monitoring
- [ ] Set up error tracking (Sentry, Application Insights, etc.)
- [ ] Monitor API usage and costs
- [ ] Track user adoption
- [ ] Collect user feedback

### Maintenance
- [ ] Document known issues
- [ ] Plan regular updates
- [ ] Monitor Smartlead API changes
- [ ] Keep dependencies updated
- [ ] Test with new Outlook versions

### User Support
- [ ] Create user documentation
- [ ] Provide API key setup instructions
- [ ] Set up support channel (email, chat, etc.)
- [ ] Create FAQ document
- [ ] Training materials for end users

## Common Issues & Solutions

### Issue: Manifest validation fails
**Solution:** Run `npm run validate` and fix reported errors

### Issue: Add-in doesn't load
**Solution:**
- Verify HTTPS is working
- Check all URLs in manifest are accessible
- Clear Outlook cache

### Issue: API errors
**Solution:**
- Verify API key is valid
- Check Smartlead account has active campaigns
- Review browser console for detailed errors

### Issue: CORS errors
**Solution:**
- Smartlead API should support CORS
- If not, implement backend proxy
- Contact Smartlead support

## Resources

- [Smartlead API Docs](https://api.smartlead.ai/)
- [Office Add-ins Documentation](https://docs.microsoft.com/en-us/office/dev/add-ins/)
- [Outlook Add-in Requirements](https://docs.microsoft.com/en-us/office/dev/add-ins/outlook/add-in-requirements)
- [Sideload for Testing](https://docs.microsoft.com/en-us/office/dev/add-ins/testing/sideload-office-add-ins-for-testing)
- [AppSource Submission](https://docs.microsoft.com/en-us/office/dev/store/submit-to-appsource-via-partner-center)

## Quick Commands Reference

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Validate manifest
npm run validate

# Install SSL certificates (dev)
npx office-addin-dev-certs install

# Generate new GUID
npx office-addin-manifest generate-id
```

---

Good luck with your deployment! 🚀
