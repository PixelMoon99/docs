import { useState } from 'react';

export const usePackManagement = (gameId) => {
  const [editingPack, setEditingPack] = useState(null);
  const [packForm, setPackForm] = useState({
  packId: '',
  name: '',
  description: '',
  image: '',
  amount: '',
  retailPrice: '',
  resellerPrice: '',
  costPrice: '',
  provider: '',
  productId: '', // <-- ADD THIS
});

  const handleEditPack = async (pack) => {
    setEditingPack(pack);
    setPackForm({
  packId: pack.packId,
  name: pack.name,
  description: pack.description || '',
  image: pack.image || '',
  amount: pack.amount,
  retailPrice: pack.retailPrice,
  resellerPrice: pack.resellerPrice,
  costPrice: pack.costPrice,
  provider: pack.provider || '',
  productId: pack.productId || '', // <-- ADD THIS
});
  };

  const handleUpdatePack = async () => {
    if (!gameId) {
    console.error('No gameId provided');
    return false;
  }
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/games/${gameId}/packs/${editingPack.packId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(packForm)
      });
      
      if (!response.ok) throw new Error('Failed to update pack');
      
      setEditingPack(null);
    setPackForm({
  packId: '',
  name: '',
  description: '',
  image: '',
  amount: '',
  retailPrice: '',
  resellerPrice: '',
  costPrice: '',
  provider: '',
  productId: '', // <-- ADD THIS
});
      
      return true;
    } catch (error) {
      console.error('Pack update failed:', error);
      return false;
    }
  };

  return {
    editingPack,
    packForm,
    setPackForm,
    handleEditPack,
    handleUpdatePack,
    resetPackForm: () => {
      setEditingPack(null);
      setPackForm({
  packId: '',
  name: '',
  description: '',
  image: '',
  amount: '',
  retailPrice: '',
  resellerPrice: '',
  costPrice: '',
  provider: '',
  productId: '', // <-- ADD THIS
});
    }
  };
};