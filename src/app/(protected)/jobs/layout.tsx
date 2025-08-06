'use client';
import { AppSidebar } from "@/components/sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isJobDetailsPage = pathname.includes('/jobs/') && pathname !== '/jobs';
  
  if (isJobDetailsPage) {
    return <main>{children}</main>;
  }

  return (
    <SidebarProvider>
      <AppSidebar/>
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}