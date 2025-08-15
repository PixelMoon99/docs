import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const BlogsListPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchBlogs();
  }, [page]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/blogs/published?page=${page}&limit=9`);
      const data = await response.json();
      
      if (data.success) {
        setBlogs(data.blogs);
        setTotalPages(data.pages);
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

  if (loading && page === 1) {
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

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold">Our Blogs</h1>
        <p className="lead text-muted">Discover insights, tips, and updates from our team</p>
      </div>

      {blogs.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-journal-text display-1 text-muted"></i>
          <h4 className="mt-3">No blogs available</h4>
          <p className="text-muted">Check back later for new content</p>
        </div>
      ) : (
        <>
          {/* Blog Grid */}
          <div className="row">
            {blogs.map((blog) => (
              <div key={blog._id} className="col-lg-4 col-md-6 mb-4">
                <Link to={`/blog/${blog.slug}`} className="text-decoration-none">
                  <div className="card h-100 shadow-sm blog-card">
                    <div className="position-relative overflow-hidden">
                      <img 
                        src={blog.imageUrl} 
                        className="card-img-top blog-image"
                        alt={blog.title}
                        style={{ height: '250px', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                      />
                      <div className="position-absolute top-0 end-0 m-3">
                        <span className="badge bg-primary bg-opacity-90">
                          {blog.views || 0} views
                        </span>
                      </div>
                    </div>
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title text-dark mb-3" style={{ lineHeight: '1.4' }}>
                        {blog.title}
                      </h5>
                      <p className="card-text text-muted mb-3 flex-grow-1">
                        {(blog.description || '').length > 120 
  ? `${(blog.description || '').substring(0, 120)}...` 
  : (blog.description || '')
}
                      </p>
                      <div className="d-flex justify-content-between align-items-center mt-auto">
                        <small className="text-muted">
                          <i className="bi bi-calendar me-1"></i>
                          {new Date(blog.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </small>
                        <span className="text-primary fw-semibold">
                          Read More
                          <i className="bi bi-arrow-right ms-1"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav aria-label="Blog pagination" className="mt-5">
              <ul className="pagination justify-content-center">
                <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                  <button 
                    className="page-link"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                  >
                    <i className="bi bi-chevron-left"></i>
                    Previous
                  </button>
                </li>
                
                {[...Array(totalPages)].map((_, index) => {
                  const pageNumber = index + 1;
                  if (
                    pageNumber === 1 || 
                    pageNumber === totalPages || 
                    (pageNumber >= page - 1 && pageNumber <= page + 1)
                  ) {
                    return (
                      <li key={pageNumber} className={`page-item ${page === pageNumber ? 'active' : ''}`}>
                        <button 
                          className="page-link"
                          onClick={() => setPage(pageNumber)}
                        >
                          {pageNumber}
                        </button>
                      </li>
                    );
                  } else if (pageNumber === page - 2 || pageNumber === page + 2) {
                    return (
                      <li key={pageNumber} className="page-item disabled">
                        <span className="page-link">...</span>
                      </li>
                    );
                  }
                  return null;
                })}
                
                <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                  <button 
                    className="page-link"
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages}
                  >
                    Next
                    <i className="bi bi-chevron-right"></i>
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </>
      )}

      <style jsx>{`
        .blog-card:hover .blog-image {
          transform: scale(1.05);
        }
        .blog-card:hover {
          transform: translateY(-5px);
          transition: transform 0.3s ease;
        }
        .card {
          border: none;
          transition: all 0.3s ease;
        }
        .card:hover {
          box-shadow: 0 10px 30px rgba(0,0,0,0.15) !important;
        }
        .page-link {
          border-radius: 8px;
          margin: 0 2px;
          border: none;
        }
        .page-item.active .page-link {
          background-color: var(--bs-primary);
          border-color: var(--bs-primary);
        }
      `}</style>
    </div>
  );
};

export default BlogsListPage;