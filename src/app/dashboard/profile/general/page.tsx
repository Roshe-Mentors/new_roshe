"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useUser } from '../../../../lib/auth';
import { getMentorProfileByUser, updateMentorProfile } from '../../../../services/profileService';
import { getUserRole } from '../../../../lib/user';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

type FormData = {
  name: string;
  bio: string;
  profile_image_url: string;
  location: string;
  company: string;
  linkedin_url: string;
  // Mentee-specific fields
  specialization: string; // Used as role/focus area
  years_experience: number;
};

export default function GeneralPage() {
  const { user, loading: userLoading } = useUser();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { register, handleSubmit, reset, watch, formState: { isSubmitting, errors } } = useForm<FormData>({
    criteriaMode: 'all'
  });

  // Get the user's role when component mounts
  useEffect(() => {
    if (!userLoading && user?.id) {
      getUserRole(user.id).then(role => {
        setUserRole(role);
      });
    }
  }, [user, userLoading]);

  // Load the profile data
  useEffect(() => {
    if (!userLoading && user) {
      (async () => {
        try {
          const profile = await getMentorProfileByUser(user.id);
          if (profile) {
            reset({
              name: profile.name || '',
              bio: profile.bio || '',
              profile_image_url: profile.profile_image_url || '',
              location: profile.location || '',
              company: profile.company || '',
              linkedin_url: profile.linkedin_url || '',
              specialization: profile.specialization || '',
              years_experience: profile.years_experience || 0
            });
          } else {
            reset({ 
              name: '', 
              bio: '', 
              profile_image_url: '', 
              location: '', 
              company: '', 
              linkedin_url: '',
              specialization: '',
              years_experience: 0
            });
          }
        } catch (err) {
          console.error('Failed to load profile:', err);
        }
      })();
    }
  }, [user, userLoading, reset]);

  const onSubmit = async (data: FormData) => {
    if (user) {
      setIsSaving(true);
      try {
        await updateMentorProfile(user.id, data);
        toast.success('Profile updated successfully!');
      } catch (error) {
        console.error('Error updating profile:', error);
        toast.error('Failed to update profile. Please try again.');
      } finally {
        setIsSaving(false);
      }
    }
  };

  if (userLoading || !user) return <div>Loading...</div>;

  return (
    <div className="mt-4">
      <div className="bg-white p-6 rounded-lg shadow w-full">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          {userRole === 'mentor' ? 'Mentor Profile' : 'Mentee Profile'}
        </h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              {...register('name', { required: 'Name is required' })}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          {/* Bio Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Bio</label>
            <textarea
              {...register('bio')}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="Tell us about yourself..."
            />
          </div>

          {/* Two fields in one row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Location Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                {...register('location')}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="City, Country"
              />
            </div>
            
            {/* Company Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Company/School</label>
              <input
                {...register('company')}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Where you work or study"
              />
            </div>
          </div>

          {/* Two fields in one row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Specialization Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Focus Area</label>
              <input
                {...register('specialization')}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your specialization or area of interest"
              />
            </div>

            {/* Experience Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Years of Experience</label>
              <input
                type="number"
                {...register('years_experience', { 
                  valueAsNumber: true,
                  min: { value: 0, message: 'Experience cannot be negative' }
                })}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
              {errors.years_experience && (
                <p className="text-red-500 text-sm mt-1">{errors.years_experience.message}</p>
              )}
            </div>
          </div>

          {/* LinkedIn URL Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">LinkedIn URL</label>
            <input
              {...register('linkedin_url', { 
                pattern: { 
                  value: /^(https?:\/\/)?(www\.)?linkedin\.com\/.+$/i, 
                  message: 'Please enter a valid LinkedIn URL' 
                } 
              })}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://linkedin.com/in/username"
            />
            {errors.linkedin_url && (
              <p className="text-red-500 text-sm mt-1">{errors.linkedin_url.message}</p>
            )}
          </div>

          {/* Profile Image URL Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Profile Image URL</label>
            <input
              {...register('profile_image_url', { 
                pattern: { 
                  value: /^(https?:\/\/).+$/, 
                  message: 'Enter a valid URL starting with http:// or https://' 
                } 
              })}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/your-image.jpg"
            />
            {errors.profile_image_url && (
              <p className="text-red-500 text-sm mt-1">{errors.profile_image_url.message}</p>
            )}
            {watch('profile_image_url') && (
              <div className="mt-2">
                <p className="text-sm text-gray-600 mb-1">Preview:</p>
                <div className="relative w-20 h-20 rounded-full border border-gray-300 overflow-hidden">
                  <Image 
                    src={watch('profile_image_url')} 
                    alt="Profile preview" 
                    fill
                    className="object-cover"
                    onError={(e) => {
                      // TypeScript doesn't like direct src setting on Image component
                      // Instead we'll use a fallback URL pattern
                      const imgElement = e.target as HTMLImageElement;
                      if (imgElement.src !== "/images/mentor_pic.png") {
                        imgElement.src = "/images/mentor_pic.png";
                      }
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || isSaving}
            className="w-full py-2 text-white font-medium rounded transition"
            style={{ background: 'linear-gradient(90deg, #24242E 0%, #747494 100%)' }}
          >
            {(isSubmitting || isSaving) ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}