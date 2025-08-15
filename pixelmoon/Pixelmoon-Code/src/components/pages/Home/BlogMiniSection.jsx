import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './MobileHome.module.css';

const BlogMiniSection = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/blogs/published?limit=3`);
      const data = await response.json();
      if (data.success) {
        setBlogs(data.blogs);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading blogs...</div>;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
      {blogs.map(blog => (
        <Link key={blog._id} to={`/blog/${blog.slug}`} className={styles.blogCard}>
          <img src={blog.imageUrl} alt={blog.title} className={styles.blogImage} />
          <div className={styles.blogContent}>
            <h3 className={styles.blogTitle}>{blog.title}</h3>
            <p className={styles.blogMeta}>
              {new Date(blog.createdAt).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default BlogMiniSection;