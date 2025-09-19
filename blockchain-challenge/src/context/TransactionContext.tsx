import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react'

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
  getTransactionsByType: (type: 'mint' | 'transfer' | 'approve') => StoredTransaction[]
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined)

const STORAGE_KEY = 'blockchain-tx-hashes'
const STORAGE_VERSION = '1.0'

export function TransactionProvider({ children }: { children: ReactNode }) {
    const [transactions, setTransactions] = useState<StoredTransaction[]>(() => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          const data = JSON.parse(stored)

          if (data.version === STORAGE_VERSION && Array.isArray(data.transactions)) {
            console.log('Loaded', data.transactions.length, 'transaction hashes from storage')
            return data.transactions
          } else {
            console.log('Storage version mismatch, starting fresh')
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
            savedAt: new Date().toISOString()
          }
          localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToStore))
          console.log('Saved', transactions.length, 'transaction hashes')
          } catch (error) {
            console.error('Error saving transactin hashes:', error)
          }
        }

        const timeoutId = setTimeout(saveToStorage, 300)
        return () => clearTimeout(timeoutId)
    }, [transactions])

    const addTransaction = useCallback((transaction: 
      StoredTransaction) => {
        console.group('🔍 DEBUG addTransaction')
        console.log('- Type:', transaction.type)
        console.log('- Hash:', transaction.hash.slice(0, 10))
        console.log('- Contract:', transaction.tokenContract)
        console.log('- Current transactions count:',
      transactions.length)
        console.groupEnd()
    
        setTransactions(prev => {
          const exists = prev.some(tx => tx.hash ===
      transaction.hash)
          if (exists) {
            console.log('🔄 Transaction hash already stored:',
      transaction.hash.slice(0, 10))
            return prev
          }
    
          console.log('✅ Adding transaction hash:',
      transaction.type, transaction.hash.slice(0, 10))
          return [transaction, ...prev]
        })
      }, [])

    // const clearTransactions = useCallback(() => {
    //   setTransactions([])
    //   localStorage.removeItem(STORAGE_KEY)
    //   console.log('Cleared all transaction hashes')
    // }, [])

    const getTransactionsByType = useCallback((type: 'mint' | 'transfer' | 'approve') => {
      return transactions.filer(tx => tx.type === type)
    }, [transactions])

    return (
        <TransactionContext.Provider value={{
          transactions,
          addTransaction,
          getTransactionsByType
        }}>
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