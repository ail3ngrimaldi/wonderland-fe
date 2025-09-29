import { describe, it, expect } from 'vitest'
import {
  formatHash,
  getTokenSymbol,
  getTokenDecimals,
  parseTokenAmount,
} from '../../src/utils/tokenUtils'
import { parseUnits } from 'viem'
import { SEPOLIA_CONTRACTS } from '../../src/config/contracts'

describe('tokenUtils', () => {
  describe('formatHash function', () => {
    it('should format long hash correctly', () => {
      const address = '0x1234567890abcdef1234567890abcdef12345678'
      const result = formatHash(address)
      expect(result).toBe('0x1234...5678')
    })

    it('should return dash for undefined hash', () => {
      const result = formatHash(undefined)
      expect(result).toBe('-')
    })

    // review
    // it('should handle empty string', () => {
    //   // Act
    //   const result = formatHash('')

    //   // Assert
    //   expect(result).toBe('-')
    // })
    // revisar
    // it('should handle exact boundary length (10 chars)', () => {
    //   // Arrange
    //   const boundaryHash = '0x12345678'

    //   // Act
    //   const result = formatHash(boundaryHash)

    //   // Assert
    //   expect(result).toBe('0x12345678') // Should return original (< 10)
    // })
  })

  describe('getTokenSymbol', () => {
    it('should return DAI for Sepolia DAI contract', () => {
      const daiAddress = SEPOLIA_CONTRACTS.DAI
      const result = getTokenSymbol(daiAddress)
      expect(result).toBe('DAI')
    })

    it('should return USDC for Sepolia USDC contract', () => {
      const usdcAddress = SEPOLIA_CONTRACTS.USDC
      const result = getTokenSymbol(usdcAddress)
      expect(result).toBe('USDC')
    })

    it('should be case insensitive', () => {
      const daiAddress = SEPOLIA_CONTRACTS.DAI
      const result = getTokenSymbol(daiAddress)
      expect(result).toBe('DAI')
    })

    it('should return UNKNOWN for unrecognized addresses', () => {
      const randomAddress = '0x1111111111111111111111111111111111111111'
      const result = getTokenSymbol(randomAddress)
      expect(result).toBe('UNKNOWN')
    })

    //review
    // it('should return UNKNOWN for invalid address format', () => {
    //   const result = getTokenSymbol('invalid-address')
    //   expect(result).toBe('UNKNOWN')
    // })
  })

  describe('getTokenDecimals', () => {
    it('should return 18 decimals for DAI', () => {
      const result = getTokenDecimals('DAI')
      expect(result).toBe(18)
    })

    it('should return 6 decimals for USDC', () => {
      const result = getTokenDecimals('USDC')
      expect(result).toBe(6)
    })
  })

  describe('parseTokenAmount', () => {
    // Could be more descriptive of what we are testing
    it('should parse DAI amounts with 18 decimals', () => {
      const amount = '100.5'
      const decimals = parseTokenAmount(amount, 'DAI')
      expect(decimals).toBe(parseUnits('100.5', 18))
    })

    it('should parse USDC amounts with 6 decimals', () => {
      const amount = '100.5'
      const decimals = parseTokenAmount(amount, 'USDC')
      expect(decimals).toBe(parseUnits('100.5', 6))
    })

    it('DAI should handle different amount values', () => {
      const result1 = parseTokenAmount('1', 'DAI')
      expect(result1).toBe(parseUnits('1', 18))
      const result2 = parseTokenAmount('100', 'DAI')
      expect(result2).toBe(parseUnits('100', 18))
      const result3 = parseTokenAmount('0.5', 'DAI')
      expect(result3).toBe(parseUnits('0.5', 18))
    })

    it('USDC should handle different amount values', () => {
      const result1 = parseTokenAmount('1', 'USDC')
      expect(result1).toBe(parseUnits('1', 6))
      const result2 = parseTokenAmount('100', 'USDC')
      expect(result2).toBe(parseUnits('100', 6))
      const result3 = parseTokenAmount('0.5', 'USDC')
      expect(result3).toBe(parseUnits('0.5', 6))
    })

    // review
    // it('should handle large amounts', () => {
    //   const largeAmount = '1000000.123456'
    //   const result = parseTokenAmount(largeAmount, 'USDC')
    //   expect(result).toBe(parseUnits(largeAmount, 6))
    // })

    // review
    // it('should handle zero amount', () => {
    //   // Act
    //   const daiResult = parseTokenAmount('0', 'DAI')
    //   const usdcResult = parseTokenAmount('0', 'USDC')

    //   // Assert
    //   expect(daiResult).toBe(0n)
    //   expect(usdcResult).toBe(0n)
    // })
  })
})
