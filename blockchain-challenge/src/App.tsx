import { Container, Box } from '@mui/material'
import { Header } from './components/Header'
import { HeroSection } from './components/HeroSection'

function App() {
  return (
    <Box>
      <Header />
      <Container sx={{ py: 3 }}>
        <HeroSection/>
      </Container>
    </Box>
  );
}

export default App;