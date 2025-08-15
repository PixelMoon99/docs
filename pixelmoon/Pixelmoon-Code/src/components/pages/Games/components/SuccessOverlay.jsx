import React from 'react';
import { Box, Typography, Avatar, LinearProgress, Zoom, CardContent } from '@mui/material';
import { EmojiEvents } from '@mui/icons-material';
import { NeonCard, NeonButton, pulseAnimation } from '../GameDisplay.styled.jsx';

const SuccessOverlay = ({ selectedPack, currentTheme, onNewPurchase }) => (
  <Zoom in={true} timeout={1000}>
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(10px)',
        zIndex: 9999,
      }}
    >
      <NeonCard currentTheme={currentTheme} variant="success" sx={{ maxWidth: 400, textAlign: 'center' }}>
        <CardContent sx={{ p: 4 }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: currentTheme === 'dark' ? '#00ff88' : '#059669',
              color: '#000',
              mx: 'auto',
              mb: 2,
              animation: `${pulseAnimation} 1.5s ease-in-out infinite`,
            }}
          >
            <EmojiEvents sx={{ fontSize: 40 }} />
          </Avatar>
          
          <Typography variant="h4" sx={{ color: currentTheme === 'dark' ? '#00ff88' : '#059669', fontWeight: 'bold', mb: 2 }}>
            SUCCESS!
          </Typography>
          
          <Typography variant="h6" sx={{ color: currentTheme === 'dark' ? '#fff' : '#000', mb: 2 }}>
            Your {selectedPack?.name} has been purchased!
          </Typography>
          
          <Typography variant="body2" sx={{ color: currentTheme === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)', mb: 3 }}>
            {selectedPack?.amount} will be credited to your account within 5 minutes.
          </Typography>

          <LinearProgress
            sx={{
              mb: 3,
              height: 6,
              borderRadius: 3,
              bgcolor: currentTheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
              '& .MuiLinearProgress-bar': {
                bgcolor: currentTheme === 'dark' ? '#00ff88' : '#059669',
              },
            }}
          />
          
          <NeonButton
            currentTheme={currentTheme}
            variant="success"
            onClick={onNewPurchase} // This now calls the handler from the hook
            sx={{ minWidth: 150 }}
          >
            New Purchase
          </NeonButton>
        </CardContent>
      </NeonCard>
    </Box>
  </Zoom>
);

export default SuccessOverlay;