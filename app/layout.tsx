import './globals.css';
import { Inter } from 'next/font/google';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Link from 'next/link';
import SignOutButton from '@/components/SignOutButton';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'UQ Med Hackers',
  description: 'UQ Med Hackers Project',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  let isDoctor = false;
  if (session) {
    const { data: doctor } = await supabase
      .from('doctors')
      .select('*')
      .eq('user_id', session.user.id)
      .single();
    isDoctor = !!doctor;
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <Link href="/" className="text-xl font-bold text-gray-800">
                    UQ Med Hackers
                  </Link>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  {session ? (
                    <>
                      <Link
                        href="/dashboard"
                        className="inline-flex items-center px-1 pt-1 text-gray-900"
                      >
                        Dashboard
                      </Link>
                      {isDoctor && (
                        <Link
                          href="/doctor"
                          className="inline-flex items-center px-1 pt-1 text-gray-900"
                        >
                          Doctor Dashboard
                        </Link>
                      )}
                    </>
                  ) : (
                    <Link
                      href="/login"
                      className="inline-flex items-center px-1 pt-1 text-gray-900"
                    >
                      Login
                    </Link>
                  )}
                </div>
              </div>
              <div className="flex items-center">
                {session && <SignOutButton />}
              </div>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
