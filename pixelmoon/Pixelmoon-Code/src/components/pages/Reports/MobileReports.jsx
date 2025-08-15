import React, { useState, useEffect } from 'react';
import { CreditCard, ShoppingBag, RefreshCw, Filter, Search, X } from 'lucide-react';
import MobileBottomNav from '../Home/MobileBottomNav';
import styles from './MobileReports.module.css';

const MobileReports = () => {
  const [activeTab, setActiveTab] = useState('payment');
  const [filterOpen, setFilterOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Data states
  const [payments, setPayments] = useState([]);
  const [orders, setOrders] = useState([]);
  
  // Filter states
  const [filters, setFilters] = useState({
    period: '',
    from: '',
    to: ''
  });

  const API_URL = import.meta.env.VITE_API_URL || 'https://pixelmoonstore.in/api';

  // Fetch payments data
  const fetchPayments = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.period) params.append('period', filters.period);
      if (filters.from) params.append('from', filters.from);
      if (filters.to) params.append('to', filters.to);

      const response = await fetch(`${API_URL}/payments?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setPayments(data.payments || []);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch orders data
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.period) params.append('period', filters.period);
      if (filters.from) params.append('from', filters.from);
      if (filters.to) params.append('to', filters.to);

      const response = await fetch(`${API_URL}/orders?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data based on active tab
  const fetchData = () => {
    if (activeTab === 'payment') {
      fetchPayments();
    } else if (activeTab === 'order') {
      fetchOrders();
    }
  };

  // Effect to fetch data when component mounts or tab changes
  useEffect(() => {
    fetchData();
  }, [activeTab]);

  // Handle search
  const handleSearch = () => {
    fetchData();
    setFilterOpen(false);
  };

  // Handle clear filters
  const handleClear = () => {
    setFilters({ period: '', from: '', to: '' });
    setTimeout(() => {
      fetchData();
      setFilterOpen(false);
    }, 100);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case 'success':
        return styles.statusSuccess;
      case 'pending':
        return styles.statusPending;
      case 'failed':
        return styles.statusFailed;
      default:
        return styles.statusDefault;
    }
  };

  // Get current data based on active tab
  const getCurrentData = () => {
    if (activeTab === 'payment') return payments;
    if (activeTab === 'order') return orders;
    return [];
  };

  const currentData = getCurrentData();

  return (
    <div className={styles.reportsPage}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => window.history.back()}>‹</button>
        <h1>All Reports</h1>
      </div>

      <div className={styles.tabsContainer}>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'payment' ? styles.active : ''}`}
            onClick={() => setActiveTab('payment')}
          >
            Payment
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'order' ? styles.active : ''}`}
            onClick={() => setActiveTab('order')}
          >
            Order
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'pre-order' ? styles.active : ''}`}
            onClick={() => setActiveTab('pre-order')}
          >
            Pre-order
          </button>
        </div>
        
        <button 
          className={styles.filterButton}
          onClick={() => setFilterOpen(!filterOpen)}
        >
          <Filter size={16} />
        </button>
      </div>

      {/* Mobile Filter Panel */}
      {filterOpen && (
        <div className={styles.mobileFilterPanel}>
          <div className={styles.filterHeader}>
            <h4>Filters</h4>
            <button onClick={() => setFilterOpen(false)}>
              <X size={20} />
            </button>
          </div>
          
          <div className={styles.filterContent}>
            <div className={styles.filterGroup}>
              <label>Period</label>
              <select
                value={filters.period}
                onChange={(e) => setFilters({ ...filters, period: e.target.value })}
              >
                <option value="">Select Period</option>
                <option value="this-week">This Week</option>
                <option value="last-week">Last Week</option>
                <option value="this-month">This Month</option>
                <option value="last-month">Last Month</option>
                <option value="all">All</option>
              </select>
            </div>
            
            <div className={styles.filterGroup}>
              <label>From Date</label>
              <input
                type="date"
                value={filters.from}
                onChange={(e) => setFilters({ ...filters, from: e.target.value })}
              />
            </div>
            
            <div className={styles.filterGroup}>
              <label>To Date</label>
              <input
                type="date"
                value={filters.to}
                onChange={(e) => setFilters({ ...filters, to: e.target.value })}
              />
            </div>
            
            <div className={styles.filterActions}>
              <button className={styles.searchBtn} onClick={handleSearch}>
                <Search size={16} />
                Search
              </button>
              <button className={styles.clearBtn} onClick={handleClear}>
                <X size={16} />
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={styles.content}>
        <p className={styles.totalCount}>
          Total {activeTab === 'payment' ? 'Payments' : 'Orders'}: {currentData.length}
        </p>
        
        {loading ? (
          <div className={styles.loadingState}>
            <RefreshCw size={24} className={styles.spinning} />
            <span>Loading {activeTab}s...</span>
          </div>
        ) : currentData.length === 0 ? (
          <div className={styles.emptyState}>
            {activeTab === 'payment' ? <CreditCard size={48} /> : <ShoppingBag size={48} />}
            <h3>No {activeTab === 'payment' ? 'Payment History' : 'Orders'} Found</h3>
            <p>Your {activeTab} history will appear here once you make your first {activeTab}.</p>
          </div>
        ) : (
          <div className={styles.dataList}>
            {activeTab === 'payment' && payments.map((payment) => (
              <div key={payment._id} className={styles.paymentCard}>
                <div className={styles.cardHeader}>
                  <span className={styles.transactionId}>#{payment.transactionId}</span>
                  <span className={`${styles.status} ${getStatusBadgeClass(payment.status)}`}>
                    {payment.status}
                  </span>
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.amount}>₹{payment.amount.toFixed(2)}</div>
                  <div className={styles.method}>
                    <CreditCard size={16} />
                    {payment.method}
                  </div>
                  <div className={styles.purpose}>{payment.purpose}</div>
                  <div className={styles.date}>{formatDate(payment.createdAt)}</div>
                </div>
                {payment.status === 'failed' && payment.failureReason && (
                  <div className={styles.failureReason}>
                    <p>Reason: {payment.failureReason}</p>
                  </div>
                )}
              </div>
            ))}
            
            {activeTab === 'order' && orders.map((order) => (
              <div key={order._id} className={styles.orderCard}>
                <div className={styles.cardHeader}>
                  <span className={styles.orderId}>#{order.orderId}</span>
                  <span className={`${styles.status} ${getStatusBadgeClass(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.packName}>{order.pack?.name}</div>
                  <div className={styles.gameId}>Game ID: {order.gameUserInfo?.userId}</div>
                  <div className={styles.amount}>₹{order.pack?.price}</div>
                  <div className={styles.date}>{new Date(order.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
            ))}
            
            {activeTab === 'pre-order' && (
              <div className={styles.emptyState}>
                <ShoppingBag size={48} />
                <h3>Pre-orders Coming Soon</h3>
                <p>This feature will be available in future updates.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <MobileBottomNav />
    </div>
  );
};

export default MobileReports;