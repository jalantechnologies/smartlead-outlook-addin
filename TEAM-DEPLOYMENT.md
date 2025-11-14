# Team Deployment Guide

This guide shows you the easiest ways to share the Smartlead Outlook add-in with your team.

## Option 1: Quick Share (Individual Sideloading) ⚡

**Best for:** Small teams, quick testing, no admin access required
**Time:** 5 minutes per person
**Requirements:** None - anyone can do this

### Steps:

#### A. Host the Add-in (One-time setup)

You need to host the add-in files on a web server with HTTPS. Choose one:

**Option A1: Use Your Own Server**
1. Build the production files:
   ```bash
   npm run build
   ```

2. Upload the `dist/` folder to your web server (must have HTTPS)
   - Example: `https://yourcompany.com/smartlead-addin/`

3. Make sure these files are accessible:
   - `https://yourcompany.com/smartlead-addin/taskpane.html`
   - `https://yourcompany.com/smartlead-addin/taskpane.bundle.js`

**Option A2: Use GitHub Pages (Free)**
1. Create a GitHub repository
2. Push your code to the repository
3. Go to Settings → Pages
4. Set source to "main branch / docs folder"
5. Copy the `dist/` contents to a `docs/` folder
6. Your add-in will be at: `https://yourusername.github.io/repo-name/`

**Option A3: Use Netlify/Vercel (Free)**
1. Create account at netlify.com or vercel.com
2. Connect your repository or drag & drop the `dist/` folder
3. Get your HTTPS URL (e.g., `https://smartlead-addin.netlify.app/`)

#### B. Update Manifest File

1. Open `manifest.xml`
2. Replace ALL instances of `https://localhost:3000` with your hosted URL
3. Example: Change to `https://yourcompany.com/smartlead-addin`

#### C. Share with Team Members

Send your team:
1. The updated `manifest.xml` file
2. Instructions below

**Instructions for Team Members:**

1. Open [Outlook Web](https://outlook.office.com)
2. Open any email message
3. Click the **...** (three dots) menu
4. Select **Get Add-ins**
5. Click **My add-ins** in the left sidebar
6. Scroll to bottom, click **+ Add a custom add-in** → **Add from file**
7. Upload the `manifest.xml` file
8. Click **Install**

Done! The add-in appears as "Add to Smartlead" button when viewing emails.

---

## Option 2: Centralized Deployment (Recommended for Organizations) 🏢

**Best for:** Organizations with Microsoft 365 admin access
**Time:** 10 minutes one-time setup
**Benefits:** Automatic deployment to all users, no individual sideloading needed

### Prerequisites:
- Microsoft 365 Business or Enterprise subscription
- Global Administrator or Exchange Administrator role

### Steps:

#### 1. Host the Add-in
Follow Option 1, Step A above to host your add-in files.

#### 2. Update Manifest
Follow Option 1, Step B above to update the manifest with your hosted URL.

#### 3. Deploy via Admin Center

1. Go to [Microsoft 365 Admin Center](https://admin.microsoft.com)
2. Navigate to **Settings** → **Integrated apps**
3. Click **Upload custom apps**
4. Click **Upload apps to deploy**
5. Choose **Office Add-in**
6. Upload your `manifest.xml` file

#### 4. Configure Deployment

1. **Select users:** Choose who gets the add-in
   - Entire organization
   - Specific users
   - Specific groups

2. **Deployment method:**
   - **Fixed (default):** Auto-installed, users can't remove
   - **Available:** Users can install if they want

3. Click **Deploy**

#### 5. Wait for Deployment
- Can take up to 12-24 hours to appear for all users
- Users will see the add-in automatically in Outlook Web

### Team Member Experience:
Once deployed, team members don't need to do anything! The add-in appears automatically in their Outlook.

---

## Option 3: Development/Testing (Localhost) 🧪

**Best for:** Testing before deployment, developers only
**Not recommended for:** Non-technical users

Each team member runs their own local server:

```bash
# Each person does this:
git clone <your-repo>
cd smartlead-outlook-addin
npm install
npx office-addin-dev-certs install
npm start

# Then sideload manifest.xml (which points to localhost:3000)
```

---

## Recommended Approach for Teams

### For Small Teams (2-10 people):
✅ **Use Option 1 with GitHub Pages or Netlify**
- Free hosting
- Share one manifest.xml file with everyone
- Each person sideloads once (5 minutes)

### For Organizations (10+ people):
✅ **Use Option 2 - Centralized Deployment**
- One-time admin setup
- Automatic for all users
- Professional deployment

---

## Step-by-Step: GitHub Pages Deployment

Here's the complete walkthrough for the easiest free option:

### 1. Prepare Your Repository

```bash
# In your project folder
git init
git add .
git commit -m "Initial commit"

# Create repo on GitHub, then:
git remote add origin https://github.com/yourusername/smartlead-outlook-addin.git
git push -u origin main
```

### 2. Set Up GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under "Source", select **main branch** → **/docs** folder
4. Click **Save**

### 3. Prepare Docs Folder

```bash
# Build and copy to docs folder
npm run build
rm -rf docs
cp -r dist docs
git add docs
git commit -m "Add docs for GitHub Pages"
git push
```

### 4. Get Your URL

After a few minutes, your add-in will be live at:
```
https://yourusername.github.io/smartlead-outlook-addin/
```

### 5. Update Manifest

```bash
# Update manifest.xml - replace localhost:3000 with your GitHub Pages URL
# Example:
# https://localhost:3000/taskpane.html
# becomes:
# https://yourusername.github.io/smartlead-outlook-addin/taskpane.html
```

### 6. Commit Updated Manifest

```bash
git add manifest.xml
git commit -m "Update manifest with GitHub Pages URL"
git push
```

### 7. Share with Team

Send your team:
1. The GitHub Pages URL: `https://yourusername.github.io/smartlead-outlook-addin/manifest.xml`
2. Or download and send them the `manifest.xml` file

Team members can either:
- **Option A:** Sideload using the manifest.xml file (see Option 1C)
- **Option B:** If you give them the manifest URL, they can add it directly

---

## Automation Script for Updates

When you make changes, update the deployment:

```bash
#!/bin/bash
# update-deployment.sh

echo "Building..."
npm run build

echo "Copying to docs..."
rm -rf docs
cp -r dist docs

echo "Committing..."
git add docs
git commit -m "Update deployment $(date +%Y-%m-%d)"
git push

echo "✅ Deployment updated!"
echo "Changes will be live in a few minutes at:"
echo "https://yourusername.github.io/smartlead-outlook-addin/"
```

Make it executable:
```bash
chmod +x update-deployment.sh
./update-deployment.sh
```

---

## Sharing Smartlead API Keys

### Important Security Note:
Each team member should use their own Smartlead API key for better security and tracking.

### Option 1: Individual API Keys (Recommended)
Each team member:
1. Gets their own Smartlead API key
2. Enters it in Settings when first using the add-in
3. Key is stored in their browser's localStorage

### Option 2: Shared API Key
If you want one shared key:

**Not Recommended** for production, but if needed:
1. Create a shared Smartlead account or API key
2. Share the key securely with your team (not in email!)
3. Each person enters it in Settings

**Better Alternative:** Build a backend proxy (advanced)
- Store API key on your server
- Add-in calls your server instead of Smartlead
- More secure, centralized management

---

## Troubleshooting Team Deployment

### "Add-in doesn't appear after sideloading"
- Wait 5 minutes and refresh Outlook
- Check manifest URLs are correct and accessible
- Try opening: `https://your-url/taskpane.html` in browser
- Clear Outlook cache: Sign out and sign back in

### "HTTPS required" error
- Make sure you're using `https://` not `http://`
- Verify your hosting supports HTTPS
- GitHub Pages and Netlify provide HTTPS automatically

### "Manifest validation failed"
```bash
# Validate your manifest:
npm run validate

# Check for common issues:
# - Invalid URLs
# - Wrong GUID format
# - Missing required fields
```

### "Can't access deployed files"
Test URLs in browser:
```bash
# These should all work:
curl https://your-url/taskpane.html
curl https://your-url/taskpane.bundle.js
curl https://your-url/manifest.xml
```

### "Add-in works for me but not team members"
- Ensure manifest.xml doesn't have `localhost` URLs
- Check team members have access to your hosted URL
- Verify no firewall/network restrictions

---

## Checklist Before Sharing

- [ ] Build production files: `npm run build`
- [ ] Host files with HTTPS enabled
- [ ] Update all URLs in manifest.xml
- [ ] Validate manifest: `npm run validate`
- [ ] Test manifest URL in browser
- [ ] Test taskpane.html loads in browser
- [ ] Document API key setup for team
- [ ] Create user guide (optional)
- [ ] Test sideloading yourself first

---

## Quick Commands Summary

```bash
# Build for production
npm run build

# Validate manifest
npm run validate

# Deploy to GitHub Pages (after setup)
npm run build && rm -rf docs && cp -r dist docs && git add docs && git commit -m "Deploy" && git push

# Test manifest validation
npx office-addin-manifest validate manifest.xml

# Start development server (local testing only)
npm start
```

---

## Need Help?

### Common Questions:

**Q: Do I need a server?**
A: Yes, for sharing with teams. Use free options like GitHub Pages or Netlify.

**Q: Can I share via email?**
A: You can email the manifest.xml file, but you still need to host the actual add-in files (HTML/JS) on a web server.

**Q: How do updates work?**
A: Update your hosted files, users get changes automatically on next Outlook refresh.

**Q: Can users install without admin?**
A: Yes for Option 1 (sideloading). Option 2 requires admin but is easier for users.

**Q: Is this secure?**
A: Yes, if using HTTPS. For production, consider a backend proxy for API keys.

---

## Production Best Practices

1. **Use a custom domain:**
   - `https://outlook-addins.yourcompany.com/smartlead/`
   - More professional than GitHub Pages

2. **Set up CI/CD:**
   - Auto-deploy on git push
   - Automated testing

3. **Monitor usage:**
   - Add analytics
   - Track API usage
   - Monitor errors

4. **Create user documentation:**
   - How to get Smartlead API key
   - How to select campaigns
   - Troubleshooting guide

5. **Security:**
   - Consider backend proxy for API calls
   - Implement user authentication
   - Regular security updates

---

## Support

If team members have issues:
1. Check DEPLOYMENT-CHECKLIST.md
2. Verify manifest URLs are accessible
3. Test in incognito/private browsing mode
4. Check browser console for errors (F12)

Good luck with your deployment! 🚀
