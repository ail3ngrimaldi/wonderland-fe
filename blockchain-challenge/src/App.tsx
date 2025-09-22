import { Container, Box } from '@mui/material'
import { Header } from './components/Header'
import { HeroSection } from './components/HeroSection'
import { Routes, Route } from 'react-router-dom'
import { BackButton } from './components/BackButton'
import { HistoryButton } from './components/HistoryButton'
import { TokenBalances } from './components/TokenBalances'
import { MintButtons } from './components/MintButtons'
import { TokenOperations } from './components/TokenOperations'
import { EventTable } from './components/EventTable'

function App() {
  return (
    <Box>
      <Header />
      <Container sx={{ py: 3 }}>
        <Routes>
          <Route path="/" element={<HeroSection />} />

          <Route path="/plant-seeds" element={
            <Container sx={{ position: 'relative' }}>
              <BackButton />
              <HistoryButton />
              <TokenBalances />
              <MintButtons />
            </Container>
          } />

          <Route path="/sponsor-project" element={
            <Container sx={{ position: 'relative' }}>
              <BackButton />
              <HistoryButton />
              <TokenOperations defaultOperation="approve" />
            </Container>
          } />

          <Route path="/make-impact" element={
            <Container sx={{ position: 'relative' }}>
              <BackButton />
              <HistoryButton />
              <TokenBalances />
              <TokenOperations defaultOperation="transfer" />
            </Container>
          } />

          <Route path="/impact-history" element={
            <Container>
              <BackButton />
              <EventTable />
            </Container>
          } />
        </Routes>
      </Container>
    </Box>
  )
}

export default App;