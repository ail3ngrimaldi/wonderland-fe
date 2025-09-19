import { useState, useEffect } from 'react'
import { usePublicClient } from 'wagmi'

type EnrichedTransactionData = {
  blockNumber: bigint
  gasUsed: bigint
  status: 'success' | 'reverted'
  logs: any[]
  effectiveGasPrice: bigint
  from: string
  to: string
}

export function useTransactionDetails(hash: string | undefined) {
  const [data, setData] = useState<EnrichedTransactionData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const publicClient = usePublicClient()

  useEffect(() => {
    if (!hash || !publicClient) {
      return
    }

    const fetchTransactionDetails = async () => {
      setIsLoading(true)
      setError(null)

      try {
        console.log('🔍 Fetching transaction details for:', hash.slice(0, 10))

        const receipt = await publicClient.getTransactionReceipt({
          hash: hash as `0x${string}`
        })

        console.log('✅ Got transaction receipt:', {
          block: receipt.blockNumber,
          status: receipt.status,
          gasUsed: receipt.gasUsed
        })

        setData({
          blockNumber: receipt.blockNumber,
          gasUsed: receipt.gasUsed,
          status: receipt.status,
          logs: receipt.logs,
          effectiveGasPrice: receipt.effectiveGasPrice,
          from: receipt.from,
          to: receipt.to || ''
        })

      } catch (err) {
        console.error('❌ Error fetching transaction details:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setIsLoading(false)
      }
    }

    fetchTransactionDetails()
  }, [hash, publicClient])

  return { data, isLoading, error }
}