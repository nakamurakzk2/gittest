'use client'

import { Clock, UserIcon } from "lucide-react"

// Components
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

// Entity
import { FormMaster } from "@/entity/product/form"

type Props = {
  formMasters: FormMaster[]
  selectedFormId: string
  answerCount: number
  onFormIdChange: (formId: string) => void
  children: React.ReactNode
}

export default function AdminFormTabs({ formMasters, selectedFormId, answerCount, onFormIdChange, children }: Props) {
  if (formMasters.length === 0) {
    return null
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Tabs value={selectedFormId} onValueChange={onFormIdChange} className="w-full">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 h-auto p-1">
            {formMasters.map((master) => (
              <TabsTrigger
                key={master.formId}
                value={master.formId}
                className="px-4 py-3 text-sm font-medium whitespace-nowrap"
              >
                {master.title.ja}
              </TabsTrigger>
            ))}
          </TabsList>

          {formMasters.map((master) => (
            <TabsContent key={master.formId} value={master.formId} className="p-6">
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {master.title.ja}
                  </h2>
                  <p className="text-gray-600">
                    {master.description.ja}
                  </p>
                  <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <UserIcon className="w-4 h-4 mr-1" />
                      回答数: {answerCount}件
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      公開期間: {new Date(master.startTime).toLocaleDateString('ja-JP')} - {new Date(master.endTime).toLocaleDateString('ja-JP')}
                    </span>
                  </div>
                </div>

                {children}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}
