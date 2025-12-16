import React from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Info } from 'lucide-react'
import DialogData from '@/entity/dialog/dialog-data'

type Props = {
  dialogData: DialogData | null
  setDialogData: (dialogData: DialogData | null) => void
}

const InfoDialog: React.FC<Props> = ({ dialogData, setDialogData }) => {
  const isOpen = dialogData != null
  const title = dialogData?.title || ''
  const description = dialogData?.description || ''

  const onClose = () => {
    if (dialogData?.onOk != null) {
      dialogData.onOk()
    }
    setDialogData(null)
  }

  const formattedDescription = description.split('\n').map((line, i) => (
    <div key={i} className="w-full whitespace-pre-wrap break-all overflow-hidden">
      {line}
      {i < description.split('\n').length - 1 && <br />}
    </div>
  ))

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className='bg-background max-w-[90vw] sm:max-w-[500px]'>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-500" />
            <span>{title}</span>
          </AlertDialogTitle>
          <AlertDialogDescription>{formattedDescription}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction asChild>
            <Button onClick={onClose}>OK</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default InfoDialog
