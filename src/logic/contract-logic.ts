import { ethers } from 'ethers'

/**
 * ENSを取得
 * @param address アドレス
 * @returns ENS
 */
export const fetchEns = async (address: string) => {
  try {
    const provider = new ethers.AlchemyProvider('mainnet', process.env.NEXT_PUBLIC_ALCHEMY_API_KEY as string)
    const name = await provider.lookupAddress(address)
    return name
  } catch (err) {
    console.error(err)
  }
  return null
}

/**
 * チェーンを切り替える
 * @param provider プロバイダ
 * @param chainId   チェーンID
 */
export const switchChain = async (provider: any, chainId: number) => {
  if (provider == null) { throw new Error('プロバイダが取得できませんでした') }
  await provider.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: `0x${chainId.toString(16)}` }]
  })
}

/**
 * BlockNoを取得
 * @param provider プロバイダ
 * @returns BlockNo
 */
export const getBlockNumber = async (provider: any): Promise<number | null> => {
  if (provider === null) { return null }
  const browserProvider = new ethers.BrowserProvider(provider)
  const blockNumber = await browserProvider.getBlockNumber()
  return blockNumber
}


/**
 * 署名を取得
 * @param provider プロバイダ
 * @param message  メッセージ
 * @returns 署名
 */
export const sign = async (provider: any, message: string) => {
  const browserProvider = new ethers.BrowserProvider(provider)
  const signer = await browserProvider.getSigner()
  const signature = await signer.signMessage(message)
  return signature
}




/**
 * 読み込みを行うためのコントラクトを取得
 * @param provider        プロバイダ
 * @param contractAddress コントラクトアドレス
 * @param abi             ABI
 * @returns コントラクト
 */
export const getContractForRead = (provider: any, contractAddress: string, abi: any[]): ethers.Contract => {
  const browserProvider = new ethers.BrowserProvider(provider)
  const contract = new ethers.Contract(contractAddress, abi, browserProvider)
  if (contract === null) {
    throw new Error('コントラクトが取得できませんでした')
  }
  return contract
}


/**
 * 書き込みを行うためのコントラクトを取得
 * @param provider        プロバイダ
 * @param contractAddress コントラクトアドレス
 * @param abi             ABI
 * @returns コントラクト
 */
export const getContractForWrite = async (provider: any, contractAddress: string, abi: any[]): Promise<ethers.Contract> => {
  const browserProvider = new ethers.BrowserProvider(provider)
  const signer = await browserProvider.getSigner()
  const contract = new ethers.Contract(contractAddress, abi, signer)
  if (contract === null) {
    throw new Error('コントラクトが取得できませんでした')
  }
  return contract
}
