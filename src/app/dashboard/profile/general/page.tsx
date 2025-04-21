"use client";
import React, { useEffect } from 'react';
import { useUser } from '../../../../lib/auth';
import { getMentorProfileByUser, updateMentorProfile } from '../../../../services/profileService';
import { useForm } from 'react-hook-form';

type FormData = {
  name: string;
  bio: string;
  profile_image_url: string;
};

export default function GeneralPage() {
  const { user, loading: userLoading } = useUser();
  const { register, handleSubmit, reset, formState: { isSubmitting, errors } } = useForm<FormData>({
    criteriaMode: 'all'
  });

  useEffect(() => {
    if (!userLoading && user) {
      (async () => {
        try {
          const profile = await getMentorProfileByUser(user.id);
          if (profile) {
            reset({
              name: profile.name || '',
              bio: profile.bio || '',
              profile_image_url: profile.profile_image_url || ''
            });
          } else {
            reset({ name: '', bio: '', profile_image_url: '' });
          }
        } catch (err) {
          console.error('Failed to load mentor profile:', err);
        }
      })();
    }
  }, [user, userLoading, reset]);

  const onSubmit = async (data: FormData) => {
    if (user) {
      await updateMentorProfile(user.id, data);
      // Optionally show success message
    }
  };

  if (userLoading || !user) return <div>Loading...</div>;

  return (
    <div className="mt-4">
      <div className="bg-white p-6 rounded-lg shadow w-11/12 md:w-4/5 lg:w-3/4 mx-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              {...register('name', { required: 'Name is required' })}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Bio</label>
            <textarea
              {...register('bio')}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Profile Image URL</label>
            <input
              {...register('profile_image_url', { pattern: { value: /^(https?:\/\/).+$/, message: 'Enter a valid URL' } })}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.profile_image_url && <p className="text-red-500 text-sm mt-1">{errors.profile_image_url.message}</p>}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 text-white font-medium rounded transition"
            style={{ background: 'linear-gradient(90deg, #24242E 0%, #747494 100%)' }}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}