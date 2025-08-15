import React, { useState, useEffect } from 'react';
import { Search, Users, UserCheck, UserX, Loader2, AlertCircle, CheckCircle, Trash2, Ban, Shield } from 'lucide-react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [updatingUsers, setUpdatingUsers] = useState(new Set());
  const [showConfirmDialog, setShowConfirmDialog] = useState({ show: false, userId: '', action: '', userName: '' });

  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/auth/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.status}`);
      }

      const data = await response.json();
      setUsers(data.users || data);
      setFilteredUsers(data.users || data);
    } catch (err) {
      setError(err.message || 'Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter users based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user => {
        const name = user.name || '';
        const email = user.email || '';
        return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               email.toLowerCase().includes(searchTerm.toLowerCase());
      });
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  // Show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  // Update user role
  const updateUserRole = async (userId, newRole) => {
    try {
      setUpdatingUsers(prev => new Set([...prev, userId]));
      
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/auth/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update user role: ${response.status}`);
      }

      // Update local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user._id === userId ? { ...user, role: newRole } : user
        )
      );

      const actionText = newRole === 'reseller' ? 'promoted to reseller' : 'demoted to user';
      showNotification(`User successfully ${actionText}`, 'success');

    } catch (err) {
      showNotification(err.message || 'Failed to update user role', 'error');
      console.error('Error updating user role:', err);
    } finally {
      setUpdatingUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  // Delete user
  const deleteUser = async (userId) => {
    try {
      setUpdatingUsers(prev => new Set([...prev, userId]));
      
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/auth/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete user: ${response.status}`);
      }

      // Remove user from local state
      setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
      showNotification('User deleted successfully', 'success');

    } catch (err) {
      showNotification(err.message || 'Failed to delete user', 'error');
      console.error('Error deleting user:', err);
    } finally {
      setUpdatingUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
      setShowConfirmDialog({ show: false, userId: '', action: '', userName: '' });
    }
  };

  // Toggle user status (block/unblock)
  const toggleUserStatus = async (userId) => {
    try {
      setUpdatingUsers(prev => new Set([...prev, userId]));
      
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/auth/users/${userId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to update user status: ${response.status}`);
      }

      const data = await response.json();
      
      // Update local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user._id === userId ? { ...user, isActive: data.user.isActive } : user
        )
      );

      showNotification(data.message, 'success');

    } catch (err) {
      showNotification(err.message || 'Failed to update user status', 'error');
      console.error('Error updating user status:', err);
    } finally {
      setUpdatingUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
      setShowConfirmDialog({ show: false, userId: '', action: '', userName: '' });
    }
  };

  // Handle confirm action
  const handleConfirmAction = () => {
    const { userId, action } = showConfirmDialog;
    if (action === 'delete') {
      deleteUser(userId);
    } else if (action === 'block' || action === 'unblock') {
      toggleUserStatus(userId);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchUsers();
  }, []);

  const getRoleColor = (role) => {
    switch(role) {
      case 'admin':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'reseller':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRowClass = (user) => {
    if (user.role === 'reseller') return 'bg-blue-50';
    if (!user.isActive) return 'bg-red-50';
    return '';
  };

  const getStatusBadge = (isActive) => {
    return isActive ? (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
        <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
        Active
      </span>
    ) : (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
        <div className="w-2 h-2 bg-red-400 rounded-full mr-1"></div>
        Blocked
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading users...</span>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <Users className="w-6 h-6 text-gray-700 mr-2" />
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        </div>
        <p className="text-gray-600">Manage user roles, permissions, and account status</p>
      </div>

      {/* Notification */}
      {notification.show && (
        <div className={`mb-4 p-4 rounded-lg border ${
          notification.type === 'success' 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <div className="flex items-center">
            {notification.type === 'success' ? (
              <CheckCircle className="w-5 h-5 mr-2" />
            ) : (
              <AlertCircle className="w-5 h-5 mr-2" />
            )}
            {notification.message}
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirmDialog.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <AlertCircle className="w-6 h-6 text-red-600 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Confirm Action</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to {showConfirmDialog.action} user "{showConfirmDialog.userName}"?
              {showConfirmDialog.action === 'delete' && ' This action cannot be undone.'}
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleConfirmAction}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  showConfirmDialog.action === 'delete'
                    ? 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
                    : 'bg-orange-600 text-white hover:bg-orange-700 focus:ring-orange-500'
                }`}
              >
                Yes, {showConfirmDialog.action}
              </button>
              <button
                onClick={() => setShowConfirmDialog({ show: false, userId: '', action: '', userName: '' })}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center text-red-800">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    {searchTerm ? 'No users found matching your search.' : 'No users found.'}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id} className={`hover:bg-gray-50 ${getRowClass(user)}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {user.name || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">
                        {user.email || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
                        {user.role === 'user' ? 'User' : user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(user.isActive)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {user.role !== 'admin' ? (
                        <div className="flex space-x-2">
                          {/* Role Toggle */}
                          <button
                            onClick={() => updateUserRole(
                              user._id, 
                              user.role === 'reseller' ? 'user' : 'reseller'
                            )}
                            disabled={updatingUsers.has(user._id)}
                            className={`inline-flex items-center px-2 py-1 border border-transparent text-xs leading-4 font-medium rounded focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                              user.role === 'reseller'
                                ? 'text-red-700 bg-red-100 hover:bg-red-200 focus:ring-red-500'
                                : 'text-blue-700 bg-blue-100 hover:bg-blue-200 focus:ring-blue-500'
                            } ${updatingUsers.has(user._id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            {updatingUsers.has(user._id) ? (
                              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                            ) : user.role === 'reseller' ? (
                              <UserX className="w-3 h-3 mr-1" />
                            ) : (
                              <UserCheck className="w-3 h-3 mr-1" />
                            )}
                            {user.role === 'reseller' ? 'Demote' : 'Promote'}
                          </button>

                          {/* Block/Unblock */}
                          <button
                            onClick={() => setShowConfirmDialog({
                              show: true,
                              userId: user._id,
                              action: user.isActive ? 'block' : 'unblock',
                              userName: user.name
                            })}
                            disabled={updatingUsers.has(user._id)}
                            className={`inline-flex items-center px-2 py-1 border border-transparent text-xs leading-4 font-medium rounded focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                              user.isActive
                                ? 'text-orange-700 bg-orange-100 hover:bg-orange-200 focus:ring-orange-500'
                                : 'text-green-700 bg-green-100 hover:bg-green-200 focus:ring-green-500'
                            }`}
                          >
                            {user.isActive ? (
                              <>
                                <Ban className="w-3 h-3 mr-1" />
                                Block
                              </>
                            ) : (
                              <>
                                <Shield className="w-3 h-3 mr-1" />
                                Unblock
                              </>
                            )}
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => setShowConfirmDialog({
                              show: true,
                              userId: user._id,
                              action: 'delete',
                              userName: user.name
                            })}
                            disabled={updatingUsers.has(user._id)}
                            className="inline-flex items-center px-2 py-1 border border-transparent text-xs leading-4 font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Delete
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm flex items-center">
                          <Shield className="w-4 h-4 mr-1" />
                          Admin (Protected)
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats Footer */}
      <div className="mt-4 text-sm text-gray-600">
        Showing {filteredUsers.length} of {users.length} users
        {searchTerm && ` matching "${searchTerm}"`}
      </div>
    </div>
  );
};

export default AdminUsers;