import { Container, Box } from '@mui/material'
import { Header } from './components/ui/Header'
import { HeroSection } from './components/ui/HeroSection'
import { Routes, Route } from 'react-router-dom'
import { BackButton } from './components/ui/BackButton'
import { HistoryButton } from './components/ui/HistoryButton'
import { TokenBalances } from './components/features/TokenBalances'
import { MintButtons } from './components/features/MintButtons'
import { TokenOperations } from './components/features/TokenOperations'
import { EventTable } from './components/features/EventTable'

function App() {
  return (
    <Box>
      <Header />
      <Container sx={{ py: 3 }}>
        <Routes>
          <Route path="/" element={<HeroSection />} />

          <Route
            path="/plant-seeds"
            element={
              <Container sx={{ position: 'relative' }}>
                <BackButton />
                <HistoryButton />
                <TokenBalances />
                <MintButtons />
              </Container>
            }
          />

          <Route
            path="/sponsor-project"
            element={
              <Container sx={{ position: 'relative' }}>
                <BackButton />
                <HistoryButton />
                <TokenOperations defaultOperation="approve" />
              </Container>
            }
          />

          <Route
            path="/make-impact"
            element={
              <Container sx={{ position: 'relative' }}>
                <BackButton />
                <HistoryButton />
                <TokenBalances />
                <TokenOperations defaultOperation="transfer" />
              </Container>
            }
          />

          <Route
            path="/impact-history"
            element={
              <Container>
                <BackButton />
                <EventTable />
              </Container>
            }
          />
        </Routes>
      </Container>
    </Box>
  )
}

export default App
