import React, { useState, useEffect } from 'react';
import styles from './ProfitCalculator.module.css';

const ProfitCalculator = () => {
  const [calculations, setCalculations] = useState([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    productName: '',
    socNeeded: '',
    socCost: 1.55,
    sellingPriceReseller: '',
    sellingPriceCustomer: ''
  });
 const API_URL = import.meta.env.VITE_API_URL;
  useEffect(() => {
    fetchCalculations();
  }, []);

  const fetchCalculations = async () => {
    try {
      const response = await fetch(`${API_URL}/profit-calculator`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      if (data.success) setCalculations(data.data);
    } catch (error) {
      console.error('Error fetching calculations:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingId ? `${API_URL}/profit-calculator/${editingId}` : `${API_URL}/profit-calculator`;
      const method = editingId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        fetchCalculations();
        resetForm();
      }
    } catch (error) {
      console.error('Error saving calculation:', error);
    }
  };

  const handleQuickEdit = async (id, field, value) => {
    try {
      const calculation = calculations.find(calc => calc._id === id);
      const updatedData = { ...calculation, [field]: parseFloat(value) };
      
      const response = await fetch(`${API_URL}/profit-calculator/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updatedData)
      });
      
      if (response.ok) {
        fetchCalculations();
      }
    } catch (error) {
      console.error('Error updating calculation:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      productName: '',
      socNeeded: '',
      socCost: 1.55,
      sellingPriceReseller: '',
      sellingPriceCustomer: ''
    });
    setIsAddingNew(false);
    setEditingId(null);
  };

  const handleEdit = (calculation) => {
    setFormData({
      productName: calculation.productName,
      socNeeded: calculation.socNeeded,
      socCost: calculation.socCost,
      sellingPriceReseller: calculation.sellingPriceReseller,
      sellingPriceCustomer: calculation.sellingPriceCustomer
    });
    setEditingId(calculation._id);
    setIsAddingNew(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this calculation?')) {
      try {
        await fetch(`${API_URL}/profit-calculator/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        fetchCalculations();
      } catch (error) {
        console.error('Error deleting calculation:', error);
      }
    }
  };

  const getProfitColor = (profit) => {
    if (profit > 15) return styles.profitHigh;
    if (profit >= 1 && profit <= 14) return styles.profitMedium;
    return styles.profitLow;
  };

  const formatCurrency = (amount) => {
    return `₹${parseFloat(amount).toFixed(2)}`;
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredCalculations = calculations.filter(calc =>
    calc.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportToExcel = () => {
    const csvContent = [
      ['Product Name', 'SOC Needed', 'SOC Cost', 'Total Cost', 'SP to Reseller', 'Reseller Profit', 'SP to Customer', 'Customer Profit', 'Orders Done'],
      ...filteredCalculations.map(calc => [
        calc.productName,
        calc.socNeeded,
        calc.socCost,
        calc.totalCost,
        calc.sellingPriceReseller,
        calc.resellerProfit,
        calc.sellingPriceCustomer,
        calc.customerProfit,
        calc.ordersCount
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'profit_calculations.csv';
    a.click();
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Admin Profit Calculator</h2>
        <div className={styles.headerActions}>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <button onClick={exportToExcel} className={styles.exportBtn}>
            Export Excel
          </button>
          <button 
            className={styles.addBtn}
            onClick={() => setIsAddingNew(true)}
          >
            Add New Product
          </button>
        </div>
      </div>

      {isAddingNew && (
        <div className={styles.formContainer}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <input
              type="text"
              placeholder="Product Name"
              value={formData.productName}
              onChange={(e) => setFormData({...formData, productName: e.target.value})}
              required
            />
            <input
              type="number"
              placeholder="SOC Needed"
              value={formData.socNeeded}
              onChange={(e) => setFormData({...formData, socNeeded: e.target.value})}
              required
            />
            <input
              type="number"
              step="0.01"
              placeholder="SOC Cost (₹)"
              value={formData.socCost}
              onChange={(e) => setFormData({...formData, socCost: e.target.value})}
              required
            />
            <input
              type="number"
              step="0.01"
              placeholder="SP to Reseller (₹)"
              value={formData.sellingPriceReseller}
              onChange={(e) => setFormData({...formData, sellingPriceReseller: e.target.value})}
              required
            />
            <input
              type="number"
              step="0.01"
              placeholder="SP to Customer (₹)"
              value={formData.sellingPriceCustomer}
              onChange={(e) => setFormData({...formData, sellingPriceCustomer: e.target.value})}
              required
            />
            <div className={styles.formActions}>
              <button type="submit">{editingId ? 'Update' : 'Add'}</button>
              <button type="button" onClick={resetForm}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>SOC Needed</th>
              <th>SOC Cost (₹)</th>
              <th>Total Cost (₹)</th>
              <th>SP to Reseller (₹)</th>
              <th>Reseller Profit (₹)</th>
              <th>SP to Customer (₹)</th>
              <th>Customer Profit (₹)</th>
              <th>Orders Done</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCalculations.map((calc) => (
              <React.Fragment key={calc._id}>
                <tr>
                  <td className={styles.productName}>{calc.productName}</td>
                  <td>
                    <input
                      type="number"
                      value={calc.socNeeded}
                      onChange={(e) => handleQuickEdit(calc._id, 'socNeeded', e.target.value)}
                      className={styles.editableCell}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      step="0.01"
                      value={calc.socCost}
                      onChange={(e) => handleQuickEdit(calc._id, 'socCost', e.target.value)}
                      className={styles.editableCell}
                    />
                  </td>
                  <td className={styles.calculatedField}>
                    {formatCurrency(calc.totalCost)}
                  </td>
                  <td>
                    <input
                      type="number"
                      step="0.01"
                      value={calc.sellingPriceReseller}
                      onChange={(e) => handleQuickEdit(calc._id, 'sellingPriceReseller', e.target.value)}
                      className={styles.editableCell}
                    />
                  </td>
                  <td className={`${styles.calculatedField} ${getProfitColor(calc.resellerProfit)}`}>
                    {formatCurrency(calc.resellerProfit)}
                  </td>
                  <td>
                    <input
                      type="number"
                      step="0.01"
                      value={calc.sellingPriceCustomer}
                      onChange={(e) => handleQuickEdit(calc._id, 'sellingPriceCustomer', e.target.value)}
                      className={styles.editableCell}
                    />
                  </td>
                  <td className={`${styles.calculatedField} ${getProfitColor(calc.customerProfit)}`}>
                    {formatCurrency(calc.customerProfit)}
                  </td>
                  <td className={styles.ordersCount}>{calc.ordersCount} orders</td>
                  <td>
                    <button onClick={() => handleEdit(calc)} className={styles.editBtn}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(calc._id)} className={styles.deleteBtn}>
                      Delete
                    </button>
                  </td>
                </tr>
                <tr className={styles.metaRow}>
                  <td colSpan="10" className={styles.metaInfo}>
                    Last edited by: {calc.lastEditedBy} on {formatDateTime(calc.updatedAt)}
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProfitCalculator;