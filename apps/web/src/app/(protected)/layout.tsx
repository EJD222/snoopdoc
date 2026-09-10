import { getCurrentUser } from '@/features/auth/api/get-current-user';
import { redirect } from 'next/navigation';

export default async function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    try {
        await getCurrentUser();
        return <>{children}</>;
    } catch {
        redirect('/');
    }
}