import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
} from 'react'
import { formatHash } from '../utils/tokenUtils'

type StoredTransaction = {
  hash: string
  type: 'mint' | 'transfer' | 'approve'
  tokenContract: string
  timestamp: number
  tokenSymbol: 'DAI' | 'USDC'
  amount?: string
}

type TransactionContextType = {
  transactions: StoredTransaction[]
  addTransaction: (transaction: StoredTransaction) => void
  clearTransactions: () => void
  getTransactionsByType: (
    type: 'mint' | 'transfer' | 'approve'
  ) => StoredTransaction[]
}

const TransactionContext = createContext<TransactionContextType | undefined>(
  undefined
)

const STORAGE_KEY = 'blockchain-tx-hashes'
const STORAGE_VERSION = '1.0'

export function TransactionProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<StoredTransaction[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const data = JSON.parse(stored)

        if (
          data.version === STORAGE_VERSION &&
          Array.isArray(data.transactions)
        ) {
          return data.transactions
        }
      }
    } catch (error) {
      console.warn('Error loading transaction hashes:', error)
      localStorage.removeItem(STORAGE_KEY)
    }
    return []
  })

  useEffect(() => {
    const saveToStorage = () => {
      try {
        const dataToStore = {
          version: STORAGE_VERSION,
          transactions,
          savedAt: new Date().toISOString(),
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToStore))
      } catch (error) {
        console.error('Error saving transactin hashes:', error)
      }
    }

    const timeoutId = setTimeout(saveToStorage, 300)
    return () => clearTimeout(timeoutId)
  }, [transactions])

  const addTransaction = useCallback((transaction: StoredTransaction) => {
    setTransactions(prev => {
      const exists = prev.some(tx => tx.hash === transaction.hash)
      if (exists) {
        return prev
      }
      return [transaction, ...prev]
    })
  }, [])

  const clearTransactions = useCallback(() => {
    setTransactions([])
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  const getTransactionsByType = useCallback(
    (type: 'mint' | 'transfer' | 'approve') => {
      return transactions.filter(tx => tx.type === type)
    },
    [transactions]
  )

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        addTransaction,
        getTransactionsByType,
        clearTransactions,
      }}
    >
      {children}
    </TransactionContext.Provider>
  )
}

export function useTransactions() {
  const context = useContext(TransactionContext)
  if (!context) {
    throw new Error('useTransactions must be used within TransactionProvider')
  }
  return context
}
