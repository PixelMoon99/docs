import { Router } from 'express';
import { sendInvoiceEmail } from '../controllers/invoiceController.js';
const router = Router();
router.post('/invoice/send', sendInvoiceEmail);
export default router;
