import React from 'react'
  import ReactDOM from 'react-dom/client'
  import { WagmiProvider } from 'wagmi'
  import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
  import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
  import { wagmiConfig } from './config/wagmi'
  import App from './App'
  import { TransactionProvider } from './context/TransactionContext'

  import '@rainbow-me/rainbowkit/styles.css'

  const queryClient = new QueryClient()

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            <TransactionProvider>
              <App />
            </TransactionProvider>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </React.StrictMode>
  )