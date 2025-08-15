import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { config } from 'dotenv';
import payments from './routes/payments.js';
import invoice from './routes/invoice.js';

config();
const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors({ origin: process.env.PUBLIC_URL?.split(',') || true, credentials: true }));
app.use(bodyParser.json({ limit: '2mb' }));
app.use('/api', payments);
app.use('/api', invoice);

app.get('/health', (req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
