import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { sepolia, mainnet, polygon } from 'wagmi/chains'

export const wagmiConfig = getDefaultConfig({
  appName: 'Blockchain Challenge',
  projectId: '62ff31ebf28a41e9407071214cb6e4e3',
  chains: [sepolia, mainnet, polygon],
})
