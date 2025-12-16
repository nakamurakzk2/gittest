"use client"

import { PaymentView } from "@/app/(page)/product/_components/PaymentView"

export default function DebugPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <PaymentView
        productId="7bf3abf8-4d96-4ef1-acf8-18406f9e469f"
        amount={1}
      />
    </main>
  )
}
