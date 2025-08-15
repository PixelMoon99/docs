import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Individual mini card component
const BlogCard = ({ blog }) => (
  <div className="col-md-4 col-sm-6 mb-4">
    <Link to={`/blog/${blog.slug}`} className="text-decoration-none">
      <div className="card h-100 shadow-sm blog-card">
        <div className="position-relative overflow-hidden">
          <img 
            src={blog.imageUrl} 
            className="card-img-top blog-image"
            alt={blog.title}
            style={{ height: '200px', objectFit: 'cover', transition: 'transform 0.3s ease' }}
          />
          <div className="position-absolute top-0 end-0 m-2">
            <span className="badge bg-primary">{blog.views || 0} views</span>
          </div>
        </div>
        <div className="card-body d-flex flex-column">
          <h5 className="card-title text-dark mb-2" style={{ fontSize: '1.1rem', lineHeight: '1.3' }}>
            {blog.title}
          </h5>
          <small className="text-muted mt-auto">
            {new Date(blog.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </small>
        </div>
      </div>
    </Link>
  </div>
);

// Main component to display blog cards
const BlogMiniCards = ({ limit = 6, showTitle = true }) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await fetch(`${API_URL}/blogs/published?limit=${limit}`);
      const data = await response.json();
      
      if (data.success) {
        setBlogs(data.blogs);
      } else {
        setError('Failed to fetch blogs');
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setError('Error loading blogs');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading blogs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger text-center">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </div>
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <i className="bi bi-journal-text display-1 text-muted"></i>
          <h4 className="mt-3">No blogs available</h4>
          <p className="text-muted">Check back later for new content</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {showTitle && (
        <div className="text-center mb-5">
          <h2 className="display-6 fw-bold">Latest Blogs</h2>
          <p className="text-muted">Stay updated with our latest articles and insights</p>
        </div>
      )}
      
      <div className="row">
        {blogs.map((blog) => (
          <BlogCard key={blog._id} blog={blog} />
        ))}
      </div>
      
      {blogs.length >= limit && (
        <div className="text-center mt-4">
          <Link to="/blogs" className="btn btn-primary">
            View All Blogs
            <i className="bi bi-arrow-right ms-2"></i>
          </Link>
        </div>
      )}

      <style jsx>{`
        .blog-card:hover .blog-image {
          transform: scale(1.05);
        }
        .blog-card:hover {
          transform: translateY(-2px);
          transition: transform 0.3s ease;
        }
        .card {
          border: none;
          transition: all 0.3s ease;
        }
        .card:hover {
          box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
        }
      `}</style>
    </div>
  );
};

export default BlogMiniCards;