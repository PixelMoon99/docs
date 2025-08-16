import React from 'react';
// UPDATED 2025-01-27 — Created SEO component for JSON-LD structured data injection
import './SEO.css';

const SEO = ({ 
  title, 
  description, 
  keywords, 
  image, 
  url, 
  type = 'website',
  product = null,
  blog = null 
}) => {
  // Generate JSON-LD structured data
  const generateStructuredData = () => {
    if (product) {
      // Product structured data
      return {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.name,
        "description": product.description,
        "image": product.mainImage,
        "url": url,
        "brand": {
          "@type": "Brand",
          "name": "PixelMoon"
        },
        "offers": {
          "@type": "Offer",
          "price": product.price,
          "priceCurrency": product.currency || "USD",
          "availability": "https://schema.org/InStock",
          "seller": {
            "@type": "Organization",
            "name": "PixelMoon Store"
          }
        },
        "aggregateRating": product.rating ? {
          "@type": "AggregateRating",
          "ratingValue": product.rating,
          "reviewCount": product.reviewCount || 0
        } : undefined
      };
    }
    
    if (blog) {
      // Blog post structured data
      return {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": blog.title,
        "description": blog.excerpt,
        "image": blog.imageUrl,
        "author": {
          "@type": "Person",
          "name": blog.author || "PixelMoon Team"
        },
        "publisher": {
          "@type": "Organization",
          "name": "PixelMoon Store",
          "logo": {
            "@type": "ImageObject",
            "url": "/logo/logo-512.png"
          }
        },
        "datePublished": blog.publishedAt || blog.createdAt,
        "dateModified": blog.updatedAt,
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": url
        }
      };
    }
    
    // Default website structured data
    return {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "PixelMoon Store",
      "description": "Premium gaming topups, VIP tiers, and digital goods store",
      "url": "https://pixelmoonstore.in",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://pixelmoonstore.in/games?search={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    };
  };

  // Remove undefined values from structured data
  const cleanStructuredData = (data) => {
    const cleaned = {};
    Object.keys(data).forEach(key => {
      if (data[key] !== undefined && data[key] !== null) {
        if (typeof data[key] === 'object' && !Array.isArray(data[key])) {
          const cleanedChild = cleanStructuredData(data[key]);
          if (Object.keys(cleanedChild).length > 0) {
            cleaned[key] = cleanedChild;
          }
        } else {
          cleaned[key] = data[key];
        }
      }
    });
    return cleaned;
  };

  const structuredData = cleanStructuredData(generateStructuredData());

  return (
    <>
      {/* Meta tags */}
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="PixelMoon Store" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
    </>
  );
};

export default SEO;