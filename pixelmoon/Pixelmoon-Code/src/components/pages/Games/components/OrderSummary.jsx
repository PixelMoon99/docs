import React from 'react';
import { Box, CardContent, Typography, Divider, Alert, FormControl, RadioGroup, FormControlLabel, Radio, Chip, CircularProgress } from '@mui/material';
import { Star, Payment, AccountBalanceWallet, QrCode, CreditCard, LocalFireDepartment, Security, Speed } from '@mui/icons-material';
import { NeonCard, NeonButton } from '../GameDisplay.styled.jsx';

const OrderSummary = ({
  game,
  selectedPack,
  validationResult,
  getPackPrice,
  user,
  paymentMode,
  setPaymentMode,
  handlePurchase,
  purchasing,
  currentTheme,
  isVoucherGame,
}) => {
  // This component will not render anything if no pack is selected.
  if (!selectedPack) {
    return null;
  }

  return (
    <>
      {/* Order Summary Card */}
      <Box sx={{ 
        width: '100%', 
        minWidth: { xs: '100%', sm: '400px' }, 
        maxWidth: { xs: '100%', sm: '900px' }, 
        mx: 'auto',
        px: { xs: 1, sm: 2 }
      }}>
        <NeonCard 
          currentTheme={currentTheme} 
          variant="summary" 
          sx={{ 
            mb: 3,
            mx: { xs: 0, sm: 0 },
            minWidth: 0
          }}
        >
          <CardContent sx={{ px: { xs: 2, sm: 3 } }}>
            <Typography 
              variant="h6" 
              sx={{ 
                color: currentTheme === 'dark' ? '#4ecdc4' : '#059669', 
                mb: 2,
                fontSize: { xs: '1.1rem', sm: '1.25rem' }
              }}
            >
              <Star sx={{ mr: 1, verticalAlign: 'middle' }} />
              Order Summary
            </Typography>
            <Box
              sx={{
                p: { xs: 1.5, sm: 2 },
                background: currentTheme === 'dark' ? 'rgba(78, 205, 196, 0.1)' : 'rgba(5, 150, 105, 0.1)',
                borderRadius: '8px',
                border: `1px solid ${currentTheme === 'dark' ? '#4ecdc4' : '#059669'}`,
                mb: 2,
              }}
            >
              <Typography 
                variant="body2" 
                sx={{ 
                  color: currentTheme === 'dark' ? '#fff' : '#000', 
                  opacity: 0.7,
                  fontSize: { xs: '0.8rem', sm: '0.875rem' }
                }}
              >
                Game: {game?.name}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: currentTheme === 'dark' ? '#fff' : '#000', 
                  opacity: 0.7,
                  fontSize: { xs: '0.8rem', sm: '0.875rem' }
                }}
              >
                User: {validationResult?.username}
              </Typography>
              <Divider sx={{ my: 1, borderColor: currentTheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }} />
              <Typography 
                variant="h6" 
                sx={{ 
                  color: currentTheme === 'dark' ? '#fff' : '#000',
                  fontSize: { xs: '1rem', sm: '1.25rem' }
                }}
              >
                {selectedPack.name}
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: currentTheme === 'dark' ? '#4ecdc4' : '#059669',
                  fontSize: { xs: '0.9rem', sm: '1rem' }
                }}
              >
                {selectedPack.amount}
              </Typography>
            </Box>
            <Box 
              display="flex" 
              justifyContent="space-between" 
              alignItems="center" 
              mb={2}
              sx={{ flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 1, sm: 0 } }}
            >
              <Typography 
                variant="body1" 
                sx={{ 
                  color: currentTheme === 'dark' ? '#fff' : '#000',
                  fontSize: { xs: '0.9rem', sm: '1rem' }
                }}
              >
                Total Amount:
              </Typography>
              <Typography 
                variant="h5" 
                sx={{ 
                  color: currentTheme === 'dark' ? '#ffe66d' : '#d97706', 
                  fontWeight: 'bold',
                  fontSize: { xs: '1.5rem', sm: '2rem' }
                }}
              >
                ₹{getPackPrice(selectedPack)}
              </Typography>
            </Box>
            {user?.role === 'reseller' && (
              <Alert 
                severity="info" 
                sx={{ 
                  background: currentTheme === 'dark' ? 'rgba(0, 245, 255, 0.1)' : 'rgba(37, 99, 235, 0.1)', 
                  border: `1px solid ${currentTheme === 'dark' ? '#00f5ff' : '#2563eb'}`, 
                  color: currentTheme === 'dark' ? '#00f5ff' : '#2563eb', 
                  fontSize: { xs: '0.75rem', sm: '0.8rem' }
                }}
              >
                Reseller Discount Applied!
              </Alert>
            )}
          </CardContent>
        </NeonCard>

        {/* Payment Options Card */}
        <NeonCard 
          currentTheme={currentTheme} 
          variant="payment"
          sx={{ minWidth: 0 }}
        >
          <CardContent sx={{ px: { xs: 2, sm: 3 } }}>
            <Typography 
              variant="h6" 
              sx={{ 
                color: currentTheme === 'dark' ? '#ffe66d' : '#d97706', 
                mb: 3,
                fontSize: { xs: '1.1rem', sm: '1.25rem' }
              }}
            >
              <Payment sx={{ mr: 1, verticalAlign: 'middle' }} />
              Payment Method
            </Typography>
            <FormControl fullWidth>
              <RadioGroup value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)}>
                <FormControlLabel
                  value="wallet"
                  control={
                    <Radio 
                      sx={{ 
                        color: currentTheme === 'dark' ? '#ffe66d' : '#d97706', 
                        '&.Mui-checked': { color: currentTheme === 'dark' ? '#ffe66d' : '#d97706' } 
                      }} 
                    />
                  }
                  label={
                    <Box 
                      display="flex" 
                      alignItems="center" 
                      gap={1} 
                      sx={{ minWidth: 0, flex: 1, width: '100%' }}
                    >
                      <AccountBalanceWallet 
                        sx={{ 
                          color: currentTheme === 'dark' ? '#ffe66d' : '#d97706',
                          display: { xs: 'none', sm: 'block' }
                        }} 
                      />
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography 
                          sx={{ 
                            color: currentTheme === 'dark' ? '#fff' : '#000', 
                            fontWeight: 'bold',
                            fontSize: { xs: '0.9rem', sm: '1rem' }
                          }}
                        >
                          Wallet Balance
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: currentTheme === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                            fontSize: { xs: '0.75rem', sm: '0.875rem' }
                          }}
                        >
                          Available: ₹{user?.walletBalance || 5000}
                        </Typography>
                      </Box>
                    </Box>
                  }
                  sx={{ mb: 1, width: '100%', alignItems: 'flex-start' }}
                />
                <FormControlLabel
                  value="upi"
                  control={
                    <Radio 
                      sx={{ 
                        color: currentTheme === 'dark' ? '#ffe66d' : '#d97706', 
                        '&.Mui-checked': { color: currentTheme === 'dark' ? '#ffe66d' : '#d97706' } 
                      }} 
                    />
                  }
                  label={
                    <Box 
                      display="flex" 
                      alignItems="center" 
                      gap={1}
                      sx={{ minWidth: 0, flex: 1, width: '100%' }}
                    >
                      <QrCode 
                        sx={{ 
                          color: currentTheme === 'dark' ? '#ffe66d' : '#d97706',
                          display: { xs: 'none', sm: 'block' }
                        }} 
                      />
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography 
                          sx={{ 
                            color: currentTheme === 'dark' ? '#fff' : '#000', 
                            fontWeight: 'bold',
                            fontSize: { xs: '0.9rem', sm: '1rem' }
                          }}
                        >
                          UPI Payment
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: currentTheme === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                            fontSize: { xs: '0.75rem', sm: '0.875rem' }
                          }}
                        >
                          Pay via PhonePe/UPI
                        </Typography>
                      </Box>
                    </Box>
                  }
                  sx={{ mb: 1, width: '100%', alignItems: 'flex-start' }}
                />
              </RadioGroup>
            </FormControl>
            <NeonButton 
              fullWidth 
              currentTheme={currentTheme} 
              variant="success" 
              onClick={handlePurchase} 
              disabled={(!isVoucherGame && !validationResult) || purchasing} 
              sx={{ 
                mt: 3, 
                height: { xs: 48, sm: 56 }, 
                fontSize: { xs: '1rem', sm: '1.1rem' }
              }}
            >
              {purchasing ? (
                <>
                  <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} /> 
                  Processing...
                </>
              ) : (
                <>
                  <LocalFireDepartment sx={{ mr: 1 }} /> 
                  Complete Purchase
                </>
              )}
            </NeonButton>
            <Box 
              display="flex" 
              justifyContent="center" 
              gap={1} 
              mt={2}
              sx={{ flexWrap: 'wrap' }}
            >
              <Chip 
                icon={<Security />} 
                label="Secure" 
                size="small" 
                sx={{ 
                  bgcolor: currentTheme === 'dark' ? 'rgba(0, 255, 136, 0.2)' : 'rgba(5, 150, 105, 0.2)', 
                  color: currentTheme === 'dark' ? '#00ff88' : '#059669',
                  fontSize: { xs: '0.7rem', sm: '0.8rem' }
                }} 
              />
              <Chip 
                icon={<Speed />} 
                label="Instant" 
                size="small" 
                sx={{ 
                  bgcolor: currentTheme === 'dark' ? 'rgba(255, 235, 109, 0.2)' : 'rgba(217, 119, 6, 0.2)', 
                  color: currentTheme === 'dark' ? '#ffe66d' : '#d97706',
                  fontSize: { xs: '0.7rem', sm: '0.8rem' }
                }} 
              />
            </Box>
          </CardContent>
        </NeonCard>
      </Box>
    </>
  );
};

export default OrderSummary;