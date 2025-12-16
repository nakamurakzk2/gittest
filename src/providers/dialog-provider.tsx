'use client'

// Package
import { createContext, useContext, useState } from 'react'

// Entity
import DialogData from '@/entity/dialog/dialog-data'

// Component
import ErrorDialog from '@/components/dialog/ErrorDialog'
import InfoDialog from '@/components/dialog/InfoDialog'
import LoadingOverlay from '@/components/dialog/LoadingOverlay'
import YesNoDialog from '@/components/dialog/YesNoDoalog'

export type DialogInfo = {
  setErrorDialogData: (errorDialogData: DialogData) => void
  setInfoDialogData: (infoDialogData: DialogData) => void
  setYesNoDialogData: (yesNoDialogData: DialogData) => void
  showLoading: () => void
  hideLoading: () => void
  onFetch: (mainMethod: () => Promise<void>) => Promise<void>
  onFetchBackground: (mainMethod: () => Promise<void>) => Promise<void>
}

export const DialogContext = createContext<DialogInfo>({
  setErrorDialogData: () => {},
  setInfoDialogData: () => {},
  setYesNoDialogData: () => {},
  showLoading: () => {},
  hideLoading: () => {},
  onFetch: async () => {},
  onFetchBackground: async () => {}
})

export const useDialog = () => {
  const context = useContext(DialogContext)
  if (!context) {
    throw new Error('useDialog must be used within a EquipmentProvider')
  }
  return context
}

export function DialogProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [errorDialogData, setErrorDialogData] = useState<DialogData | null>(null)
  const [infoDialogData, setInfoDialogData] = useState<DialogData | null>(null)
  const [yesNoDialogData, setYesNoDialogData] = useState<DialogData | null>(null)

  const showLoading = (): void => {
    setIsLoading(true)
  }
  const hideLoading = (): void => {
    setIsLoading(false)
  }

  const onFetch = async (mainMethod: () => Promise<void>): Promise<void> => {
    setIsLoading(true)
    await onFetchBackground(mainMethod)
    setIsLoading(false)
  }
  const onFetchBackground = async (mainMethod: () => Promise<void>): Promise<void> => {
    try {
      await mainMethod()
    } catch (e) {
      const description = e instanceof Error ? e.message : 'エラーが発生しました。'
      setErrorDialogData({
        title: "エラー",
        description
      })
    }
  }

  return (
    <DialogContext.Provider value={{setErrorDialogData, setInfoDialogData, setYesNoDialogData, showLoading, hideLoading, onFetch, onFetchBackground}}>
      {children}
      <ErrorDialog
        dialogData={errorDialogData}
        setDialogData={setErrorDialogData}
      />
      <InfoDialog
        dialogData={infoDialogData}
        setDialogData={setInfoDialogData}
      />
      <YesNoDialog
        dialogData={yesNoDialogData}
        setDialogData={setYesNoDialogData}
      />
      <LoadingOverlay
        isLoading={isLoading}
      />
    </DialogContext.Provider>
  )
}