import {
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    CircularProgress
  } from '@mui/material'
import { useState, useEffect } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseUnits, isAddress } from 'viem'
import { sepolia } from 'wagmi/chains'
import { SEPOLIA_CONTRACTS, ERC20_ABI, TOKEN_DECIMALS } from '../../config/contracts'
import { useTransactions } from '../../context/TransactionContext'

type TokenType = 'DAI' | 'USDC'

interface TokenOperationsProps {
  defaultOperation?: 'approve' | 'transfer'
}

export function TokenOperations({ defaultOperation = 'transfer' }: TokenOperationsProps) {
  const [selectedToken, setSelectedToken] = useState<TokenType>('DAI')
  const [amount, setAmount] = useState('')
  const [recipientAddress, setRecipientAddress] = useState('')
  const [spenderAddress, setSpenderAddress] = useState('')
  const [operation, setOperation] = useState<'approve' | 'transfer'>(defaultOperation)
  const { address, isConnected, chain } = useAccount()
  const { writeContract, isPending, data: hash, error, reset } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })
  const { addTransaction } = useTransactions()

  // Check if connected and on Sepolia
  const isOnSepolia = isConnected && chain?.id === sepolia.id && address

  useEffect(() => {
    if (isSuccess && hash) {
      // Basic receipt
      const tokenSymbol = selectedToken as 'DAI' | 'USDC'
      const tokenContract = selectedToken === 'DAI' ? SEPOLIA_CONTRACTS.DAI : SEPOLIA_CONTRACTS.USDC

      addTransaction({
        hash: hash,
        type: operation as 'transfer' | 'approve',
        tokenContract,
        timestamp: Date.now(),
        tokenSymbol,
        amount
      })
    }
  }, [isSuccess, hash, operation, selectedToken, addTransaction])

  // Validaciones
  const isValidAmount = amount && !isNaN(Number(amount)) && Number(amount) > 0
  const isValidRecipient = operation === 'transfer' ? isAddress(recipientAddress) : true
  const isValidSpender = operation === 'approve' ? isAddress(spenderAddress) : true
  const canSubmit = isOnSepolia && isValidAmount && isValidRecipient && isValidSpender

  const handleApprove = () => {
    if (!isOnSepolia || !isValidAmount || !isValidSpender) return

    const decimals = TOKEN_DECIMALS[selectedToken]
    const parsedAmount = parseUnits(amount, decimals)

    reset()
    writeContract({
      address: SEPOLIA_CONTRACTS[selectedToken],
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [spenderAddress as `0x${string}`, parsedAmount],
    })
  }

  const handleTransfer = () => {
    if (!isOnSepolia || !isValidAmount || !isValidRecipient) return

    const decimals = TOKEN_DECIMALS[selectedToken]
    const parsedAmount = parseUnits(amount, decimals)

    reset()
    writeContract({
      address: SEPOLIA_CONTRACTS[selectedToken],
      abi: ERC20_ABI,
      functionName: 'transfer',
      args: [recipientAddress as `0x${string}`, parsedAmount],
    })
  }

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Help your favorite environmental projects!
        </Typography>

        {!isOnSepolia && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            ⚠️ Connect to Sepolia network to approve/transfer tokens
          </Alert>
        )}

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Select which way you'll be contributing</InputLabel>
          <Select
            value={operation}
            label="Select which way you'll be contributing"
            onChange={(e) => setOperation(e.target.value as 'approve' | 'transfer')}
            disabled={!isOnSepolia}
          >
            <MenuItem value="transfer">Make Immediate Donations (send tokens to the project)</MenuItem>
            <MenuItem value="approve">Sponsor Project (give permission to use some of your tokens)</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Choose your token</InputLabel>
          <Select
            value={selectedToken}
            label="Choose your token"
            onChange={(e) => setSelectedToken(e.target.value as TokenType)}
            disabled={!isOnSepolia}
          >
            <MenuItem value="DAI">🌱 DAI Token (18 decimals)</MenuItem>
            <MenuItem value="USDC">💚 USDC Token (6 decimals)</MenuItem>
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="How many tokens will you provide?"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          error={amount !== '' && !isValidAmount}
          helperText={amount !== '' && !isValidAmount ? 'Tokens are represented in positive numbers' : ''}
          disabled={!isOnSepolia}
          sx={{ mb: 2 }}
        />

        {operation === 'transfer' ? (
          <TextField
            fullWidth
            label="Address of the NGO Project you'll be contributing"
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
            error={recipientAddress !== '' && !isValidRecipient}
            helperText={recipientAddress !== '' && !isValidRecipient ? 'Enter a valid Ethereum address' : 'This address will receive the tokens'}
            disabled={!isOnSepolia}
            sx={{ mb: 2 }}
          />
        ) : (
          <TextField
            fullWidth
            label="Which project do you want to have power over these tokens?"
            value={spenderAddress}
            onChange={(e) => setSpenderAddress(e.target.value)}
            error={spenderAddress !== '' && !isValidSpender}
            helperText={spenderAddress !== '' && !isValidSpender ? 'You have to insert the ethereum address of the project' : 'Address that can spend your tokens'}
            disabled={!isOnSepolia}
            sx={{ mb: 2 }}
          />
        )}

        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={operation === 'approve' ? handleApprove : handleTransfer}
          disabled={!canSubmit || isPending || isConfirming}
          startIcon={isPending || isConfirming ? 
          <CircularProgress size={16} /> : null}>
            {isPending ? `Waiting for confirmation for ${operation}...` : isConfirming ? `Processing ${operation}...` : operation === 'approve' ? 'Become a Sponsor' : 'Send Tokens Right Now'}
        </Button>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            Error: {error.message}
          </Alert>
        )}

        {isSuccess && (
          <Alert severity="success" sx={{ mt: 2 }}>
            ✅ {operation} successful!
            {hash && (
              <Box sx={{ mt: 1 }}>
                <a 
                  href={`https://sepolia.etherscan.io/tx/${hash}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  View the transaction data on etherscan
                </a>
              </Box>
            )}
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
