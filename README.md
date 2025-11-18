# Rave Swirls

An interactive web visualization featuring colorful swirling particles that respond to mouse/touch interactions and audio input.

## Features

- Screen-filling colorful swirls
- Interactive drag effects - swirls react to mouse/touch movement
- Audio-reactive visualization (responds to microphone input)
- Smooth, fluid particle motion

## Deployment

This project is configured for deployment on Vercel.

### GitHub Setup

1. Create a new repository on GitHub (go to github.com and click "New repository")
2. Name it something like `rave-swirls` or `interactive-swirls`
3. **Don't** initialize it with a README, .gitignore, or license (we already have these)

Then run these commands:

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual GitHub username and repository name.

### Vercel Deployment

#### Option 1: Via Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign in with your GitHub account
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will automatically detect it's a static site
5. Click "Deploy" - no build settings needed!

#### Option 2: Via Vercel CLI

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in this directory
3. Follow the prompts to link your project

The site will be live at a URL like `your-project-name.vercel.app`

## Local Development

Simply open `index.html` in a web browser, or use a local server:

```bash
# Using Python
python3 -m http.server 8000

# Using Node.js (http-server)
npx http-server
```

Then visit `http://localhost:8000`

## Technologies

- p5.js - Creative coding library
- p5.sound - Audio input handling
- Vercel - Hosting platform

