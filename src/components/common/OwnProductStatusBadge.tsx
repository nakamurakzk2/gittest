// Entity
import { OwnProductStatus } from "@/entity/product/product"

// Components
import { Badge } from "@/components/ui/badge"

type Props = {
  status: OwnProductStatus
  className?: string
}


export default function OwnProductStatusBadge({ status, className }: Props) {
  const getStatusText = (status: OwnProductStatus) => {
    switch (status) {
      case OwnProductStatus.PENDING_PAYMENT:
        return "入金待ち"
      case OwnProductStatus.PURCHASED:
        return "購入済み"
      case OwnProductStatus.NFT_MINTED:
        return "NFT発行済"
      case OwnProductStatus.NFT_TRANSFERRED:
        return "NFT転送済"
      case OwnProductStatus.CANCELED:
        return "キャンセル済み"
      default:
        return "不明"
    }
  }

  const getStatusColor = (status: OwnProductStatus) => {
    switch (status) {
      case OwnProductStatus.PENDING_PAYMENT:
        return "bg-yellow-100 text-yellow-800"
      case OwnProductStatus.PURCHASED:
        return "bg-blue-100 text-blue-800"
      case OwnProductStatus.NFT_MINTED:
        return "bg-green-100 text-green-800"
      case OwnProductStatus.NFT_TRANSFERRED:
        return "bg-gray-100 text-gray-800"
      case OwnProductStatus.CANCELED:
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Badge className={`${getStatusColor(status)} ${className}`}>
      {getStatusText(status)}
    </Badge>
  )
}