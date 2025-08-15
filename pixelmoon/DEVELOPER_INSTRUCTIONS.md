
DEVELOPER QUICK INSTRUCTIONS
- .env: contains API keys and secrets. Replace placeholders as needed.
- To create master admin: `node scripts/seedMasterAdmin.js`
- Start dev: `npm run dev` (from project root)
- Payments: frontend should call POST /api/v1/payments/create with {amount,currency,userId,orderId}
- Webhooks: NowPayments should be configured to POST to /api/v1/payments/webhook/now
- Mailer util: utils/mailer.js - uses SMTP settings in .env
- Invoice util: utils/invoiceGenerator.js - generates simple PDF invoices
- Security: Please rotate all keys provided and use environment-specific secrets. Use Gmail app password for SMTP.
