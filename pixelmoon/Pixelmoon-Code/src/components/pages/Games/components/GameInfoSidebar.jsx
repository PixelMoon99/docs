import React, { useState, useEffect } from 'react';
import { Box, CardContent, Typography, Chip, Avatar, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { CheckCircle, Person, ShoppingCart, Payment, SportsEsports, Star } from '@mui/icons-material';
import { alpha } from '@mui/material/styles';
import { NeonCard } from '../GameDisplay.styled.jsx';

const instructions = [
  { icon: <Person />, text: 'Enter your User ID', color: '#00f5ff' },
  { icon: <ShoppingCart />, text: 'Select a pack', color: '#ff6b6b' },
  { icon: <Star />, text: 'Review your order', color: '#4ecdc4' },
  { icon: <Payment />, text: 'Choose payment', color: '#ffe66d' },
  { icon: <CheckCircle />, text: 'Complete purchase', color: '#00ff88' },
];

const GameInfoSidebar = ({ game, currentTheme, userInfo, setUserInfo }) => {
  const [servers, setServers] = useState([]);
  const [loadingServers, setLoadingServers] = useState(false);
  const API_BASE = import.meta.env.VITE_API_URL;

  // Check if game has Smile.one packs
  const hasSmileOnePacks = game?.packs?.some(p => p.provider === 'smile.one');
  
  // Get the product ID from the first Smile.one pack
  const smileOneProduct = game?.packs?.find(p => p.provider === 'smile.one')?.productId;

  useEffect(() => {
    if (hasSmileOnePacks && smileOneProduct) {
      fetchServers(smileOneProduct);
    }
  }, [hasSmileOnePacks, smileOneProduct]);

  const fetchServers = async (product) => {
    setLoadingServers(true);
    try {
      const response = await fetch(`${API_BASE}/games/api-servers/${product}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      if (data.success && data.servers) {
        setServers(data.servers);
      }
    } catch (error) {
      console.error('Error fetching servers:', error);
    } finally {
      setLoadingServers(false);
    }
  };

  if (!game) return null;

  return (
    <NeonCard currentTheme={currentTheme} variant="default">
      <Box sx={{ position: 'relative', height: 200, overflow: 'hidden', borderRadius: '12px 12px 0 0' }}>
        <img 
          src={game.image} 
          alt={game.name}
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover',
            filter: currentTheme === 'dark' ? 'brightness(0.8) contrast(1.2)' : 'none'
          }}
        />
        <Box 
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
            p: 2
          }}
        >
          <Typography variant="h5" sx={{ color: '#fff', fontWeight: 'bold' }}>
            {game.name}
          </Typography>
          <Box display="flex" gap={1} mt={1}>
            <Chip label={game.region} size="small" sx={{ bgcolor: '#00f5ff', color: '#000', fontWeight: 'bold' }} />
            <Chip label={game.category} size="small" sx={{ bgcolor: '#ff6b6b', color: '#fff', fontWeight: 'bold' }} />
          </Box>
        </Box>
      </Box>
      
      <CardContent>
        {/* Game Description */}
        {game.description && (
          <Box sx={{ mb: 3, pb: 2, borderBottom: `1px solid ${currentTheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}` }}>
            <Typography variant="h6" sx={{ color: currentTheme === 'dark' ? '#4ecdc4' : '#059669', mb: 1 }}>
              About {game.name}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: currentTheme === 'dark' ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)',
                lineHeight: 1.6
              }}
            >
              {game.description}
            </Typography>
          </Box>
        )}

        <Typography variant="h6" sx={{ color: currentTheme === 'dark' ? '#00f5ff' : '#2563eb', mb: 2 }}>
          <SportsEsports sx={{ mr: 1, verticalAlign: 'middle' }} />
          How to Top-Up
        </Typography>
        
        {instructions.map((step, index) => (
          <Box 
            key={index}
            display="flex" 
            alignItems="center" 
            mb={2}
          >
            <Avatar 
              sx={{ 
                bgcolor: alpha(step.color, 0.2), 
                color: step.color, 
                width: 32, 
                height: 32, 
                mr: 2 
              }}
            >
              {step.icon}
            </Avatar>
            <Typography sx={{ color: currentTheme === 'dark' ? '#fff' : '#374151' }}>
              {step.text}
            </Typography>
          </Box>
        ))}

        {/* Server Selection for Smile.one games */}
        {hasSmileOnePacks && (
          <Box sx={{ mt: 3, pt: 2, borderTop: `1px solid ${currentTheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}` }}>
            <Typography variant="body2" sx={{ mb: 2, color: currentTheme === 'dark' ? '#00f5ff' : '#2563eb', fontWeight: 'bold' }}>
              Server Selection
            </Typography>
            
            {loadingServers ? (
              <Typography variant="body2" sx={{ color: currentTheme === 'dark' ? '#fff' : '#374151' }}>
                Loading servers...
              </Typography>
            ) : servers.length > 0 ? (
              <FormControl fullWidth size="small">
                <InputLabel sx={{ color: currentTheme === 'dark' ? '#fff' : '#374151' }}>
                  Select Server (Optional)
                </InputLabel>
                <Select
                  value={userInfo?.serverId || ''}
                  onChange={(e) => setUserInfo(prev => ({ ...prev, serverId: e.target.value }))}
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: currentTheme === 'dark' ? 'rgba(0,245,255,0.3)' : 'rgba(37,99,235,0.3)'
                    },
                    '& .MuiSelect-select': {
                      color: currentTheme === 'dark' ? '#fff' : '#000'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: currentTheme === 'dark' ? '#00f5ff' : '#2563eb'
                    }
                  }}
                >
                  <MenuItem value="">
                    <em>No server required</em>
                  </MenuItem>
                  {servers.map((server) => (
                    <MenuItem key={server.serverId} value={server.serverId}>
                      {server.serverName} ({server.serverId})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <Typography variant="body2" sx={{ color: currentTheme === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' }}>
                No server selection required for this game
              </Typography>
            )}
          </Box>
        )}
      </CardContent>
    </NeonCard>
  );
};

export default GameInfoSidebar;