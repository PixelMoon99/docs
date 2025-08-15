import React, { useState, useEffect } from 'react';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    orderId: '',
    transactionId: '',
    userId: '',
    status: '',
    provider: '',
    dateFrom: '',
    dateTo: '',
    userRole: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });

  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchOrders();
  }, [pagination.page]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        ...filters
      });

      const response = await fetch(`${API_URL}/orders/admin?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await response.json();
      if (data.success) {
        setOrders(data.orders);
        setPagination(prev => ({
          ...prev,
          total: data.total,
          totalPages: data.totalPages
        }));
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleSearch = () => {
    fetchOrders();
  };

  const clearFilters = () => {
    setFilters({
      orderId: '',
      transactionId: '',
      userId: '',
      status: '',
      provider: '',
      dateFrom: '',
      dateTo: '',
      userRole: ''
    });
    setPagination(prev => ({ ...prev, page: 1 }));
    setTimeout(fetchOrders, 100);
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      'pending': 'bg-warning',
      'awaiting_payment': 'bg-info',
      'paid': 'bg-primary',
      'processing': 'bg-secondary',
      'completed': 'bg-success',
      'failed': 'bg-danger',
      'refunded': 'bg-dark'
    };
    return `badge ${statusColors[status] || 'bg-secondary'}`;
  };

  const handleRefund = async (orderId) => {
    if (!confirm('Are you sure you want to refund this order?')) return;

    const reason = prompt('Enter refund reason:');
    if (!reason) return;

    try {
      const response = await fetch(`${API_URL}/orders/refund/${orderId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ reason })
      });

      const data = await response.json();
      if (data.success) {
        alert('Order refunded successfully');
        fetchOrders();
      } else {
        alert(data.message || 'Refund failed');
      }
    } catch (error) {
      console.error('Refund error:', error);
      alert('Refund failed');
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Order Management</h2>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary" onClick={clearFilters}>
            Clear Filters
          </button>
          <button className="btn btn-primary" onClick={handleSearch}>
            <i className="bi bi-search me-2"></i>Search
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label">Order ID</label>
              <input
                type="text"
                className="form-control"
                placeholder="ORD-123..."
                value={filters.orderId}
                onChange={(e) => handleFilterChange('orderId', e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Transaction ID</label>
              <input
                type="text"
                className="form-control"
                placeholder="TXN-123..."
                value={filters.transactionId}
                onChange={(e) => handleFilterChange('transactionId', e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">User ID</label>
              <input
                type="text"
                className="form-control"
                placeholder="User ID or Email"
                value={filters.userId}
                onChange={(e) => handleFilterChange('userId', e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="awaiting_payment">Awaiting Payment</option>
                <option value="paid">Paid</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">Provider</label>
              <select
                className="form-select"
                value={filters.provider}
                onChange={(e) => handleFilterChange('provider', e.target.value)}
              >
                <option value="">All Providers</option>
                <option value="smile.one">Smile.one</option>
                <option value="yokcash">Yokcash</option>
                <option value="hopestore">Hopestore</option>
                <option value="voucher">Voucher</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">User Type</label>
              <select
                className="form-select"
                value={filters.userRole}
                onChange={(e) => handleFilterChange('userRole', e.target.value)}
              >
                <option value="">All Users</option>
                <option value="user">Regular Users</option>
                <option value="reseller">Resellers</option>
                <option value="admin">Admins</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">Date From</label>
              <input
                type="date"
                className="form-control"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Date To</label>
              <input
                type="date"
                className="form-control"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card">
        <div className="card-body">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary"></div>
              <p className="mt-2">Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-inbox display-1 text-muted"></i>
              <h4 className="mt-3">No orders found</h4>
              <p className="text-muted">Try adjusting your filters</p>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-dark">
                    <tr>
                      <th>Order ID</th>
                      <th>User</th>
                      <th>Game</th>
                      <th>Pack</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Provider</th>
                      <th>Payment</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id}>
                        <td>
                          <code className="text-primary">{order.orderId}</code>
                        </td>
                        <td>
                          <div>
                            <strong>{order.user?.name}</strong>
                            <br />
                            <small className="text-muted">{order.user?.email}</small>
                            <br />
                            <span className={`badge ${order.user?.role === 'reseller' ? 'bg-warning' : 'bg-info'}`}>
                              {order.user?.role}
                            </span>
                          </div>
                        </td>
                        <td>
                          <div>
                            <strong>{order.game?.name || 'N/A'}</strong>
                            <br />
                            <small className="text-muted">
                              ID: {order.gameUserInfo?.userId}
                              {order.gameUserInfo?.serverId && ` | Server: ${order.gameUserInfo.serverId}`}
                            </small>
                          </div>
                        </td>
                        <td>
                          <div>
                            <strong>{order.pack?.name}</strong>
                            <br />
                            <small className="text-muted">{order.pack?.amount}</small>
                          </div>
                        </td>
                        <td>
                          <div>
                            <strong>₹{order.pack?.price}</strong>
                            {order.profit && (
                              <>
                                <br />
                                <small className={`text-${order.profit > 0 ? 'success' : 'danger'}`}>
                                  Profit: ₹{order.profit}
                                </small>
                              </>
                            )}
                          </div>
                        </td>
                        <td>
                          <div>
                            <span className={getStatusBadge(order.status)}>
                              {order.status}
                            </span>
                            {order.failureReason && (
                              <>
                                <br />
                                <small className="text-danger" title={order.failureReason}>
                                  Failed
                                </small>
                              </>
                            )}
                          </div>
                        </td>
                        <td>
                          <div>
                            <span className="badge bg-secondary">
                              {order.apiOrder?.provider}
                            </span>
                            {order.apiOrder?.apiOrderId && (
                              <>
                                <br />
                                <small className="text-muted">
                                  API: {order.apiOrder.apiOrderId}
                                </small>
                              </>
                            )}
                          </div>
                        </td>
                        <td>
                          <div>
                            <strong>{order.paymentInfo?.method?.toUpperCase()}</strong>
                            <br />
                            <small className="text-muted">
                              {order.paymentInfo?.transactionId?.substring(0, 10)}...
                            </small>
                          </div>
                        </td>
                        <td>
                          <small>
                            {new Date(order.createdAt).toLocaleDateString()}
                            <br />
                            {new Date(order.createdAt).toLocaleTimeString()}
                          </small>
                        </td>
                        <td>
                          <div className="btn-group-vertical btn-group-sm">
                            <button
                              className="btn btn-outline-info"
                              onClick={() => window.open(`/admin/order/${order._id}`, '_blank')}
                              title="View Details"
                            >
                              <i className="bi bi-eye"></i>
                            </button>
                            {(['completed', 'failed'].includes(order.status) && order.status !== 'refunded') && (
                              <button
                                className="btn btn-outline-warning"
                                onClick={() => handleRefund(order.orderId)}
                                title="Refund"
                              >
                                <i className="bi bi-arrow-counterclockwise"></i>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <nav className="mt-4">
                  <ul className="pagination justify-content-center">
                    <li className={`page-item ${pagination.page === 1 ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                        disabled={pagination.page === 1}
                      >
                        Previous
                      </button>
                    </li>
                    
                    {[...Array(Math.min(5, pagination.totalPages))].map((_, index) => {
                      const page = index + Math.max(1, pagination.page - 2);
                      if (page <= pagination.totalPages) {
                        return (
                          <li key={page} className={`page-item ${pagination.page === page ? 'active' : ''}`}>
                            <button
                              className="page-link"
                              onClick={() => setPagination(prev => ({ ...prev, page }))}
                            >
                              {page}
                            </button>
                          </li>
                        );
                      }
                      return null;
                    })}
                    
                    <li className={`page-item ${pagination.page === pagination.totalPages ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                        disabled={pagination.page === pagination.totalPages}
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                  
                  <div className="text-center mt-2">
                    <small className="text-muted">
                      Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} orders
                    </small>
                  </div>
                </nav>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;