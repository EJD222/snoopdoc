import { getCurrentUser } from '@/features/auth/api/get-current-user';
import { redirect } from 'next/navigation';
import { SidebarProvider, Sidebar, SidebarInset, SidebarHeader, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarMenuButton, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarTrigger } from '@snoopdoc/ui';
import Link from 'next/link';
export default async function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    try {
        await getCurrentUser();
        return (
            <SidebarProvider>
                <Sidebar variant="inset">
                    <SidebarHeader>
                        <div>SnoopDoc</div>
                    </SidebarHeader>

                    <SidebarContent>
                        <SidebarGroup>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton
                                            render={
                                                <Link href="/workspaces" />
                                            }
                                        >
                                            <span>Workspace</span>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>

                                    <SidebarMenuItem>
                                        <SidebarMenuButton
                                            render={
                                                <Link href="/dashboard" />
                                            }
                                        >
                                            <span>Dashboard</span>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>

                    </SidebarContent>
                </Sidebar>

                <SidebarInset>
                    <header className='flex h-14 bg-blue-500'>
                        <SidebarTrigger />
                    </header>
                    <main>{children}</main>
                </SidebarInset>
            </SidebarProvider>
        )
    } catch {
        redirect('/');
    }
}