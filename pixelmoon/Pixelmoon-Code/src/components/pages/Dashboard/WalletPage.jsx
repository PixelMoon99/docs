import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight, 
  X, 
  RefreshCw,
  Search 
} from 'lucide-react';
import { FilterPanel } from './Filter';
import styles from './WalletPage.module.css';

export const WalletPage = () => {
  const [walletData, setWalletData] = useState({
    balance: 0,
    history: []
  });

  const [loading, setLoading] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('transaction');
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [addMoneyAmount, setAddMoneyAmount] = useState('');
  const [filters, setFilters] = useState({
    period: '',
    from: '',
    to: ''
  });
const API_URL = import.meta.env.VITE_API_URL || 'https://pixelmoonstore.in/api';
  const fetchWalletData = async () => {
  setLoading(true);
  try {
    // Get token from localStorage or your auth context
    const token = localStorage.getItem('token'); // or however you store your token
    
    if (!token) {
      console.error('No authentication token found');
      return;
    }

    // Fetch user balance
    const resp = await fetch(`${API_URL}/wallet/balance`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (resp.ok) {
      const data = await resp.json();
      setWalletData(prev => ({ 
        ...prev, 
        balance: parseFloat(data.data.balanceRupees) || 0 
      }));
    }

    // Fetch wallet history
    const page = 1;
    const histresp = await fetch(`${API_URL}/wallet/transactions?page=${page}&limit=10`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (histresp.ok) {
      const data = await histresp.json();
      // Map backend transaction format to frontend format
      const mappedHistory = data.data.transactions.map(transaction => ({
        _id: transaction._id,
        description: transaction.description,
        createdAt: transaction.createdAt,
        amount: transaction.amountPaise / 100, // Convert paise to rupees
        type: transaction.type === 'DEPOSIT' || transaction.type === 'CREDIT' || transaction.type === 'REFUND' ? 'credit' : 'debit'
      }));
      
      setWalletData(prev => ({ 
        ...prev, 
        history: mappedHistory 
      }));
    }
  } catch (error) {
    console.error('Error fetching wallet data:', error);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchWalletData();
  }, [activeTab]);

  const handleAddMoney = async (e) => {
  e.preventDefault();
  if (!addMoneyAmount || parseFloat(addMoneyAmount) <= 0) return;

  const token = localStorage.getItem('token');
  if (!token) {
    alert('Please login to continue');
    return;
  }

  setLoading(true);
  try {
    const response = await fetch(`${API_URL}/wallet/deposit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        amount: parseFloat(addMoneyAmount),
        // 🚨 REMOVE THIS LINE FOR PRODUCTION:
        // isStub: true
        
        // 🎯 FOR PRODUCTION: Remove isStub completely to use real PhonePe
      })
    });

    if (response.ok) {
      const result = await response.json();
      
      // 🎯 NEW: Handle PhonePe redirect for production
      if (result.data && result.data.redirectRequired && result.data.checkoutUrl) {
        // This will redirect to PhonePe payment page
        window.location.href = result.data.checkoutUrl;
      } else {
        // For stub payments (testing only)
        alert(result.message || 'Money added successfully!');
        setShowAddMoney(false);
        setAddMoneyAmount('');
        fetchWalletData();
      }
    } else {
      const error = await response.json();
      alert(error.message || 'Failed to add money');
    }
  } catch (error) {
    console.error('Error adding money:', error);
    alert('Failed to process request');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className={styles.walletPage}>
      <div className={styles.pageHeader}>
        <h2>My Wallet</h2>
        <p>Manage your wallet balance and transaction history</p>
      </div>

      <div className={styles.walletBalanceCard}>
        <div className={styles.balanceInfo}>
          <h3>Current Balance</h3>
          <p className={styles.balanceAmount}>₹{walletData.balance.toFixed(2)}</p>
        </div>
        <div className={styles.walletActions}>
          <button 
            className={styles.addMoneyBtn}
            onClick={() => setShowAddMoney(true)}
          >
            <Plus size={16} />
            Add Money
          </button>
        </div>
      </div>

      <div className={styles.walletTabs}>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'transaction' ? styles.active : ''}`}
          onClick={() => setActiveTab('transaction')}
        >
          Transaction History
        </button>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'cashback' ? styles.active : ''}`}
          onClick={() => setActiveTab('cashback')}
        >
          Cashback History
        </button>
      </div>

      <FilterPanel
        isOpen={filterOpen}
        togglePanel={() => setFilterOpen(!filterOpen)}
        filters={filters}
        setFilters={setFilters}
        onSearch={fetchWalletData}
        onClear={() => {
          setFilters({ period: '', from: '', to: '' });
          fetchWalletData();
        }}
      />

      <div className={styles.walletHistoryContainer}>
        {loading ? (
          <div className={styles.loadingState}>
            <RefreshCw size={24} />
            <span>Loading wallet history...</span>
          </div>
        ) : walletData.history.length === 0 ? (
          <div className={styles.emptyState}>
            <Wallet size={48} />
            <h3>No {activeTab} History</h3>
            <p>Your {activeTab} history will appear here.</p>
          </div>
        ) : (
          <div className={styles.historyList}>
            {walletData.history.map((item) => (
              <div key={item._id} className={styles.historyItem}>
                <div className={styles.historyIcon}>
                  {item.type === 'credit' ? 
                    <ArrowUpRight className={styles.creditIcon} size={20} /> : 
                    <ArrowDownRight className={styles.debitIcon} size={20} />
                  }
                </div>
                <div className={styles.historyDetails}>
                  <h4>{item.description}</h4>
                  <p>{new Date(item.createdAt).toLocaleString()}</p>
                </div>
                <div className={`${styles.historyAmount} ${styles[item.type]}`}>
                  {item.type === 'credit' ? '+' : '-'}₹{item.amount.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAddMoney && (
        <div className={styles.modalOverlay} onClick={() => setShowAddMoney(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Add Money to Wallet</h3>
              <button 
                className={styles.modalClose}
                onClick={() => setShowAddMoney(false)}
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddMoney} className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label>Amount</label>
                <input
                  type="number"
                  className={styles.formControl}
                  placeholder="Enter amount"
                  value={addMoneyAmount}
                  onChange={(e) => setAddMoneyAmount(e.target.value)}
                  min="1"
                  step="1"
                  required
                />
              </div>
              <div className={styles.quickAmounts}>
                {[100, 500, 1000, 2000].map(amount => (
                  <button
                    key={amount}
                    type="button"
                    className={styles.quickAmountBtn}
                    onClick={() => setAddMoneyAmount(amount.toString())}
                  >
                    ₹{amount}
                  </button>
                ))}
              </div>
              <div className={styles.modalFooter}>
                <button 
                  type="button"
                  className={styles.btnOutline}
                  onClick={() => setShowAddMoney(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className={styles.btnPrimary}
                  disabled={!addMoneyAmount || parseFloat(addMoneyAmount) <= 0 || loading}
                >
                  {loading ? 'Processing...' : 'Add Money'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};