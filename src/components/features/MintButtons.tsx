import { Button, Box, Typography, CircularProgress, Alert } from '@mui/material'
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  useChainId,
} from 'wagmi'
import { SEPOLIA_CONTRACTS, ERC20_ABI } from '../../config/contracts'
import { useTransactions } from '../../context/TransactionContext'
import { useEffect, useState } from 'react'
import { parseTokenAmount, getTokenSymbol } from '../../utils/tokenUtils'
import { sepolia } from 'wagmi/chains'

export function MintButtons() {
  const { address } = useAccount()
  const [processedHashes, setProcessedHashes] = useState<Set<string>>(new Set())
  const { addTransaction } = useTransactions()
  const {
    writeContract,
    isPending,
    data: hash,
    error,
    reset,
  } = useWriteContract()
  const {
    isLoading: isConfirming,
    isSuccess,
    data: receipt,
    error: receiptError,
  } = useWaitForTransactionReceipt({ hash })
  const [mintingToken, setMintingToken] = useState<'DAI' | 'USDC' | null>(null)
  const chainId = useChainId()
  const isOnSepolia = chainId === sepolia.id

  useEffect(() => {
    if (isSuccess && hash && receipt && !processedHashes.has(hash)) {
      addTransaction({
        hash: hash,
        type: 'mint',
        tokenContract: receipt.to || '',
        timestamp: Date.now(),
        tokenSymbol: getTokenSymbol(receipt.to || '') as 'DAI' | 'USDC',
        amount: '10',
      })

      setProcessedHashes(prev => new Set([...prev, hash]))
    }
    if (isSuccess || error) {
      setMintingToken(null)
    }
  }, [isSuccess, hash, receipt, addTransaction, processedHashes])

  const mintDAI = () => {
    if (!isOnSepolia) return

    const amount = parseTokenAmount('10', 'DAI')
    setMintingToken('DAI')

    reset()
    writeContract({
      address: SEPOLIA_CONTRACTS.DAI,
      abi: ERC20_ABI,
      functionName: 'mint',
      args: [address!, amount],
    })
  }

  const mintUSDC = () => {
    if (!isOnSepolia) return

    const amount = parseTokenAmount('10', 'USDC')
    setMintingToken('USDC')

    reset()
    writeContract({
      address: SEPOLIA_CONTRACTS.USDC,
      abi: ERC20_ABI,
      functionName: 'mint',
      args: [address!, amount],
    })
  }

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        🌱 Plant Seeds
      </Typography>

      {!isOnSepolia && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Please switch to Sepolia testnet to mint eco-tokens.
        </Alert>
      )}

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Create new eco-tokens to fund environmental projects
      </Typography>

      <Box display="flex" gap={2}>
        <Button
          variant="contained"
          color="mint"
          onClick={mintDAI}
          disabled={!isOnSepolia || mintingToken === 'DAI'}
          startIcon={
            mintingToken === 'DAI' ? <CircularProgress size={16} /> : null
          }
        >
          {mintingToken === 'DAI' ? 'Planting DAI Seeds...' : 'Create 10 DAI'}
        </Button>

        <Button
          variant="contained"
          color="mint"
          onClick={mintUSDC}
          disabled={!isOnSepolia || mintingToken === 'USDC'}
          startIcon={
            mintingToken === 'USDC' ? <CircularProgress size={16} /> : null
          }
        >
          {mintingToken === 'USDC'
            ? 'Planting USDC Seeds...'
            : 'Create 10 USDC'}
        </Button>
      </Box>

      {/* Estado de transacción */}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          <Typography variant="subtitle2">
            Eco-token couldnt be created :(
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
            {error.message}
          </Typography>
        </Alert>
      )}

      {receiptError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          <Typography variant="subtitle2">
            Unable to confirm planting :
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
            {receiptError.message}
          </Typography>
        </Alert>
      )}

      {isSuccess && receipt && (
        <Alert severity="success" sx={{ mt: 2 }}>
          <Typography variant="subtitle2">
            Seeds Planted Successfully!
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Your eco-tokens are ready! Check your balance.
          </Typography>
        </Alert>
      )}

      {receipt && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2">
            📊{' '}
            <a
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
