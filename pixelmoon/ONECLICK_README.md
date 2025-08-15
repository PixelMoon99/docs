Pixelmoon One-Click Deployment
------------------------------

This package includes Docker + docker-compose for one-command deployment on a server with Docker installed.

Steps:
1. Copy this zip to your server and unzip.
2. Edit .env (or create it) with real credentials (SENDGRID_API_KEY, FCM key, JWT_SECRET, etc.).
   NOTE: Some payment keys were embedded per your request; verify them.
3. Run: ./setup.sh
4. The script will build images and start services (app, mongo, redis, nginx).

Caveats:
- You must have Docker and docker-compose installed on the target host.
- DNS, SSL (Let's Encrypt) not configured automatically. Use certbot/nginx setup or an external proxy (Cloudflare).
- External services need real API keys configured in .env.
