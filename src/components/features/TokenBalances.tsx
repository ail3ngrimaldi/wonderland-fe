import {
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material'
import { useAccount, useBalance } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { SEPOLIA_CONTRACTS } from '../../config/contracts'

export function TokenBalances() {
  const { address } = useAccount()

  // DAI Hook
  const { data: daiBalance, isLoading: daiLoading } = useBalance({
    address,
    token: SEPOLIA_CONTRACTS.DAI,
    chainId: sepolia.id,
    query: {
      refetchInterval: 5000,
    },
  })

  // USDC Hook
  const { data: usdcBalance, isLoading: usdcLoading } = useBalance({
    address,
    token: SEPOLIA_CONTRACTS.USDC,
    chainId: sepolia.id,
    query: {
      refetchInterval: 5000,
    },
  })

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        Token Balances
      </Typography>

      <Box display="flex" gap={2}>
        {/* DAI Balance Card */}
        <Card sx={{ minWidth: 200 }}>
          <CardContent>
            <Typography variant="h6" component="div">
              DAI
            </Typography>
            {daiLoading ? (
              <CircularProgress size={20} />
            ) : (
              <Typography variant="h5">
                {daiBalance?.formatted || '0.00'}
              </Typography>
            )}
          </CardContent>
        </Card>

        {/* USDC Balance Card */}
        <Card sx={{ minWidth: 200 }}>
          <CardContent>
            <Typography variant="h6" component="div">
              USDC
            </Typography>
            {usdcLoading ? (
              <CircularProgress size={20} />
            ) : (
              <Typography variant="h5">
                {usdcBalance?.formatted || '0.00'}
              </Typography>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}
