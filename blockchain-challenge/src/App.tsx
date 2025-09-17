import { Container, Typography, Box } from '@mui/material'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { NetworkStatus } from './components/NetworkStatus'

function App() {
  return (
    <Container>
      <Typography variant="h4" align="center" sx={{ mt: 4 }}>
        Blockchain Challenge
      </Typography>

      <NetworkStatus />

      <Box display="flex" justifyContent="center">
          <ConnectButton />
      </Box>
    </Container>
  );
}

export default App;