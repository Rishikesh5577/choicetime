import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GoogleLoginButton from '../components/GoogleLoginButton';

// Helper for left-side static icons
const LeftIcon = ({ children }) => (
  <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-gray-400">
    {children}
  </div>
);

const SHOW_OTP_LOGIN = false; // Set to true to show "Login by OTP" again

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // State for Password Visibility
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    const result = await login(formData.email, formData.password);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.message || 'Login failed. Please try again.');
    }

    setIsLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  // --- Handlers for OTP ---
  const handleOTPLogin = () => {
    console.log("OTP Login Triggered");
    navigate('/login-otp'); // Adjust route as needed
  };

  const inputClass =
    "block w-full pl-9 pr-9 sm:pr-3 py-2.5 border border-gray-300 rounded-lg text-sm leading-5 bg-white placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-zinc-800 focus:border-transparent transition duration-150";

  return (
    <div className="fixed inset-0 z-50 flex min-h-screen min-h-[100dvh] bg-[#F7F4EE] font-sans">
      <div className="w-full flex flex-col justify-center items-center p-4 sm:p-6 md:p-8 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-[400px] sm:max-w-md mx-auto">
          {/* Card container: subtle on mobile, clearer on larger screens */}
          <div className="bg-white/60 sm:bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-sm border border-gray-200/60 p-4 sm:p-5 md:p-6">
            <div className="space-y-4 sm:space-y-5">

              <div className="text-center">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                  Sign in
                </h1>
                <p className="mt-1.5 text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link
                    to="/signup"
                    className="font-medium text-zinc-900 hover:text-zinc-700 underline underline-offset-2"
                  >
                    Create a new account
                  </Link>
                </p>
              </div>

              <form className="space-y-3 sm:space-y-4" onSubmit={handleSubmit}>
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-2.5 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <div className="space-y-3">
                  <div className="relative">
                    <label htmlFor="email" className="sr-only">Email address</label>
                    <LeftIcon>
                      <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </LeftIcon>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="Email address"
                    />
                  </div>

                  <div className="relative">
                    <label htmlFor="password" className="sr-only">Password</label>
                    <LeftIcon>
                      <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </LeftIcon>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className={`${inputClass} pr-10`}
                      placeholder="Password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none justify-end"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-1.5 cursor-pointer select-none">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-zinc-900 focus:ring-zinc-800 border-gray-300 rounded cursor-pointer"
                    />
                    <span className="text-xs sm:text-sm text-gray-700">Remember me</span>
                  </label>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-zinc-900 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-900 transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-md active:scale-[0.99]"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Signing in...
                      </span>
                    ) : (
                      'Sign in'
                    )}
                  </button>
                </div>
              </form>

              <div className="relative py-1.5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-2 bg-white/80 sm:bg-white text-gray-500 text-xs">Or continue with</span>
                </div>
              </div>

              <div className="space-y-2">
                <GoogleLoginButton
                  onSuccess={() => navigate('/')}
                  onError={(msg) => setError(msg)}
                  disabled={isLoading}
                />
                {SHOW_OTP_LOGIN && (
                  <button
                    type="button"
                    onClick={handleOTPLogin}
                    className="flex w-full items-center justify-center gap-3 min-h-[48px] sm:min-h-[44px] py-3 rounded-xl sm:rounded-lg border border-gray-300 bg-white text-sm sm:text-base font-medium text-gray-700 hover:bg-gray-50 transition-all focus:outline-none focus:ring-2 focus:ring-gray-200 active:scale-[0.99]"
                  >
                    <svg className="h-5 w-5 text-gray-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <span>Login by OTP</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 sm:mt-5 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors min-h-[44px] sm:min-h-0 items-center justify-center"
            >
              <span aria-hidden>←</span> Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;