import { Box, Container, Typography } from '@mui/material'
import { ActionCard } from '../ui/ActionCard'
import { useNavigate } from 'react-router-dom'
import { useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'

export function HeroSection() {
  const navigate = useNavigate()
  const { isConnected } = useAccount()

  if (!isConnected) {
    return (
      <Container>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          textAlign: 'center',
          py: 8,
          gap: 4
        }}>
          <Box>
            <Typography   
              variant="h3"
              component="h1"
              gutterBottom
              sx={{ fontWeight: 'bold' }}>
              🌍 Welcome to Impact Wallet
            </Typography>
            <Typography 
              variant="h5"
              color="text.secondary"
              sx={{ mb: 4, maxWidth: '600px', mx: 'auto' }}>
              To start creating impact, you have to connect your wallet!
            </Typography>
            <Typography 
              variant="body1"
              color="text.secondary"
              sx={{ mb: 6, maxWidth: '500px', mx: 'auto' }}>
              Once connected, you'll be able to plant seeds, sponsor projects, 
              and make real environmental impact with eco-tokens.
            </Typography>
          </Box>
          
          <Box sx={{ 
            p: 3, 
            borderRadius: 3, 
            backgroundColor: 'background.paper',
            border: '2px dashed',
            borderColor: 'primary.main',
            minWidth: '300px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <Typography variant="h6" gutterBottom>
              🚀 Get Started
            </Typography>
            <ConnectButton />
          </Box>
        </Box>
      </Container>
    )
  }

  // Si está conectado, mostrar el dashboard completo
  return (
    <Container>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
        <Box sx={{ flex: 1, textAlign: 'left' }}>
          <Typography   
            variant="h4"
            component="h1"
            gutterBottom>
            🌍 Welcome to your Impact Dashboard
          </Typography>
          <Typography 
            variant="h6"
            color="text.secondary">
            Your actions create real change in the world
          </Typography>
        </Box>

        <Box sx={{ ml: 3 }}>
          <ActionCard
            testId="history"
            icon=""
            title="Impact History"
            description="127 eco-tokens • 3 projects supported • View all transactions"
            buttonText="View History"
            color="#FF9800"
            onClick={() => navigate('/impact-history')}
            height={220}
            transparent={true}
            clickableCard={true}
          />
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: { xs: 'center', md:'space-between' },
          flexWrap: 'wrap',
          gap: { xs: 2, md: 1 }
        }}
      >                
        <ActionCard
          testId="mint"
          icon="🌱"
          title="Plant Seeds"
          description="Generate eco-tokens to support sustainable projects and earn rewards"
          buttonText="Start Planting"
          color="#4CAF50"
          onClick={() => navigate('/plant-seeds')}
        />
        <ActionCard
          testId="approve"
          icon="🤝"
          title="Sponsor Project"
          description="Give permission to support meaningful causes and environmental initiatives"
          buttonText="Become Sponsor"
          color="#2196F3"
          onClick={() => navigate('/sponsor-project')}
        />
        <ActionCard
          testId="transfer"
          icon="💚"
          title="Make Impact"
          description="Send your eco-tokens to create real change in the world"
          buttonText="Start Donating"
          color="#388E3C"
          onClick={() => navigate('/make-impact')}
        />
      </Box>
    </Container>
  )
}