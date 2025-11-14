# Deploy to Jalan Technologies GitHub

## Quick Deployment Steps

### 1. Create Repository on GitHub

1. Go to https://github.com/jalantechnologies
2. Click **New repository**
3. Repository details:
   - **Name:** `smartlead-outlook-addin`
   - **Description:** "Outlook add-in to add email contacts as leads to Smartlead campaigns"
   - **Visibility:** Private (or Public if you want to share)
   - **DON'T** initialize with README, .gitignore, or license (we already have these)
4. Click **Create repository**

### 2. Push to GitHub

```bash
# Add the remote
git remote add origin https://github.com/jalantechnologies/smartlead-outlook-addin.git

# Push to GitHub
git push -u origin main
```

### 3. Deploy to GitHub Pages

**Option A: Automated Deployment Script**

```bash
./deploy-github-pages.sh
```

This will automatically:
- Build the project
- Create docs folder
- Update manifest.xml with correct URLs
- Push everything to GitHub

**Option B: Manual Deployment**

```bash
# Build the project
npm run build

# Copy to docs folder
rm -rf docs
cp -r dist docs

# Commit and push
git add docs
git commit -m "Deploy to GitHub Pages"
git push
```

### 4. Enable GitHub Pages

1. Go to: https://github.com/jalantechnologies/smartlead-outlook-addin/settings/pages
2. Under **Source**:
   - Branch: `main`
   - Folder: `/docs`
3. Click **Save**
4. Wait 2-5 minutes

### 5. Verify Deployment

Your add-in will be live at:
```
https://jalantechnologies.github.io/smartlead-outlook-addin/
```

Test these URLs in your browser:
- https://jalantechnologies.github.io/smartlead-outlook-addin/taskpane.html
- https://jalantechnologies.github.io/smartlead-outlook-addin/manifest.xml

### 6. Update Manifest (If Not Using Script)

If you deployed manually, update manifest.xml:

```bash
# Replace localhost with your GitHub Pages URL
sed -i '' 's|https://localhost:3000|https://jalantechnologies.github.io/smartlead-outlook-addin|g' manifest.xml

# Commit the change
git add manifest.xml
git commit -m "Update manifest with GitHub Pages URL"
git push
```

### 7. Share with Team

**Your team can now install the add-in!**

Share these files with team members:
1. `manifest.xml` (from this folder)
2. `TEAM-INSTALL-GUIDE.md` (installation instructions)

Or share this direct link to the manifest:
```
https://jalantechnologies.github.io/smartlead-outlook-addin/manifest.xml
```

---

## Your Deployment URLs

After deployment, these URLs will be active:

| Resource | URL |
|----------|-----|
| **Add-in Homepage** | https://jalantechnologies.github.io/smartlead-outlook-addin/ |
| **Task Pane** | https://jalantechnologies.github.io/smartlead-outlook-addin/taskpane.html |
| **Manifest** | https://jalantechnologies.github.io/smartlead-outlook-addin/manifest.xml |
| **GitHub Repo** | https://github.com/jalantechnologies/smartlead-outlook-addin |
| **Settings (Pages)** | https://github.com/jalantechnologies/smartlead-outlook-addin/settings/pages |

---

## Team Installation Instructions

### For Team Members at Jalan Technologies:

1. Download `manifest.xml` from the repo or receive it from admin
2. Open [outlook.office.com](https://outlook.office.com)
3. Open any email
4. Click `...` → **Get Add-ins** → **My add-ins**
5. **+ Add a custom add-in** → **Add from file**
6. Upload `manifest.xml`
7. Click **Install**

Done! The "Add to Smartlead" button will appear when viewing emails.

**First time setup:**
- Click the button → Settings
- Enter Smartlead API key (from app.smartlead.ai → Settings → API)
- Save

---

## Making Updates

When you update the add-in:

```bash
# Make your code changes
# Then deploy:

./deploy-github-pages.sh
```

Team members get updates automatically on their next Outlook refresh!

---

## Alternative: Custom Domain

If you want to use a custom domain like `addins.jalantechnologies.com`:

### Option 1: GitHub Pages Custom Domain

1. In GitHub repo settings → Pages
2. Add custom domain: `addins.jalantechnologies.com`
3. Update your DNS:
   - Add CNAME record: `addins` → `jalantechnologies.github.io`
4. Wait for DNS propagation (up to 48 hours)
5. Update manifest.xml URLs to use custom domain

### Option 2: Deploy to Your Own Server

1. Build: `npm run build`
2. Upload `dist/` folder to your server
3. Ensure HTTPS is enabled
4. Update manifest.xml with your server URLs
5. Share manifest with team

---

## Centralized Deployment (For IT Admin)

If you have Microsoft 365 admin access for Jalan Technologies:

1. Complete GitHub Pages deployment above
2. Go to [admin.microsoft.com](https://admin.microsoft.com)
3. Navigate to **Settings** → **Integrated apps**
4. Click **Upload custom apps** → **Office Add-in**
5. Upload the `manifest.xml` file
6. Select deployment scope:
   - **Entire organization** (all employees)
   - **Specific users**
   - **Specific groups**
7. Choose deployment type:
   - **Fixed** (auto-installed, can't be removed)
   - **Available** (users can choose to install)
8. Click **Deploy**

**Benefits:**
- Automatic installation for all selected users
- No manual sideloading needed
- Centralized management
- Easy updates

---

## Repository Best Practices

### Branch Protection

Consider adding branch protection rules:

1. Go to repo Settings → Branches
2. Add rule for `main` branch:
   - Require pull request reviews
   - Require status checks to pass
   - Require branches to be up to date

### CI/CD (Optional)

Add GitHub Actions for automatic deployment:

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Build
        run: npm run build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

This automatically deploys when you push to `main` branch.

---

## Security Recommendations

### For Production Use:

1. **Private Repository:** Keep the repo private if containing sensitive logic
2. **API Key Management:**
   - Each user should use their own Smartlead API key
   - Don't commit API keys to the repository
3. **Code Review:** Require PR reviews before merging to main
4. **Access Control:** Limit who can push to main branch
5. **Backend Proxy (Advanced):**
   - Consider building a backend service
   - Store API keys server-side
   - Add user authentication

---

## Support Contacts

### Internal Support (Jalan Technologies):
- **Repository Admin:** [Your name/email]
- **IT Support:** [Your IT team contact]

### External Resources:
- **Smartlead Support:** https://smartlead.ai/support
- **Microsoft Add-ins Docs:** https://docs.microsoft.com/office/dev/add-ins/

---

## Quick Commands Reference

```bash
# Initial setup (one-time)
git remote add origin https://github.com/jalantechnologies/smartlead-outlook-addin.git
git push -u origin main

# Deploy updates
./deploy-github-pages.sh

# Manual deploy
npm run build
rm -rf docs && cp -r dist docs
git add docs manifest.xml
git commit -m "Deploy update"
git push

# Check deployment status
git status
git log --oneline -5
```

---

## Troubleshooting

### "Permission denied" when pushing
```bash
# Use SSH instead of HTTPS
git remote set-url origin git@github.com:jalantechnologies/smartlead-outlook-addin.git
```

Or authenticate with GitHub CLI:
```bash
gh auth login
```

### GitHub Pages not updating
- Check Settings → Pages shows correct source
- Wait 5 minutes and force refresh (Ctrl+Shift+R)
- Check Actions tab for build errors
- Verify docs/ folder is in the repository

### Manifest validation fails
```bash
npm run validate
```

Fix reported errors and redeploy.

---

## Next Steps

1. ✅ Create GitHub repository
2. ✅ Push code to GitHub
3. ✅ Enable GitHub Pages
4. ✅ Verify deployment URLs work
5. ✅ Share manifest.xml with team
6. ✅ Provide installation instructions
7. ⬜ (Optional) Set up centralized deployment
8. ⬜ (Optional) Configure custom domain
9. ⬜ (Optional) Add CI/CD automation

---

**Your add-in is ready to deploy!** 🚀

Follow the steps above and your team will be able to add Outlook contacts to Smartlead in minutes.
