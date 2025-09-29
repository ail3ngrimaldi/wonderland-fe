import { parseUnits, isAddress } from 'viem'
import { SEPOLIA_CONTRACTS } from '../config/contracts'
/**
 * Formatea una dirección Ethereum para display
 * @param address - Dirección completa (0x...)
 * @returns Dirección truncada (0x1234...abcd)
 */
export function formatHash(address?: string): string {
  if (!address) return '-'
  if (address.length < 10) return address
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

/**
 * Determina el símbolo del token basado en contract address
 * @param contractAddress - Address del contrato
 * @returns 'DAI' | 'USDC' | 'UNKNOWN'
 */
export function getTokenSymbol(
  contractAddress: string
): 'DAI' | 'USDC' | 'UNKNOWN' {
  const address = contractAddress.toLowerCase()

  if (address === SEPOLIA_CONTRACTS.DAI.toLowerCase()) return 'DAI'
  if (address === SEPOLIA_CONTRACTS.USDC.toLowerCase()) return 'USDC'
  return 'UNKNOWN'
}

/**
 * Obtiene los decimales para un token específico
 * @param tokenSymbol - 'DAI' | 'USDC'
 * @returns Number of decimals (DAI: 18, USDC: 6)
 */
export function getTokenDecimals(tokenSymbol: 'DAI' | 'USDC'): number {
  return tokenSymbol === 'DAI' ? 18 : 6
}

export function parseTokenAmount(amount: string, tokenSymbol: 'DAI' | 'USDC') {
  const decimals = getTokenDecimals(tokenSymbol)
  return parseUnits(amount, decimals)
}
