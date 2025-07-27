# Firebase Hosting Guide for PsycheBot.pro

This guide will walk you through deploying your PsycheBot.pro website to Firebase Hosting.

## Prerequisites

1. **Firebase Account** - You'll need a Google account to access Firebase
2. **Optional: Node.js** - Only needed if using Firebase CLI (version 14 or higher)
   - Your website is static HTML/CSS/JS and doesn't need Node.js to run
   - Node.js is only needed to install and use Firebase CLI for deployment
3. **Optional: Git** - Only needed if using CLI deployment

## Deployment Methods

You have two options for deploying your website:

### Option A: Web Interface (Recommended - No CLI needed)

Deploy directly from the Firebase Console web interface.

### Option B: Firebase CLI

Use command-line tools for deployment.

---

## Option A: Web Interface Deployment (Easiest)

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `psychebot-pro`
4. Follow the setup wizard

### Step 2: Enable Hosting

1. In your Firebase project, click "Hosting" in the left sidebar
2. Click "Get started"
3. Choose "Web app" and register your app
4. Give it a nickname like "psychebot-pro"

### Step 3: Upload Files

1. In the Hosting section, click "Upload files"
2. Select all your website files:
   - `index.html`
   - `styles.css`
   - `neural-network.js`
   - `favicon.svg`
   - `firebase.json` (if you have it)
   - `.firebaserc` (if you have it)
3. Click "Upload"

### Step 4: Deploy

1. Click "Deploy" button
2. Your site will be live at the provided URL (e.g., `https://psychebot-pro.web.app`)

---

## Option B: Firebase CLI Deployment

### Step 1: Install Firebase CLI

The Firebase CLI is a Node.js package that helps you deploy to Firebase. Install it globally:

```bash
npm install -g firebase-tools
```

**Note:** Your website itself doesn't use Node.js - it's purely static HTML/CSS/JavaScript. Node.js is only needed for the deployment tools.

### Step 2: Login to Firebase

Login to your Firebase account:

```bash
firebase login
```

This will open a browser window for authentication.

### Step 3: Initialize Firebase Project

1. **Create a new Firebase project:**

   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add project"
   - Enter project name: `psychebot-pro`
   - Follow the setup wizard

2. **Initialize Firebase in your project:**

   ```bash
   firebase init hosting
   ```

3. **When prompted:**
   - Select your project: `psychebot-pro`
   - Public directory: `.` (current directory)
   - Configure as single-page app: `Yes`
   - Set up automatic builds: `No`

### Step 4: Deploy to Firebase

Deploy your website:

```bash
firebase deploy
```

## Custom Domain Setup (Optional)

To use your custom domain `psychebot.pro`:

1. **Add custom domain in Firebase Console:**

   - Go to Firebase Console → Hosting
   - Click "Add custom domain"
   - Enter: `psychebot.pro`
   - Follow the verification steps

2. **Update DNS records:**
   - Add the provided A records to your domain registrar
   - Wait for DNS propagation (can take up to 48 hours)

## File Structure

Your project should now have this structure:

```
psychebot.pro/
├── index.html          # Main website file
├── styles.css          # CSS styles
├── firebase.json       # Firebase configuration
├── .firebaserc         # Firebase project settings
└── FIREBASE_HOSTING_GUIDE.md  # This guide
```

## Configuration Details

### firebase.json

- **public**: `.` - Serves files from the current directory
- **ignore**: Excludes unnecessary files from deployment
- **rewrites**: Routes all requests to index.html for SPA behavior
- **headers**: Optimizes caching for CSS and JS files

### .firebaserc

- **projects**: Maps the default project to `psychebot-pro`

## Deployment Commands

```bash
# Deploy to production
firebase deploy

# Deploy only hosting
firebase deploy --only hosting

# Preview before deploying
firebase serve

# View deployment history
firebase hosting:releases:list
```

## Troubleshooting

### Common Issues:

1. **"Project not found"**

   - Make sure you're logged in: `firebase login`
   - Verify project ID in `.firebaserc`

2. **"Permission denied"**

   - Ensure you have owner/editor permissions on the Firebase project

3. **Custom domain not working**
   - Check DNS records are correctly configured
   - Wait for DNS propagation (up to 48 hours)

### Useful Commands:

```bash
# Check Firebase CLI version
firebase --version

# List all projects
firebase projects:list

# Switch projects
firebase use <project-id>

# View hosting status
firebase hosting:sites:list
```

## Performance Optimization

The configuration includes:

- **Caching headers** for static assets (CSS/JS)
- **Single-page app routing** for better UX
- **Optimized file serving** from root directory

## Security

- Firebase Hosting provides automatic HTTPS
- DDoS protection included
- Global CDN for fast loading worldwide

## Monitoring

After deployment, you can monitor your site at:

- **Firebase Console** → Hosting → Your site
- **Analytics** (if enabled) → Firebase Console → Analytics

## Next Steps

1. **Enable Analytics** (optional):

   ```bash
   firebase init analytics
   ```

2. **Set up CI/CD** (optional):

   - Connect your GitHub repository
   - Enable automatic deployments on push

3. **Add more features**:
   - Contact forms
   - Blog section
   - Newsletter signup

Your PsycheBot.pro website is now ready for deployment! 🚀
