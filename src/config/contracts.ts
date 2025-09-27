export const SEPOLIA_CONTRACTS = {
    DAI: '0x1D70D57ccD2798323232B2dD027B3aBcA5C00091',
    USDC: '0xC891481A0AaC630F4D89744ccD2C7D2C4215FD47',
  } as const

  export const TOKEN_DECIMALS = {
    DAI: 18,
    USDC: 6,
  } as const

  export const ERC20_ABI = [
    {
      name: 'mint',
      type: 'function',
      stateMutability: 'nonpayable',
      inputs: [
        { name: '_address', type: 'address' },
        { name: '_value', type: 'uint256' }
      ],
      outputs: []
    },
    {
      name: 'approve',
      type: 'function',
      stateMutability: 'nonpayable',
      inputs: [
        { name: 'spender', type: 'address' },
        { name: 'amount', type: 'uint256' }
      ],
      outputs: [{ name: '', type: 'bool' }]
    },
    {
      name: 'transfer',
      type: 'function',
      stateMutability: 'nonpayable',
      inputs: [
        { name: 'to', type: 'address' },
        { name: 'amount', type: 'uint256' }
      ],
      outputs: [{ name: '', type: 'bool' }]
    },
    {
      name: 'allowance',
      type: 'function',
      stateMutability: 'view',
      inputs: [
        { name: 'owner', type: 'address' },
        { name: 'spender', type: 'address' }
      ],
      outputs: [{ name: '', type: 'uint256' }]
    }
  ] as const