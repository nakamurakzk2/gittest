/**
 * [Entity] ダイアログ情報
 */
type DialogData = {
  title: string
  description: string
  onOk?: () => void
  onCancel?: () => void
}
export default DialogData
