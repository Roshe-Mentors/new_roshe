"use client";
import React, { useState } from 'react';
import Image from 'next/image';

const MentorSignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    linkedin: '',
    dob: '',
    password: '',
  });

  const [error, setError] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
    } else {
      setError('');
      // Handle successful form submission (API call)
      console.log('Form Data Submitted:', formData);
    }
  };

  return (
    <div className="w-full text-black bg-white max-w mx-auto py-20 px-3">
      <div className="flex flex-col md:flex-row justify-between items-start space-y-6 md:space-y-0 gap-8">
        {/* Left Form Section */}
        <form onSubmit={handleSubmit} className="w-full md:w-2/3 space-y-6">
          <h2 className="text-3xl font-bold text-gray-900">Get Started Now</h2>
          <p className="text-gray-600">Enter your credentials to create your account</p>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="mt-2 block w-full px-4 py-3 max-w-sm border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="mt-2 block w-full max-w-sm px-4 py-3 border border-gray-300 rounded-md"
            />
          </div>

          <div className="flex space-x-4">
            <div className="w-full">
              <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700">
                LinkedIn URL
              </label>
              <input
                type="url"
                name="linkedin"
                id="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                placeholder="https://www.linkedin.com/in/yourprofile"
                className="mt-2 block w-full max-w-xs px-4 py-3 border border-gray-300 rounded-md"
              />
            </div>

            <div className="w-full max-w-xs px-1">
              <label htmlFor="dob" className="block text-sm font-medium text-gray-700">
                Date of Birth 
              </label>
              <input
                type="text"
                name="dob"
                id="dob"
                value={formData.dob}
                onChange={handleChange}
                placeholder="DD/MM/YYYY"
                className="mt-2 block w-full px-1 py-3 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="mt-2 block w-full max-w-xs px-4 py-3 border border-gray-300 rounded-md"
            />
          </div>

          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

          <button
            type="submit"
            className="w-full py-3 text-white max-w-xs font-medium rounded-md mt-4"
            style={{
              background: 'linear-gradient(90.15deg, #24242E 0.13%, #747494 99.87%)',
            }}
          >
            Sign Up
          </button>
        </form>

        {/* Right Image Section */}
        <div className="w-full md:w-1/3">
          <Image
            src="/images/image_mentor.jpg" // Adjust to your actual image path
            alt="Sign Up"
            width={600}
            height={375}
            className="rounded-lg shadow-lg w-full"
            priority
          />
        </div>
      </div>
    </div>
  );
};

export default MentorSignUp;
