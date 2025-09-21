import { AppBar, Toolbar, Typography, Box, Container } from '@mui/material'
import { ConnectButton } from '@rainbow-me/rainbowkit'

export function Header() {
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
              variant="h5" 
              component="h1"
              sx={{ 
                fontWeight: 700,
                background: '#8367c7',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.5px'
              }}
            >
              🌱 Impact Wallet
            </Typography>
            <Typography 
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
      </Container>
    </AppBar>
  )
}