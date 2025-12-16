import React from 'react'
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'
import DialogData from '@/entity/dialog/dialog-data'

// Providers
import { useLanguageSession } from '@/providers/language-provider'

// Define
import { LANGUAGE_LIST } from '@/define/language'

type Props = {
  dialogData: DialogData | null
  setDialogData: (dialogData: DialogData | null) => void
}

const YesNoDialog: React.FC<Props> = ({ dialogData, setDialogData }) => {
  const { getLocalizedText } = useLanguageSession()
  const isOpen = dialogData != null
  const title = dialogData?.title || ''
  const description = dialogData?.description || ''

  const onYes = () => {
    if (dialogData?.onOk != null) {
      dialogData.onOk()
    }
    setDialogData(null)
  }

  const onNo = () => {
    if (dialogData?.onCancel != null) {
      dialogData.onCancel()
    }
    setDialogData(null)
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onNo}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-gray-700" />
            <span>{title}</span>
          </AlertDialogTitle>
          <AlertDialogDescription>{description.split('\n').map((line, i) => (
            <div key={i} className="w-full whitespace-pre-wrap break-all overflow-hidden">
              {line}
              {i < description.split('\n').length - 1 && <br />}
            </div>
          ))}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="secondary" onClick={onNo}>
            {getLocalizedText(LANGUAGE_LIST.No)}
          </Button>
          <Button onClick={onYes}>
            {getLocalizedText(LANGUAGE_LIST.Yes)}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default YesNoDialog