import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import GameCard from '../home/GameCard/GameCard';
import styles from './SearchOverlay.module.css';
import { useNavigate } from 'react-router-dom';

const SearchOverlay = ({ isOpen, onClose }) => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchInputRef = useRef(null);
  const overlayRef = useRef(null);
  const debounceRef = useRef(null);
  const navigate = useNavigate();

  const API_BASE = import.meta.env.VITE_API_URL;

  // Auto-focus input when overlay opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current.focus(), 100);
    }
  }, [isOpen]);

  // Handle escape key and outside clicks
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < games.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
      } else if (e.key === 'Enter' && selectedIndex >= 0) {
        const g = games[selectedIndex];
        if (g) {
          navigate(`/games/${g.slug || g._id || g.id}`);
          onClose();
        }
      }
    };

    const handleClickOutside = (e) => {
      if (overlayRef.current && !overlayRef.current.contains(e.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, games.length, selectedIndex, navigate]);

  // Debounced search function
  const searchGames = async (term) => {
    if (!term.trim()) {
      setGames([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Search regular games with the search parameter
      const gamesResponse = await fetch(`${API_BASE}/games?search=${encodeURIComponent(term)}`);
      let allGames = [];
      
      if (gamesResponse.ok) {
        const gamesData = await gamesResponse.json();
        allGames = gamesData.games || [];
      }

      // Search vouchers
      try {
        const vouchersResponse = await fetch(`${API_BASE}/vouchers/available`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        
        if (vouchersResponse.ok) {
          const vouchersData = await vouchersResponse.json();
          const matchingVouchers = (vouchersData.vouchers || []).filter(voucher =>
            voucher.name.toLowerCase().includes(term.toLowerCase())
          );
          
          const sortedVouchers = matchingVouchers.sort((a, b) => {
            const aName = a.name.toLowerCase();
            const bName = b.name.toLowerCase();
            const searchTerm = term.toLowerCase();
            
            if (aName.startsWith(searchTerm) && !bName.startsWith(searchTerm)) return -1;
            if (bName.startsWith(searchTerm) && !aName.startsWith(searchTerm)) return 1;
            
            return aName.localeCompare(bName);
          });
          
          allGames = [...allGames, ...sortedVouchers.map(v=> ({...v, slug: v._id }))];
        }
      } catch (voucherError) {
        console.log('Voucher search failed, continuing with games only');
      }

      setGames(allGames);
    } catch (error) {
      console.error('Search error:', error);
      setGames([]);
    } finally {
      setLoading(false);
    }
  };

  const sortByRelevance = (games, searchTerm) => {
    const term = searchTerm.toLowerCase().trim();
    
    return games.sort((a, b) => {
      const nameA = (a.name||'').toLowerCase();
      const nameB = (b.name||'').toLowerCase();
      
      const scoreA = calculateRelevanceScore(nameA, term);
      const scoreB = calculateRelevanceScore(nameB, term);
      
      return scoreB - scoreA;
    });
  };

  const calculateRelevanceScore = (gameName, searchTerm) => {
    let score = 0;
    if (gameName === searchTerm) score += 1000;
    if (gameName.startsWith(searchTerm)) score += 500;
    const words = gameName.split(/\s+/);
    if (words.some(word => word === searchTerm)) score += 300;
    if (words.some(word => word.startsWith(searchTerm))) score += 200;
    if (gameName.includes(searchTerm)) score += 100;
    if (gameName.length <= searchTerm.length + 5) score += 50;
    const similarity = calculateSimilarity(gameName, searchTerm);
    score += similarity * 50;
    return score;
  };

  const calculateSimilarity = (str1, str2) => {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    if (longer.length === 0) return 1.0;
    const editDistance = getEditDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  };

  const getEditDistance = (str1, str2) => {
    const matrix = [];
    for (let i = 0; i <= str2.length; i++) matrix[i] = [i];
    for (let j = 0; j <= str1.length; j++) matrix[0][j] = j;
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) matrix[i][j] = matrix[i - 1][j - 1];
        else matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
      }
    }
    return matrix[str2.length][str1.length];
  };

  // Handle search input change with debouncing
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setSelectedIndex(-1);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => { searchGames(value); }, 300);
  };

  // Highlight matching text in game names
  const highlightMatch = (text, searchTerm) => {
    if (!searchTerm.trim()) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? 
        <mark key={index} className={styles.highlight}>{part}</mark> : 
        part
    );
  };

  if (!isOpen) return null;

  return (
    <div className={`${styles.overlay} ${theme === 'dark' ? styles.dark : ''}`}>
      <div className={styles.backdrop} />
      <div 
        ref={overlayRef}
        className={`${styles.panel} ${isOpen ? styles.slideIn : styles.slideOut}`}
      >
        {/* Search Header */}
        <div className={styles.searchHeader}>
          <div className={styles.searchIcon}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
            </svg>
          </div>
          
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search games..."
            value={searchTerm}
            onChange={handleSearchChange}
            className={styles.searchInput}
          />
          
          <button 
            onClick={onClose}
            className={styles.closeButton}
            aria-label="Close search"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
            </svg>
          </button>
        </div>

        {/* Search Results */}
        <div className={styles.resultsContainer}>
          {loading && (
            <div className={styles.loadingContainer}>
              <div className={styles.spinner}></div>
              <span>Searching...</span>
            </div>
          )}

          {!loading && searchTerm && games.length === 0 && (
            <div className={styles.noResults}>
              <div className={styles.noResultsIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z"/>
                  <path d="M10.344 11.742c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1 6.538 6.538 0 0 1-1.398 1.4z"/>
                  <path d="M6.5 3a.5.5 0 0 1 .5.5V6h2.5a.5.5 0 0 1 0 1H7v2.5a.5.5 0 0 1-1 0V7H3.5a.5.5 0 0 1 0-1H6V3.5a.5.5 0 0 1 .5-.5z"/>
                </svg>
              </div>
              <h3>No games found</h3>
              <p>No games found for '<strong>{searchTerm}</strong>'</p>
              <p>Try different keywords or browse our game categories</p>
            </div>
          )}

          {!loading && games.length > 0 && (
            <>
              <div className={styles.resultsHeader}>
                <span className={styles.resultsCount}>
                  {games.length} game{games.length !== 1 ? 's' : ''} found
                </span>
              </div>
              
              <div className={styles.gamesGrid}>
                {games.slice(0, 20).map((game, index) => (
                  <div 
                    key={game._id || game.id || index}
                    className={`${styles.gameCardWrapper} ${
                      selectedIndex === index ? styles.selected : ''
                    }`}
                    onClick={() => { setSelectedIndex(index); navigate(`/games/${game.slug || game._id || game.id}`); onClose(); }}
                  >
                    <GameCard 
                      game={{
                        ...game,
                        name: searchTerm ? highlightMatch(game.name, searchTerm) : game.name
                      }} 
                    />
                  </div>
                ))}
              </div>

              {games.length > 20 && (
                <div className={styles.seeMoreFooter}>
                  <button className={styles.seeMoreButton}>
                    See all {games.length} results
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path fillRule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z"/>
                    </svg>
                  </button>
                </div>
              )}
            </>
          )}

          {!loading && !searchTerm && (
            <div className={styles.searchPrompt}>
              <div className={styles.searchPromptIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                </svg>
              </div>
              <h3>Search for games</h3>
              <p>Start typing to find your favorite games...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;