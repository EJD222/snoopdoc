import { LoginForm } from '@/features/auth/components/login-form';

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-10">
      <LoginForm />
    </main>
  );
}
