"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { signUp } from '../../../../lib/auth';
import { supabase } from '../../../../lib/supabaseClient';
import { useRouter } from 'next/navigation';
import emailjs from '@emailjs/browser';

const MentorSignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    linkedin: '',
    dob: '',
    biography: '',
    password: '',
  });

  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  // Initialize EmailJS
  React.useEffect(() => {
    emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '');
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
      return;
    }

    setError('');
    setLoading(true);

    try {
      // Sign up the user
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
          },
        },
      });
      
      if (signUpError) {
        throw new Error(signUpError.message);
      }

      if (!signUpData.user) {
        throw new Error('User registration failed');
      }

      // Insert the mentor data immediately after signup
      const { error: insertError } = await supabase
        .from('mentors')
        .insert([
          { 
            user_id: signUpData.user.id,
            name: formData.name,
            linkedin: formData.linkedin,
            dob: formData.dob,
            biography: formData.biography,
          }
        ]);

      if (insertError) {
        throw new Error(insertError.message);
      }

      // Send email notification using EmailJS
      const emailParams = {
        to_email: formData.email,
        to_name: formData.name,
        message: `
          Name: ${formData.name}
          Email: ${formData.email}
          LinkedIn: ${formData.linkedin}
          Date of Birth: ${formData.dob}
          Biography: ${formData.biography}
        `
      };

      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        emailParams
      );

      // Show success message instead of immediate redirect
      setError('Registration successful! Please check your email to confirm your account.');
      
    } catch (err: any) {
      setError(err?.message || 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full text-black bg-white flex items-center justify-center py-16 px-4 mt-8">
      <div className="max-w-5xl w-full flex flex-col md:flex-row justify-between items-stretch gap-8">
        {/* Left Image Section */}
        <div className="w-full md:w-1/2 flex items-center">
          <Image
            src="/images/mentor_pic.png"
            alt="Mentor Sign Up"
            width={650}
            height={800}
            className="rounded-lg shadow-lg w-full h-auto object-cover"
            priority
          />
        </div>

        {/* Right Form Section */}
        <div className="w-full md:w-1/2 bg-white rounded-lg p-6 flex flex-col">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Get Started Now</h2>
          <p className="text-gray-600 mb-6">Enter your credentials to create your account</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="block w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>

            {/* Email Field */}
            <div>
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
                className="block w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>

            {/* LinkedIn and DOB Fields in a row */}
            <div className="flex flex-col sm:flex-row gap-4">  
              <div className="w-full sm:w-1/2">  
                <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 mb-1">
                  LinkedIn
                </label>
                <input
                  type="url"
                  name="linkedin"
                  id="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/..."
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="w-full sm:w-1/2">  
                <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth 
                </label>
                <input
                  type="text"
                  name="dob"
                  id="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  placeholder="DD/MM/YYYY"
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md"  
                />
              </div>
            </div>

            {/* Biography Field */}
            <div>
              <label htmlFor="biography" className="block text-sm font-medium text-gray-700 mb-1">
                Biography
              </label>
              <textarea
                name="biography"
                id="biography"
                value={formData.biography}
                onChange={handleChange}
                placeholder="Write a brief biography"
                className="block w-full px-4 py-2 border border-gray-300 rounded-md"
                rows={4}
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="block w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full py-3 text-white font-medium rounded-md mt-4"
              style={{
                background: 'linear-gradient(90.15deg, #24242E 0.13%, #747494 99.87%)',
              }}
              disabled={loading}
            >
              {loading ? 'Signing Up...' : 'Join the waiting list'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MentorSignUp;