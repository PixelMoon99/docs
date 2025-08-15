module.exports = function productSchema(product){ return {
  "@context": "https://schema.org",
  "@type": "Product",
  name: product.title || '',
  image: product.image || [],
  description: product.description || '',
  sku: product.sku || '',
  offers: { "@type": "Offer", price: product.price || 0, priceCurrency: product.currency || 'INR' }
}; };
