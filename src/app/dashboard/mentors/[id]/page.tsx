import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchMentorById } from '../../../lib/mentors';

interface Slot {
  slot_id: string;
  start_time: string;
  end_time: string;
}

const MentorProfilePage = ({ params }: { params: { id: string } }) => {
  const mentorId = params.id;
  const router = useRouter();
  const [mentor, setMentor] = useState<any>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const mentorData = await fetchMentorById(mentorId);
        setMentor(mentorData);
        const res = await fetch(`/api/mentors/${mentorId}/availability`);
        const data = await res.json();
        setSlots(data.slots || []);
      } catch (err) {
        setError('Failed to load mentor or availability.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [mentorId]);

  const handleBook = async (slotId: string) => {
    setBooking(slotId);
    setError(null);
    try {
      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mentor_id: mentorId, slot_id: slotId }),
      });
      if (!res.ok) throw new Error('Booking failed');
      // On success, redirect to My Sessions
      router.push('/dashboard/bookings');
    } catch (err) {
      setError('Booking failed. Please try again.');
    } finally {
      setBooking(null);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!mentor) return <div>Mentor not found.</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">{mentor.name}</h1>
      <p className="mb-4 text-gray-600">{mentor.role} at {mentor.company}</p>
      {/* Add more mentor details as needed */}
      <h2 className="text-xl font-semibold mb-2">Available Slots</h2>
      {slots.length === 0 ? (
        <p>No available slots.</p>
      ) : (
        <ul className="space-y-3">
          {slots.map(slot => (
            <li key={slot.slot_id} className="flex items-center justify-between border p-3 rounded">
              <span>{new Date(slot.start_time).toLocaleString()} - {new Date(slot.end_time).toLocaleTimeString()}</span>
              <button
                className="bg-indigo-600 text-white px-4 py-2 rounded disabled:opacity-50"
                disabled={!!booking}
                onClick={() => handleBook(slot.slot_id)}
              >
                {booking === slot.slot_id ? 'Booking...' : 'Book'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MentorProfilePage;