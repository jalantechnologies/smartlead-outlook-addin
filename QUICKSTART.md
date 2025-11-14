# Quick Start Guide

Get your Smartlead Outlook add-in up and running in 5 minutes!

## Step 1: Install Dependencies

```bash
cd smartlead-outlook-addin
npm install
```

## Step 2: Generate SSL Certificates

```bash
npx office-addin-dev-certs install
```

When prompted, accept the certificate installation.

## Step 3: Start Development Server

```bash
npm start
```

The dev server will start at `https://localhost:3000`

## Step 4: Sideload in Outlook Web

1. Open [Outlook Web](https://outlook.office.com)
2. Open any email message
3. Click the three dots (...) → **Get Add-ins**
4. Click **My add-ins** (left sidebar)
5. Scroll down and click **+ Add a custom add-in** → **Add from file**
6. Upload the `manifest.xml` file from your project folder
7. Click **Install**

## Step 5: Use the Add-in

1. Open any email in Outlook Web
2. Look for the **"Add to Smartlead"** button in the toolbar
3. Click it to open the task pane
4. On first use, go to **Settings** and enter your Smartlead API key
5. Select a campaign and click **"Add to Campaign"**

## Get Your Smartlead API Key

1. Log in to [Smartlead](https://app.smartlead.ai)
2. Go to **Settings** → **API**
3. Copy your API key
4. Paste it in the add-in Settings

## Troubleshooting

**Add-in button doesn't appear?**
- Refresh Outlook Web
- Check that you installed the manifest successfully
- Try removing and re-adding the add-in

**SSL Certificate warnings?**
- This is normal for localhost development
- Click "Advanced" and "Proceed" in your browser
- The certificate is only for local development

**API errors?**
- Verify your Smartlead API key is correct
- Ensure you have active campaigns in Smartlead
- Check browser console (F12) for detailed errors

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Customize the add-in styling in `src/taskpane/taskpane.css`
- Add custom fields in `src/taskpane/components/App.tsx`
- Deploy to production following the README guide

Enjoy your Smartlead integration! 🚀
