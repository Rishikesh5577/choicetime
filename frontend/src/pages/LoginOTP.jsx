// src/pages/Login-otp.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../utils/api'; 

const LeftIcon = ({ children }) => (
  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
    {children}
  </div>
);

const LoginOTP = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [expandForm, setExpandForm] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Clean phone number (remove non-digits)
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    
    if (cleanPhone.length !== 10) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    setIsLoading(true);

    try {
      const response = await authAPI.sendOTP(cleanPhone);
      
      if (response.success) {
        setExpandForm(true);
        setSuccess('OTP sent successfully! Please check your phone.');
        setIsLoading(false);
        // In development, show OTP if provided
        if (response.otp) {
          setSuccess(`OTP sent! (Dev mode - OTP: ${response.otp})`);
        }
      } else {
        setError(response.message || "Failed to send OTP");
        setIsLoading(false);
      }
    } catch (err) {
      setIsLoading(false);
      console.error("Error sending OTP:", err);
      setError(err.message || "Failed to send OTP. Please try again.");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    if (otp.length !== 6) {
      setError("Please enter the 6-digit OTP");
      setIsLoading(false);
      return;
    }

    // If new user checkbox is checked, require name and email
    if (isNewUser && (!name || !email)) {
      setError("Please provide name and email for new user registration");
      setIsLoading(false);
      return;
    }

    try {
      const cleanPhone = phoneNumber.replace(/\D/g, '');
      // Send name and email only if it's a new user
      const response = await authAPI.verifyOTP(
        cleanPhone, 
        otp, 
        isNewUser ? name : null, 
        isNewUser ? email : null
      );
      
      if (response.success) {
        // Store token and user data
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Reload to update auth state
        window.location.href = '/';
      } else {
        // If error says user needs registration, show the form
        if (response.message && (response.message.includes('registration requires') || response.requiresRegistration)) {
          setIsNewUser(true);
          setError("Please fill in your name and email to complete registration");
        } else {
          setError(response.message || "Invalid OTP. Please check and try again.");
        }
        setIsLoading(false);
      }
    } catch (err) {
      setIsLoading(false);
      
      // Check if error has response data
      const errorData = err.response?.data || {};
      const errorMessage = errorData.message || err.message || "Invalid OTP. Please check and try again.";
      const needsRegistration = errorData.requiresRegistration || errorMessage.includes('registration requires');
      
      // If error says user needs registration, show the form
      if (needsRegistration) {
        setIsNewUser(true);
        setError("Please fill in your name and email to complete registration");
      } else {
        setError(errorMessage);
      }
    }
  };


  const inputClass = "block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-zinc-800 focus:border-transparent sm:text-sm transition duration-150 ease-in-out";

  return (
    <div className="fixed inset-0 z-50 flex min-h-screen bg-white font-sans">
      {/* Left Side */}
      <div 
        className="hidden lg:flex flex-col justify-between w-[45%] p-12 text-white relative overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: "url('https://res.cloudinary.com/de1bg8ivx/image/upload/v1765192160/1_08426779-951c-47b7-9feb-ef29ca85b27c_frapuz.webp')" }}
      >
        <div className="absolute inset-0 bg-black/50 z-0"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2.5 mb-8">
            {/* Professional E-commerce Logo */}
            <div className="relative">
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="36" height="36" rx="8" fill="rgba(255,255,255,0.15)"/>
                <path d="M12 18C12 15.5 13.5 14 16 14C18.5 14 20 15.5 20 17C20 18.5 18.5 19.5 17 20C15.5 20.5 14 21.5 14 23C14 25.5 15.5 27 18 27C20.5 27 22 25.5 22 24" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
            </div>
            <div>
              <span className="text-xl font-bold text-white tracking-tight leading-none block">
                StyleTrending
              </span>
            </div>
          </div>
          <h1 className="text-4xl font-light leading-tight mb-4 text-white drop-shadow-md">
            Secure Login.
          </h1>
        </div>
        <div className="relative z-10 text-sm text-gray-300 drop-shadow-sm">
          © 2024 StyleTrending. All rights reserved.
        </div>
      </div>

      {/* Right Side */}
      <div className="w-full lg:w-[55%] flex flex-col justify-center items-center p-8 lg:p-16 overflow-y-auto bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Login via OTP</h2>
            <p className="mt-2 text-sm text-gray-600">
              Go back to{' '}
              <Link to="/login" className="font-medium text-zinc-900 hover:text-zinc-700 underline underline-offset-2">
                Standard Login
              </Link>
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={expandForm ? handleVerifyOtp : handleSendOtp}>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 text-sm text-red-700">
                <p>{error}</p>
              </div>
            )}
            
            {success && (
              <div className="bg-green-50 border-l-4 border-green-500 p-4 text-sm text-green-700">
                <p>{success}</p>
              </div>
            )}

            <div className="space-y-5">
              {!expandForm && (
                <div className="relative">
                  <label htmlFor="phone" className="sr-only">Phone Number</label>
                  <LeftIcon>
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </LeftIcon>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className={inputClass}
                    placeholder="Enter phone number"
                  />
                </div>
              )}

              {expandForm && (
                <>
                  <div className="relative">
                    <label htmlFor="otp" className="sr-only">OTP</label>
                    <LeftIcon>
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </LeftIcon>
                    <input
                      id="otp"
                      name="otp"
                      type="text"
                      maxLength="6"
                      required
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      className={inputClass}
                      placeholder="Enter 6-digit OTP"
                    />
                  </div>

                  {/* New User Registration Fields */}
                  {isNewUser && (
                    <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-800 font-medium mb-2">
                        Complete your registration
                      </p>
                      <div className="relative">
                        <label htmlFor="name" className="sr-only">Full Name</label>
                        <LeftIcon>
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </LeftIcon>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className={inputClass}
                          placeholder="Full Name *"
                        />
                      </div>

                      <div className="relative">
                        <label htmlFor="email" className="sr-only">Email address</label>
                        <LeftIcon>
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </LeftIcon>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className={inputClass}
                          placeholder="Email address *"
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* Show checkbox only if not already a new user */}
                  {!isNewUser && (
                    <div className="flex items-center p-2">
                      <input
                        id="isNewUser"
                        type="checkbox"
                        checked={isNewUser}
                        onChange={(e) => setIsNewUser(e.target.checked)}
                        className="h-4 w-4 text-zinc-900 focus:ring-zinc-800 border-gray-300 rounded cursor-pointer"
                      />
                      <label htmlFor="isNewUser" className="ml-2 block text-sm text-gray-700 cursor-pointer">
                        I'm a new user (need to register)
                      </label>
                    </div>
                  )}
                </>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-zinc-900 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-900 transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
              >
                {isLoading ? (expandForm ? "Verifying..." : "Sending OTP...") : (expandForm ? 'Verify OTP' : 'Send OTP')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginOTP;