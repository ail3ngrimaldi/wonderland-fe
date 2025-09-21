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
    Button,
    CircularProgress
  } from '@mui/material'
import { useAccount } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { useTransactions } from '../context/TransactionContext'
import { SEPOLIA_CONTRACTS } from '../config/contracts'
import { useTransactionDetails } from '../hooks/useTransactionDetails'
import { formatHash } from '../utils/tokenUtils'

function TransactionRow({ transaction, index }: { transaction: any, index: number }) {
    const { data: enrichedData, isLoading } = useTransactionDetails(transaction.hash)
 
    const getEventColor = (type: string) => {
       switch (type) {
         case 'mint': return 'mint'
         case 'transfer': return 'transfer'
         case 'approve': return 'approve'
         default: return 'default'
        }
    }
 
    const formatTime = (timestamp: number) => {
       return new Date(timestamp).toLocaleTimeString()
    }
 
    return (
        <TableRow key={`${transaction.hash}-${index}`}>
            <TableCell>
                <Chip 
                    label={transaction.type.toUpperCase()} 
                    color={getEventColor(transaction.type) as any}
                    size="small"
                />
                </TableCell>
                <TableCell>{transaction.tokenSymbol || 'UNKNOWN'}</TableCell>
                <TableCell>{transaction.amount || '---'}</TableCell>
                <TableCell>{formatTime(transaction.timestamp)}</TableCell>
                <TableCell>
                {isLoading ? (
                    <CircularProgress size={16} />
                ) : enrichedData ? (
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    Block: {enrichedData.blockNumber.toString()}<br/>
                    Gas: {enrichedData.gasUsed.toString()}
                    </Typography>
                ) : (
                    '---'
                )}
                </TableCell>
        
                <TableCell>
                <Link 
                    href={`https://sepolia.etherscan.io/tx/${transaction.hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {formatHash(transaction.hash)}
                </Link>
            </TableCell>
        </TableRow>
     )
   }
 
export function EventTable() {
    const { isConnected, chain } = useAccount()
    const { transactions, clearTransactions } = useTransactions()
 
    if (!isConnected || chain?.id !== sepolia.id) {
       return null
    }
 
    return (
       <Box sx={{ mb: 2 }}>
         <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
           <Typography variant="h6">
             Your Transaction History ({transactions.length} transactions)
           </Typography>
 
           {transactions.length > 0 && (
             <Button 
               variant="outlined" 
               size="small" 
               onClick={clearTransactions}
               color="secondary"
             >
               Clear History
             </Button>
           )}
         </Box>
 
         {transactions.length === 0 ? (
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
                   <TableCell>Amount</TableCell>
                   <TableCell>Time</TableCell>
                   <TableCell>Blockchain Data</TableCell>
                   <TableCell>Transaction</TableCell>
                 </TableRow>
               </TableHead>
               <TableBody>
                 {transactions.map((transaction, index) => (
                   <TransactionRow 
                     key={`${transaction.hash}-${index}`}
                     transaction={transaction} 
                     index={index} 
                   />
                 ))}
               </TableBody>
             </Table>
           </TableContainer>
         )}
       </Box>
     )
   }