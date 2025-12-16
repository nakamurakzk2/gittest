import { AdminUser, SimpleAdminUser, CustomerSupportMemo } from "@/entity/admin/user"
import { SimpleTown, Town, TownPageItem } from "@/entity/town/town"
import { BusinessApplication, SuperAdminApplication, TownApplication } from "@/entity/admin/user-application"
import { OwnAssetProduct, OwnProduct, ProductCategory, ProductGroup, ProductItem, SearchProductItem, SimpleOwnProduct, SimpleProductCategory, SimpleProductGroup, SimpleProductItem } from "@/entity/product/product"
import { Business, SimpleBusiness } from "@/entity/town/business"
import { BillingInfo, LoginToken, SimpleUser, SimpleUserWallet, User } from "@/entity/user/user"
import { SimpleProductRankingItem } from "@/entity/ranking"
import { CampaignBanner, DisplayOrder, TopBanner, TopPickup } from "@/entity/page/top-page"
import { FormAnswer, FormAnswerSummary, FormMaster, SimpleFormMaster } from "@/entity/product/form"
import { Collection, CollectionDraft } from "@/entity/product/contract"
import { ChatItem, PreTalkChat, ProductChat, SimpleChat } from "@/entity/user/user-chat"
import { PaymentType, ProductPendingPayment } from "@/entity/product/payment"

// Admin
export type ResponseAdminUsers = {
  adminUsers: AdminUser[]
}
export type ResponseSimpleAdminUser = {
  simpleAdminUser: SimpleAdminUser
  loginToken?: LoginToken
}
export type ResponseSuperAdminApplications = {
  superAdminApplications: SuperAdminApplication[]
}
export type ResponseTownApplications = {
  townApplications: TownApplication[]
  towns: Town[]
}
export type ResponseBusinessApplications = {
  businessApplications: BusinessApplication[]
}
export type ResponseTowns = {
  towns: Town[]
}
export type ResponseTown = {
  town: Town
}
export type ResponsePreTalkChats = {
  productItems: ProductItem[]
  preTalkChats: PreTalkChat[]
}
export type ResponsePreTalkChat = {
  preTalkChat: PreTalkChat
  chatItems: ChatItem[]
  user: User
  productItem: ProductItem
}
export type ResponseProductChats = {
  productItems: ProductItem[]
  productChats: ProductChat[]
  users: User[]
}
export type ResponseProductChat = {
  productChat: ProductChat
  chatItems: ChatItem[]
  user: User
  productItem: ProductItem
  ownProduct: OwnProduct
}

// Town
export type ResponseSimpleTowns = {
  simpleTowns: SimpleTown[]
}

// Product
export type ResponseProducts = {
  productGroups: ProductGroup[]
  productItems: ProductItem[]
  productCategories: ProductCategory[]
  collectionDrafts: CollectionDraft[]
  businesses: Business[]
}
export type ResponseProductItem = {
  productItem: ProductItem
}
export type ResponseProductItems = {
  townId: string
  businessId: string
  productItems: ProductItem[]
}
export type ResponseProductCategories = {
  productCategories: ProductCategory[]
  displayOrder: DisplayOrder
}
export type ResponseProductCategory = {
  productCategory: ProductCategory
}
export type ResponseSimpleProduct = {
  simpleProductGroup: SimpleProductGroup
  simpleProductItems: SimpleProductItem[]
  simpleProductCategories: SimpleProductCategory[]
  simpleTown: SimpleTown
  simpleBusiness: SimpleBusiness
}
export type ResponseSimpleProductItem = {
  simpleProductGroup: SimpleProductGroup
  simpleProductItem: SimpleProductItem
}
export type ResponsePaymentResult = {
  simpleProductGroup: SimpleProductGroup
  simpleProductItem: SimpleProductItem
  simpleBusiness: SimpleBusiness
  amount: number
  price: number
  tokenIds: number[]
  billingInfo: BillingInfo
  paymentType: PaymentType
}
export type ResponseOwnProducts = {
  ownProducts: OwnProduct[]
  ownAssetProducts: OwnAssetProduct[]
  productItems: ProductItem[]
  users: User[]
}
export type ResponseOwnProduct = {
  ownProduct: OwnProduct | null
  ownAssetProduct: OwnAssetProduct | null
  productItem: ProductItem
  user: User
  productChat: ProductChat
  chatItems: ChatItem[]
  formMasters: FormMaster[]
  formAnswers: FormAnswer[]
}
export type ResponseOwnCount = {
  productId: string
  count: number
  reachedUserLimit: boolean
}

// Payment
export type ResponsePendingPayments = {
  pendingPayments: ProductPendingPayment[]
  productItems: ProductItem[]
  towns: Town[]
  businesses: Business[]
}

// Form
export type ResponseFormMasters = {
  formMasters: FormMaster[]
}
export type ResponseSimpleFormMasters = {
  simpleFormMasters: SimpleFormMaster[]
}
export type ResponseFormMaster = {
  formMaster: FormMaster
}


// CustomerSupport
export type ResponseCustomerSupportData = {
  towns: Town[]
  businesses: Business[]
  productItems: ProductItem[]
  ownProducts: OwnProduct[]
  ownAssetProducts: OwnAssetProduct[]
  productChats: ProductChat[]
  preTalkChats: PreTalkChat[]
  formAnswers: FormAnswer[]
  users: User[]
}
export type ResponseCustomerSupportMemos = {
  customerSupportMemos: CustomerSupportMemo[]
}
export type ResponseFormAnswerSummaries = {
  formAnswerSummaries: FormAnswerSummary[]
}
export type ResponseFormAnswers = {
  productItems: ProductItem[]
  formMasters: FormMaster[]
  formAnswers: FormAnswer[]
  users: User[]
}
export type ResponseFormAnswer = {
  productItem: ProductItem
  formMasters: FormMaster[]
  formAnswers: FormAnswer[]
  users: User[]
}

// Business
export type ResponseBusinesses = {
  businesses: Business[]
}
export type ResponseBusiness = {
  business: Business
}

// Contract
export type ResponseCollection = {
  productItem: ProductItem
  collection: Collection | null
}
export type ResponseCollectionDraft = {
  productItem: ProductItem
  collectionDraft: CollectionDraft | null
}

// User
export type ResponseSimpleUser = {
  simpleUser: SimpleUser
  loginToken?: LoginToken
}
export type ResponseSimpleChat = {
  simpleChat: SimpleChat
}
export type ResponseUserEditPage = {
  isGoogleLogin: boolean
  email: string
  billingInfo: BillingInfo | null
}
export type ResponseUserWalletPage = {
  simpleUserWallets: SimpleUserWallet[]
  transferAddress: string | null
}
export type ResponseProductPage = {
  simpleOwnProduct: SimpleOwnProduct
  simpleProductItem: SimpleProductItem
  formMasters: FormMaster[]
  simpleCategories: SimpleProductCategory[]
  simpleBusiness: SimpleBusiness,
  simpleChat: SimpleChat,
}
export type ResponsePreTalkChatPage = {
  simpleProductItem: SimpleProductItem
  simpleCategories: SimpleProductCategory[]
  simpleBusiness: SimpleBusiness,
  simpleChat: SimpleChat,
}
export type ResponseSearchPage = {
  searchProductItems: SearchProductItem[]
  simpleTowns: SimpleTown[]
  simpleCategories: SimpleProductCategory[]
  simpleBusinesses: SimpleBusiness[]
}
export type ResponseOwnProductsPage = {
  simpleOwnProducts: SimpleOwnProduct[]
  transferAddress: string | null
}

// Page
export type ResponseTopBanners = {
  topBanners: TopBanner[]
  displayOrder: DisplayOrder
}
export type ResponseTopBanner = {
  topBanner: TopBanner
}
export type ResponseTopPickups = {
  topPickups: TopPickup[]
  displayOrder: DisplayOrder
}
export type ResponseTopPickup = {
  topPickup: TopPickup
}
export type ResponseCampaignBanners = {
  campaignBanners: CampaignBanner[]
  displayOrder: DisplayOrder
}
export type ResponseCampaignBanner = {
  campaignBanner: CampaignBanner
}


// Public
export type ResponseTopPage = {
  simpleCategories: SimpleProductCategory[]
  simpleTowns: SimpleTown[]
  simpleBusinesses: SimpleBusiness[]
  dailyRankingItems: SimpleProductRankingItem[]
  topBanners: TopBanner[]
  topPickups: TopPickup[]
  campaignBanners: CampaignBanner[]
}
export type ResponseRankingPage = {
  dailyRankingItems: SimpleProductRankingItem[]
  monthlyRankingItems: SimpleProductRankingItem[]
  allTimeRankingItems: SimpleProductRankingItem[]
  simpleTowns: SimpleTown[]
  simpleBusinesses: SimpleBusiness[]
  simpleCategories: SimpleProductCategory[]
}
export type ResponseFeaturePage = {
  campaignBanners: CampaignBanner[]
}
export type ResponseTownsPage = {
  townPageItems: TownPageItem[]
  simpleCategories: SimpleProductCategory[]
}
export type ResponseTownPage = {
  simpleTown: SimpleTown
  simpleProductItems: SimpleProductItem[]
  simpleBusinesses: SimpleBusiness[]
  simpleCategories: SimpleProductCategory[]
}

// Common
export type ResponseMessage = {
  message: string
}
export type ResponseKey = {
  key: string
}
export type ResponseLink = {
  link: string
}
export type ResponseRedirect = {
  link: string
  content: string
}
export type ResponseBank = {
  shunoKikanNo: string
  customerNo: string
  confirmNo: string
  simpleProductItem: SimpleProductItem
  totalPrice: number
}
export type ResponseCount = {
  count: number
}
export type ResponseLoginToken = {
  loginToken: LoginToken
}

// Metadata
export type Metadata = {
  name: string
  description: string
  image: string
  animation_url: string
  external_url: string
  attributes: {
    trait_type: string
    value: string
  }[]
}

// Generic Response
export type Response<T> = {
  success: boolean
  data?: T
  message?: string
}
