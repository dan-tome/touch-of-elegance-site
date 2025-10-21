# Hosting Guide for Touch of Elegance Website

This guide provides comprehensive instructions for hosting the Touch of Elegance website on various platforms. The website is a Node.js/Express application with a static frontend, ready for deployment to production.

## Table of Contents

1. [Quick Start Options](#quick-start-options)
2. [Platform-as-a-Service (PaaS) Hosting](#platform-as-a-service-paas-hosting)
3. [Container-Based Hosting](#container-based-hosting)
4. [Kubernetes Hosting](#kubernetes-hosting)
5. [Traditional Server Hosting](#traditional-server-hosting)
6. [DNS and Domain Configuration](#dns-and-domain-configuration)
7. [SSL/TLS Certificates](#ssltls-certificates)
8. [Environment Variables](#environment-variables)
9. [Health Checks and Monitoring](#health-checks-and-monitoring)
10. [Troubleshooting](#troubleshooting)

---

## Quick Start Options

### Option 1: Local Development

**Best for:** Testing and development

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start the server
npm start
```

The application will be available at `http://localhost:3000`

### Option 2: Docker (Easiest for Production)

**Best for:** Quick production deployment, consistent environments

```bash
# Build the Docker image
docker build -t touch-of-elegance:latest .

# Run the container
docker run -d \
  -p 80:3000 \
  -e NODE_ENV=production \
  -e PORT=3000 \
  --name touch-of-elegance \
  --restart unless-stopped \
  touch-of-elegance:latest
```

Your website will be accessible at `http://your-server-ip`

---

## Platform-as-a-Service (PaaS) Hosting

### 1. Vercel (Recommended for Node.js Apps)

**Pricing:** Free tier available, Pro starts at $20/month  
**Best for:** Easy deployment, automatic HTTPS, global CDN

#### Deployment Steps:

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Configure:**
   - Set environment variables in Vercel dashboard
   - Configure custom domain if needed

**Note:** The application runs as a serverless function on Vercel.

### 2. Railway

**Pricing:** $5/month per service (free $5 credit monthly)  
**Best for:** Full-stack apps, databases, automatic deployments

#### Deployment Steps:

1. **Connect GitHub:**
   - Go to [railway.app](https://railway.app)
   - Click "Start a New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

2. **Configure:**
   - Railway auto-detects Node.js
   - Set environment variables in the dashboard:
     - `NODE_ENV=production`
     - `PORT=3000`
   
3. **Deploy:**
   - Railway automatically deploys on git push
   - Get public URL from dashboard

### 3. Render

**Pricing:** Free tier available, Starter at $7/month  
**Best for:** Simple deployments, automatic SSL

#### Deployment Steps:

1. **Create Account:**
   - Go to [render.com](https://render.com)
   - Sign up and connect GitHub

2. **New Web Service:**
   - Click "New +" → "Web Service"
   - Connect repository
   - Configure:
     - **Build Command:** `npm install`
     - **Start Command:** `npm start`
     - **Environment:** Node
   
3. **Environment Variables:**
   ```
   NODE_ENV=production
   PORT=3000
   ```

4. **Deploy:**
   - Click "Create Web Service"
   - Render automatically deploys and provides HTTPS URL

### 4. Heroku

**Pricing:** Free tier discontinued, Basic at $5-7/month  
**Best for:** Established platform, many add-ons

#### Deployment Steps:

1. **Install Heroku CLI:**
   ```bash
   npm install -g heroku
   ```

2. **Login and Create App:**
   ```bash
   heroku login
   heroku create touch-of-elegance
   ```

3. **Deploy:**
   ```bash
   git push heroku main
   ```

4. **Configure:**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set PORT=3000
   ```

5. **Open:**
   ```bash
   heroku open
   ```

### 5. Netlify (with Serverless Functions)

**Pricing:** Free tier available, Pro at $19/month  
**Best for:** Static sites with API functions

**Note:** Requires converting Express routes to Netlify Functions. Not recommended for this app unless modified.

---

## Container-Based Hosting

### 1. Google Cloud Run (Recommended)

**Pricing:** Pay-per-use, free tier includes 2 million requests/month  
**Best for:** Serverless containers, automatic scaling, cost-effective

#### Deployment Steps:

1. **Install Google Cloud SDK:**
   ```bash
   curl https://sdk.cloud.google.com | bash
   gcloud init
   ```

2. **Enable Required APIs:**
   ```bash
   gcloud services enable run.googleapis.com
   gcloud services enable containerregistry.googleapis.com
   ```

3. **Build and Deploy:**
   ```bash
   # Set your project ID
   export PROJECT_ID=your-project-id
   
   # Build container
   gcloud builds submit --tag gcr.io/$PROJECT_ID/touch-of-elegance
   
   # Deploy to Cloud Run
   gcloud run deploy touch-of-elegance \
     --image gcr.io/$PROJECT_ID/touch-of-elegance \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --set-env-vars NODE_ENV=production,PORT=8080 \
     --port 3000
   ```

4. **Get URL:**
   - Cloud Run provides an HTTPS URL automatically
   - Map custom domain in Cloud Run console

### 2. AWS Elastic Container Service (ECS)

**Pricing:** Pay for EC2/Fargate resources  
**Best for:** AWS ecosystem integration

#### Deployment Steps:

1. **Install AWS CLI:**
   ```bash
   aws configure
   ```

2. **Create ECR Repository:**
   ```bash
   aws ecr create-repository --repository-name touch-of-elegance
   ```

3. **Build and Push:**
   ```bash
   # Get ECR login
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com
   
   # Build and tag
   docker build -t touch-of-elegance .
   docker tag touch-of-elegance:latest YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/touch-of-elegance:latest
   
   # Push
   docker push YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/touch-of-elegance:latest
   ```

4. **Create ECS Service:**
   - Use AWS Console or CLI to create Task Definition
   - Create ECS Service with Application Load Balancer
   - Configure health checks to `/health` endpoint

### 3. Azure Container Instances

**Pricing:** Pay-per-second billing  
**Best for:** Simple container hosting

#### Deployment Steps:

1. **Install Azure CLI:**
   ```bash
   curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
   az login
   ```

2. **Create Resource Group:**
   ```bash
   az group create --name touch-of-elegance-rg --location eastus
   ```

3. **Create Container Registry:**
   ```bash
   az acr create --resource-group touch-of-elegance-rg \
     --name touchofeleganceacr --sku Basic
   ```

4. **Build and Push:**
   ```bash
   az acr build --registry touchofeleganceacr \
     --image touch-of-elegance:latest .
   ```

5. **Deploy Container:**
   ```bash
   az container create \
     --resource-group touch-of-elegance-rg \
     --name touch-of-elegance \
     --image touchofeleganceacr.azurecr.io/touch-of-elegance:latest \
     --dns-name-label touch-of-elegance-unique \
     --ports 80 \
     --environment-variables NODE_ENV=production PORT=3000
   ```

### 4. DigitalOcean App Platform

**Pricing:** $5-12/month for containers  
**Best for:** Simple setup, predictable pricing

#### Deployment Steps:

1. **Create App:**
   - Go to [DigitalOcean App Platform](https://www.digitalocean.com/products/app-platform)
   - Click "Create App"
   - Connect GitHub repository

2. **Configure:**
   - Select the Dockerfile
   - Set HTTP port to `3000`
   - Add environment variables

3. **Deploy:**
   - DigitalOcean automatically builds and deploys
   - Provides HTTPS URL

---

## Kubernetes Hosting

This repository includes Kubernetes manifests (`deployment.yml`, `service.yml`, `kustomization.yml`) ready for deployment.

### 1. Google Kubernetes Engine (GKE)

**Pricing:** Pay for cluster nodes (starts ~$70/month for small cluster)  
**Best for:** Production apps needing scalability and high availability

#### Prerequisites:

- Google Cloud account
- `gcloud` CLI installed
- `kubectl` installed

#### Deployment Steps:

1. **Create GKE Cluster:**
   ```bash
   gcloud container clusters create touch-of-elegance-cluster \
     --num-nodes=2 \
     --machine-type=e2-small \
     --region=us-central1
   ```

2. **Configure kubectl:**
   ```bash
   gcloud container clusters get-credentials touch-of-elegance-cluster \
     --region=us-central1
   ```

3. **Build and Push Image to Artifact Registry:**
   ```bash
   # Enable Artifact Registry
   gcloud services enable artifactregistry.googleapis.com
   
   # Create repository
   gcloud artifacts repositories create touch-of-elegance \
     --repository-format=docker \
     --location=us-central1
   
   # Build and push
   gcloud builds submit --tag us-central1-docker.pkg.dev/PROJECT_ID/touch-of-elegance/app:latest
   ```

4. **Update Kubernetes Manifests:**
   
   Edit `deployment.yml` to replace the image placeholder:
   ```yaml
   image: us-central1-docker.pkg.dev/PROJECT_ID/touch-of-elegance/app:latest
   ```

5. **Deploy:**
   ```bash
   kubectl apply -k .
   ```

6. **Get External IP:**
   ```bash
   kubectl get service touch-of-elegance-service
   ```
   
   Wait for `EXTERNAL-IP` to be assigned (may take 2-5 minutes).

7. **Access Your Website:**
   ```
   http://EXTERNAL-IP
   ```

#### Automated Deployment with GitHub Actions:

The repository includes a GitHub Actions workflow (`.github/workflows/google.yml`) for CI/CD:

1. **Configure Workload Identity Federation:**
   - Follow [Google's guide](https://cloud.google.com/iam/docs/workload-identity-federation)
   - Create service account with necessary permissions

2. **Update Workflow Variables:**
   
   Edit `.github/workflows/google.yml`:
   ```yaml
   env:
     PROJECT_ID: 'your-project-id'
     GAR_LOCATION: 'us-central1'
     GKE_CLUSTER: 'touch-of-elegance-cluster'
     GKE_ZONE: 'us-central1'
     REPOSITORY: 'touch-of-elegance'
     IMAGE: 'app'
     WORKLOAD_IDENTITY_PROVIDER: 'projects/YOUR_PROJECT_NUMBER/...'
   ```

3. **Push to Main:**
   - GitHub Actions automatically builds and deploys on push to `main` branch

### 2. Amazon EKS

**Pricing:** $0.10/hour for control plane + node costs  
**Best for:** AWS integration, enterprise needs

#### Deployment Steps:

1. **Create EKS Cluster:**
   ```bash
   eksctl create cluster \
     --name touch-of-elegance \
     --region us-east-1 \
     --nodes 2 \
     --node-type t3.small
   ```

2. **Update kubectl Context:**
   ```bash
   aws eks update-kubeconfig --name touch-of-elegance --region us-east-1
   ```

3. **Deploy:**
   ```bash
   kubectl apply -k .
   ```

### 3. Azure Kubernetes Service (AKS)

**Pricing:** Pay for node VMs  
**Best for:** Azure ecosystem

#### Deployment Steps:

1. **Create AKS Cluster:**
   ```bash
   az aks create \
     --resource-group touch-of-elegance-rg \
     --name touch-of-elegance-aks \
     --node-count 2 \
     --generate-ssh-keys
   ```

2. **Get Credentials:**
   ```bash
   az aks get-credentials \
     --resource-group touch-of-elegance-rg \
     --name touch-of-elegance-aks
   ```

3. **Deploy:**
   ```bash
   kubectl apply -k .
   ```

### 4. Self-Managed Kubernetes

**Best for:** Full control, on-premises or existing cluster

Use tools like:
- **k3s** (lightweight Kubernetes)
- **microk8s** (Ubuntu's Kubernetes)
- **kubeadm** (standard Kubernetes setup)

Then deploy with:
```bash
kubectl apply -k .
```

---

## Traditional Server Hosting

### VPS Providers (DigitalOcean, Linode, Vultr, etc.)

**Pricing:** $5-20/month for small VPS  
**Best for:** Full control, traditional infrastructure

#### Deployment Steps:

1. **Create VPS:**
   - Ubuntu 22.04 LTS recommended
   - Minimum 1GB RAM, 1 CPU

2. **SSH into Server:**
   ```bash
   ssh root@your-server-ip
   ```

3. **Install Node.js:**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

4. **Install Git:**
   ```bash
   sudo apt-get install -y git
   ```

5. **Clone Repository:**
   ```bash
   cd /opt
   git clone https://github.com/dan-tome/touch-of-elegance-site.git
   cd touch-of-elegance-site
   ```

6. **Install Dependencies:**
   ```bash
   npm install --production
   ```

7. **Create Environment File:**
   ```bash
   cp .env.example .env
   nano .env
   ```
   
   Set production values:
   ```
   NODE_ENV=production
   PORT=3000
   HOST=0.0.0.0
   ```

8. **Install PM2 (Process Manager):**
   ```bash
   sudo npm install -g pm2
   ```

9. **Start Application:**
   ```bash
   pm2 start src/index.js --name touch-of-elegance
   pm2 save
   pm2 startup
   ```

10. **Install Nginx (Reverse Proxy):**
    ```bash
    sudo apt-get install -y nginx
    ```

11. **Configure Nginx:**
    ```bash
    sudo nano /etc/nginx/sites-available/touch-of-elegance
    ```
    
    Add:
    ```nginx
    server {
        listen 80;
        server_name yourdomain.com www.yourdomain.com;

        location / {
            proxy_pass http://localhost:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Health check endpoint
        location /health {
            proxy_pass http://localhost:3000/health;
            access_log off;
        }
    }
    ```

12. **Enable Site:**
    ```bash
    sudo ln -s /etc/nginx/sites-available/touch-of-elegance /etc/nginx/sites-enabled/
    sudo nginx -t
    sudo systemctl reload nginx
    ```

13. **Configure Firewall:**
    ```bash
    sudo ufw allow 'Nginx Full'
    sudo ufw allow OpenSSH
    sudo ufw enable
    ```

---

## DNS and Domain Configuration

### Setting Up Your Domain

1. **Purchase Domain:**
   - Use registrars like Namecheap, GoDaddy, Google Domains, or Cloudflare

2. **Configure DNS Records:**

   For PaaS platforms (Vercel, Render, etc.):
   ```
   Type: CNAME
   Name: @ (or www)
   Value: your-app.vercel.app (or platform-specific URL)
   ```

   For VPS with static IP:
   ```
   Type: A
   Name: @
   Value: your-server-ip
   
   Type: A
   Name: www
   Value: your-server-ip
   ```

   For Kubernetes LoadBalancer:
   ```
   Type: A
   Name: @
   Value: EXTERNAL-IP from kubectl get service
   ```

3. **Wait for DNS Propagation:**
   - Can take 1-48 hours
   - Check with: `dig yourdomain.com` or `nslookup yourdomain.com`

---

## SSL/TLS Certificates

### Option 1: Platform Automatic SSL

Most PaaS platforms (Vercel, Render, Railway, Cloud Run) automatically provide SSL certificates. No additional configuration needed.

### Option 2: Let's Encrypt (Free) for VPS

1. **Install Certbot:**
   ```bash
   sudo apt-get install -y certbot python3-certbot-nginx
   ```

2. **Obtain Certificate:**
   ```bash
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```

3. **Auto-Renewal:**
   ```bash
   sudo certbot renew --dry-run
   ```

Certbot automatically configures Nginx and sets up auto-renewal.

### Option 3: Cloudflare (Free SSL + CDN)

1. **Add Site to Cloudflare:**
   - Go to [cloudflare.com](https://www.cloudflare.com)
   - Add your domain
   - Update nameservers at your registrar

2. **Configure SSL:**
   - Go to SSL/TLS settings
   - Set to "Full" or "Full (strict)"

3. **Benefits:**
   - Free SSL certificate
   - Global CDN
   - DDoS protection
   - Automatic HTTPS rewrites

---

## Environment Variables

### Required Environment Variables

```bash
NODE_ENV=production        # Set to production
PORT=3000                  # Port the app listens on (use 8080 for Cloud Run)
HOST=0.0.0.0              # Listen on all interfaces
```

### Optional Environment Variables

```bash
CORS_ORIGIN=*             # Allowed CORS origins (* for all, or specific domain)
LOG_LEVEL=info            # Logging level (error, warn, info, debug)
LOG_DIR=logs              # Directory for log files
```

### Platform-Specific Configuration

#### Vercel
Set in: Dashboard → Project Settings → Environment Variables

#### Railway
Set in: Dashboard → Service → Variables

#### Google Cloud Run
Set in: Dashboard → Edit Container → Environment Variables  
Or via CLI: `--set-env-vars KEY=value`

#### Kubernetes
Create ConfigMap or Secret:
```bash
kubectl create configmap app-config \
  --from-literal=NODE_ENV=production \
  --from-literal=PORT=3000
```

---

## Health Checks and Monitoring

### Health Check Endpoint

The application includes a built-in health check at `/health`:

```bash
curl http://yourdomain.com/health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2025-10-21T12:00:00.000Z",
  "uptime": 123.456
}
```

### Configure Health Checks

#### Docker
Health check is built into the Dockerfile and runs automatically.

#### Kubernetes
Configured in `deployment.yml`:
```yaml
livenessProbe:
  httpGet:
    path: /health
    port: 3000
  initialDelaySeconds: 30
  periodSeconds: 10

readinessProbe:
  httpGet:
    path: /health
    port: 3000
  initialDelaySeconds: 5
  periodSeconds: 5
```

#### Cloud Run
Automatically uses the container's health check.

### Monitoring Solutions

#### Basic Monitoring (Free)

1. **UptimeRobot:** Free uptime monitoring
   - Monitor `/health` endpoint
   - Get alerts via email/SMS

2. **StatusCake:** Free monitoring plan
   - HTTP(S) monitoring
   - Page speed tests

#### Advanced Monitoring (Paid)

1. **Datadog:** Full observability platform
2. **New Relic:** Application performance monitoring
3. **Sentry:** Error tracking and performance
4. **Google Cloud Monitoring:** For GCP deployments
5. **AWS CloudWatch:** For AWS deployments

#### Application Logs

Access logs by platform:

- **Railway:** Dashboard → Logs tab
- **Render:** Dashboard → Logs
- **Heroku:** `heroku logs --tail`
- **Cloud Run:** Google Cloud Console → Logs
- **Kubernetes:** `kubectl logs -f deployment/touch-of-elegance`
- **VPS:** `pm2 logs touch-of-elegance`

---

## Recommended Hosting by Use Case

### Personal/Portfolio Site
**Recommendation:** Vercel or Render (Free tier)
- Zero cost
- Automatic SSL
- Easy setup

### Small Business Site
**Recommendation:** Railway or Render (Paid tier)
- $5-7/month
- Custom domain
- Professional support

### Growing Business
**Recommendation:** Google Cloud Run or VPS
- Cost-effective scaling
- More control
- Better performance

### Enterprise/High Traffic
**Recommendation:** Kubernetes (GKE/EKS/AKS)
- High availability
- Auto-scaling
- Professional infrastructure

---

## Cost Comparison

| Platform | Monthly Cost | Pros | Cons |
|----------|-------------|------|------|
| Vercel Free | $0 | Easy, automatic SSL | Limited resources |
| Vercel Pro | $20 | More resources | Can get expensive |
| Railway | $5 | Simple, good UX | Limited free tier |
| Render | $7 | Easy setup | Basic features |
| Cloud Run | ~$5-10 | Pay-per-use, scales to zero | GCP complexity |
| DigitalOcean VPS | $6 | Full control | Manual setup |
| Heroku | $7 | Established platform | Expensive at scale |
| GKE | ~$70+ | Enterprise-ready | Complex, expensive |

---

## Security Best Practices

1. **Environment Variables:**
   - Never commit `.env` to git
   - Use platform-specific secret management
   - Rotate sensitive values regularly

2. **HTTPS:**
   - Always use HTTPS in production
   - Use HSTS headers (already configured via Helmet.js)

3. **Updates:**
   - Keep dependencies updated: `npm audit fix`
   - Monitor security advisories

4. **Firewall:**
   - Only open necessary ports
   - Use security groups (cloud platforms)

5. **Access Control:**
   - Use SSH keys, not passwords
   - Implement least privilege access

6. **Rate Limiting:**
   - Already configured in the app
   - Consider adding CDN/WAF for additional protection

---

## Troubleshooting

### Application Won't Start

1. **Check logs:**
   ```bash
   # Docker
   docker logs touch-of-elegance
   
   # PM2
   pm2 logs touch-of-elegance
   
   # Kubernetes
   kubectl logs -f deployment/touch-of-elegance
   ```

2. **Verify environment variables:**
   - Ensure `NODE_ENV=production`
   - Check `PORT` configuration

3. **Test locally:**
   ```bash
   npm start
   curl http://localhost:3000/health
   ```

### Site Not Accessible

1. **Check DNS:**
   ```bash
   dig yourdomain.com
   nslookup yourdomain.com
   ```

2. **Check firewall:**
   ```bash
   # VPS
   sudo ufw status
   
   # Check if port is listening
   sudo netstat -tlnp | grep :80
   ```

3. **Check SSL certificate:**
   ```bash
   curl -vI https://yourdomain.com
   ```

### Performance Issues

1. **Enable compression:** Already configured in the app

2. **Use CDN:** Consider Cloudflare or CloudFront

3. **Optimize images:** Compress images in `/public/images`

4. **Monitor resources:**
   ```bash
   # CPU and memory
   top
   htop
   
   # Docker
   docker stats
   ```

### Database Connection Issues

When you add a database:

1. **Check connection string**
2. **Verify network access** (security groups, firewall)
3. **Test connection independently**

---

## Next Steps After Deployment

1. **Set Up Monitoring:**
   - Configure uptime monitoring
   - Set up error tracking

2. **Configure Backups:**
   - Back up server configurations
   - Set up database backups (when added)

3. **Set Up Analytics:**
   - Google Analytics
   - Plausible (privacy-friendly alternative)

4. **Performance Optimization:**
   - Enable CDN
   - Configure caching headers

5. **SEO:**
   - Submit sitemap to search engines
   - Configure meta tags
   - Set up Google Search Console

---

## Support and Resources

### Documentation
- **Express.js:** https://expressjs.com/
- **Node.js:** https://nodejs.org/docs/
- **Docker:** https://docs.docker.com/
- **Kubernetes:** https://kubernetes.io/docs/

### Platform Documentation
- **Vercel:** https://vercel.com/docs
- **Railway:** https://docs.railway.app/
- **Render:** https://render.com/docs
- **Google Cloud:** https://cloud.google.com/docs
- **AWS:** https://docs.aws.amazon.com/
- **Azure:** https://docs.microsoft.com/azure/

### Community Support
- Stack Overflow
- Reddit: r/webdev, r/node
- Discord: Node.js, Express.js communities

---

## Conclusion

This guide covers multiple hosting options for the Touch of Elegance website. Choose the platform that best fits your:

- **Budget:** Free tier vs paid hosting
- **Technical expertise:** PaaS (easiest) to VPS (most control)
- **Scale requirements:** Single server vs auto-scaling
- **Integration needs:** Existing cloud infrastructure

For most users, we recommend starting with **Railway** or **Google Cloud Run** for a balance of simplicity, cost, and scalability.

If you need help with deployment, create an issue in the repository or contact the development team.
