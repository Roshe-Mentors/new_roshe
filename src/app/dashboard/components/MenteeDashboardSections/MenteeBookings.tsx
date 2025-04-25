"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import { Mentor } from '../common/types';

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  user
}) => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [sessionType, setSessionType] = useState<'video' | 'audio'>('video');
  const [sessionDuration, setSessionDuration] = useState<30 | 45 | 60>(30);
  const [agenda, setAgenda] = useState<string>('');
  const [bookingStep, setBookingStep] = useState<'select-mentor' | 'select-time' | 'session-details' | 'confirmation'>('select-mentor');
  
  const selectedMentor = selectedMentorId ? mentors.find(m => m.id === selectedMentorId) : null;
  
  const generateAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        dates.push({
          date: date.toISOString().split('T')[0],
          formattedDate: date.toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
          })
        });
      }
    }
    
    return dates;
  };
  
  const generateTimeSlots = () => {
    const slots = [];
    const startHour = 9;
    const endHour = 17;
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minutes = 0; minutes < 60; minutes += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        const formattedTime = new Date(`2000-01-01T${timeString}:00`).toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: 'numeric',
          hour12: true
        });
        slots.push({ time: timeString, formattedTime });
      }
    }
    
    return slots;
  };
  
  const availableDates = generateAvailableDates();
  const timeSlots = generateTimeSlots();
  
  const handleBookSession = () => {
    setBookingStep('confirmation');
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
    return (
      <div className="space-y-6">
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
            <div className="space-y-2 h-60 overflow-y-auto pr-2 border rounded-lg p-2">
              {availableDates.map(date => (
                <div
                  key={date.date}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    selectedDate === date.date
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-indigo-300'
                  }`}
                  onClick={() => setSelectedDate(date.date)}
                >
                  <p className="text-sm font-medium">{date.formattedDate}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Select Time</h3>
            <div className="grid grid-cols-2 gap-2 h-60 overflow-y-auto pr-2 border rounded-lg p-2">
              {timeSlots.map(slot => (
                <div
                  key={slot.time}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    selectedTimeSlot === slot.time
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-indigo-300'
                  }`}
                  onClick={() => setSelectedTimeSlot(slot.time)}
                >
                  <p className="text-sm font-medium text-center">{slot.formattedTime}</p>
                </div>
              ))}
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
            <h3 className="text-sm font-medium text-gray-700 mb-2">Session Type</h3>
            <div className="flex gap-2">
              <button
                className={`flex-1 py-3 rounded-lg border ${
                  sessionType === 'video'
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 text-gray-700 hover:border-indigo-300'
                }`}
                onClick={() => setSessionType('video')}
              >
                <div className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Video Call
                </div>
              </button>
              <button
                className={`flex-1 py-3 rounded-lg border ${
                  sessionType === 'audio'
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 text-gray-700 hover:border-indigo-300'
                }`}
                onClick={() => setSessionType('audio')}
              >
                <div className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                  Audio Call
                </div>
              </button>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Session Duration</h3>
            <div className="flex gap-2">
              <button
                className={`flex-1 py-2 rounded-lg border ${
                  sessionDuration === 30
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 text-gray-700 hover:border-indigo-300'
                }`}
                onClick={() => setSessionDuration(30)}
              >
                30 minutes
              </button>
              <button
                className={`flex-1 py-2 rounded-lg border ${
                  sessionDuration === 45
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 text-gray-700 hover:border-indigo-300'
                }`}
                onClick={() => setSessionDuration(45)}
              >
                45 minutes
              </button>
              <button
                className={`flex-1 py-2 rounded-lg border ${
                  sessionDuration === 60
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 text-gray-700 hover:border-indigo-300'
                }`}
                onClick={() => setSessionDuration(60)}
              >
                60 minutes
              </button>
            </div>
          </div>
          
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
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Book Session
          </button>
        </div>
      </div>
    );
  };
  
  const renderConfirmation = () => {
    return (
      <div className="text-center space-y-6 py-10">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Session Booked!</h2>
          <p className="mt-2 text-gray-600">
            Your session has been scheduled successfully.
          </p>
        </div>
        
        {selectedMentor && selectedDate && selectedTimeSlot && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 max-w-md mx-auto">
            <div className="flex items-center mb-4">
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
              <div className="text-left">
                <h3 className="text-sm font-medium text-gray-900">Session with {selectedMentor.name}</h3>
                <p className="text-xs text-gray-500">{selectedMentor.role} at {selectedMentor.company}</p>
              </div>
            </div>
            
            <div className="space-y-2 text-left text-sm text-gray-600">
              <div className="flex">
                <div className="w-20 font-medium">Date:</div>
                <div>
                  {new Date(selectedDate).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
              </div>
              <div className="flex">
                <div className="w-20 font-medium">Time:</div>
                <div>
                  {new Date(`2000-01-01T${selectedTimeSlot}:00`).toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    minute: 'numeric',
                    hour12: true
                  })}
                </div>
              </div>
              <div className="flex">
                <div className="w-20 font-medium">Duration:</div>
                <div>{sessionDuration} minutes</div>
              </div>
              <div className="flex">
                <div className="w-20 font-medium">Type:</div>
                <div className="capitalize">{sessionType} call</div>
              </div>
            </div>
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
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Book Another Session
          </button>
        </div>
      </div>
    );
  };
  
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