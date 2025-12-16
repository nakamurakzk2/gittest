'use client'

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Package, Tag, FileText, MessageSquare, FileCheck, PackageCheck } from "lucide-react"
import { useAdminSession } from "@/providers/admin-session-provider"
import { AdminUserType } from "@/entity/admin/user"

type CardConfig = {
  key: string
  category: string
  icon: React.ReactNode
  title: string
  description: string
  buttonText: string
  href: string
}

export default function AdminTopView() {
  const { simpleAdminUser } = useAdminSession()

  const getDisplayCards = () => {
    if (!simpleAdminUser) return []

    // Card構成要素の定義
    const cardConfigs = {
      superAdminUserManagement: {
        key: "super-admin-users",
        category: "ユーザー",
        icon: <Users className="h-5 w-5" />,
        title: "あるやうむユーザー管理",
        description: "システムの管理者ユーザーを表示・管理します",
        buttonText: "ユーザー管理画面へ",
        href: "/admin/super-admin-users"
      },
      townUserManagement: {
        key: "town-users",
        category: "ユーザー",
        icon: <Users className="h-5 w-5" />,
        title: "自治体ユーザー管理",
        description: "自治体ユーザーを表示・管理します",
        buttonText: "ユーザー管理画面へ",
        href: "/admin/town-users"
      },
      businessUserManagement: {
        key: "business-users",
        category: "ユーザー",
        icon: <Users className="h-5 w-5" />,
        title: "事業者ユーザー管理",
        description: "事業者ユーザーを表示・管理します",
        buttonText: "ユーザー管理画面へ",
        href: "/admin/business-users"
      },
      businessManagement: {
        key: "businesses",
        category: "管理者向け",
        icon: <Package className="h-5 w-5" />,
        title: "事業者管理",
        description: "事業者を表示・管理します",
        buttonText: "事業者管理画面へ",
        href: "/admin/businesses"
      },
      productManagement: {
        key: "products",
        category: "商品",
        icon: <Package className="h-5 w-5" />,
        title: "商品管理",
        description: "販売商品を表示・管理します",
        buttonText: "商品管理画面へ",
        href: "/admin/products"
      },
      productCategoryManagement: {
        key: "product-categories",
        category: "商品",
        icon: <Tag className="h-5 w-5" />,
        title: "商品カテゴリ管理",
        description: "商品カテゴリを表示・管理します",
        buttonText: "カテゴリ管理画面へ",
        href: "/admin/product-categories"
      },
      topBannerManagement: {
        key: "top-banners",
        category: "ページ管理",
        icon: <FileText className="h-5 w-5" />,
        title: "TOPバナー管理",
        description: "トップページのバナーを表示・管理します",
        buttonText: "TOPバナー管理画面へ",
        href: "/admin/page-management/top-banners"
      },
      topPickupManagement: {
        key: "top-pickups",
        category: "ページ管理",
        icon: <FileText className="h-5 w-5" />,
        title: "PickUp管理",
        description: "ピックアップアイテムを表示・管理します",
        buttonText: "PickUp管理画面へ",
        href: "/admin/page-management/top-pickups"
      },
      campaignBannerManagement: {
        key: "campaign-banners",
        category: "ページ管理",
        icon: <FileText className="h-5 w-5" />,
        title: "特集バナー管理",
        description: "特集バナーを表示・管理します",
        buttonText: "特集バナー管理画面へ",
        href: "/admin/page-management/campaign-banners"
      },
      customerSupport: {
        key: "customer-support",
        category: "顧客対応",
        icon: <MessageSquare className="h-5 w-5" />,
        title: "顧客対応管理",
        description: "顧客との商品チャットを管理します",
        buttonText: "顧客対応管理画面へ",
        href: "/admin/customer-support"
      },
      townManagement: {
        key: "towns",
        category: "管理者向け",
        icon: <Users className="h-5 w-5" />,
        title: "自治体管理",
        description: "自治体を表示・管理します",
        buttonText: "自治体管理画面へ",
        href: "/admin/towns"
      },
    }

    // adminUserTypeに応じて表示するCard設定を決定
    let selectedConfigs: CardConfig[] = []
    switch (simpleAdminUser.adminUserType) {
      case AdminUserType.ENGINEER:
        selectedConfigs = [
          cardConfigs.superAdminUserManagement,
          cardConfigs.townUserManagement,
          cardConfigs.businessUserManagement,
          cardConfigs.townManagement,
          cardConfigs.businessManagement,
          cardConfigs.productManagement,
          cardConfigs.productCategoryManagement,
          cardConfigs.topBannerManagement,
          cardConfigs.topPickupManagement,
          cardConfigs.campaignBannerManagement,
          cardConfigs.customerSupport,
        ]
        break
      case AdminUserType.SUPER_ADMIN:
        selectedConfigs = [
          cardConfigs.townUserManagement,
          cardConfigs.businessUserManagement,
          cardConfigs.townManagement,
          cardConfigs.businessManagement,
          cardConfigs.productManagement,
          cardConfigs.productCategoryManagement,
          cardConfigs.topBannerManagement,
          cardConfigs.topPickupManagement,
          cardConfigs.campaignBannerManagement,
          cardConfigs.customerSupport,
        ]
        break
      case AdminUserType.TOWN:
      case AdminUserType.TOWN_VIEWER:
          selectedConfigs = [
          cardConfigs.businessUserManagement,
          cardConfigs.productManagement,
          cardConfigs.customerSupport,
        ]
        break
      case AdminUserType.BUSINESS:
      case AdminUserType.BUSINESS_VIEWER:
        selectedConfigs = [
          cardConfigs.productManagement,
          cardConfigs.customerSupport,
        ]
        break
      default:
        // その他のユーザータイプの場合は何も表示しない
        break
    }

    // categoryでグループ化
    const groupedConfigs = selectedConfigs.reduce((groups, config) => {
      const category = config.category
      if (!groups[category]) {
        groups[category] = []
      }
      groups[category].push(config)
      return groups
    }, {} as Record<string, CardConfig[]>)

    // カテゴリ別にCardコンポーネントを生成
    return Object.entries(groupedConfigs).map(([category, configs]) => (
      <div key={category} className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">{category}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {configs.map(config => (
            <Card key={config.key}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {config.icon}
                  {config.title}
                </CardTitle>
                <CardDescription>
                  {config.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={config.href}>
                  <Button className="w-full">{config.buttonText}</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    ))
  }

  const displayCards = getDisplayCards()

  return (
    <div className="space-y-6">
      {displayCards.length > 0 && (
        <div className="space-y-8">
          {displayCards}
        </div>
      )}
    </div>
  )
}

