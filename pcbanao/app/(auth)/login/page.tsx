import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth/authOptions';
import LoginClient from './LoginClient';

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  if (session) redirect('/builds');
  return <LoginClient />;
}
