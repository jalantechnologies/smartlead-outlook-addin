# Share Smartlead Add-in With Your Team

## Fastest Method (5 minutes) 🚀

### 1. Deploy to GitHub Pages (Free)

```bash
# One-time setup
git init
git add .
git commit -m "Initial commit"

# Create a repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Deploy automatically
./deploy-github-pages.sh
```

### 2. Enable GitHub Pages

1. Go to your repo: `Settings` → `Pages`
2. Source: `main branch` → `/docs` folder
3. Click `Save`
4. Wait 2-5 minutes

Your add-in is now live at: `https://YOUR_USERNAME.github.io/YOUR_REPO/`

### 3. Share manifest.xml with Team

Send your team the `manifest.xml` file from this folder.

### 4. Team Members Install (2 minutes each)

1. Open [outlook.office.com](https://outlook.office.com)
2. Open any email
3. Click `...` → `Get Add-ins` → `My add-ins`
4. `+ Add a custom add-in` → `Add from file`
5. Upload `manifest.xml`
6. Done! Look for "Add to Smartlead" button

---

## Alternative: Centralized Deployment (Admin Only) 🏢

**Best for:** Organizations with Microsoft 365 admin access

### Admin Does Once:

1. Deploy to GitHub Pages (steps above)
2. Go to [admin.microsoft.com](https://admin.microsoft.com)
3. `Settings` → `Integrated apps` → `Upload custom apps`
4. Upload `manifest.xml`
5. Choose users and deploy

**Team members get the add-in automatically** - no manual install needed!

---

## After Installation

### First Time Setup (Each Team Member):

1. Click "Add to Smartlead" button in Outlook
2. Click `Settings`
3. Enter Smartlead API Key
   - Get from: [app.smartlead.ai](https://app.smartlead.ai) → Settings → API
4. Click `Save`

### Using the Add-in:

1. Open any email in Outlook
2. Click "Add to Smartlead" button
3. Select a campaign
4. Click "Add to Campaign"

---

## Need Help?

- **Full deployment guide:** See `TEAM-DEPLOYMENT.md`
- **Quick start:** See `QUICKSTART.md`
- **Complete docs:** See `README.md`

---

## Update Deployment

When you make changes:

```bash
./deploy-github-pages.sh
```

Team members get updates automatically on next Outlook refresh!

---

## Deployment Options Comparison

| Method | Time | Requires Admin | Best For |
|--------|------|----------------|----------|
| GitHub Pages | 5 min | No | Most teams |
| Centralized Deploy | 10 min | Yes | Large orgs |
| Other hosting | Varies | No | Custom needs |

**Recommended:** GitHub Pages (free, easy, fast)
