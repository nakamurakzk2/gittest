import React from 'react'
import { Loader2 } from 'lucide-react'

type Props = {
  isLoading: boolean
}

const LoadingOverlay: React.FC<Props> = ({ isLoading }) => {
  if (!isLoading) return null

  return (
    <div className='fixed inset-0 z-[9999] flex items-center justify-center bg-background/80'>
      <div className='rounded-lg bg-card p-6 shadow-xl justify-center items-center flex flex-col'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
      </div>
    </div>
  )
}

export default LoadingOverlay