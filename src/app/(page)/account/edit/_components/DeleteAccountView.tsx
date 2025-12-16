"use client"

import { useRouter } from "next/navigation"

// Components
import RedButton from "@/components/RedButton"

// Providers
import { useDialog } from "@/providers/dialog-provider"
import { useUserSession } from "@/providers/user-session-provider"
import { toast } from "@/components/hooks/use-toast"

// Logic
import * as UserEditPageServerLogic from "@/logic/server/user/user-edit-page-server-logic"

export default function DeleteAccountView() {
  const router = useRouter()
  const { onFetch, setInfoDialogData, setYesNoDialogData } = useDialog()
  const { logout } = useUserSession()

  /**
   * アカウントを削除する
   */
  const onClickDelete = async () => {
    setYesNoDialogData({
      title: "最終確認：アカウントを削除しますか？",
      description: "この操作により、アカウント情報に加え、購入済み商品の情報もすべて削除されます。\n削除は取り消せません。未使用の商品も、削除後は利用できません。続行してよろしいですか？",
      onOk: async () => {
        await onFetch(async () => {
          await UserEditPageServerLogic.deleteUser()
          toast({
            description: "アカウントを削除しました",
          })
          logout()
          router.push(`/`)
        })
      }
    })
  }

  return (
    <div className="max-w-3xl">
      <h2 className="text-xl font-bold text-gray-800 mb-6">
        アカウント削除する
      </h2>

      <div className="text-sm text-gray-500 mb-6">
        この操作を行うと、登録済みのアカウント情報に加えて、購入した商品に関する情報もすべて削除されます。<br />
        一度削除すると元に戻せません。未使用の商品であっても、削除後に利用することはできません。
      </div>
      <div className="flex justify-start">
        <div>
          <RedButton onClick={onClickDelete}>
            アカウントを削除する
          </RedButton>
        </div>
      </div>
    </div>
  )
}
