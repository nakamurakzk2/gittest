'use client'

import Link from "next/link"
import { AlertTriangle, Home } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ErrorPageProps {
  title?: string
  message?: string
  showHomeButton?: boolean
}

export default function ErrorPage({
  title = "ページが見つかりません",
  message = "お探しのページは存在しないか、移動または削除された可能性があります。",
  showHomeButton = true
}: ErrorPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AlertTriangle className="h-16 w-16 text-amber-500" />
          </div>
          <CardTitle className="text-xl font-bold text-foreground">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p className="text-muted-foreground leading-relaxed">
            {message}
          </p>

          {showHomeButton && (
            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link href="/" className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  トップページに戻る
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}