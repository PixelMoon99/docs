import React from 'react';
import { Box, CardContent, Typography, Alert, TextField, CircularProgress, Grid, Avatar, Chip, Zoom } from '@mui/material';
import { CheckCircle, Shield, Bolt } from '@mui/icons-material';
import { alpha } from '@mui/material/styles';
import { NeonCard, NeonButton, PackCard, pulseAnimation } from '../GameDisplay.styled.jsx';

const PurchaseFlow = ({
  game,
  currentTheme,
  userInfo,
  setUserInfo,
  validating,
  validationResult,
  showValidationAlert,
  validateUser,
  selectedPack,
  handlePackSelect,
  getPackPrice,
  user,
  isVoucherGame,
}) => (
  <>
    {/* User Validation Card */}
    {/* User Validation Card */}
{!isVoucherGame && (
<NeonCard currentTheme={currentTheme} variant="validate" sx={{ mb: 4 }}>
  <CardContent>
    <Typography variant="h5" sx={{ color: currentTheme === 'dark' ? '#00f5ff' : '#2563eb', mb: 3 }}>
      <Shield sx={{ mr: 1, verticalAlign: 'middle' }} />
      User Validation
    </Typography>

    {showValidationAlert && (
      <Zoom in={showValidationAlert}>
        <Alert
          severity="success"
          sx={{
            mb: 3,
            background: currentTheme === 'dark' ? 'rgba(0, 255, 136, 0.1)' : 'rgba(5, 150, 105, 0.1)',
            border: `1px solid ${currentTheme === 'dark' ? '#00ff88' : '#059669'}`,
            color: currentTheme === 'dark' ? '#00ff88' : '#059669',
          }}
        >
          User <strong>{validationResult?.username}</strong> validated successfully!
        </Alert>
      </Zoom>
    )}

    {/* Mobile: Stack vertically, Desktop: Side by side */}
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
      <TextField
        fullWidth
        label="Your User ID"
        placeholder="Enter your gaming ID"
        value={userInfo.userId}
        onChange={(e) => setUserInfo(prev => ({ ...prev, userId: e.target.value }))}
        disabled={Boolean(validationResult)}
        sx={{
          '& .MuiOutlinedInput-root': {
            background: currentTheme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
            '& fieldset': { borderColor: currentTheme === 'dark' ? 'rgba(0,245,255,0.3)' : 'rgba(37,99,235,0.3)' },
            '&:hover fieldset': { borderColor: currentTheme === 'dark' ? '#00f5ff' : '#2563eb' },
            '&.Mui-focused fieldset': { borderColor: currentTheme === 'dark' ? '#00f5ff' : '#2563eb' },
          },
          '& .MuiInputLabel-root': { color: currentTheme === 'dark' ? '#fff' : '#374151' },
          '& .MuiOutlinedInput-input': { color: currentTheme === 'dark' ? '#fff' : '#000' },
        }}
      />
       
      <TextField
        fullWidth
        label="Server ID (Optional)"
        placeholder="Enter server ID if required"
        value={userInfo.serverId || ''}
        onChange={(e) => setUserInfo(prev => ({ ...prev, serverId: e.target.value }))}
        disabled={Boolean(validationResult)}
        sx={{
          '& .MuiOutlinedInput-root': {
            background: currentTheme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
            '& fieldset': { borderColor: currentTheme === 'dark' ? 'rgba(0,245,255,0.3)' : 'rgba(37,99,235,0.3)' },
            '&:hover fieldset': { borderColor: currentTheme === 'dark' ? '#00f5ff' : '#2563eb' },
            '&.Mui-focused fieldset': { borderColor: currentTheme === 'dark' ? '#00f5ff' : '#2563eb' },
          },
          '& .MuiInputLabel-root': { color: currentTheme === 'dark' ? '#fff' : '#374151' },
          '& .MuiOutlinedInput-input': { color: currentTheme === 'dark' ? '#fff' : '#000' },
        }}
      />

      <NeonButton
        currentTheme={currentTheme}
        variant="validate"
        onClick={validateUser}
        disabled={!userInfo.userId.trim() || validating || Boolean(validationResult)}
        sx={{ 
          minWidth: { xs: '100%', md: 140 }, 
          height: 56,
          mt: { xs: 1, md: 0 }
        }}
      >
        {validating ? (
          <><CircularProgress size={20} color="inherit" sx={{ mr: 1 }} /> Validating...</>
        ) : validationResult ? (
          <><CheckCircle sx={{ mr: 1 }} /> Validated</>
        ) : (
          'Validate'
        )}
      </NeonButton>
    </Box>
  </CardContent>
</NeonCard>
)}

    {/* Pack Selection Card */}
{/* Pack Selection Card */}
{/* Pack Selection Card */}
<NeonCard currentTheme={currentTheme} variant="packs" sx={{ width: '100%', mx: 'auto' }}>
  <CardContent>
    <Typography variant="h5" sx={{ color: currentTheme === 'dark' ? '#ff6b6b' : '#dc2626', mb: 3 }}>
      <Bolt sx={{ mr: 1, verticalAlign: 'middle' }} />
      Power Up Packs
    </Typography>

    <Grid container spacing={2} sx={{ justifyContent: 'flex-start' }}>
      {game?.packs?.map((pack, index) => {
        const isSelected = selectedPack?.packId === pack.packId;
        return (
          <Grid item xs={6} sm={4} md={2.4} lg={2} xl={1.8} key={pack.packId}>
            <Zoom in={true} timeout={600 + index * 200}>
              <PackCard 
                currentTheme={currentTheme} 
                selected={isSelected} 
                onClick={() => handlePackSelect(pack)}
                className="pack-card-redesigned"
              >
                {/* Rest of the card content remains the same */}
                <CardContent sx={{ padding: '12px !important', textAlign: 'center', position: 'relative' }}>
                  {/* Selection Indicator */}
                  {isSelected && (
                    <CheckCircle
                      sx={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        color: currentTheme === 'dark' ? '#00ff88' : '#059669',
                        fontSize: 20,
                        animation: `${pulseAnimation} 1s ease-in-out`,
                        zIndex: 2
                      }}
                    />
                  )}

                  {/* Pack Image - Small and Cute */}
                  <Box 
                    sx={{ 
                      width: { xs: '50px', sm: '60px' }, 
                      height: { xs: '50px', sm: '60px' }, 
                      mx: 'auto',
                      mb: 1.5,
                      borderRadius: '12px',
                      overflow: 'hidden',
                      position: 'relative',
                      background: currentTheme === 'dark' 
                        ? 'linear-gradient(135deg, #1a1a2e, #16213e)' 
                        : 'linear-gradient(135deg, #f8fafc, #e2e8f0)'
                    }}
                  >
                    {pack.image ? (
                      <img
                        src={pack.image}
                        alt={pack.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          borderRadius: '12px'
                        }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    
                    {/* Fallback when no image */}
                    <Box
                      sx={{
                        width: '100%',
                        height: '100%',
                        display: pack.image ? 'none' : 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: `linear-gradient(45deg, ${currentTheme === 'dark' ? '#ff6b6b' : '#dc2626'}, ${currentTheme === 'dark' ? '#ff9999' : '#ef4444'})`,
                        borderRadius: '12px'
                      }}
                    >
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          color: '#fff', 
                          fontWeight: 'bold',
                          fontFamily: '"Orbitron", monospace',
                          fontSize: { xs: '0.8rem', sm: '1rem' }
                        }}
                      >
                        {String(pack.amount).match(/\d+/)?.[0].slice(0, 2) || pack.name.charAt(0)}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Pack Name - Compact */}
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      fontWeight: '600', 
                      color: currentTheme === 'dark' ? '#fff' : '#000', 
                      mb: 2,
                      fontSize: { xs: '0.75rem', sm: '0.85rem' },
                      lineHeight: 1.2,
                      minHeight: { xs: '28px', sm: '32px' },
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center'
                    }}
                  >
                    {pack.name}
                  </Typography>

                  {/* ONLY PRICE */}
                  <Box>
                    {user?.role === 'reseller' ? (
                      <Box>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            textDecoration: 'line-through', 
                            color: currentTheme === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
                            fontSize: { xs: '0.6rem', sm: '0.7rem' },
                            lineHeight: 1
                          }}
                        >
                          ₹{pack.retailPrice}
                        </Typography>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            color: currentTheme === 'dark' ? '#ffe66d' : '#d97706', 
                            fontWeight: 'bold',
                            fontFamily: '"Orbitron", monospace',
                            fontSize: { xs: '0.9rem', sm: '1rem' },
                            lineHeight: 1
                          }}
                        >
                          ₹{pack.resellerPrice}
                        </Typography>
                        <Chip 
                          label={`Save ₹${pack.retailPrice - pack.resellerPrice}`} 
                          size="small" 
                          sx={{ 
                            bgcolor: currentTheme === 'dark' ? '#00ff88' : '#059669', 
                            color: '#000', 
                            fontWeight: 'bold',
                            fontSize: { xs: '0.5rem', sm: '0.6rem' },
                            height: { xs: '14px', sm: '16px' },
                            mt: 0.5,
                            '& .MuiChip-label': { px: 1 }
                          }} 
                        />
                      </Box>
                    ) : (
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          color: currentTheme === 'dark' ? '#ffe66d' : '#d97706', 
                          fontWeight: 'bold',
                          fontFamily: '"Orbitron", monospace',
                          fontSize: { xs: '0.9rem', sm: '1rem' }
                        }}
                      >
                        ₹{pack.retailPrice}
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </PackCard>
            </Zoom>
          </Grid>
        );
      })}
    </Grid>
  </CardContent>
</NeonCard>
  </>
);

export default PurchaseFlow;