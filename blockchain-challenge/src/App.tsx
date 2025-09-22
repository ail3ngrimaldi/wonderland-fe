import { Container, Box } from '@mui/material'
import { Header } from './components/Header'
import { NetworkStatus } from './components/NetworkStatus'
import { TokenBalances } from './components/TokenBalances'
import { HeroSection } from './components/HeroSection'

function App() {
  return (
    <Box>
      <Header />
      <Container sx={{ py: 3 }}>

      <NetworkStatus />
      <HeroSection/>
        <TokenBalances />
      </Container>
    </Box>
  );
}

export default App;