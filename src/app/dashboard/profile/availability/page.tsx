"use client";
import React, { useEffect, useState, useCallback } from 'react';
import { useUser } from '../../../../lib/auth';
import {
  getAvailability,
  createAvailability,
  deleteAvailability
} from '../../../../services/profileService';
import { supabase } from '../../../../lib/supabaseClient';

type Slot = {
  id: string;
  start_time: string;
  end_time: string;
};

export default function AvailabilityPage() {
  const { user, loading } = useUser();
  const [slots, setSlots] = useState<Slot[]>([]);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const loadSlots = useCallback(async () => {
    if (user) {
      try {
        const data = await getAvailability(user.id);
        setSlots(data || []);
      } catch (err) {
        console.warn('Error loading availability slots:', err);
      }
    }
  }, [user]);

  useEffect(() => {
    if (!loading && user) loadSlots();
  }, [user, loading, loadSlots]);
  
  // subscribe to real-time availability changes for this mentor
  useEffect(() => {
    let channel: any;
    if (!loading && user) {
      channel = supabase
        .channel(`availability_${user.id}`)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'availability', filter: `mentor_id=eq.${user.id}` }, payload => {
          try {
            const newSlot = (payload as any).record as Slot;
            if (newSlot && newSlot.id) {
              setSlots(prev => [...prev, newSlot]);
            }
          } catch (err) {
            console.warn('Subscription insert error:', err);
          }
        })
        .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'availability', filter: `mentor_id=eq.${user.id}` }, payload => {
          try {
            const oldSlot = (payload as any).record as Slot;
            if (oldSlot && oldSlot.id) {
              setSlots(prev => prev.filter(s => s.id !== oldSlot.id));
            }
          } catch (err) {
            console.warn('Subscription delete error:', err);
          }
        })
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'availability', filter: `mentor_id=eq.${user.id}` }, payload => {
          try {
            const updatedSlot = (payload as any).record as Slot;
            setSlots(prev => prev.map(s => s.id === updatedSlot.id ? updatedSlot : s));
          } catch (err) {
            console.warn('Subscription update error:', err);
          }
        })
        .subscribe();
    }
    return () => { if (channel) supabase.removeChannel(channel); };
  }, [user, loading]);

  const handleAdd = async () => {
    if (!user) return;
    // Validation
    if (!start || !end) {
      setFormError('Start and end time are required');
      return;
    }
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (endDate <= startDate) {
      setFormError('End time must be after start time');
      return;
    }
    setFormError(null);
    setBusy(true);
    try {
      await createAvailability({ mentor_id: user.id, start_time: start, end_time: end, recurrence: null });
      setStart(''); setEnd('');
      await loadSlots();
    } catch (err) {
      console.warn('Error adding availability slot:', err);
      setFormError('Failed to add slot');
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (id: string) => {
    setBusy(true);
    try {
      await deleteAvailability(id);
      await loadSlots();
    } catch (err) {
      console.warn('Error deleting availability slot:', err);
      setFormError('Failed to delete slot');
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="mt-4">
      <div className="bg-white p-6 rounded-lg shadow w-11/12 md:w-4/5 lg:w-3/4 mx-auto space-y-6">
        <h2 className="text-xl font-semibold text-gray-800">Availability Slots</h2>
        {formError && <p className="text-red-500 text-sm">{formError}</p>}
        <ul className="space-y-3">
          {slots.map(slot => (
            <li key={slot.id} className="flex justify-between items-center">
              <span>{new Date(slot.start_time).toLocaleString()} - {new Date(slot.end_time).toLocaleString()}</span>
              <button onClick={() => handleDelete(slot.id)} disabled={busy} className="text-red-500 hover:underline">
                Delete
              </button>
            </li>
          ))}
        </ul>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-800">Add New Slot</h2>
          <div>
            <label htmlFor="start-time" className="block text-sm font-medium text-gray-700">Start Time</label>
            <input
              id="start-time"
              type="datetime-local"
              value={start}
              onChange={e => setStart(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          <div>
            <label htmlFor="end-time" className="block text-sm font-medium text-gray-700">End Time</label>
            <input
              id="end-time"
              type="datetime-local"
              value={end}
              onChange={e => setEnd(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          </div>
          <button
            onClick={handleAdd}
            disabled={busy}
            className="w-full py-2 text-white font-medium rounded transition"
            style={{ background: 'linear-gradient(90deg, #24242E 0%, #747494 100%)' }}
          >
            {busy ? 'Saving...' : 'Add Slot'}
          </button>
        </div>
      </div>
    </div>
  );
}