import React from 'react'
  import ReactDOM from 'react-dom/client'
  import { WagmiProvider } from 'wagmi'
  import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
  import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
  import { ThemeProvider } from '@mui/material/styles'
  import { CssBaseline } from '@mui/material'
  import { wagmiConfig } from './config/wagmi'
  import { impactTheme } from './theme'
  import App from './App'
  import { TransactionProvider } from './context/TransactionContext'

  import '@rainbow-me/rainbowkit/styles.css'

  const queryClient = new QueryClient()

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <ThemeProvider theme={impactTheme}>
        <CssBaseline />
        <WagmiProvider config={wagmiConfig}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider>
              <TransactionProvider>
                <App />
              </TransactionProvider>
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </ThemeProvider>
    </React.StrictMode>
  )