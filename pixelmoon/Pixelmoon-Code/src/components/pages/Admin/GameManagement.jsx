import React, { useState, useEffect } from 'react';
import { usePackManagement } from '../../../hooks/usePackManagement';
import styles from './admin.module.css';

const PROVIDER_OPTIONS = [
  { value: 'smile.one', label: 'Smile.one' },
  { value: 'yokcash', label: 'Yokcash' },
  { value: 'hopestore', label: 'Hopestore' }
];

export const GameManagement = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('token');
  const [showGameForm, setShowGameForm] = useState(false);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingGame, setEditingGame] = useState(null);
  
  // Simplified game form - removed apiProvider and apiGameId
  const [gameForm, setGameForm] = useState({
    name: '',
    description: '',
    image: '',
    region: '',
    category: 'Mobile Games'
  });

  // Pack addition states
  const [selectedProvider, setSelectedProvider] = useState('');
  const [availableProducts, setAvailableProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [availablePacks, setAvailablePacks] = useState([]);
  const [selectedGamePacks, setSelectedGamePacks] = useState([]);

  const {
  editingPack,
  packForm,
  setPackForm,
  handleEditPack,
  handleUpdatePack,
  resetPackForm
} = usePackManagement(editingGame?._id || null);

  // Fetch games on component mount
  useEffect(() => {
    fetchGames();
  }, []);

  // Fetch products when provider changes
  useEffect(() => {
    if (selectedProvider) {
      fetchProviderProducts(selectedProvider);
      setSelectedProduct('');
      setAvailablePacks([]);
    } else {
      setAvailableProducts([]);
      setSelectedProduct('');
      setAvailablePacks([]);
    }
  }, [selectedProvider]);

  // Fetch packs when product changes
  useEffect(() => {
    if (selectedProvider && selectedProduct) {
      fetchProviderPacks(selectedProvider, selectedProduct);
    } else {
      setAvailablePacks([]);
    }
  }, [selectedProvider, selectedProduct]);

  const fetchGames = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/games`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await response.json();
      if (data.success) {
        setGames(data.games || []);
      } else {
        setError('Failed to fetch games');
      }
    } catch (error) {
      console.error('Error fetching games:', error);
      setError('Error fetching games');
    } finally {
      setLoading(false);
    }
  };

  const fetchProviderProducts = async (provider) => {
    try {
      const response = await fetch(
        `${API_URL}/games/provider/${provider}/products`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = await response.json();
      if (data.success) {
        setAvailableProducts(data.products || []);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setAvailableProducts([]);
    }
  };

  const fetchProviderPacks = async (provider, productId) => {
    try {
      const response = await fetch(
        `${API_URL}/games/provider/${provider}/products/${productId}/packs`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = await response.json();
      if (data.success) {
        const normalized = (data.packs || []).map(item => ({
          id: item.id || item.service_id,
          name: item.spu || item.nama_layanan || item.name,
          price: item.price || item.harga,
          raw: item,
          provider,
          productId
        }));
        setAvailablePacks(normalized);
      }
    } catch (error) {
      console.error('Error fetching packs:', error);
      setAvailablePacks([]);
    }
  };

  const handleGameSubmit = async (e) => {
    e.preventDefault();
    clearMessages();

    // Validation - removed apiProvider and apiGameId checks
    if (!gameForm.name.trim() ||
        !gameForm.description.trim() ||
        !gameForm.image.trim() ||
        !gameForm.region.trim()
    ) {
      setError('Please fill all required fields');
      return;
    }

    if (selectedGamePacks.length === 0) {
      setError('Please add at least one pack to the game');
      return;
    }

    // Ensure every pack has provider and productId
    if (selectedGamePacks.some(p => !p.provider || !p.productId)) {
      setError('Every pack must have a provider and product ID');
      return;
    }

    try {
      setLoading(true);
      const url = editingGame
        ? `${API_URL}/games/${editingGame._id}`
        : `${API_URL}/games`;

      const response = await fetch(url, {
        method: editingGame ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...gameForm,
          packs: selectedGamePacks
        })
      });

      const data = await response.json();
      if (data.success) {
        setSuccess(editingGame ? 'Game updated successfully!' : 'Game created successfully!');
        setShowGameForm(false);
        setEditingGame(null);
        resetGameForm();
        fetchGames();
      } else {
        setError(data.message || 'Failed to save game');
      }
    } catch (error) {
      console.error('Error saving game:', error);
      setError('Error saving game. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Add pack from API
  const handleAddPackFromApi = (e) => {
    const packId = e.target.value;
    if (!packId) return;

    const pack = availablePacks.find(p => p.id === packId);
    if (!pack) return;

    if (selectedGamePacks.some(p => p.packId === pack.id)) {
      setError('Pack already added');
      return;
    }

    const newPack = {
      packId: pack.id,
      name: pack.name,
      description: pack.raw?.spu || pack.raw?.nama_layanan || '',
      image: '',
      amount: parseFloat(pack.price) || 0,
      retailPrice: parseFloat(pack.price) || 0,
      resellerPrice: parseFloat(pack.price) * 0.95 || 0,
      costPrice: parseFloat(pack.price) * 0.90 || 0,
      provider: pack.provider,
      productId: pack.productId
    };

    setSelectedGamePacks([...selectedGamePacks, newPack]);
    e.target.value = '';
    clearMessages();
  };

  // Manual add/edit pack
  const handleAddPackManually = async () => {
    if (!packForm.packId ||
        !packForm.name ||
        !packForm.amount ||
        !packForm.retailPrice ||
        !packForm.resellerPrice ||
        !packForm.costPrice ||
        !packForm.provider ||
        !packForm.productId
    ) {
      setError('Please fill all required pack fields (including provider and product ID)');
      return;
    }

    if (editingPack) {
      const ok = await handleUpdatePack();
      if (ok) {
        const updated = [...selectedGamePacks];
        const idx = selectedGamePacks.findIndex(p => p.packId === editingPack.packId);
        if (idx > -1) {
          updated[idx] = packForm;
          setSelectedGamePacks(updated);
        }
      }
    } else {
      const exists = selectedGamePacks.some(p => p.packId === packForm.packId);
      if (exists) {
        setError('Pack ID already exists');
        return;
      }
      setSelectedGamePacks(prev => [...prev, { ...packForm }]);
    }
    resetPackForm();
    clearMessages();
  };

  const handleEditGame = (game) => {
    setEditingGame(game);
    setGameForm({
      name: game.name,
      description: game.description,
      image: game.image,
      region: game.region,
      category: game.category
    });
    setSelectedGamePacks(game.packs || []);
    setShowGameForm(true);
    clearMessages();
  };

  const handleDeleteGame = async (gameId) => {
    if (!window.confirm('Are you sure you want to delete this game?')) return;

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/games/${gameId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await response.json();
      if (data.success) {
        setSuccess('Game deleted successfully!');
        fetchGames();
      } else {
        setError(data.message || 'Failed to delete game');
      }
    } catch (error) {
      console.error('Error deleting game:', error);
      setError('Error deleting game');
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  const resetGameForm = () => {
    setGameForm({
      name: '',
      description: '',
      image: '',
      region: '',
      category: 'Mobile Games'
    });
    setSelectedGamePacks([]);
    setSelectedProvider('');
    setAvailableProducts([]);
    setSelectedProduct('');
    setAvailablePacks([]);
    resetPackForm();
  };

  const handleRemovePack = (index) => {
    const updated = selectedGamePacks.filter((_, i) => i !== index);
    setSelectedGamePacks(updated);
    clearMessages();
  };

  return (
    <div className={styles.gameManagement}>
      {/* Games List */}
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="h3 mb-0">Game Management</h2>
            <button
              onClick={() => {
                setShowGameForm(true);
                resetGameForm();
                setEditingGame(null);
                clearMessages();
                resetPackForm();
              }}
              disabled={loading}
              className="btn btn-primary"
            >
              Add New Game
            </button>
          </div>

          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Games List</h5>
            </div>
            <div className="card-body">
              {loading && !showGameForm ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary mb-3" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="text-muted">Loading games...</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-light">
                      <tr>
                        <th>Game</th>
                        <th>Region</th>
                        <th>Packs</th>
                        <th>Providers</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {games.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="text-center py-4 text-muted">
                            No games found. Create your first game!
                          </td>
                        </tr>
                      ) : (
                        games.map((game) => {
                          const providers = [...new Set(game.packs?.map(p => p.provider) || [])];
                          return (
                            <tr key={game._id}>
                              <td>
                                <div className="d-flex align-items-center">
                                  <img 
                                    className={`${styles.gameImage} me-3`}
                                    src={game.image} 
                                    alt={game.name}
                                    onError={(e) => {
                                      e.target.src = '/api/placeholder/40/40';
                                    }}
                                  />
                                  <div>
                                    <div className="fw-medium">{game.name}</div>
                                    <small className="text-muted">{game.category}</small>
                                  </div>
                                </div>
                              </td>
                              <td>{game.region}</td>
                              <td>{game.packs?.length || 0} packs</td>
                              <td>
                               {providers.map((provider, idx) => (
  <span key={`${game._id}-${provider}-${idx}`} className="badge bg-primary me-1">{provider}</span>
))}
                              </td>
                              <td>
                                <button
                                  onClick={() => handleEditGame(game)}
                                  className="btn btn-sm btn-outline-primary me-2"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteGame(game._id)}
                                  className="btn btn-sm btn-outline-danger"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Game Form Modal */}
      {showGameForm && (
        <div className={`${styles.modalBackdrop} modal-backdrop`}>
          <div className="modal d-block" tabIndex="-1">
            <div className="modal-dialog modal-xl modal-dialog-scrollable">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {editingGame ? 'Edit Game' : 'Add New Game'}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                      setShowGameForm(false);
                      setEditingGame(null);
                      resetGameForm();
                      clearMessages();
                    }}
                  ></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleGameSubmit}>
                    {/* Basic Game Info - Simplified */}
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label">Game Name *</label>
                        <input
                          type="text"
                          className="form-control"
                          value={gameForm.name}
                          onChange={(e) => setGameForm({...gameForm, name: e.target.value})}
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Region *</label>
                        <input
                          type="text"
                          className="form-control"
                          value={gameForm.region}
                          onChange={(e) => setGameForm({...gameForm, region: e.target.value})}
                          placeholder="e.g., Global, Asia, Brazil"
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Category</label>
                        <select
                          className="form-select"
                          value={gameForm.category}
                          onChange={(e) => setGameForm({...gameForm, category: e.target.value})}
                        >
                          <option value="Mobile Games">Mobile Games</option>
                          <option value="PC Games">PC Games</option>
                          <option value="Console Games">Console Games</option>
                        </select>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Image URL *</label>
                        <input
                          type="url"
                          className="form-control"
                          value={gameForm.image}
                          onChange={(e) => setGameForm({...gameForm, image: e.target.value})}
                          required
                        />
                      </div>

                      <div className="col-12">
                        <label className="form-label">Description *</label>
                        <textarea
                          className="form-control"
                          rows="3"
                          value={gameForm.description}
                          onChange={(e) => setGameForm({...gameForm, description: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    {/* Pack Management Section */}
                    <div className="border-top pt-4 mt-4">
                      <h5 className="mb-3">Game Packs</h5>
                      
                      {/* Provider and Product Selection */}
                      <div className="card mb-3">
                        <div className="card-body">
                          <h6 className="card-title">Add Pack from API</h6>
                          <div className="row g-2 mb-3">
                            <div className="col-md-4">
                              <label className="form-label">Provider</label>
                              <select
                                className="form-select"
                                value={selectedProvider}
                                onChange={(e) => setSelectedProvider(e.target.value)}
                              >
                                <option value="">Select Provider</option>
                                {PROVIDER_OPTIONS.map(opt => (
                                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                              </select>
                            </div>
                            <div className="col-md-4">
                              <label className="form-label">Product</label>
                              <select
                                className="form-select"
                                value={selectedProduct}
                                onChange={(e) => setSelectedProduct(e.target.value)}
                                disabled={!selectedProvider || availableProducts.length === 0}
                              >
                                <option value="">Select Product</option>
                                {availableProducts.map(product => (
                                  <option key={product.id} value={product.id}>{product.displayName}</option>
                                ))}
                              </select>
                            </div>
                            <div className="col-md-4">
                              <label className="form-label">Pack</label>
                              <select
                                className="form-select"
                                onChange={handleAddPackFromApi}
                                disabled={!selectedProduct || availablePacks.length === 0}
                                defaultValue=""
                              >
                                <option value="" disabled>Choose a pack to add</option>
                                {availablePacks.map((p, idx) => (
  <option key={`pack-${p.id}-${idx}`} value={p.id}>
    {p.name} — ₹{p.price}
  </option>
))}
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Manual Pack Entry */}
                      <div className="card mb-3">
                        <div className="card-body">
                          <h6 className="card-title">
                            {editingPack !== null ? 'Edit Pack' : 'Add Pack Manually'}
                          </h6>
                          <div className="row g-2">
                            <div className="col-md-2">
                              <label className="form-label">Pack ID</label>
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                placeholder="Pack ID"
                                value={packForm.packId}
                                onChange={(e) => setPackForm({...packForm, packId: e.target.value})}
                              />
                            </div>
                            <div className="col-md-2">
                              <label className="form-label">Pack Name</label>
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                placeholder="Pack Name"
                                value={packForm.name}
                                onChange={(e) => setPackForm({...packForm, name: e.target.value})}
                              />
                            </div>
                            <div className="col-md-2">
                              <label className="form-label">Amount</label>
                              <input
                                type="number"
                                className="form-control form-control-sm"
                                placeholder="Amount"
                                value={packForm.amount}
                                onChange={(e) => setPackForm({...packForm, amount: e.target.value})}
                              />
                            </div>
                            <div className="col-md-2">
                              <label className="form-label">Retail Price</label>
                              <input
                                type="number"
                                step="0.01"
                                className="form-control form-control-sm"
                                placeholder="Retail Price"
                                value={packForm.retailPrice}
                                onChange={(e) => setPackForm({...packForm, retailPrice: e.target.value})}
                              />
                            </div>
                            <div className="col-md-2">
                              <label className="form-label">Provider *</label>
                              <select
                                className="form-select form-select-sm"
                                value={packForm.provider}
                                onChange={e => setPackForm({ ...packForm, provider: e.target.value })}
                                required
                              >
                                <option value="">Select Provider</option>
                                {PROVIDER_OPTIONS.map(opt => (
                                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                              </select>
                            </div>
                            <div className="col-md-2">
                              <label className="form-label">Product ID *</label>
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                placeholder="Product ID"
                                value={packForm.productId}
                                onChange={(e) => setPackForm({...packForm, productId: e.target.value})}
                              />
                            </div>
                          </div>
                          <div className="row g-2 mt-2">
                            <div className="col-md-3">
                              <label className="form-label">Reseller Price</label>
                              <input
                                type="number"
                                step="0.01"
                                className="form-control form-control-sm"
                                placeholder="Reseller Price"
                                value={packForm.resellerPrice}
                                onChange={(e) => setPackForm({...packForm, resellerPrice: e.target.value})}
                              />
                            </div>
                            <div className="col-md-3">
                              <label className="form-label">Cost Price</label>
                              <input
                                type="number"
                                step="0.01"
                                className="form-control form-control-sm"
                                placeholder="Cost Price"
                                value={packForm.costPrice}
                                onChange={(e) => setPackForm({...packForm, costPrice: e.target.value})}
                              />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label">Image URL</label>
                              <input
                                type="url"
                                className="form-control form-control-sm"
                                placeholder="Pack Image URL"
                                value={packForm.image}
                                onChange={(e) => setPackForm({...packForm, image: e.target.value})}
                              />
                            </div>
                          </div>
                          <div className="mt-3">
                            <button
                              type="button"
                              onClick={handleAddPackManually}
                              className={`btn btn-sm ${editingPack !== null ? 'btn-primary' : 'btn-success'}`}
                            >
                              {editingPack !== null ? 'Update Pack' : 'Add Pack'}
                            </button>
                            {editingPack !== null && (
                              <button
                                type="button"
                                onClick={resetPackForm}
                                className="btn btn-sm btn-secondary ms-2"
                              >
                                Cancel Edit
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Packs List */}
                      {selectedGamePacks.length > 0 && (
                        <div className="table-responsive">
                          <table className="table table-sm table-striped">
                            <thead className="table-secondary">
                              <tr>
                                <th>Image</th>
                                <th>Pack ID</th>
                                <th>Name</th>
                                <th>Amount</th>
                                <th>Provider</th>
                                <th>Product</th>
                                <th>Cost</th>
                                <th>Retail</th>
                                <th>Reseller</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {selectedGamePacks.map((pack, index) => (
                                <tr key={index}>
                                  <td>
                                    {pack.image ? (
                                      <img 
                                        src={pack.image} 
                                        alt={pack.name}
                                        style={{width: '30px', height: '30px', objectFit: 'cover'}}
                                        onError={(e) => {
                                          e.target.src = '/api/placeholder/30/30';
                                        }}
                                      />
                                    ) : (
                                      <div style={{width: '30px', height: '30px', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px'}}>
                                        No Image
                                      </div>
                                    )}
                                  </td>
                                  <td>{pack.packId}</td>
                                  <td>{pack.name}</td>
                                  <td>{pack.amount}</td>
                                  <td><span className="badge bg-info">{pack.provider}</span></td>
                                  <td><small>{pack.productId}</small></td>
                                  <td>₹{pack.costPrice}</td>
                                  <td>₹{pack.retailPrice}</td>
                                  <td>₹{pack.resellerPrice}</td>
                                  <td>
                                    <button
                                      type="button"
                                      onClick={() => handleEditPack(pack)}
                                      className="btn btn-sm btn-outline-primary me-2"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleRemovePack(index)}
                                      className="btn btn-sm btn-outline-danger"
                                    >
                                      Remove
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowGameForm(false);
                      setEditingGame(null);
                      resetGameForm();
                      resetPackForm();
                      clearMessages();
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    form="gameForm"
                    disabled={loading}
                    className="btn btn-primary"
                    onClick={handleGameSubmit}
                  >
                    {loading ? 'Saving...' : (editingGame ? 'Update Game' : 'Create Game')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};