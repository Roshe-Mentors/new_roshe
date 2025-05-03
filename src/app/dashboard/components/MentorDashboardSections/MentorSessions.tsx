"use client"
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { getMentorSessions, startSession, completeSession, cancelSession } from '../../../../services/sessionService';
import { getMentorReviews } from '../../../../services/reviewService';
import { toast } from 'react-toastify';
import { FaVideo, FaPhoneAlt, FaCalendarCheck, FaClock, FaStar } from 'react-icons/fa';
import { saveAs } from 'file-saver';

const formatICSDate = (dateString: string) => new Date(dateString).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
const generateICSString = (session: any) => {
  const dtStamp = formatICSDate(new Date().toISOString());
  const dtStart = formatICSDate(session.start_time);
  const dtEnd = formatICSDate(session.end_time);
  return [
    'BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Roshe Mentorship//EN','BEGIN:VEVENT',
    `UID:session-${session.id}@roshe`,`DTSTAMP:${dtStamp}`,`DTSTART:${dtStart}`,`DTEND:${dtEnd}`,
    `SUMMARY:${session.title}`,`DESCRIPTION:${session.description || ''}`,`URL:${session.meeting_link || ''}`,
    'END:VEVENT','END:VCALENDAR'
  ].join('\r\n');
};
const generateGoogleLink = (session: any) => {
  const start = formatICSDate(session.start_time);
  const end = formatICSDate(session.end_time);
  const text = encodeURIComponent(session.title);
  const details = encodeURIComponent(session.description || '');
  const location = encodeURIComponent(session.meeting_link || '');
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${start}/${end}&details=${details}&location=${location}`;
};

interface MentorSessionsProps {
  mentorId: string;
}

const MentorSessions: React.FC<MentorSessionsProps> = ({ mentorId }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sessions, setSessions] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'reviews'>('upcoming');
  const [cancelSessionId, setCancelSessionId] = useState<string | null>(null);
  const [cancellationReason, setCancellationReason] = useState<string>('');
  const [isCancelling, setIsCancelling] = useState<boolean>(false);
  
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Load both sessions and reviews
        const sessionsPromise = getMentorSessions(mentorId);
        const reviewsPromise = getMentorReviews(mentorId);
        
        // Use Promise.allSettled instead of Promise.all to handle partial success
        const [sessionsResult, reviewsResult] = await Promise.allSettled([
          sessionsPromise,
          reviewsPromise
        ]);
        
        // Handle sessions result
        if (sessionsResult.status === 'fulfilled') {
          setSessions(sessionsResult.value);
        } else {
          console.error('Failed to load sessions:', sessionsResult.reason);
          toast.error('Failed to load sessions');
        }
        
        // Handle reviews result
        if (reviewsResult.status === 'fulfilled') {
          setReviews(reviewsResult.value);
        } else {
          console.error('Failed to load reviews:', reviewsResult.reason);
          toast.error('Failed to load mentor reviews');
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Error loading mentor data:', errorMessage, error);
        toast.error('Failed to load sessions and reviews');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (mentorId) {
      loadData();
    }
  }, [mentorId]);
  
  const handleCancelSession = async () => {
    if (!cancelSessionId) return;
    
    setIsCancelling(true);
    try {
      await cancelSession(cancelSessionId, cancellationReason);
      toast.success('Session cancelled successfully');
      setCancelSessionId(null);
      setCancellationReason('');
      
      // Reload sessions
      const sessionsData = await getMentorSessions(mentorId);
      setSessions(sessionsData);
    } catch (error) {
      console.error('Error cancelling session:', error);
      toast.error('Failed to cancel session');
    } finally {
      setIsCancelling(false);
    }
  };
  
  const handleStartSession = async (sessionId: string) => {
    try {
      await startSession(sessionId);
      toast.success('Session started successfully');
      
      // Reload sessions
      const sessionsData = await getMentorSessions(mentorId);
      setSessions(sessionsData);
    } catch (error) {
      console.error('Error starting session:', error);
      toast.error('Failed to start session');
    }
  };
  
  const handleCompleteSession = async (sessionId: string) => {
    try {
      await completeSession(sessionId);
      toast.success('Session completed successfully');
      
      // Reload sessions
      const sessionsData = await getMentorSessions(mentorId);
      setSessions(sessionsData);
    } catch (error) {
      console.error('Error completing session:', error);
      toast.error('Failed to complete session');
    }
  };
  
  const handleJoinSession = (session: any) => {
    if (session.meeting_link) {
      window.open(session.meeting_link, '_blank');
    } else {
      toast.info('This session has no meeting link. Please contact support.');
    }
  };
  
  const filterSessions = (status: 'upcoming' | 'past') => {
    if (status === 'upcoming') {
      return sessions.filter(session => 
        ['upcoming', 'active'].includes(session.status) && !session.cancelled_at
      );
    } else {
      return sessions.filter(session => 
        session.status === 'completed' || session.status === 'cancelled' || session.cancelled_at
      );
    }
  };
  
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
    
    const formattedTime = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    
    return `${formattedDate} at ${formattedTime}`;
  };
  
  const calculateDuration = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const durationMinutes = Math.round((endDate.getTime() - startDate.getTime()) / 60000);
    return `${durationMinutes} minutes`;
  };
  
  const renderStatus = (session: any) => {
    const now = new Date();
    const startTime = new Date(session.start_time);
    const endTime = new Date(session.end_time);
    const isActive = now >= startTime && now <= endTime;
    
    if (session.cancelled_at) {
      return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">Cancelled</span>;
    } else if (session.status === 'completed') {
      return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Completed</span>;
    } else if (isActive) {
      return <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded">In Progress</span>;
    } else {
      return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">Upcoming</span>;
    }
  };
  
  const renderSessionActions = (session: any) => {
    const now = new Date();
    const startTime = new Date(session.start_time);
    const endTime = new Date(session.end_time);
    const isUpcoming = now < startTime;
    const isActive = now >= startTime && now <= endTime;
    const isPast = now > endTime;
    const isCompleted = session.status === 'completed';
    
    if (session.cancelled_at) {
      return null;
    }
    
    return (
      <div className="mt-2 space-x-2">
        {isActive && (
          <>
            <button 
              onClick={() => handleJoinSession(session)}
              className="px-4 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 transition-colors"
            >
              Join Session
            </button>
            <button 
              onClick={() => handleCompleteSession(session.id)}
              className="px-4 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
            >
              Complete Session
            </button>
          </>
        )}
        
        {isUpcoming && (
          <>
            {startTime.getTime() - now.getTime() < 10 * 60 * 1000 && (
              <button 
                onClick={() => handleStartSession(session.id)}
                className="px-4 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 transition-colors"
              >
                Start Session
              </button>
            )}
            <button 
              onClick={() => setCancelSessionId(session.id)}
              className="px-4 py-1 bg-red-100 text-red-600 text-sm rounded hover:bg-red-200 transition-colors"
            >
              Cancel
            </button>
          </>
        )}
        
        {isPast && !isCompleted && (
          <button 
            onClick={() => handleCompleteSession(session.id)}
            className="px-4 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
          >
            Mark Complete
          </button>
        )}
      </div>
    );
  };
  
  const renderCancelSessionModal = () => {
    if (!cancelSessionId) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Cancel Session</h3>
          <p className="text-sm text-gray-600 mb-4">
            Are you sure you want to cancel this session? This action cannot be undone.
          </p>
          
          <div className="mb-4">
            <label htmlFor="cancellation-reason" className="block text-sm font-medium text-gray-700 mb-1">
              Reason (optional)
            </label>
            <textarea
              id="cancellation-reason"
              className="w-full rounded-lg border border-gray-200 p-3 focus:border-indigo-500 focus:ring-indigo-500"
              rows={3}
              placeholder="Please provide a reason for cancellation..."
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setCancelSessionId(null);
                setCancellationReason('');
              }}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCancelSession}
              disabled={isCancelling}
              className={`px-4 py-2 bg-red-600 text-white rounded-lg ${
                isCancelling ? 'opacity-70 cursor-not-allowed' : 'hover:bg-red-700'
              } transition-colors`}
            >
              {isCancelling ? 'Cancelling...' : 'Confirm Cancellation'}
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  const renderEmptyState = (tab: 'upcoming' | 'past' | 'reviews') => (
    <div className="text-center py-12">
      <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        {tab === 'reviews' ? (
          <FaStar className="text-gray-400 text-2xl" />
        ) : (
          <FaCalendarCheck className="text-gray-400 text-2xl" />
        )}
      </div>
      <h3 className="text-lg font-medium text-gray-900">
        {tab === 'upcoming'
          ? "No upcoming sessions"
          : tab === 'past'
          ? "No past sessions"
          : "No reviews yet"}
      </h3>
      <p className="text-gray-500 mt-2">
        {tab === 'upcoming'
          ? "You don't have any upcoming sessions with mentees."
          : tab === 'past'
          ? "You don't have any past mentoring sessions."
          : "You haven't received any reviews from mentees yet."}
      </p>
    </div>
  );
  
  const renderReviews = () => {
    return (
      <div className="space-y-6">
        {reviews.length === 0 ? (
          renderEmptyState('reviews')
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="border border-gray-200 rounded-lg p-4 bg-white">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden">
                  {review.mentees?.profile_image_url ? (
                    <Image
                      src={review.mentees.profile_image_url}
                      alt={review.mentees?.name || 'Mentee'}
                      width={48}
                      height={48}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-indigo-600 font-medium text-lg">
                      {(review.mentees?.name?.charAt(0) || 'M').toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="flex-grow">
                  <h3 className="text-sm font-medium text-gray-900">
                    {review.mentees?.name || 'Anonymous Mentee'}
                  </h3>
                  
                  <div className="flex items-center mt-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={i < review.rating ? "text-yellow-500" : "text-gray-300"}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">{review.rating}/5</span>
                  </div>
                  
                  {review.feedback && (
                    <p className="text-sm text-gray-600 mt-2 border-t border-gray-100 pt-2">
                      "{review.feedback}"
                    </p>
                  )}
                  
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(review.created_at).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                    {review.session?.session_title || review.session?.name ? (
                      <> • {review.session?.session_title || review.session?.name}</>
                    ) : null}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      {renderCancelSessionModal()}
      
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            className={`flex-1 py-4 px-6 text-center focus:outline-none ${
              activeTab === 'upcoming'
                ? 'border-b-2 border-indigo-500 text-indigo-700 font-medium'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('upcoming')}
          >
            Upcoming Sessions
          </button>
          <button
            className={`flex-1 py-4 px-6 text-center focus:outline-none ${
              activeTab === 'past'
                ? 'border-b-2 border-indigo-500 text-indigo-700 font-medium'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('past')}
          >
            Past Sessions
          </button>
          <button
            className={`flex-1 py-4 px-6 text-center focus:outline-none ${
              activeTab === 'reviews'
                ? 'border-b-2 border-indigo-500 text-indigo-700 font-medium'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {isLoading ? (
            <div className="py-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
              <p className="mt-3 text-gray-500">Loading data...</p>
            </div>
          ) : (
            activeTab === 'reviews' ? (
              renderReviews()
            ) : (
              <div className="space-y-6">
                {filterSessions(activeTab).length === 0 ? (
                  renderEmptyState(activeTab)
                ) : (
                  filterSessions(activeTab).map((session) => (
                    <div key={session.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden">
                          {session.mentees?.profile_image_url ? (
                            <Image
                              src={session.mentees.profile_image_url}
                              alt={session.mentees?.name || 'Mentee'}
                              width={48}
                              height={48}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-indigo-600 font-medium text-lg">
                              {(session.mentees?.name?.charAt(0) || 'M').toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className="flex-grow">
                          <div className="flex justify-between">
                            <h3 className="text-sm font-medium text-gray-900">
                              {session.title || `Session with ${session.mentees?.name || 'Mentee'}`}
                            </h3>
                            {renderStatus(session)}
                          </div>
                          <p className="text-xs text-gray-500">
                            {session.mentees?.name || 'Mentee'}
                          </p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                            <div className="flex items-center text-xs text-gray-600">
                              <FaClock className="mr-1 text-gray-400" />
                              {formatDateTime(session.start_time)}
                            </div>
                            <div className="flex items-center text-xs text-gray-600">
                              <span className="mr-1">Duration:</span>
                              {calculateDuration(session.start_time, session.end_time)}
                            </div>
                          </div>
                          
                          <div className="flex items-center text-xs text-gray-600 mt-1">
                            {session.meeting_link ? (
                              <>
                                {session.title?.includes('Video') ? (
                                  <FaVideo className="mr-1 text-gray-400" />
                                ) : (
                                  <FaPhoneAlt className="mr-1 text-gray-400" />
                                )}
                                <span>Online meeting available</span>
                              </>
                            ) : (
                              <span>No meeting link</span>
                            )}
                          </div>
                          
                          <div className="mt-2 flex space-x-2">
                            <a
                              href={generateGoogleLink(session)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                            >
                              Add to Google Calendar
                            </a>
                            <button
                              onClick={() => saveAs(new Blob([generateICSString(session)], { type: 'text/calendar;charset=utf-8' }), `session-${session.id}.ics`)}
                              className="px-2 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                            >
                              Add to Calendar (.ics)
                            </button>
                          </div>
                          
                          {session.description && (
                            <p className="text-xs text-gray-600 mt-2 border-t border-gray-100 pt-2">
                              {session.description}
                            </p>
                          )}
                          
                          {renderSessionActions(session)}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default MentorSessions;