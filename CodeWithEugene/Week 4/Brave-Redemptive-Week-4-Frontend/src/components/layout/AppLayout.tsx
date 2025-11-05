import type { ReactElement, ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";
import { Sidebar } from "./Sidebar";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps): ReactElement {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-50">
      <SiteHeader />
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-6 lg:flex-row">
        <main className="flex-1 space-y-6">{children}</main>
        <div className="order-first w-full lg:order-last lg:w-72">
          <Sidebar />
        </div>
      </div>
    </div>
  );
}
