# Quick Start Hosting Guide

Get your Touch of Elegance website online in minutes with these quick start options.

## 🚀 Fastest Options (5-10 minutes)

### Option 1: Railway (Recommended)

1. Go to [railway.app](https://railway.app)
2. Click "Start a New Project"
3. Select "Deploy from GitHub repo"
4. Choose `dan-tome/touch-of-elegance-site`
5. Railway auto-deploys! Get your URL from the dashboard

**Cost:** $5/month (includes $5 free credit monthly)

### Option 2: Render

1. Go to [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect GitHub repository
4. Set:
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Click "Create Web Service"

**Cost:** Free tier or $7/month for better performance

### Option 3: Google Cloud Run

```bash
# Install gcloud CLI first: https://cloud.google.com/sdk/docs/install

# Set your project
gcloud config set project YOUR_PROJECT_ID

# Enable required APIs
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com

# Deploy (from repository root)
gcloud run deploy touch-of-elegance \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars NODE_ENV=production
```

**Cost:** Pay-per-use, free tier includes 2M requests/month

---

## 🐳 Docker (Self-Hosting)

If you have a VPS or server with Docker installed:

```bash
# Build the image
docker build -t touch-of-elegance:latest .

# Run the container
docker run -d \
  -p 80:3000 \
  -e NODE_ENV=production \
  --name touch-of-elegance \
  --restart unless-stopped \
  touch-of-elegance:latest
```

Access at `http://your-server-ip`

---

## 📋 Environment Variables

Set these in your hosting platform:

```bash
NODE_ENV=production
PORT=3000              # or 8080 for Cloud Run
HOST=0.0.0.0
```

---

## 🔒 Adding Your Custom Domain

### For Railway/Render/Vercel
1. Go to Settings → Custom Domain
2. Add your domain
3. Update DNS with provided CNAME

### For VPS/Docker
1. Point A record to your server IP
2. Install Nginx and configure reverse proxy
3. Get free SSL with Let's Encrypt:
   ```bash
   sudo certbot --nginx -d yourdomain.com
   ```

---

## ✅ Verify Deployment

Test your deployment:

```bash
# Check health
curl https://your-url.com/health

# Should return:
# {"status":"healthy","timestamp":"...","uptime":...}

# Check main site
curl https://your-url.com/
```

---

## 📚 Need More Details?

See [HOSTING.md](./HOSTING.md) for:
- 10+ deployment platforms
- Kubernetes setup
- SSL configuration
- Monitoring setup
- Troubleshooting

---

## 🆘 Common Issues

**App won't start?**
- Check environment variables are set
- Verify `NODE_ENV=production`
- Check logs in your platform dashboard

**Can't access the site?**
- DNS takes 1-48 hours to propagate
- Check firewall settings
- Verify health endpoint: `/health`

**Need help?**
Create an issue in the repository with:
- Hosting platform used
- Error messages
- Deployment logs
