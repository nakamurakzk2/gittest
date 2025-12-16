import LanguageView from "@/app/(page)/(home)/_components/LanguageView"

export default function PreviewLayout({children}: Readonly<{children: React.ReactNode}>) {
  return (
    <div className="w-full bg-white min-h-screen">
      <LanguageView />
      {children}
    </div>
  );
}