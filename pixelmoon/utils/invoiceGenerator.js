const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

function generateInvoicePDF(order, outPath) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40 });
    const stream = fs.createWriteStream(outPath);
    doc.pipe(stream);

    doc.fontSize(20).text('Invoice', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Order ID: ${order.id}`);
    doc.text(`Amount: ${order.amount}`);
    doc.text(`Date: ${new Date().toISOString()}`);
    doc.moveDown();
    doc.text('Thank you for your purchase from PixelMoon Store');

    doc.end();
    stream.on('finish', () => resolve(outPath));
    stream.on('error', (err) => reject(err));
  });
}

module.exports = { generateInvoicePDF };
