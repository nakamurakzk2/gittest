export const CHAINS = [
  { chainId: 137, name: 'Polygon', icon: '/chains/polygon.png' },
  { chainId: 8453, name: 'Base', icon: '/chains/base.png' },
  { chainId: 11155111, name: 'Sepolia', icon: '/chains/ethereum.png' },
]

export const ChainId = {
  ETHEREUM: 1,
  POLYGON: 137,
  BASE: 8453,
  SEPOLIA: 11155111,
}

export const DEFAULT_CHAIN_ID = process.env.NEXT_PUBLIC_ENV === 'local' ? ChainId.SEPOLIA : ChainId.POLYGON
