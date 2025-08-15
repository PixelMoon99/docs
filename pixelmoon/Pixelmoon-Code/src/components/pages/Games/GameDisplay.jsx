import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Grid as Grid2 } from '@mui/material';
import { Box, Typography, Paper, Stepper, Step, StepLabel, CircularProgress, IconButton, Fade, Slide } from '@mui/material';
import { ArrowBack, CheckCircle } from '@mui/icons-material';

// Imports from our new refactored files
import { useGamePurchase } from './useGamePurchase';
import { PixelmoonContainer, StepIcon, FloatingParticle, SakuraPetal, neonGlow } from './GameDisplay.styled.jsx';
import GameInfoSidebar from './components/GameInfoSidebar';
import PurchaseFlow from './components/PurchaseFlow';
import OrderSummary from './components/OrderSummary';
import SuccessOverlay from './components/SuccessOverlay';

const GameDisplay = () => {
  const { theme: currentTheme } = useTheme();
  const {
  // State
  game, loading, userInfo, validating, validationResult, showValidationAlert,
  selectedPack, paymentMode, purchasing, activeStep, user,
  // Handlers
  setUserInfo, setPaymentMode, validateUser, handlePackSelect,
  handlePurchase, handleNewPurchase, getPackPrice,
  isVoucherGame, // Add this line
} = useGamePurchase();

  const steps = isVoucherGame ? ['Select Pack', 'Order Summary', 'Payment'] : ['Validate User', 'Select Pack', 'Order Summary', 'Payment'];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh"
           sx={{ background: currentTheme === 'dark' ? '#0a0a0a' : '#f0f2ff' }}>
        <Box textAlign="center">
          <CircularProgress size={60} sx={{ color: currentTheme === 'dark' ? '#00f5ff' : '#2563eb', mb: 2 }} />
          <Typography variant="h6" sx={{ color: currentTheme === 'dark' ? '#fff' : '#000' }}>
            Loading Game Universe...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <PixelmoonContainer maxWidth="xl" currentTheme={currentTheme}>
      {/* Background Effects */}
      {currentTheme === 'light' && [...Array(15)].map((_, i) => <SakuraPetal key={i} currentTheme={currentTheme} />)}
      {[...Array(20)].map((_, i) => <FloatingParticle key={i} currentTheme={currentTheme} style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 6}s` }} />)}

      {/* Header */}
      <Slide direction="down" in={true} timeout={800}>
        <Box textAlign="center" mb={4}>
          <Typography variant="h2" sx={{ fontFamily: '"Orbitron", monospace', fontWeight: 'bold', background: currentTheme === 'dark' ? 'linear-gradient(45deg, #00f5ff, #ff6b6b, #00ff88)' : 'linear-gradient(45deg, #2563eb, #dc2626, #059669)', backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent', mb: 1, animation: `${neonGlow} 3s ease-in-out infinite` }}>
            PIXELMOON STORE
          </Typography>
          <Typography variant="h5" sx={{ color: currentTheme === 'dark' ? '#fff' : '#374151', opacity: 0.8 }}>
            {game?.name} - Premium Gaming Experience
          </Typography>
        </Box>
      </Slide>

      {/* Progress Stepper */}
      <Fade in={true} timeout={1000}>
        <Paper elevation={0} sx={{ p: 3, mb: 4, background: 'transparent', border: `1px solid ${currentTheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`, borderRadius: '16px', backdropFilter: 'blur(10px)' }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel StepIconComponent={() => <StepIcon currentTheme={currentTheme} active={index === activeStep} completed={index < activeStep}>{index < activeStep ? <CheckCircle /> : index + 1}</StepIcon>} sx={{ '& .MuiStepLabel-label': { color: currentTheme === 'dark' ? '#fff' : '#374151', fontWeight: 'bold', mt: 1 } }}>
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>
      </Fade>

     <Grid2 container spacing={4}>
  {/* Game Info Sidebar */}
  <Grid2 xs={12} lg={2}>
    <Slide direction="right" in={true} timeout={1000}>
      <div>
        <GameInfoSidebar 
  game={game} 
  currentTheme={currentTheme}
  userInfo={userInfo}
  setUserInfo={setUserInfo}
/>
      </div>
    </Slide>
  </Grid2>

  {/* Main Content - Full Width */}
  <Grid2 xs={12} lg={10}>
    <Slide direction="up" in={true} timeout={1200}>
      <div>
        <PurchaseFlow
          game={game}
          currentTheme={currentTheme}
          userInfo={userInfo}
          setUserInfo={setUserInfo}
          validating={validating}
          validationResult={validationResult}
          showValidationAlert={showValidationAlert}
          validateUser={validateUser}
          selectedPack={selectedPack}
          handlePackSelect={handlePackSelect}
          getPackPrice={getPackPrice}
          user={user}
          isVoucherGame={isVoucherGame}
        />
        
        {/* Order Summary directly below packs */}
        <Box sx={{ mt: 4 }}>
          <OrderSummary
            game={game}
            currentTheme={currentTheme}
            selectedPack={selectedPack}
            validationResult={validationResult}
            getPackPrice={getPackPrice}
            user={user}
            paymentMode={paymentMode}
            setPaymentMode={setPaymentMode}
            handlePurchase={handlePurchase}
            purchasing={purchasing}
            isVoucherGame={isVoucherGame}
          />
        </Box>
      </div>
    </Slide>
  </Grid2>
</Grid2>

      {/* Success Animation */}
      {activeStep === 3 && purchasing === false && (
        <SuccessOverlay
          selectedPack={selectedPack}
          currentTheme={currentTheme}
          onNewPurchase={handleNewPurchase}
        />
      )}

      {/* Back Button */}
      <Box position="fixed" top={20} left={20}>
        <IconButton onClick={() => window.history.back()} sx={{ /* ... styles */ }}>
          <ArrowBack />
        </IconButton>
      </Box>
    </PixelmoonContainer>
  );
};

export default GameDisplay;