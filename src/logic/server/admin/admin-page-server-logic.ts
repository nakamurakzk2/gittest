// Entity
import { CampaignBanner, TopBanner, TopPickup, DisplayOrder, DisplayOrderType } from '@/entity/page/top-page'
import { ResponseCampaignBanner, ResponseCampaignBanners, ResponseTopBanner, ResponseTopBanners, ResponseTopPickup, ResponseTopPickups } from '@/entity/response'

// Logic
import * as ServerLogic from '@/logic/server-logic'


// =========
// TopBanner
// =========

/**
 * すべてのTOPバナーを取得
 * @returns ResponseTopBanners
 */
export const fetchAllTopBanners = async (): Promise<ResponseTopBanners> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/page/top-banners`
  const response = await ServerLogic.postWithAccessToken(url) as ResponseTopBanners
  return response
}

/**
 * TOPバナーを取得
 * @param bannerId バナーID
 * @returns ResponseTopBanner
 */
export const fetchTopBanner = async (bannerId: string): Promise<ResponseTopBanner> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/page/top-banner`
  const response = await ServerLogic.postWithAccessToken(url, { bannerId }) as ResponseTopBanner
  return response
}

/**
 * TOPバナーを更新
 * @param topBanner TOPバナー
 * @returns void
 */
export const upsertTopBanner = async (topBanner: TopBanner): Promise<void> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/page/upsert-top-banner`
  await ServerLogic.postWithAccessToken(url, { topBanner })
}

/**
 * TOPバナーを削除
 * @param bannerId TOPバナーID
 * @returns void
 */
export const deleteTopBanner = async (bannerId: string): Promise<void> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/page/delete-top-banner`
  await ServerLogic.postWithAccessToken(url, { bannerId })
}


// =========
// TopPickup
// =========

/**
 * すべてのTOPピックアップを取得
 * @returns ResponseTopPickups
 */
export const fetchAllTopPickups = async (): Promise<ResponseTopPickups> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/page/top-pickups`
  const response = await ServerLogic.postWithAccessToken(url) as ResponseTopPickups
  return response
}

/**
 * TOPピックアップを取得
 * @param pickupId ピックアップID
 * @returns ResponseTopPickup
 */
export const fetchTopPickup = async (pickupId: string): Promise<ResponseTopPickup> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/page/top-pickup`
  const response = await ServerLogic.postWithAccessToken(url, { pickupId }) as ResponseTopPickup
  return response
}

/**
 * TOPピックアップを更新
 * @param topPickup TOPピックアップ
 * @returns void
 */
export const upsertTopPickup = async (topPickup: TopPickup): Promise<void> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/page/upsert-top-pickup`
  await ServerLogic.postWithAccessToken(url, { topPickup })
}

/**
 * TOPピックアップを削除
 * @param pickupId ピックアップID
 * @returns void
 */
export const deleteTopPickup = async (pickupId: string): Promise<void> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/page/delete-top-pickup`
  await ServerLogic.postWithAccessToken(url, { pickupId })
}


// =========
// 汎用的な順序管理
// =========

/**
 * 表示順序を取得
 * @param type 順序のタイプ
 * @returns DisplayOrder
 */
export const fetchDisplayOrder = async (type: DisplayOrderType): Promise<DisplayOrder> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/page/display-order`
  const response = await ServerLogic.postWithAccessToken(url, { type }) as DisplayOrder
  return response
}

/**
 * 表示順序を更新
 * @param displayOrder 表示順序
 * @returns void
 */
export const updateDisplayOrder = async (displayOrder: DisplayOrder): Promise<void> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/page/update-display-order`
  await ServerLogic.postWithAccessToken(url, { displayOrder })
}



// ==============
// CampaignBanner
// ==============

/**
 * すべての特集バナーを取得
 * @returns ResponseCampaignBanners
 */
export const fetchAllCampaignBanners = async (): Promise<ResponseCampaignBanners> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/page/campaign-banners`
  const response = await ServerLogic.postWithAccessToken(url) as ResponseCampaignBanners
  return response
}

/**
 * 特集バナーを取得
 * @param campaignId 特集ID
 * @returns ResponseCampaignBanner
 */
export const fetchCampaignBanner = async (campaignId: string): Promise<ResponseCampaignBanner> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/page/campaign-banner`
  const response = await ServerLogic.postWithAccessToken(url, { campaignId }) as ResponseCampaignBanner
  return response
}

/**
 * 特集バナーを更新
 * @param campaignBanner 特集バナー
 * @returns void
 */
export const upsertCampaignBanner = async (campaignBanner: CampaignBanner): Promise<void> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/page/upsert-campaign-banner`
  await ServerLogic.postWithAccessToken(url, { campaignBanner })
}

/**
 * 特集バナーを削除
 * @param campaignId 特集ID
 * @returns void
 */
export const deleteCampaignBanner = async (campaignId: string): Promise<void> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/page/delete-campaign-banner`
  await ServerLogic.postWithAccessToken(url, { campaignId })
}


// ============
// DisplayOrder
// ============

/**
 * すべての特集バナーを取得
 * @returns ResponseCampaignBanners
 */
export const upsertDisplayOrder = async (displayOrder: DisplayOrder): Promise<void> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/page/upsert-display-order`
  await ServerLogic.postWithAccessToken(url, { displayOrder })
}