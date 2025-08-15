/**
 * Basic server.js added/merged by assistant.
 * - uses express
 * - registers raw parser for webhook route only
 * - includes webhook verification based on lib/webhookVerifier.js
 *
 * IMPORTANT: run `npm install` in project root and test locally.
 */
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const mongoose = require('mongoose');

const { identifyAndVerify } = require('./lib/webhookVerifier');

const app = express();

// CORS: allow frontend origins from PUBLIC_URL (.env)
app.use(cors({ origin: (process.env.PUBLIC_URL || '').split(',').filter(Boolean).length ? (process.env.PUBLIC_URL || '').split(',') : true, credentials: true }));
// Preflight for all
app.options('*', cors());
app.use(helmet());
app.use(compression());
const limiter = rateLimit({ windowMs: 1*60*1000, max: 200 });
app.use(limiter);

// connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/pixelmoon';
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> console.log('MongoDB connected'))
  .catch(err=> console.error('MongoDB connection error', err));

// Serve static uploads and public assets
const publicDir = path.join(__dirname, 'public');
app.use('/uploads', express.static(path.join(publicDir, 'uploads'), { maxAge: '30d', immutable: true }));
app.use('/public', express.static(publicDir, { maxAge: '7d' }));

// normal json routes
app.use(express.json());

// raw body parser only for webhook endpoint
app.use('/api/nowpayments/webhook', express.raw({ type: 'application/json' }));
app.use('/api/matrixsols/webhook', express.raw({ type: 'application/json' }));

// Example webhook endpoint (NOWPayments & MatrixSols)
app.post('/api/nowpayments/webhook', async (req, res) => {
  try {
    const raw = req.body;
    const headers = req.headers;
    const { gateway, eventId } = identifyAndVerify(raw, headers);
    let payload = {};
    try { payload = JSON.parse(raw.toString('utf8')); } catch(e) { payload = {}; }

    // idempotency check would go here (WebhookEvent model)
    console.log('Received webhook', gateway, eventId);

    // TODO: if payment finished -> credit wallet, create transaction, etc.

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Webhook error', err && err.message);
    return res.status(400).json({ ok: false, error: String(err && err.message) });
  }
});

// Basic health
app.get('/health', (req, res) => res.json({ ok: true }));

let PORT = Number(process.env.PORT || 5000);

// Additional feature routes
const vipRoutes = require('./routes/vip');
const pricingRoutes = require('./routes/pricing');
const analyticsRoutes = require('./routes/analytics');
const leaderboardRoutes = require('./routes/leaderboard');
const mediaRoutes = require('./routes/media');
const voucherRoutes = require('./routes/voucher');
const paymentsRoutes = require('./routes/payments');
const incomingRoutes = require('./routes/incoming');
const otpAuthRoutes = require('./routes/auth_otp');
const authRoutes = require('./routes/auth');
const walletRoutes = require('./routes/wallet');
const notificationsRoutes = require('./routes/notifications');
const gamesRoutes = require('./routes/games');
const blogsRoutes = require('./routes/blogs');
const ordersRoutes = require('./routes/orders');

const authMiddleware = require('./middlewares/auth');

app.use('/api/v1/vip', vipRoutes);
app.use('/api/v1/pricing', authMiddleware, pricingRoutes);
app.use('/api/v1/analytics', authMiddleware, analyticsRoutes);
app.use('/api/v1/leaderboard', leaderboardRoutes);
app.use('/api/v1/media', mediaRoutes);
app.use('/api/v1/vouchers', voucherRoutes);
app.use('/api/v1/payments', paymentsRoutes);
app.use('/api/v1/incoming', incomingRoutes);
app.use('/api/v1/auth/otp', otpAuthRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/wallet', authMiddleware, walletRoutes);
app.use('/api/v1/notifications', notificationsRoutes);
app.use('/api/v1/games', authMiddleware, gamesRoutes);
app.use('/api/v1/blogs', blogsRoutes);
app.use('/api/v1/orders', ordersRoutes);

// Invoice HTML endpoint (simple)
app.get('/api/v1/invoice/:orderId', async (req,res)=>{
  const html = `<html><body><h1>Invoice: ${req.params.orderId}</h1><p>Pixel Moon Store</p></body></html>`;
  res.setHeader('Content-Type','text/html');
  res.send(html);
});

function startServer(port){
  const server = app.listen(port, () => console.log('Server listening on', port));
  server.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE') {
      const fallback = 5000;
      if (port !== fallback) {
        console.warn(`Port ${port} in use, retrying on ${fallback}...`);
        startServer(fallback);
      } else {
        const alt = 5001;
        console.warn(`Port ${port} in use, retrying on ${alt}...`);
        startServer(alt);
      }
    } else {
      console.error('Server error', err);
      process.exit(1);
    }
  });
}
startServer(PORT);

// --- API docs (Swagger) ---
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: { title: 'PixelMoon Public API', version: '1.0.0' },
  },
  apis: ['./routes/*.js'],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Mount public api (ensure Product model exists)
const publicApi = require('./routes/public_api');
app.use('/api', publicApi);

// mount admin api keys (protect with admin auth)
const adminApiKeys = require('./routes/admin_api_keys');
app.use('/admin/api-keys', authMiddleware, adminApiKeys);
