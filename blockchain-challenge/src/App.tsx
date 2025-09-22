import { Container, Box } from '@mui/material'
import { Header } from './components/Header'
import { NetworkStatus } from './components/NetworkStatus'
import { TokenBalances } from './components/TokenBalances'
import { MintButtons } from './components/MintButtons'
import { TokenOperations } from './components/TokenOperations'
import { EventTable } from './components/EventTable'
import { HeroSection } from './components/HeroSection'

function App() {
  return (
    <Box>
      <Header />
      <Container sx={{ py: 3 }}>

      <NetworkStatus />
      <HeroSection/>
        <TokenBalances />
        <EventTable />
      </Container>
    </Box>
  );
}

export default App;