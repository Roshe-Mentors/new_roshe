"use client"
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Mentor } from '../common/types';
import { createSession } from '../../../../services/sessionService';
import { toast } from 'react-toastify';
import { createVideoSDKMeeting } from '../../../../services/videoSDKService';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { saveAs } from 'file-saver';

import { supabase } from '../../../../lib/supabaseClient';
import { deleteAvailability } from '../../../../services/profileService';

// Availability slot from mentor profile
interface AvailabilitySlot {
  id: string;
  start_time: string;
  end_time: string;
  status?: string; // Making the status field explicit
  mentor_id?: string;
}

interface TimeSlot {
  time: string;
  formattedTime: string;
  uniqueKey: string;
  availabilityId: string;
}

interface MenteeBookingsProps {
  mentors: Mentor[];
  selectedMentorId: string | null;
  setSelectedMentorId: React.Dispatch<React.SetStateAction<string | null>>;
  user: Record<string, unknown>;
}

const MenteeBookings: React.FC<MenteeBookingsProps> = ({
  mentors,
  selectedMentorId,
  setSelectedMentorId,
  user
}) => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedDateObj, setSelectedDateObj] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  // Fixed video call sessions, 30-minute duration
  const sessionDuration = 30;
  const [agenda, setAgenda] = useState<string>('');
  const [bookingStep, setBookingStep] = useState<'select-mentor' | 'select-time' | 'session-details' | 'confirmation'>('select-mentor');
  const [isBooking, setIsBooking] = useState(false);
  const [availabilitySlots, setAvailabilitySlots] = useState<AvailabilitySlot[]>([]);
  const [selectedAvailabilityId, setSelectedAvailabilityId] = useState<string>('');
  const [bookingResult, setBookingResult] = useState<any>(null);

  const selectedMentor = selectedMentorId ? mentors.find(m => m.id === selectedMentorId) : null;

  // Reset form when mentor changes
  useEffect(() => {
    setSelectedDate('');
    setSelectedTimeSlot('');
    setAgenda('');
    setBookingStep('select-mentor');
  }, [selectedMentorId]);
  
  // Load mentor availability when selected and subscribe to real-time changes
  useEffect(() => {
    let channel: any;
    if (selectedMentorId) {
      console.log('Loading availability for mentor:', selectedMentorId);
      
      // Fetch availability directly from API
      fetch(`/api/mentors/${selectedMentorId}/availability`)
        .then(response => response.json())
        .then(data => {
          console.log('Fetched availability slots:', data);
          // Make sure we process all valid slots regardless of status format
          const validSlots = Array.isArray(data) ? data.filter(slot => 
            // Account for both 'available' and 'available ' with trim()
            slot && (slot.status?.trim() === 'available')
          ) : [];
          console.log('Valid availability slots after filtering:', validSlots);
          setAvailabilitySlots(validSlots);
          
          if (!validSlots.length) {
            console.log('No availability slots found for this mentor');
          }
        })
        .catch(err => console.error('Error fetching availability:', err));
      
      // Subscribe to real-time changes for this mentor's availability
      channel = supabase
        .channel(`availability_${selectedMentorId}`)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'availability', filter: `mentor_id=eq.${selectedMentorId}` }, payload => {
          const newSlot = (payload as any).record as AvailabilitySlot;
          console.log('Realtime: New availability slot:', newSlot);
          setAvailabilitySlots(prev => [...prev, newSlot]);
        })
        .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'availability', filter: `mentor_id=eq.${selectedMentorId}` }, payload => {
          const oldSlot = (payload as any).record as AvailabilitySlot;
          console.log('Realtime: Deleted availability slot:', oldSlot);
          setAvailabilitySlots(prev => prev.filter(s => s.id !== oldSlot.id));
        })
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'availability', filter: `mentor_id=eq.${selectedMentorId}` }, payload => {
          const updatedSlot = (payload as any).record as AvailabilitySlot;
          console.log('Realtime: Updated availability slot:', updatedSlot);
          setAvailabilitySlots(prev => prev.map(s => s.id === updatedSlot.id ? updatedSlot : s));
        })
        .subscribe();
    } else {
      setAvailabilitySlots([]);
    }
    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [selectedMentorId]);

  // Compute available dates from availability slots, ensuring we only use future slots
  const now = new Date();
  const futureSlots = availabilitySlots.filter(s => {
    const endTime = new Date(s.end_time);
    return endTime > now; // Only include slots that end in the future
  });

  console.log('Future slots available:', futureSlots.length);
  
  const uniqueDates = Array.from(new Set(futureSlots.map(s => s.start_time.split('T')[0])));
  const availableDates = uniqueDates.sort().map(date => {
    const d = new Date(date);
    return {
      date,
      formattedDate: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    };
  });

  // Compute time slots for selected date
  const timeSlots: TimeSlot[] = selectedDate
    ? availabilitySlots
        .filter(s => s.start_time.startsWith(`${selectedDate}T`))
        .flatMap((slot, slotIndex) => {
          const slots: TimeSlot[] = [];
          const start = new Date(slot.start_time);
          const end = new Date(slot.end_time);
          const interval = sessionDuration;
          const cursor = new Date(start);
          let timeIndex = 0;
          
          while (cursor.getTime() + interval * 60000 <= end.getTime()) {
            const hh = cursor.getHours().toString().padStart(2,'0');
            const mm = cursor.getMinutes().toString().padStart(2,'0');
            const time = `${hh}:${mm}`;
            const formattedTime = cursor.toLocaleTimeString(undefined, {hour:'numeric', minute:'2-digit'});
            const uniqueKey = `${slot.id}-${slotIndex}-${timeIndex}-${time}`;
            slots.push({ time, formattedTime, uniqueKey, availabilityId: slot.id });
            cursor.setMinutes(cursor.getMinutes() + interval);
            timeIndex++;
          }
          return slots;
        })
    : [];

  const calculateEndTime = (startTime: string, durationMinutes: number) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const startDate = new Date();
    startDate.setHours(hours, minutes, 0, 0);
    
    const endDate = new Date(startDate);
    endDate.setMinutes(startDate.getMinutes() + durationMinutes);
    
    const endHours = endDate.getHours().toString().padStart(2, '0');
    const endMinutes = endDate.getMinutes().toString().padStart(2, '0');
    
    return `${endHours}:${endMinutes}`;
  };
  
  const formatSessionTitle = (mentorName: string) => {
    return `Video Session with ${mentorName}`;
  };
  
  const formatDateTime = (dateStr: string) => new Date(dateStr).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const generateICS = (session: any) => {
    const dtstart = formatDateTime(session.start_time);
    const dtend = formatDateTime(session.end_time);
    const lines = [
      'BEGIN:VCALENDAR','VERSION:2.0','BEGIN:VEVENT',
      `DTSTART:${dtstart}`,`DTEND:${dtend}`,
      `SUMMARY:${session.title}`,
      `DESCRIPTION:${session.description || ''}`,
      `URL:${session.meeting_link}`,
      'END:VEVENT','END:VCALENDAR'
    ];
    return new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  };
  const generateGoogleLink = (session: any) => {
    const start = formatDateTime(session.start_time);
    const end = formatDateTime(session.end_time);
    const text = encodeURIComponent(session.title);
    const details = encodeURIComponent(session.description || '');
    const location = encodeURIComponent(session.meeting_link || '');
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${start}/${end}&details=${details}&location=${location}`;
  };

  const handleBookSession = async () => {
    if (!selectedMentor || !user.id || !selectedDate || !selectedTimeSlot) return;
    setIsBooking(true);
    try {
      const startDateTime = `${selectedDate}T${selectedTimeSlot}:00`;
      const endTime = calculateEndTime(selectedTimeSlot, sessionDuration);
      const endDateTime = `${selectedDate}T${endTime}:00`;
      let meetingLink = '';
      try {
        const meetResult = await createVideoSDKMeeting({
          title: sessionType,
          description: sessionType,
          startTime: `${selectedDateObj?.toISOString()}`,
          attendees: [user.email as string]
        });
        meetingLink = meetResult.meetingLink;
      } catch {};
      const session = await createSession({
        mentor_id: selectedMentor.id,
        mentee_id: user.id as string,
        title: formatSessionTitle(selectedMentor.name),
        description: agenda,
        status: 'upcoming',
        start_time: startDateTime,
        end_time: endDateTime,
        meeting_link: meetingLink
      });
      setBookingResult(session);

      // Automatically sync to Google Calendar for both mentee and mentor
      try {
        await fetch('/api/calendar/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session, userId: user.id, userRole: 'mentee' })
        });
      } catch (err) {
        console.error('Failed to sync mentee event:', err);
      }
      if (selectedMentor) {
        try {
          await fetch('/api/calendar/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ session, userId: selectedMentor.id, userRole: 'mentor' })
          });
        } catch (err) {
          console.error('Failed to sync mentor event:', err);
        }
      }

      // remove booked availability
      if (selectedAvailabilityId) {
        try {
          await deleteAvailability(selectedAvailabilityId);
        } catch (err) {
          console.error('Failed to remove booked availability:', err);
        }
      }
      setBookingStep('confirmation');
      toast.success('Session booked successfully!');
    } catch (error: any) {
      console.error('Error booking session:', error);
      // Show specific error message if available
      const errMsg = error.message || JSON.stringify(error);
      toast.error(`Booking failed: ${errMsg}`);
    } finally {
      setIsBooking(false);
    }
  };
  
  const renderMentorSelection = () => {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-800">Select a Mentor</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mentors.map(mentor => (
            <div
              key={mentor.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                selectedMentorId === mentor.id
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/30'
              }`}
              onClick={() => setSelectedMentorId(mentor.id)}
            >
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center mr-4 overflow-hidden">
                  {mentor.imageUrl ? (
                    <Image
                      src={mentor.imageUrl} 
                      alt={mentor.name} 
                      className="h-full w-full object-cover"
                      width={48}
                      height={48}
                    />
                  ) : (
                    <span className="text-indigo-600 font-medium text-lg">
                      {mentor.name.charAt(0)}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{mentor.name}</h3>
                  <p className="text-xs text-gray-500">{mentor.role} at {mentor.company}</p>
                </div>
              </div>
              
              <div className="mt-3 flex flex-wrap gap-1">
                {mentor.categories?.slice(0, 2).map((category, idx) => (
                  <span 
                    key={idx} 
                    className="px-2 py-1 bg-gray-100 text-xs rounded-full text-gray-600"
                  >
                    {category}
                  </span>
                ))}
                {(mentor.categories?.length || 0) > 2 && (
                  <span className="px-2 py-1 bg-gray-100 text-xs rounded-full text-gray-600">
                    +{(mentor.categories?.length || 0) - 2} more
                  </span>
                )}
              </div>
            </div>
          ))}

        </div>
        
        <div className="flex justify-end mt-6">
          <button
            onClick={() => selectedMentorId && setBookingStep('select-time')}
            disabled={!selectedMentorId}
            className={`px-6 py-2 rounded-lg transition-colors ${
              selectedMentorId
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            Continue
          </button>
        </div>
      </div>
    );
  };
  
  const renderTimeSelection = () => {
    // Create an array of available dates for the DatePicker
    const availableDateObjects = availableDates.map(({ date }) => new Date(date));
    
    // Function to check if a date should be enabled in the calendar
    const isDateAvailable = (date: Date) => {
      return availableDates.some(({ date: availableDate }) => 
        availableDate === date.toISOString().split('T')[0]
      );
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => setBookingStep('select-mentor')}
              className="mr-4 text-indigo-600 hover:text-indigo-800"
              aria-label="Go back to mentor selection"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="text-xl font-semibold text-gray-800">Select Date & Time</h2>
          </div>
        </div>
        
        {selectedMentor && (
          <div className="flex items-center p-4 bg-indigo-50 rounded-lg">
            <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center mr-4 overflow-hidden">
              {selectedMentor.imageUrl ? (
                <Image 
                  src={selectedMentor.imageUrl} 
                  alt={selectedMentor.name} 
                  className="h-full w-full object-cover"
                  width={48}
                  height={48}
                />
              ) : (
                <span className="text-indigo-600 font-medium text-lg">
                  {selectedMentor.name.charAt(0)}
                </span>
              )}
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900">Session with {selectedMentor.name}</h3>
              <p className="text-xs text-gray-500">{selectedMentor.role} at {selectedMentor.company}</p>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Select Date</h3>
            {availableDateObjects.length > 0 ? (
              <div className="border rounded-lg p-4">
                <DatePicker
                  selected={selectedDateObj}
                  onChange={(date) => {
                    if (date) {
                      setSelectedDateObj(date);
                      setSelectedDate(date.toISOString().split('T')[0]);
                      setSelectedTimeSlot(''); // Reset time slot when date changes
                    }
                  }}
                  filterDate={isDateAvailable}
                  highlightDates={availableDateObjects}
                  minDate={new Date()}
                  inline
                  className="w-full"
                  calendarClassName="bg-white rounded-lg border-none shadow-none"
                  dayClassName={date => 
                    isDateAvailable(date) ? "react-datepicker__day--highlighted" : ""
                  }
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-6 text-center text-gray-500 border rounded-lg bg-gray-50">
                <svg className="w-12 h-12 mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="font-medium">No availability found</p>
                <p className="text-sm mt-1">This mentor hasn't added any available time slots yet.</p>
              </div>
            )}
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Select Time</h3>
            <div className="grid grid-cols-2 gap-2 h-[320px] overflow-y-auto pr-2 border rounded-lg p-4">
              {timeSlots.length > 0 ? (
                timeSlots.map(slot => (
                  <div
                    key={slot.uniqueKey}
                    className={`p-3 border rounded-lg cursor-pointer transition-all flex items-center justify-center ${
                      selectedTimeSlot === slot.time
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-gray-200 hover:border-indigo-300'
                    }`}
                    onClick={() => {
                      setSelectedTimeSlot(slot.time);
                      setSelectedAvailabilityId(slot.availabilityId);
                    }}
                  >
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 mr-2 ${selectedTimeSlot === slot.time ? 'text-indigo-600' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-sm font-medium">{slot.formattedTime}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-4 col-span-2 text-center text-gray-500">
                  {selectedDate ? (
                    <>
                      <svg className="w-10 h-10 mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="font-medium">No available times</p>
                      <p className="text-sm mt-1">Try selecting a different date</p>
                    </>
                  ) : (
                    <p>Select a date to view available time slots</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end mt-6">
          <button
            onClick={() => (selectedDate && selectedTimeSlot) && setBookingStep('session-details')}
            disabled={!selectedDate || !selectedTimeSlot}
            className={`px-6 py-2 rounded-lg transition-colors ${
              selectedDate && selectedTimeSlot
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            Continue
          </button>
        </div>
      </div>
    );
  };
  
  const renderSessionDetails = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <button
            onClick={() => setBookingStep('select-time')}
            className="mr-4 text-indigo-600 hover:text-indigo-800"
            aria-label="Go back to time selection"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-xl font-semibold text-gray-800">Session Details</h2>
        </div>
        
        {selectedMentor && selectedDate && selectedTimeSlot && (
          <div className="p-4 bg-indigo-50 rounded-lg space-y-2">
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center mr-4 overflow-hidden">
                {selectedMentor.imageUrl ? (
                  <Image 
                    src={selectedMentor.imageUrl} 
                    alt={selectedMentor.name} 
                    className="h-full w-full object-cover"
                    width={48}
                    height={48}
                  />
                ) : (
                  <span className="text-indigo-600 font-medium text-lg">
                    {selectedMentor.name.charAt(0)}
                  </span>
                )}
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">Session with {selectedMentor.name}</h3>
                <p className="text-xs text-gray-500">{selectedMentor.role} at {selectedMentor.company}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="font-medium">Date: </span>
                {new Date(selectedDate).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
              <div>
                <span className="font-medium">Time: </span>
                {new Date(`2000-01-01T${selectedTimeSlot}:00`).toLocaleTimeString('en-US', { 
                  hour: 'numeric', 
                  minute: 'numeric',
                  hour12: true
                })}
              </div>
            </div>
          </div>
        )}
        
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Session Agenda</h3>
            <textarea
              className="w-full rounded-lg border border-gray-200 p-3 focus:border-indigo-500 focus:ring-indigo-500"
              rows={4}
              placeholder="Describe what you'd like to discuss in this session..."
              value={agenda}
              onChange={(e) => setAgenda(e.target.value)}
            ></textarea>
          </div>
        </div>
        
        <div className="flex justify-end mt-6">
          <button
            onClick={handleBookSession}
            disabled={isBooking}
            className={`px-6 py-2 bg-indigo-600 text-white rounded-lg ${
              isBooking ? 'opacity-70 cursor-not-allowed' : 'hover:bg-indigo-700'
            } transition-colors`}
          >
            {isBooking ? 'Booking...' : 'Book Session'}
          </button>
        </div>
      </div>
    );
  };
  
  const renderConfirmation = () => (
    <div className="text-center space-y-6 py-10">
      <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
        {/* ...success icon... */}
      </div>
      <h2 className="text-2xl font-semibold text-gray-800">Session Booked!</h2>
      <p className="mt-2 text-gray-600">Your session has been scheduled successfully.</p>
      {bookingResult && (
        <div className="mt-4 flex flex-col space-y-2 items-center">
          <a href={bookingResult.meeting_link} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            Join Session
          </a>
          <a href={generateGoogleLink(bookingResult)} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
            Add to Google Calendar
          </a>
          <button onClick={() => saveAs(generateICS(bookingResult), `session-${bookingResult.id}.ics`)} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Add to Calendar (.ics)
          </button>
        </div>
      )}
      <div className="pt-6">
        <button
          onClick={() => {
            setBookingStep('select-mentor');
            setSelectedDate('');
            setSelectedTimeSlot('');
            setAgenda('');
          }}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
        >
          Book Another Session
        </button>
      </div>
    </div>
  );
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      {bookingStep === 'select-mentor' && renderMentorSelection()}
      {bookingStep === 'select-time' && renderTimeSelection()}
      {bookingStep === 'session-details' && renderSessionDetails()}
      {bookingStep === 'confirmation' && renderConfirmation()}
    </div>
  );
};

export default MenteeBookings;