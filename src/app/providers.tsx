import { headers } from 'next/headers'
import { ClientProviders } from './client-providers'

export function Providers({ children }: { children: React.ReactNode }) {
  const cookies = headers().get('cookie')
  return (
    <ClientProviders cookies={cookies}>
      {children}
    </ClientProviders>
  )
}