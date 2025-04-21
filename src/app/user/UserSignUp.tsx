"use client";
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; // Next.js router

const UserSignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string>('');
  const router = useRouter();

  // Zod schema for sign-up form
  const signupSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    linkedin: z.string().url('Invalid URL').refine(val => val.includes('linkedin.com'), 'Must be a LinkedIn URL'),
    dob: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Date must be DD/MM/YYYY'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  });
  type SignupForm = z.infer<typeof signupSchema>;

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  });

  // submit handler calls our API
  const onSubmit = async (data: SignupForm) => {
    setServerError('');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) {
        setServerError(result.error || 'Registration failed');
      } else {
        router.push('/signIn');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setServerError('An unexpected error occurred.');
    }
  };

  return (
    <div className="w-full text-black bg-white flex items-center justify-center py-32 px-4">
      <div className="max-w-5xl w-full flex flex-col md:flex-row justify-between items-stretch gap-8">
        {/* Left Form Section */}
        <div className="w-full md:w-1/2 bg-white p-6 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Get Started Now</h2>
          <p className="text-gray-600 mb-6">Enter your credentials to create your account</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register('name')}
                placeholder="Full Name"
                className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                {...register('email')}
                placeholder="you@example.com"
                className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-1/2">
                <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 mb-1">
                  LinkedIn URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  {...register('linkedin')}
                  placeholder="https://linkedin.com/in/..."
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.linkedin && <p className="text-red-600 text-sm mt-1">{errors.linkedin.message}</p>}
              </div>

              <div className="w-full sm:w-1/2">
                <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('dob')}
                  placeholder="DD/MM/YYYY"
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.dob && <p className="text-red-600 text-sm mt-1">{errors.dob.message}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register('password')}
                  placeholder="Password"
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>}
            </div>

            {serverError && <p className="text-red-600 text-sm">{serverError}</p>}

            <button
              type="submit"
              className="w-full py-3 text-white font-medium rounded-md mt-4 flex justify-center items-center"
              style={{
                background: 'linear-gradient(90.15deg, #24242E 0.13%, #747494 99.87%)',
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing Up...
                </>
              ) : 'Sign Up'}
            </button>
            
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <a href="/signIn" className="text-blue-600 hover:text-blue-800">
                  Log in
                </a>
              </p>
            </div>
          </form>
        </div>

        {/* Right Image Section */}
        <div className="w-full md:w-1/2 flex items-center justify-center">
          <Image
            src="/images/image_mentor.jpg"
            alt="Sign Up"
            width={600}
            height={800}
            className="rounded-lg shadow-lg w-full h-full object-cover"
            priority
          />
        </div>
      </div>
    </div>
  );
};

export default UserSignUp;