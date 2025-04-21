"use client";
import React, { useEffect, useState, useCallback } from 'react';
import { useUser } from '../../../../lib/auth';
import { getCalendarOAuth, deleteCalendarOAuth } from '../../../../services/profileService';
import { supabase } from '../../../../lib/supabaseClient';

export default function CalendarPage() {
  const { user, loading } = useUser();
  const [record, setRecord] = useState<any>(null);
  const [busy, setBusy] = useState(false);

  const loadRecord = useCallback(async () => {
    if (user) {
      const rec = await getCalendarOAuth(user.id);
      setRecord(rec);
    }
  }, [user]);

  useEffect(() => {
    if (!loading && user) loadRecord();
  }, [user, loading, loadRecord]);

  const handleConnect = () => {
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard/profile/calendar` }
    });
  };

  const handleDisconnect = async () => {
    if (!record) return;
    setBusy(true);
    try {
      await deleteCalendarOAuth(record.id);
      setRecord(null);
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="mt-4">
      <div className="bg-white p-6 rounded-lg shadow max-w-md mx-auto space-y-6">
        <h2 className="text-xl font-semibold text-gray-800">Calendar Integration</h2>
        {record ? (
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Connected to Google Calendar</span>
            <button
              onClick={handleDisconnect}
              disabled={busy}
              className="px-4 py-2 bg-red-500 text-white font-medium rounded hover:bg-red-600 transition"
            >
              {busy ? 'Disconnecting...' : 'Disconnect'}
            </button>
          </div>
        ) : (
          <button
            onClick={handleConnect}
            className="w-full py-2 bg-green-600 text-white font-medium rounded hover:bg-green-700 transition"
          >
            Connect Google Calendar
          </button>
        )}
      </div>
    </div>
  );
}