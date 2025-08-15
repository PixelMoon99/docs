import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../components/context/AuthContext';

export const useGamePurchase = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const API_BASE = import.meta.env.VITE_API_URL;

  // State Management
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState({ userId: '', serverId: '' });
  const [validating, setValidating] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [showValidationAlert, setShowValidationAlert] = useState(false);
  const [selectedPack, setSelectedPack] = useState(null);
  const [paymentMode, setPaymentMode] = useState('wallet');
  const [purchasing, setPurchasing] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
const [servers, setServers] = useState([]);

useEffect(() => {
  if (game?.packs?.some(p => p.provider === 'smile.one')) {
    // Fetch servers for the product
    const product = game.packs.find(p => p.provider === 'smile.one')?.productId;
    if (product) fetchServers(product);
  }
}, [game]);

const fetchServers = async (product) => {
  try {
    const response = await fetch(`${API_BASE}/games/api-servers/${product}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    const data = await response.json();
    if (data.success) setServers(data.servers || []);
  } catch (error) {
    console.error('Error fetching servers:', error);
  }
};
  // Data Fetching for the specific game
  useEffect(() => {
    const fetchGame = async () => {
  setLoading(true);
  try {
    // First try to fetch as a regular game
    let response = await fetch(`${API_BASE}/games/${gameId}`);
    let data = await response.json();
    
    if (response.ok && data.success && data.game) {
      setGame(data.game);
    } else {
      // If not found, try to fetch as voucher
      const voucherResponse = await fetch(`${API_BASE}/vouchers/${gameId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (voucherResponse.ok) {
        const voucherData = await voucherResponse.json();
        if (voucherData.success) {
          setGame(voucherData.game);
        } else {
          navigate('/games');
        }
      } else {
        navigate('/games');
      }
    }
  } catch (error) {
    console.error('Error fetching game:', error);
    navigate('/games');
  } finally {
    setLoading(false);
  }
};

    fetchGame();
  }, [gameId, navigate, API_BASE]);

  // Core Logic Functions

  // Add this helper function
const isVoucherGame = (game) => {
  return game?.category === 'Game Vouchers' || game?.packs?.some(pack => pack.provider === 'voucher');
};


  const validateUser = async () => {


      if (isVoucherGame(game)) {
    setValidationResult({ username: 'Voucher Purchase', userId: 'voucher' });
    setShowValidationAlert(true);
    setActiveStep(1);
    setTimeout(() => setShowValidationAlert(false), 3000);
    return;
  }

  if (!userInfo.userId.trim()) {
    alert('Please enter your User ID');
    return;
  }
  if (!userInfo.userId.trim()) {
    alert('Please enter your User ID');
    return;
  }

  setValidating(true);
  try {
    const response = await fetch(`${API_BASE}/games/validate-user`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ 
        gameId, 
        userId: userInfo.userId, 
        serverId: userInfo.serverId || "" 
      }),
    });

    const data = await response.json();
    if (response.ok && data.success && data.valid) {
      setValidationResult(data.data);
      setShowValidationAlert(true);
      setActiveStep(1);
      setTimeout(() => setShowValidationAlert(false), 3000);
    } else {
      alert(data.message || 'User validation failed');
      setValidationResult(null);
    }
  } catch (error) {
    console.error('Error validating user:', error);
    alert('An error occurred during validation');
    setValidationResult(null);
  } finally {
    setValidating(false);
  }
};

  const handlePackSelect = (pack) => {
    setSelectedPack(pack);
    setActiveStep(2);
  };

  const handlePurchase = async () => {
  if (!selectedPack) return;
  
  // For regular games, require validation result
  if (!isVoucherGame(game) && !validationResult) return;
  
  setPurchasing(true);
  setActiveStep(isVoucherGame(game) ? 2 : 3); // Adjust step for vouchers

  try {
    if (paymentMode === 'wallet') {
      await handleWalletPayment();
    } else {
      await handleUPIPayment();
    }
  } catch (error) {
    alert(error.message || 'Payment failed. Please try again.');
    setPurchasing(false);
    setActiveStep(isVoucherGame(game) ? 1 : 2); // Adjust step back
  }
};

const handleWalletPayment = async () => {
  const response = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({
      gameId,
      packId: selectedPack.packId,
      gameUserInfo: {
        userId: isVoucherGame(game) ? 'voucher' : userInfo.userId,
        serverId: userInfo.serverId || ''
      },
      paymentInfo: {
        method: 'wallet',
        amount: getPackPrice(selectedPack),
        currency: 'INR'
      },
      contact: user?.phone || '0000' // Add this line
    })
  });

  const data = await response.json();
  
  if (data.success) {
    setPurchasing(false);
    setActiveStep(isVoucherGame(game) ? 3 : 4); // Adjust success step
  } else {
    throw new Error(data.message);
  }
};

const handleUPIPayment = async () => {
const response = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({
      gameId,
      packId: selectedPack.packId,
      gameUserInfo: {
        userId: isVoucherGame(game) ? 'voucher' : userInfo.userId, // Fix this
        serverId: userInfo.serverId || ''
      },
      paymentInfo: {
        method: 'phonepe',
        amount: getPackPrice(selectedPack),
        currency: 'INR'
      },
      contact: user?.phone || '0000'
    })
  });

  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.message);
  }

// Handle PhonePe redirect
if (data.checkoutUrl) {
  window.location.href = data.checkoutUrl;
} else {
  setPurchasing(false);
  setActiveStep(4);
}
};

  // Reset the flow to start a new purchase
  const handleNewPurchase = () => {
    setActiveStep(0);
    setSelectedPack(null);
    setValidationResult(null);
    setUserInfo({ userId: '' });
    setPurchasing(false); // Ensure this is reset
  };

  // Helper function to determine price based on user role
  const getPackPrice = (pack) => {
    if (!user || !pack) return 0;
    return user.role === 'reseller' ? pack.resellerPrice : pack.retailPrice;
  };

  // Return all state and functions needed by the UI components
  return {
    game,
    loading,
    userInfo,
    validating,
    validationResult,
    showValidationAlert,
    selectedPack,
    paymentMode,
    purchasing,
    activeStep,
    user,
    isVoucherGame: isVoucherGame(game),
    setUserInfo,
    setPaymentMode,
    validateUser,
    handlePackSelect,
    handlePurchase,
    handleNewPurchase,
    getPackPrice,
  };
};