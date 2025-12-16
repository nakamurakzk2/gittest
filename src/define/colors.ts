/**
 * アプリケーション全体で使用するカラー定数
 */
export const COLORS = {
  // 背景色
  BACKGROUND: {
    PRIMARY: '#FFFFFF',
  },
} as const

// Tailwind CSSクラスとして使用するためのヘルパー関数
export const getBackgroundClass = (color: keyof typeof COLORS.BACKGROUND) => {
  return `bg-[${COLORS.BACKGROUND[color]}]`
}
