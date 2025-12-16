import Image from 'next/image'

// Components
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"

type Props = {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  title: string
  imageUrl: string
  onClickReceive: () => void
}

export default function NftAccountReceiveDialog({
  isOpen,
  onOpenChange,
  title,
  imageUrl,
  onClickReceive
}: Props) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>確認</DialogTitle>
          <DialogDescription>
            「{title}」を受け取ります。よろしいですか？
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center">
          <Image
            src={imageUrl}
            alt={title}
            width={200}
            height={200}
            className="rounded-lg"
          />
        </div>
        <DialogFooter className="flex gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            キャンセル
          </Button>
          <Button onClick={onClickReceive}>
            受け取る
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}