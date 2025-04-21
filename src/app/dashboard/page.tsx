"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MentorDashboard from './components/MentorDashboard';
import { useUser } from '../../lib/auth';

export default function DashboardPage() {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/signIn');
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <main className="min-h-screen">
      <MentorDashboard />
    </main>
  );
}