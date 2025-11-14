# Get Started - Smartlead Outlook Add-in

## 🎉 Your add-in is ready to deploy!

All code is complete, tested, and committed to git. Follow these simple steps to share with your team.

---

## Step 1: Create GitHub Repository (2 minutes)

1. Go to https://github.com/jalantechnologies
2. Click **New repository**
3. Settings:
   - Name: `smartlead-outlook-addin`
   - Description: "Outlook add-in to add email contacts to Smartlead campaigns"
   - Visibility: **Private** (recommended) or Public
   - DON'T check any initialization options
4. Click **Create repository**

---

## Step 2: Push Code to GitHub (1 minute)

```bash
# Add GitHub as remote
git remote add origin https://github.com/jalantechnologies/smartlead-outlook-addin.git

# Push code
git push -u origin main
```

---

## Step 3: Deploy (2 minutes)

### Automated Deployment (Recommended):

```bash
./deploy-github-pages.sh
```

This script will:
- ✅ Build the production files
- ✅ Create docs folder
- ✅ Update manifest.xml automatically
- ✅ Push everything to GitHub
- ✅ Show you the next steps

### Manual Deployment (Alternative):

```bash
npm run build
rm -rf docs && cp -r dist docs
git add docs
git commit -m "Deploy to GitHub Pages"
git push
```

---

## Step 4: Enable GitHub Pages (1 minute)

1. Go to: https://github.com/jalantechnologies/smartlead-outlook-addin/settings/pages
2. Source: **main branch** → **/docs folder**
3. Click **Save**
4. Wait 2-5 minutes

Your add-in will be live at:
```
https://jalantechnologies.github.io/smartlead-outlook-addin/
```

---

## Step 5: Share with Team

### Option A: Send Manifest File

1. Share `manifest.xml` from this folder
2. Include `TEAM-INSTALL-GUIDE.md` for installation instructions

### Option B: Centralized Deployment (Requires Admin)

See **DEPLOY-TO-JALAN.md** for Microsoft 365 admin center deployment.

---

## What Your Team Can Do

Once installed, team members can:

✅ Extract email addresses from Outlook messages
✅ View all Smartlead campaigns
✅ Add contacts to campaigns with one click
✅ Automatically handle new and existing leads

---

## Documentation Overview

| File | Purpose |
|------|---------|
| **GET-STARTED.md** | This file - quick deployment steps |
| **DEPLOY-TO-JALAN.md** | Detailed Jalan Technologies deployment guide |
| **SHARE-WITH-TEAM.md** | Quick reference for sharing |
| **TEAM-INSTALL-GUIDE.md** | User installation instructions |
| **TEAM-DEPLOYMENT.md** | Complete deployment options |
| **QUICKSTART.md** | 5-minute quick start |
| **README.md** | Full technical documentation |
| **DEPLOYMENT-CHECKLIST.md** | Comprehensive deployment checklist |

---

## Quick Reference

### Your URLs (After Deployment):

| Resource | URL |
|----------|-----|
| Add-in Live | https://jalantechnologies.github.io/smartlead-outlook-addin/ |
| Manifest | https://jalantechnologies.github.io/smartlead-outlook-addin/manifest.xml |
| Repository | https://github.com/jalantechnologies/smartlead-outlook-addin |
| Settings | https://github.com/jalantechnologies/smartlead-outlook-addin/settings/pages |

### Deployment Commands:

```bash
# Quick deploy
./deploy-github-pages.sh

# Manual deploy
npm run build && rm -rf docs && cp -r dist docs && git add docs && git commit -m "Deploy" && git push

# Validate manifest
npm run validate
```

---

## Need Help?

- **Deployment issues:** See DEPLOY-TO-JALAN.md
- **Sharing with team:** See SHARE-WITH-TEAM.md
- **User instructions:** See TEAM-INSTALL-GUIDE.md
- **Full docs:** See README.md

---

## Current Status

✅ Code complete
✅ Icons generated
✅ Build successful
✅ Git repository initialized
✅ Commits ready to push
✅ Documentation complete

**Next:** Follow Steps 1-5 above to deploy!

---

**Estimated total time:** 10 minutes from start to live deployment 🚀
