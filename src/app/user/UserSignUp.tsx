"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { signUp } from '../../../lib/auth'; // Sign-up function
import { supabase } from '../../../lib/supabaseClient'; // Supabase client
import { useRouter } from 'next/navigation'; // Use the Next.js router for redirection

const UserSignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    linkedin: '',
    dob: '',
    password: '',
    showPassword: false
  });

  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>(''); // Success message state
  const router = useRouter(); // Initialize Next.js router for redirection

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = () => {
    setFormData((prev) => ({
      ...prev,
      showPassword: !prev.showPassword,
    }));
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    return emailRegex.test(email);
  };

  const validateLinkedIn = (linkedin: string): boolean => {
    const linkedinRegex = /^https:\/\/(www\.)?linkedin\.com\/.*$/;
    return linkedinRegex.test(linkedin);
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.dob || !formData.password) {
      return 'Please fill in all fields.';
    }

    if (!validateEmail(formData.email)) {
      return 'Please enter a valid email address.';
    }

    if (!validateLinkedIn(formData.linkedin)) {
      return 'Please enter a valid LinkedIn URL.';
    }

    if (formData.dob.length !== 10 || !formData.dob.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
      return 'Please enter a valid date of birth in DD/MM/YYYY format.';
    }

    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
    } else {
      setError('');
      setLoading(true); // Set loading to true when form is submitted

      // Call Supabase sign-up function
      const { user, error } = await signUp(formData.email, formData.password);

      if (error || !user) {
        setError(error || 'Failed to create user');
        setLoading(false);
      } else {
        // After successful sign-up, insert additional user profile data into the 'users' table
        const { data, error: insertError } = await supabase
          .from('users')
          .insert([
            {
              user_id: user.id,
              name: formData.name,
              linkedin: formData.linkedin,
              dob: formData.dob,
            }
          ]);

        if (insertError) {
          setError(insertError.message);
        } else {
          console.log('User data inserted:', data);
          setSuccessMessage('Sign-up successful! Please check your email for verification.');
          // Redirect to dashboard or homepage after successful sign-up
          setTimeout(() => {
            router.push('/dashboard'); // Redirect to the user dashboard
          }, 2000); // Wait for 2 seconds before redirecting
        }
      }

      setLoading(false); // Set loading to false once the request is complete
    }
  };

  return (
    <div className="w-full text-black bg-white flex items-center justify-center py-32 px-4">
      <div className="max-w-5xl w-full flex flex-col md:flex-row justify-between items-stretch gap-8">
        {/* Left Form Section */}
        <div className="w-full md:w-1/2 bg-white p-6 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Get Started Now</h2>
          <p className="text-gray-600 mb-6">Enter your credentials to create your account</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-1/2">
                <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 mb-1">
                  LinkedIn URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  name="linkedin"
                  id="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/..."
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="w-full sm:w-1/2">
                <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="dob"
                  id="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  placeholder="DD/MM/YYYY"
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={formData.showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <button 
                  type="button" 
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                >
                  {formData.showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}
            {successMessage && <p className="text-green-600 text-sm">{successMessage}</p>}

            <button
              type="submit"
              className="w-full py-3 text-white font-medium rounded-md mt-4 flex justify-center items-center"
              style={{
                background: 'linear-gradient(90.15deg, #24242E 0.13%, #747494 99.87%)',
              }}
              disabled={loading}
            >
              {loading ? (
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