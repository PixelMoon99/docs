// src/components/pages/Admin/NotificationManager.jsx
import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Eye, EyeOff, ExternalLink, Calendar, Bell, Save, X } from 'lucide-react';

const NotificationManager = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingNotification, setEditingNotification] = useState(null);
  const [formData, setFormData] = useState({
    message: '',
    type: 'info',
    priority: 1,
    startDate: '',
    endDate: '',
    link: ''
  });

  const API_BASE = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchNotifications();
  }, []);

 const fetchNotifications = async () => {
  setLoading(true);
  try {
    const response = await fetch(`${API_BASE}/notifications/`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    setNotifications(data.notifications || []);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    alert('Error fetching notifications');
  } finally {
    setLoading(false);
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const payload = {
      ...formData,
      startDate: formData.startDate || new Date().toISOString(),
      endDate: formData.endDate || null
    };

    try {
      const url = editingNotification 
        ? `${API_BASE}/notifications/${editingNotification._id}` 
        : `${API_BASE}/notifications`;
      
      const response = await fetch(url, {
        method: editingNotification ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        await fetchNotifications();
        resetForm();
        alert(`Notification ${editingNotification ? 'updated' : 'created'} successfully!`);
      } else {
        const error = await response.json();
        alert(error.message || 'Error saving notification');
      }
    } catch (error) {
      console.error('Error saving notification:', error);
      alert('Error saving notification');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this notification?')) return;

    try {
      const response = await fetch(`${API_BASE}/notifications/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        await fetchNotifications();
        alert('Notification deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      alert('Error deleting notification');
    }
  };

  const toggleStatus = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/notifications/${id}/toggle`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        await fetchNotifications();
      }
    } catch (error) {
      console.error('Error toggling notification status:', error);
    }
  };

  const handleEdit = (notification) => {
    setEditingNotification(notification);
    setFormData({
      message: notification.message,
      type: notification.type,
      priority: notification.priority,
      startDate: notification.startDate ? new Date(notification.startDate).toISOString().slice(0, 16) : '',
      endDate: notification.endDate ? new Date(notification.endDate).toISOString().slice(0, 16) : '',
      link: notification.link || ''
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      message: '',
      type: 'info',
      priority: 1,
      startDate: '',
      endDate: '',
      link: ''
    });
    setEditingNotification(null);
    setShowForm(false);
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'success': return 'bg-green-100 text-green-800 border-green-300';
      case 'error': return 'bg-red-100 text-red-800 border-red-300';
      case 'promotion': return 'bg-purple-100 text-purple-800 border-purple-300';
      default: return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  const isActive = (notification) => {
  if (!notification.isActive) return false;
  
  const now = new Date();
  const start = new Date(notification.startDate);
  const end = notification.endDate ? new Date(notification.endDate) : null;
  
  const isInDateRange = start <= now && (!end || end >= now);
  return isInDateRange;
};

  return (
    <div className="notification-manager p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Bell className="text-blue-500" />
              Notification Manager
            </h2>
            <p className="text-gray-600 mt-1">Manage site-wide notification banners</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors shadow-md"
          >
            <Plus size={18} />
            New Notification
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  {editingNotification ? 'Edit Notification' : 'Create New Notification'}
                </h3>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={3}
                    placeholder="Enter notification message..."
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Max 500 characters</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="info">Info (Blue)</option>
                      <option value="warning">Warning (Orange)</option>
                      <option value="success">Success (Green)</option>
                      <option value="error">Error (Red)</option>
                      <option value="promotion">Promotion (Purple)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority (1-10)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Higher priority shows first</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date & Time (Optional)
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Leave empty for permanent</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Link (Optional)
                  </label>
                  <input
                    type="url"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com or /games/new-game"
                  />
                  <p className="text-xs text-gray-500 mt-1">Users can click the notification to navigate</p>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Save size={16} />
                    {editingNotification ? 'Update' : 'Create'} Notification
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Notifications List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <Bell size={64} className="mx-auto mb-6 opacity-20" />
              <h3 className="text-xl font-semibold mb-2">No notifications found</h3>
              <p className="text-gray-400">Create your first notification to get started</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Message
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Schedule
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {notifications.map((notification) => (
                    <tr key={notification._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-start">
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900 max-w-md">
                              {notification.message}
                            </div>
                            {notification.link && (
                              <div className="text-xs text-blue-500 flex items-center gap-1 mt-1">
                                <ExternalLink size={12} />
                                <span className="truncate max-w-xs">{notification.link}</span>
                              </div>
                            )}
                            <div className="text-xs text-gray-500 mt-1">
                              Priority: {notification.priority}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getTypeColor(notification.type)}`}>
                          {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`w-3 h-3 rounded-full ${isActive(notification) ? 'bg-green-400' : 'bg-gray-400'}`}></span>
                          <span className="text-sm text-gray-600 font-medium">
                            {isActive(notification) ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {new Date(notification.startDate).toLocaleDateString()}
                            </span>
                            {notification.endDate && (
                              <span className="text-xs text-gray-500">
                                → {new Date(notification.endDate).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => toggleStatus(notification._id)}
                            className={`p-2 rounded-lg transition-colors ${
                              notification.isActive 
                                ? 'text-green-600 hover:bg-green-50' 
                                : 'text-gray-400 hover:bg-gray-50'
                            }`}
                            title={notification.isActive ? 'Deactivate' : 'Activate'}
                          >
                            {notification.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
                          </button>
                          <button
                            onClick={() => handleEdit(notification)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(notification._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationManager;