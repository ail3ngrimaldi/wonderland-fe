import { AppBar, Toolbar, Typography, Box, Container } from '@mui/material'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { NetworkStatus  } from '../features/NetworkStatus'
import { useNavigate } from 'react-router-dom'

export function Header() {
  const navigate = useNavigate()

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{ 
        background: 'transparent',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}
    >
      <Container>
        <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
          <Box display="flex" alignItems="center" gap={2}>
            <Typography 
              data-testid="app-title"
              variant="h5" 
              component="h1"
              onClick={() => navigate('/')}
              sx={{ 
                fontWeight: 700,
                background: '#8367c7',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.5px',
                cursor: 'pointer',
                userSelect: 'none',
                '&:hover': {
                  opacity: 0.8,
                  transform: 'scale(1.02)'
                },
                transition: 'all 0.2s ease-in-out'
              }}
            >
              🌱 Impact Wallet
            </Typography>
            <Typography 
              data-testid="environment-badge"
              variant="caption" 
              sx={{ 
                color: 'text.secondary',
                fontSize: '0.75rem',
                background: 'rgba(255, 255, 255, 0.1)',
                px: 1,
                py: 0.5,
                borderRadius: 1,
                backdropFilter: 'blur(5px)'
              }}
            >
              Testnet
            </Typography>
          </Box>
          
          <ConnectButton />
        </Toolbar>
        <NetworkStatus />
      </Container>
    </AppBar>
  )
}