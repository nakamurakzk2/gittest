import HeaderView from "@/app/(page)/(home)/_components/HeaderView"
import FooterView from "@/app/(page)/(home)/_components/FooterView"
import LanguageView from "@/app/(page)/(home)/_components/LanguageView"
import { UserSessionProvider } from "@/providers/user-session-provider"
import A8ParamTracker from "@/app/(page)/_components/A8ParamTracker"

export default function HomeLayout({children}: Readonly<{children: React.ReactNode}>) {
  return (
    <UserSessionProvider>
      <A8ParamTracker />
      <div className="w-full bg-white min-h-screen flex flex-col">
        <HeaderView />
        <LanguageView />
        <main className="flex-1">
          {children}
        </main>
        <FooterView />
      </div>
    </UserSessionProvider>
  );
}