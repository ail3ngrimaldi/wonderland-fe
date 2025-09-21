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
import { SEPOLIA_CONTRACTS, ERC20_ABI, TOKEN_DECIMALS } from '../config/contracts'
import { useTransactions } from '../context/TransactionContext'

type TokenType = 'DAI' | 'USDC'

export function TokenOperations() {
    // Estados del formulario
  const [selectedToken, setSelectedToken] = useState<TokenType>('DAI')
  const [amount, setAmount] = useState('')
  const [recipientAddress, setRecipientAddress] = useState('')
  const [spenderAddress, setSpenderAddress] = useState('')
  const [operation, setOperation] = useState<'approve' | 'transfer'>('transfer')
  const { address, isConnected, chain } = useAccount()
  const { writeContract, isPending, data: hash, error, reset } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })
  const { addTransaction } = useTransactions()

  // Solo mostrar si está conectado y en Sepolia
  if (!isConnected || chain?.id !== sepolia.id || !address) {
      return (
        <Alert severity="warning" sx={{ mb: 2 }}>
          ⚠️ Connect to Sepolia network to approve/transfer tokens
        </Alert>
      )
  }

  useEffect(() => {
    if (isSuccess && hash) {
      // Basic receipt
      const tokenSymbol = selectedToken as 'DAI' | 'USDC'
      const tokenContract = selectedToken === 'DAI' ? SEPOLIA_CONTRACTS.DAI : SEPOLIA_CONTRACTS.USDC

      console.log('🎯 Adding ApproveTransfer receipt:', operation, selectedToken)

      addTransaction({
        hash: hash,
        type: operation as 'transfer' | 'approve',
        tokenContract,
        timestamp: Date.now(),
        tokenSymbol,
        amount,
        blockNumber: hash.blockNumber,
        to: tokenContract
      })
    }
  }, [isSuccess, hash, operation, selectedToken, addTransaction])

  // Validaciones
  const isValidAmount = amount && !isNaN(Number(amount)) && Number(amount) > 0
  const isValidRecipient = operation === 'transfer' ? isAddress(recipientAddress) : true
  const isValidSpender = operation === 'approve' ? isAddress(spenderAddress) : true
  const canSubmit = isValidAmount && isValidRecipient && isValidSpender

  // Función para aprobar tokens
  const handleApprove = () => {
    if (!isValidAmount || !isValidSpender) return

    console.group('🚀 Initiating Approve')
    const decimals = TOKEN_DECIMALS[selectedToken]
    const parsedAmount = parseUnits(amount, decimals)
    console.log('📊 Token:', selectedToken)
    console.log('📊 Spender:', spenderAddress)
    console.log('📊 Amount:', parsedAmount.toString())
    console.groupEnd()

    reset()
    writeContract({
      address: SEPOLIA_CONTRACTS[selectedToken],
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [spenderAddress as `0x${string}`, parsedAmount],
    })
  }

  // Función para transferir tokens
  const handleTransfer = () => {
    if (!isValidAmount || !isValidRecipient) return

    console.group('🚀 Initiating Transfer')
    const decimals = TOKEN_DECIMALS[selectedToken]
    const parsedAmount = parseUnits(amount, decimals)
    console.log('📊 Token:', selectedToken)
    console.log('📊 Recipient:', recipientAddress)
    console.log('📊 Amount:', parsedAmount.toString())
    console.groupEnd()

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
          Approve & Transfer Tokens
        </Typography>
        {/* Selector de operación */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Operation</InputLabel>
          <Select
            value={operation}
            label="Operation"
            onChange={(e) => setOperation(e.target.value as 'approve' | 'transfer')}
          >
            <MenuItem value="transfer">Transfer (send tokens)</MenuItem>
            <MenuItem value="approve">Approve (give permission)</MenuItem>
          </Select>
        </FormControl>

        {/* Selector de token */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Token</InputLabel>
          <Select
            value={selectedToken}
            label="Token"
            onChange={(e) => setSelectedToken(e.target.value as TokenType)}
          >
            <MenuItem value="DAI">DAI (18 decimals)</MenuItem>
            <MenuItem value="USDC">USDC (6 decimals)</MenuItem>
          </Select>
        </FormControl>

        {/* Input de cantidad */}
        <TextField
          fullWidth
          label="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          error={amount !== '' && !isValidAmount}
          helperText={amount !== '' && !isValidAmount ? 'Enter a valid positive number' : ''}
          sx={{ mb: 2 }}
        />

        {/* Input condicional según operación */}
        {operation === 'transfer' ? (
          <TextField
            fullWidth
            label="Recipient Address"
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
            error={recipientAddress !== '' && !isValidRecipient}
            helperText={recipientAddress !== '' && !isValidRecipient ? 'Enter a valid Ethereum address' : 'Address that will receive the tokens'}
            sx={{ mb: 2 }}
          />
        ) : (
          <TextField
            fullWidth
            label="Spender Address"
            value={spenderAddress}
            onChange={(e) => setSpenderAddress(e.target.value)}
            error={spenderAddress !== '' && !isValidSpender}
            helperText={spenderAddress !== '' && !isValidSpender ? 'Enter a valid Ethereum address' : 'Address that can spend your tokens'}
            sx={{ mb: 2 }}
          />
        )}

        {/* Botón de acción */}
        <Button
          fullWidth
          variant="contained"
          color={operation === 'approve' ? 'approve' : 'transfer'}
          onClick={operation === 'approve' ? handleApprove : handleTransfer}
          disabled={!canSubmit || isPending || isConfirming}
          startIcon={isPending || isConfirming ? 
          <CircularProgress size={16} /> : null}>
            {isPending ? `Signing ${operation}...` : isConfirming ? `Mining ${operation}...` : operation === 'approve' ? 'Approve Tokens' : 'Transfer Tokens'}
        </Button>

        {/* Estados de error y éxito */}
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
                  View on Etherscan
                </a>
              </Box>
            )}
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
