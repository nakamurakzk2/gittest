// Components
import { Badge } from "@/components/ui/badge"

type Props = {
  isOwner: boolean
  className?: string
}


export default function OwnAssetProductStatusBadge({ isOwner, className }: Props) {
  const getStatusText = (isOwner: boolean) => {
    if (isOwner) {
      return "NFT保有者"
    } else {
      return "過去保有者"
    }
  }

  const getStatusColor = (isOwner: boolean) => {
    if (isOwner) {
      return "bg-green-100 text-green-800"
    } else {
      return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Badge className={`${getStatusColor(isOwner)} ${className}`}>
      {getStatusText(isOwner)}
    </Badge>
  )
}