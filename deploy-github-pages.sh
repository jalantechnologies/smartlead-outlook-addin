#!/bin/bash

# Smartlead Outlook Add-in - GitHub Pages Deployment Script
# This script automates deployment to GitHub Pages

set -e  # Exit on error

echo "🚀 Smartlead Add-in Deployment Script"
echo "======================================"
echo ""

# Check if git repo exists
if [ ! -d .git ]; then
    echo "❌ Not a git repository. Initializing..."
    git init
    echo "✅ Git repository initialized"
fi

# Check if remote exists
if ! git remote get-url origin &> /dev/null; then
    echo ""
    echo "⚠️  No git remote found."
    echo "Please create a GitHub repository and add it as remote:"
    echo ""
    echo "   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git"
    echo ""
    exit 1
fi

# Get the GitHub repository URL
REMOTE_URL=$(git remote get-url origin)
echo "📦 Repository: $REMOTE_URL"
echo ""

# Extract username and repo name from URL
if [[ $REMOTE_URL =~ github.com[:/]([^/]+)/([^/.]+) ]]; then
    USERNAME="${BASH_REMATCH[1]}"
    REPO="${BASH_REMATCH[2]}"
    GITHUB_PAGES_URL="https://${USERNAME}.github.io/${REPO}"
else
    echo "❌ Could not parse GitHub URL"
    exit 1
fi

echo "🌐 GitHub Pages URL: $GITHUB_PAGES_URL"
echo ""

# Ask for confirmation
read -p "Deploy to GitHub Pages? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deployment cancelled."
    exit 0
fi

# Build the project
echo ""
echo "📦 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Build successful"

# Create/update docs folder
echo ""
echo "📁 Creating docs folder..."
rm -rf docs
cp -r dist docs

# Update manifest.xml with GitHub Pages URL
echo ""
echo "📝 Updating manifest.xml..."

# Create backup
cp manifest.xml manifest.xml.backup

# Replace localhost URLs with GitHub Pages URL
sed -i.tmp "s|https://localhost:3000|${GITHUB_PAGES_URL}|g" manifest.xml
rm -f manifest.xml.tmp

echo "✅ Manifest updated"

# Show changes
echo ""
echo "📋 Changes to manifest.xml:"
echo "   localhost:3000 → ${USERNAME}.github.io/${REPO}"
echo ""

# Git commit and push
echo "📤 Committing and pushing to GitHub..."
git add docs manifest.xml
git commit -m "Deploy to GitHub Pages - $(date +%Y-%m-%d\ %H:%M:%S)" || true
git push origin main || git push origin master

echo ""
echo "✅ Deployment complete!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📌 Next Steps:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. Enable GitHub Pages:"
echo "   → Go to: https://github.com/${USERNAME}/${REPO}/settings/pages"
echo "   → Source: Deploy from a branch"
echo "   → Branch: main → /docs folder"
echo "   → Click Save"
echo ""
echo "2. Wait 2-5 minutes for deployment"
echo ""
echo "3. Your add-in will be available at:"
echo "   🌐 ${GITHUB_PAGES_URL}/taskpane.html"
echo ""
echo "4. Download and share with your team:"
echo "   📄 manifest.xml (in this folder)"
echo ""
echo "5. Team members can sideload using the manifest file"
echo "   (See TEAM-DEPLOYMENT.md for instructions)"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "💡 Tip: Your manifest.xml has been updated automatically!"
echo "💡 Backup saved as: manifest.xml.backup"
echo ""
