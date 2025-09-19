import { Container, Typography, Box } from '@mui/material'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { NetworkStatus } from './components/NetworkStatus'
import { TokenBalances } from './components/TokenBalances'
import { MintButtons } from './components/MintButtons'
import { TokenOperations } from './components/TokenOperations'

function App() {
  return (
    <Container>
      <Typography variant="h4" align="center" sx={{ mt: 4 }}>
        Blockchain Challenge
      </Typography>

      <NetworkStatus />
      <TokenBalances />
      <MintButtons />
      <TokenOperations />

      <Box display="flex" justifyContent="center">
          <ConnectButton />
      </Box>
    </Container>
  );
}

export default App;