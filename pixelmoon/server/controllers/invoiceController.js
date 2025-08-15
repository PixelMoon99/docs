import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { config } from 'dotenv';
import nodemailer from 'nodemailer';
config();

export async function generateInvoicePDF(invoiceData, outPath) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const stream = fs.createWriteStream(outPath);
    doc.pipe(stream);

    doc.fontSize(20).text('Invoice', { align: 'left' });
    doc.moveDown();

    doc.fontSize(12);
    doc.text(`Invoice No: ${invoiceData.number}`);
    doc.text(`Date: ${invoiceData.date}`);
    doc.text(`Customer: ${invoiceData.customerName}`);
    doc.text(`Email: ${invoiceData.customerEmail}`);
    doc.moveDown();

    doc.text('Items:');
    invoiceData.items.forEach((item, idx) => {
      doc.text(`${idx+1}. ${item.name} - Qty ${item.qty} x ${item.price} ${item.currency}`);
    });
    doc.moveDown();
    doc.text(`Total: ${invoiceData.total} ${invoiceData.currency}`);
    doc.end();

    stream.on('finish', () => resolve(outPath));
    stream.on('error', reject);
  });
}

export async function sendInvoiceEmail(req, res) {
  try {
    const invoice = req.body;
    const outDir = path.join(process.cwd(), 'data');
    const outPath = path.join(outDir, `invoice-${invoice.number}.pdf`);
    await generateInvoicePDF(invoice, outPath);

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT || 587),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'no-reply@example.com',
      to: invoice.customerEmail,
      subject: `Invoice ${invoice.number}`,
      text: 'Please find your invoice attached.',
      attachments: [{ filename: `invoice-${invoice.number}.pdf`, path: outPath }]
    });

    return res.json({ sent: true, messageId: info.messageId });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
