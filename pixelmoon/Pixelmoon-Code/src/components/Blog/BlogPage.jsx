import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const BlogPage = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchBlog();
  }, [slug]);

  const fetchBlog = async () => {
    try {
      const response = await fetch(`${API_URL}/blogs/${slug}`);
      const data = await response.json();
      
      if (data.success) {
        setBlog(data.blog);
      } else {
        setError('Blog not found');
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
      setError('Error loading blog');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Loading blog...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="text-center">
              <i className="bi bi-exclamation-triangle display-1 text-muted"></i>
              <h2 className="mt-3">Blog Not Found</h2>
              <p className="text-muted mb-4">{error || 'The blog you are looking for does not exist.'}</p>
              <Link to="/blogs" className="btn btn-primary">
                <i className="bi bi-arrow-left me-2"></i>
                Back to Blogs
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          {/* Back Button */}
          <div className="mb-4">
            <Link to="/blogs" className="btn btn-outline-primary">
              <i className="bi bi-arrow-left me-2"></i>
              Back to Blogs
            </Link>
          </div>

          {/* Blog Content */}
          <article className="blog-article">
            <header className="mb-4">
              <h1 className="display-5 fw-bold mb-3">{blog.title}</h1>
            </header>

            {/* Meta tags if present */}
            {Array.isArray(blog?.tags) && blog.tags.length>0 && (
              <div className="mb-3">
                {blog.tags.map((t, idx)=> (
                  <span key={idx} className="badge bg-secondary me-1">{t}</span>
                ))}
              </div>
            )}

            {/* Featured Image */}
            {blog.imageUrl && (
              <div className="mb-4">
                <img 
                  src={blog.imageUrl} 
                  alt={blog.title}
                  className="img-fluid rounded shadow-sm w-100"
                  style={{ maxHeight: '400px', objectFit: 'cover' }}
                />
              </div>
            )}

            {/* Blog Content */}
            <div className="blog-content">
              <div className="fs-5 lh-lg" style={{ whiteSpace: 'pre-wrap' }}>
                {blog.description}
              </div>
            </div>

            {/* Share Section */}
            <div className="mt-5 pt-4 border-top">
              <h5 className="mb-3">Share this blog</h5>
              <div className="d-flex gap-2">
                <button 
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => {
                    const url = window.location.href;
                    const text = `Check out this blog: ${blog.title}`;
                    if (navigator.share) {
                      navigator.share({ title: blog.title, text, url });
                    } else {
                      navigator.clipboard.writeText(url);
                      alert('Link copied to clipboard!');
                    }
                  }}
                >
                  <i className="bi bi-share me-1"></i>
                  Share
                </button>
                <a 
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(blog.title)}&url=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-info btn-sm"
                >
                  <i className="bi bi-twitter me-1"></i>
                  Twitter
                </a>
                <a 
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-primary btn-sm"
                >
                  <i className="bi bi-facebook me-1"></i>
                  Facebook
                </a>
              </div>
            </div>
          </article>
        </div>
      </div>

      <style jsx>{`
        .blog-article {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
        }
        
        .blog-content {
          font-family: 'Georgia', serif;
          line-height: 1.8;
          color: #333;
        }
        
        @media (max-width: 768px) {
          .blog-article {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default BlogPage;