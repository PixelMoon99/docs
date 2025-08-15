import { Router } from 'express';
import { createUsdtPayment, nowpaymentsWebhook } from '../controllers/paymentController.js';
const router = Router();
router.post('/nowpayments/create', createUsdtPayment);
router.post('/nowpayments/webhook', nowpaymentsWebhook);
export default router;
