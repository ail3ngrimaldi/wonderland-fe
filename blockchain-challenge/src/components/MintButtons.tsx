import { Button, Box, Typography, CircularProgress, Alert, Card, CardContent } from '@mui/material'
  import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
  import { parseUnits, formatUnits } from 'viem'
  import { sepolia } from 'wagmi/chains'
  import { SEPOLIA_CONTRACTS, ERC20_ABI } from '../config/contracts'
  import { useTransactions } from '../context/TransactionContext'
  import { useEffect, useState } from 'react'
  import { getTokenDecimals, formatHash, parseTokenAmount, getTokenSymbol } from '../utils/tokenUtils'

  export function MintButtons() {
    const { address, isConnected, chain } = useAccount()
    const [processedHashes, setProcessedHashes] = useState<Set<string>>(new Set())
    const { addTransaction } = useTransactions()
    const { writeContract, isPending, data: hash, error, reset } = useWriteContract()
    const { isLoading: isConfirming, isSuccess, data: receipt, error: receiptError } = useWaitForTransactionReceipt({ hash })
    const [mintingToken, setMintingToken] = useState<'DAI' | 'USDC' | null>(null)

    useEffect(() => {
        if (isSuccess && hash && receipt && !processedHashes.has(hash)) {
            addTransaction({
                hash: hash, // ✅ hash es el string directamente
                type: 'mint',
                tokenContract: receipt.to || '',
                timestamp: Date.now(),
                tokenSymbol: getTokenSymbol(receipt.to || '') as 'DAI' | 'USDC',
                amount: '10'
            })
  
            setProcessedHashes(prev => new Set([...prev, hash]))
        }
        if (isSuccess || error) {
          setMintingToken(null)
      }
    }, [isSuccess, hash, receipt, addTransaction, processedHashes])

    if (!isConnected || chain?.id !== sepolia.id || !address) {
      return null
    }

    const mintDAI = () => {
        const amount = parseTokenAmount('10', 'DAI')
        setMintingToken('DAI')

        reset()
        writeContract({
          address: SEPOLIA_CONTRACTS.DAI,
          abi: ERC20_ABI,
          functionName: 'mint',
          args: [address, amount],
        })
      }

      const mintUSDC = () => {
        const amount = parseTokenAmount('10', 'USDC')
        setMintingToken('USDC')
        
        reset()
        writeContract({
          address: SEPOLIA_CONTRACTS.USDC,
          abi: ERC20_ABI,
          functionName: 'mint',
          args: [address, amount],
        })
      }

    return (
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          🌱 Plant Seeds
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Create new eco-tokens to fund environmental projects
        </Typography>

        <Card sx={{ mb: 2, bgcolor: 'grey.50' }}>
            <CardContent>
            <Typography variant="subtitle2" gutterBottom>
                🔍 Transaction Debug Info
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                Status: {isPending ? '⏳ Signing...' : isConfirming ? '⛏️ Mining...' : isSuccess ? '✅ Complete' : '⭕ Ready'} <br/>
                Hash: {hash ? formatHash(hash) : 'None'} <br/>
                Block: {receipt?.blockNumber?.toString() || 'Pending'} <br/>
                Gas Used: {receipt?.gasUsed?.toString() || 'Pending'}
            </Typography>
            </CardContent>
        </Card>
        

        <Box display="flex" gap={2}>
          <Button
            variant="contained"
            color="mint"
            onClick={mintDAI}
            disabled={mintingToken === 'DAI' }
            startIcon={mintingToken === 'DAI' ? <CircularProgress size={16} /> : null}
          >
            {mintingToken === 'DAI' ? 'Processing DAI...' : 'Mint 10 DAI'}
          </Button>

          <Button
            variant="contained"
            color="mint"
            onClick={mintUSDC}
            disabled={mintingToken === 'USDC'}
            startIcon={mintingToken === 'USDC' ? <CircularProgress size={16} /> : null}
          >
              {mintingToken === 'USDC' ? 'Processing USDC...' : 'Mint 10 USDC'}   
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
            <Typography variant="body2" sx={{ mt: 1 }}> Tokens minted! Check your balance above. </Typography>
            </Alert>
        )}

        {receipt && (
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