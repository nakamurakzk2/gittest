"use client"

import { useA8Param } from "@/hooks/use-a8-param"

/**
 * A8パラメータを自動的に取得・保存するコンポーネント
 * レイアウトに配置することで、すべてのページでA8パラメータを監視します
 */
export default function A8ParamTracker() {
  useA8Param()
  return null
}

