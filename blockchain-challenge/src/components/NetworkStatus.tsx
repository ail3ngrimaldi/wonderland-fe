import { Alert, Button, Box } from '@mui/material'
import { useAccount, useSwitchChain } from 'wagmi'
import { sepolia } from 'wagmi/chains'

export function NetworkStatus() {
  const { isConnected, chain } = useAccount()
  const { switchChain } = useSwitchChain()

  if (!isConnected) return null

  if (chain?.id === sepolia.id) {
    return (
      <Box sx={{ mb: 2 }}>
        <Alert severity="success">
          ✅ Connected to Sepolia testnet
        </Alert>
      </Box>
    )
  }

  return (
    <Box sx={{ mb: 2 }}>
      <Alert 
        severity="warning"
        action={
          <Button 
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