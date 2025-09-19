import { Button, Box, Typography, CircularProgress, Alert, Card, CardContent } from '@mui/material'
  import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
  import { parseUnits, formatUnits } from 'viem'
  import { sepolia } from 'wagmi/chains'
  import { SEPOLIA_CONTRACTS, ERC20_ABI } from '../config/contracts'

  export function MintButtons() {
    const { address, isConnected, chain } = useAccount()

    const { writeContract, isPending, data: hash, error, reset } = useWriteContract()

    const { isLoading: isConfirming, isSuccess, error: receiptError, data: receipt } = useWaitForTransactionReceipt({
      hash,
    })

    console.group('🔍 MintButtons Debug State')
    console.log('📝 Connected:', isConnected)
    console.log('📝 Address:', address)
    console.log('📝 Chain:', chain?.name, `(${chain?.id})`)
    console.log('📝 isPending (signing):', isPending)
    console.log('📝 isConfirming (mining):', isConfirming)
    console.log('📝 Hash:', hash)
    console.log('📝 Receipt:', receipt)
    console.log('📝 Error:', error?.message)
    console.log('📝 Receipt Error:', receiptError?.message)
    console.groupEnd()

    if (!isConnected || chain?.id !== sepolia.id || !address) {
      return null
    }

    const mintDAI = () => {
        console.group('🚀 Initiating DAI Mint')
        const amount = parseUnits('10', 18)
        console.log('📊 Amount (raw):', amount.toString())
        console.log('📊 Amount (formatted):', formatUnits(amount, 18))
        console.log('📊 Contract:', SEPOLIA_CONTRACTS.DAI)
        console.log('📊 Recipient:', address)
        console.groupEnd()
  
        reset() // Limpiar estado anterior
        writeContract({
          address: SEPOLIA_CONTRACTS.DAI,
          abi: ERC20_ABI,
          functionName: 'mint',
          args: [address, amount],
        })
      }

      const mintUSDC = () => {
        console.group('🚀 Initiating USDC Mint')
        const amount = parseUnits('10', 6)
        console.log('📊 Amount (raw):', amount.toString())
        console.log('📊 Amount (formatted):', formatUnits(amount, 6))
        console.log('📊 Contract:', SEPOLIA_CONTRACTS.USDC)
        console.log('📊 Recipient:', address)
        console.groupEnd()
  
        reset() // Limpiar estado anterior
        writeContract({
          address: SEPOLIA_CONTRACTS.USDC,
          abi: MINT_ABI,
          functionName: 'mint',
          args: [address, parseUnits('10', 6)],
        })
      }

    return (
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Mint Test Tokens
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Get free testnet tokens to test the app functionality
        </Typography>

         {/* 🔍 DEBUG: Estado visual en UI */}
         <Card sx={{ mb: 2, bgcolor: 'grey.50' }}>
          <CardContent>
            <Typography variant="subtitle2" gutterBottom>
              🔍 Transaction Debug Info
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: 
  '0.75rem' }}>
              Status: {isPending ? '⏳ Signing...' : isConfirming ? '⛏️ Mining...' :
  isSuccess ? '✅ Complete' : '⭕ Ready'}<br/>
              Hash: {hash ? `${hash.slice(0, 10)}...${hash.slice(-8)}` : 'None'}<br/>
              Block: {receipt?.blockNumber?.toString() || 'Pending'}<br/>
              Gas Used: {receipt?.gasUsed?.toString() || 'Pending'}
            </Typography>
          </CardContent>
        </Card>
        

        <Box display="flex" gap={2}>
          <Button
            variant="contained"
            onClick={mintDAI}
            disabled={isPending || isConfirming}
            startIcon={isPending || isConfirming ? <CircularProgress size={16} /> :
  null}
          >
            {isPending ? 'Signing DAI...' : isConfirming ? 'Mining DAI...' : 'Mint 10DAI'}
          </Button>

          <Button
            variant="contained"
            onClick={mintUSDC}
            disabled={isPending || isConfirming}
            startIcon={isPending || isConfirming ? <CircularProgress size={16} /> :
  null}
          >
            {isPending ? 'Signing USDC...' : isConfirming ? 'Mining USDC...' : 'Mint 10USDC'}          
          </Button>
        </Box>

        {/* Estado de transacción */}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            <Typography variant="subtitle2">Transaction Error:</Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
              {error.message}
            </Typography>
          </Alert>
        )}

        {receiptError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            <Typography variant="subtitle2">Receipt Error:</Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
              {receiptError.message}
            </Typography>
          </Alert>
        )}

        {isSuccess && receipt && (
          <Alert severity="success" sx={{ mt: 2 }}>
            <Typography variant="subtitle2">✅ Transaction Successful!</Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
              Block: {receipt.blockNumber.toString()}<br/>
              Gas: {receipt.gasUsed.toString()}<br/>
              Hash: {hash}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Tokens minted! Check your balance above.
            </Typography>
          </Alert>
        )}

        {hash && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2">
              📊 <a 
                href={`https://sepolia.etherscan.io/tx/${hash}`} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                View on Etherscan
              </a>
            </Typography>
          </Box>
        )}
      </Box>
    )
  }