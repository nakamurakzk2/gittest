export type Collection = {
  townId: string
  businessId: string
  productId: string
  chainId: number
  contractAddress: string
  name: string
  symbol: string
  title: string
  description: string
  attributes: Attribute[]
  image: string
  createdAt: number
  updatedAt: number
}

export type CollectionDraft = {
  townId: string
  businessId: string
  productId: string
  chainId: number
  name: string
  symbol: string
  title: string
  description: string
  attributes: Attribute[]
  image: string
  createdAt: number
  updatedAt: number
}


export type Asset = {
  productId: string
  chainId: number
  contractAddress: string
  tokenId: number
  name: string
  description: string
  owner: string
  image: string
  attributes: Attribute[]
  createdAt: number
  updatedAt: number
}

export type Attribute = {
  trait_type: string
  value: string
}


export type AssetOwner = {
  tokenId: number
  address: string
}