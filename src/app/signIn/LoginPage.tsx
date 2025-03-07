"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error || !data.user) {
        setError(error?.message || 'Failed to log in');
      } else {
        if (formData.rememberMe) {
          console.log("User will be remembered");
        }
        router.push('/dashboard');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
      });

      if (error || !data) {
        setError(error?.message || 'Failed to log in with social account');
      } else {
        router.push('/dashboard');
      }
    } catch (_) {
      setError('An error occurred with social login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center bg-white">
      <div className="container mx-auto px-4 py-8 flex">
        <div className="w-full lg:w-1/2 z-10">
          <h1 className="text-2xl font-semibold mb-6">Log in</h1>
          
          <form onSubmit={handleSubmit} className="max-w-md">
            {/* Social Login Buttons */}
            <button
              type="button"
              onClick={() => handleSocialLogin('google')}
              className="w-full py-3 mb-3 rounded-md flex items-center justify-center bg-[#9898FA] text-white font-medium"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="#ffffff">
                <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
              </svg>
              Continue with Google
            </button>
            
            <button
              type="button"
              onClick={() => handleSocialLogin('facebook')}
              className="w-full py-3 mb-6 rounded-md border border-gray-300 text-black flex items-center justify-center font-medium"
            >
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13.397,20.997v-8.196h2.765l0.411-3.209h-3.176V7.548c0-0.926,0.258-1.56,1.587-1.56h1.684V3.127 C15.849,3.039,15.025,2.997,14.201,3c-2.444,0-4.122,1.492-4.122,4.231v2.355H7.332v3.209h2.753v8.202H13.397z"/>
              </svg>
              Continue with Facebook
            </button>
            
            <div className="flex items-center mb-6">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="px-4 text-sm text-gray-500">or</span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>
            
            {/* Email Field */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-400"
              />
            </div>
            
            {/* Password Field */}
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-400"
              />
            </div>
            
            {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
            
            <button
              type="submit"
              className="w-full py-3 text-white font-medium rounded-md hover:opacity-90"
              style={{
                background: 'linear-gradient(90deg, #24242E 0%, #747494 100%)'
              }}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Log in'}
            </button>
            
            <p className="text-center mt-6 text-gray-600 text-sm">
              Don't have an account?
            </p>
          </form>
        </div>
        
        {/* Right Image Section */}
        <div className="hidden lg:block lg:w-1/2">
          <Image
            src="/images/signIn.png" 
            alt="Login"
            width={600}
            height={800}
            className="rounded-lg shadow-lg object-cover h-full w-full"
            priority
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;