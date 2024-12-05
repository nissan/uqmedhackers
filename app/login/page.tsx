import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import LoginForm from '@/components/LoginForm';

export default async function LoginPage() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <div className="w-full max-w-md">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-center">Welcome Back</h1>
            <p className="text-muted-foreground text-center mt-2">
              Please sign in to continue
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
} 