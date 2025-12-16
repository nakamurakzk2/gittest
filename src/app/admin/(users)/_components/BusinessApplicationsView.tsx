"use client"

// Entity
import { BusinessApplication } from "@/entity/admin/user-application"
import { Business } from "@/entity/town/business"

// Components
import { Card, CardContent } from "@/components/ui/card"
import BusinessApplicationCard from "./BusinessApplicationCard"

import { useEffect, useState } from "react"

// Logic
import * as AdminApplicationServerLogic from "@/logic/server/admin/admin-application-server-logic"
import * as AdminBusinessServerLogic from "@/logic/server/admin/admin-business-server-logic"

type Props = {
  townId: string
}

export default function BusinessApplicationsView({ townId }: Props) {
  const [ businessApplications, setBusinessApplications ] = useState<BusinessApplication[]>([])
  const [ businesses, setBusinesses ] = useState<Business[]>([])

  const reload = async () => {
    const { businessApplications } = await AdminApplicationServerLogic.fetchBusinessApplications(townId)
    const { businesses } = await AdminBusinessServerLogic.fetchBusinesses(townId)
    setBusinessApplications(businessApplications)
    setBusinesses(businesses)
  }

  useEffect(() => {
    reload()
  }, [townId])


  return (
    <div className="space-y-3">
      <div className="text-base font-bold">
        申請状況
      </div>

      {businessApplications.length === 0 ? (
        <Card>
          <CardContent className="text-center py-6 text-muted-foreground text-sm">
            申請が見つかりません
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {businessApplications.map((application) => (
            <BusinessApplicationCard
              key={application.userId}
              application={application}
              businesses={businesses}
              townId={townId}
              onReload={reload}
            />
          ))}
        </div>
      )}
    </div>
  )
}