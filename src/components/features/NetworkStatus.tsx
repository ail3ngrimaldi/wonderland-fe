import { Alert, Button, Box } from '@mui/material'
import { useAccount, useSwitchChain } from 'wagmi'
import { sepolia } from 'wagmi/chains'

export function NetworkStatus() {
  const { isConnected, chain } = useAccount()
  const { switchChain } = useSwitchChain()

  if (!isConnected) return null

  if (chain?.id === sepolia.id) {
    return (
      <Box data-testid="network-status-container" sx={{ mb: 2 }}>
        <Alert data-testid="network-status-success" severity="success">
          Successfully connected to Sepolia testnet
        </Alert>
      </Box>
    )
  }

  return (
    <Box data-testid="network-status-container" sx={{ mb: 2 }}>
      <Alert
        data-testid="network-status-warning"
        severity="warning"
        action={
          <Button
            data-testid="switch-button"
            color="inherit"
            size="small"
            onClick={() => switchChain({ chainId: sepolia.id })}
          >
            Switch to Sepolia
          </Button>
        }
      >
        ⚠️ Careful! For this transaction Sepolia testnet is preferred.
      </Alert>
    </Box>
  )
}
