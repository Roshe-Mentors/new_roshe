"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MentorDashboard from './components/MentorDashboard';
import { useUser } from '../../lib/auth';
import { supabase } from '../../lib/supabaseClient';

export default function DashboardPage() {
  // Set Supabase session from URL hash if present
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const access_token = params.get('access_token');
      const refresh_token = params.get('refresh_token');
      if (access_token && refresh_token) {
        supabase.auth.setSession({ access_token, refresh_token }).then(() => {
          window.location.hash = '';
          window.location.reload();
        });
      }
    }
  }, []);

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