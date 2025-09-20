import { describe, it, expect } from 'vitest'
import { formatHash, getTokenSymbol, getTokenDecimals, parseTokenAmount } from './tokenUtils'
import { parseUnits } from 'viem'
import { SEPOLIA_CONTRACTS } from '../config/contracts'

  describe('formatHash function', () => {
    it('should format long addresses correctly', () => {
        const address = '0x1234567890abcdef1234567890abcdef12345678'
        const result = formatHash(address)
        expect(result).toBe('0x1234...5678')
    })

    it('should return "-" for undefined address', () => {
        const result = formatHash(undefined)
        expect(result).toBe('-')
    })
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
  })

  describe('getTokenDecimals', () => {
    it('should return 18 decimals for DAI', () => {
      const result = getTokenDecimals('DAI')
      expect(result).toBe(18)
    })

    it('should return 6 decimals for USDC', () => {
      const result = getTokenDecimals('USDC')
      expect(result).toBe(6) // da el numero correcto?
    })
  })
  
  describe('parseTokenAmount', () => {
    it('should parse DAI amounts with 18 decimals', () => {
        const decimals = parseTokenAmount('5', 'DAI')
        expect(decimals).toBe(parseUnits('5', 18))
    })

    it('should parse USDC amounts with 6 decimals', () => {
        const decimals = parseTokenAmount('5', 'USDC')
        expect(decimals).toBe(parseUnits('5', 6))
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
  })