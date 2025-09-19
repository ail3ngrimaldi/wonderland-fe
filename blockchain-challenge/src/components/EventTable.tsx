import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Chip,
    Link,
    Box,
  } from '@mui/material'
import { useAccount } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { useTransactions } from '../context/TransactionContext'
import { SEPOLIA_CONTRACTS } from '../config/contracts'

export function EventTable() {
    const { isConnected, chain } = useAccount()
    const { receipts } = useTransactions()

    console.log('🔍 EventTable - receipts from context:', receipts)

    // In this case I want the transactions to be shown always, even if the user changes the network after having performed the transactions.
    // if (!isConnected || chain?.id !== sepolia.id) {
    //   return null
    // }

    const getEventColor = (type: string) => {
      switch (type) {
        case 'mint': return 'success'
        case 'transfer': return 'primary'
        case 'approve': return 'warning'
        default: return 'default'
      }
    }

    const formatAddress = (addr?: string) => {
      if (!addr) return '-'
      return `${addr.slice(0, 6)}...${addr.slice(-4)}`
    }

    const getTokenName = (contractAddress: string) => {
      if (contractAddress.toLowerCase() === SEPOLIA_CONTRACTS.DAI.toLowerCase()) return 'DAI'
      if (contractAddress.toLowerCase() === SEPOLIA_CONTRACTS.USDC.toLowerCase()) return 'USDC'
      return 'UNKNOWN'
    }

    const formatTime = (timestamp: number) => {
      return new Date(timestamp).toLocaleTimeString()
    }

    return (
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Your Transaction History ({receipts.length} transactions)
        </Typography>

        {receipts.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No transactions yet. Start by minting some tokens!
          </Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Type</TableCell>
                  <TableCell>Token</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Block</TableCell>
                  <TableCell>Transaction</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {receipts.map((receipt, index) => (
                  <TableRow key={`${receipt.hash}-${index}`}>
                    <TableCell>
                      <Chip 
                        label={receipt.type.toUpperCase()} 
                        color={getEventColor(receipt.type) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{getTokenName(receipt.tokenContract)}</TableCell>
                    <TableCell>{formatTime(receipt.timestamp)}</TableCell>
                    <TableCell>{receipt.blockNumber.toString()}</TableCell>
                    <TableCell>
                      <Link 
                        href={`https://sepolia.etherscan.io/tx/${receipt.hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {formatAddress(receipt.hash)}
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    )
  }