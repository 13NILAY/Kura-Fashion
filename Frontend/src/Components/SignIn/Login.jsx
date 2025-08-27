import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Login = () => {
  const { setAuthInfo, persist, setPersist } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState('');
  const [pwd, setPwd] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg('');
  }, [user, pwd]);

  useEffect(() => {
    // Set persist to true by default
    if (persist === undefined) {
      setPersist(true);
      localStorage.setItem('persist', 'true');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axiosPrivate.post(
        '/login',
        JSON.stringify({ identity: user, password: pwd }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );

      // Automatically enable persist login after successful login
      setPersist(true);
      localStorage.setItem('persist', 'true');

      const email = response?.data?.email;
      const accessToken = response?.data?.accessToken;
      const roles = response?.data?.roles;

      setAuthInfo({ accessToken }, email, roles);
      setUser('');
      setPwd('');
      setLoading(false);
      navigate(from, { replace: true });
    } catch (err) {
      setLoading(false);
      if (!err?.response) {
        setErrMsg('No Server Response. Please check your connection.');
      } else if (err.response?.status === 400) {
        setErrMsg('Missing Username or Password');
      } else if (err.response?.status === 401) {
        setErrMsg('Invalid credentials. Please try again.');
      } else {
        setErrMsg('Login Failed. Please try again later.');
      }
      errRef.current.focus();
    }
  };

  const togglePersist = () => {
    setPersist((prev) => !prev);
  };

  useEffect(() => {
    localStorage.setItem('persist', persist);
  }, [persist]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex-grow w-full pt-28 pb-16 bg-gradient-to-br from-[#F8F5F2] via-[#EADBC8] to-[#D4A373]/20 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-20 left-10 w-40 h-40 bg-[#D4A373]/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-[#3A2E2E]/5 rounded-full blur-3xl animate-pulse" 
        style={{animationDelay: '2s'}}></div>
      
      <div className="w-full flex items-center justify-center px-4 relative">
        <div className="w-full max-w-lg bg-white/70 backdrop-blur-md rounded-3xl shadow-2xl 
          border border-white/30 p-8 sm:p-10 relative overflow-hidden">
          
          {/* Premium gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent pointer-events-none"></div>
          
          {/* Header Section */}
          <div className="relative text-center mb-10">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-0.5 bg-[#D4A373]"></div>
              <span className="mx-4 text-[#3A2E2E]/60 text-sm font-medium tracking-widest uppercase">
                Welcome Back
              </span>
              <div className="w-12 h-0.5 bg-[#D4A373]"></div>
            </div>
            <h2 className="font-headings text-[#3A2E2E] text-4xl font-light mb-3">
              Sign
              <span className="block text-[#D4A373] font-normal">In</span>
            </h2>
            <p className="text-[#3A2E2E]/70 font-texts">
              Continue your premium fashion journey
            </p>
          </div>
          
          {/* Error Message */}
          {errMsg && (
            <div 
              ref={errRef} 
              className="bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-200 
                text-red-800 px-6 py-4 rounded-2xl mb-6 shadow-lg relative" 
              aria-live="assertive"
            >
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="text-white text-sm" />
                </div>
                <div>
                  <p className="font-semibold">Authentication Error</p>
                  <p className="text-sm opacity-80">{errMsg}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 relative">
            {/* Username/Email Input */}
            <div className="group">
              <label className="block text-[#3A2E2E] text-sm font-semibold mb-3" htmlFor="username">
                Username / Email
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="username"
                  ref={userRef}
                  autoComplete="off"
                  onChange={(e) => setUser(e.target.value)}
                  value={user}
                  required
                  className="w-full px-4 py-4 rounded-xl border-2 border-[#D4A373]/30 
                    bg-white/80 backdrop-blur-sm
                    focus:border-[#3A2E2E] focus:ring-4 focus:ring-[#D4A373]/20 
                    transition-all duration-300 outline-none font-texts
                    hover:border-[#D4A373] hover:shadow-lg"
                  placeholder="Enter your username or email"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#D4A373]/5 to-transparent 
                  opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>

            {/* Password Input */}
            <div className="group">
              <label className="block text-[#3A2E2E] text-sm font-semibold mb-3" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  onChange={(e) => setPwd(e.target.value)}
                  value={pwd}
                  required
                  className="w-full px-4 py-4 pr-12 rounded-xl border-2 border-[#D4A373]/30 
                    bg-white/80 backdrop-blur-sm
                    focus:border-[#3A2E2E] focus:ring-4 focus:ring-[#D4A373]/20 
                    transition-all duration-300 outline-none font-texts
                    hover:border-[#D4A373] hover:shadow-lg"
                  placeholder="Enter your password"
                />
                
                {/* Password visibility toggle */}
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#3A2E2E]/60 
                    hover:text-[#3A2E2E] transition-colors duration-200 p-1"
                >
                  <FontAwesomeIcon 
                    icon={showPassword ? faEyeSlash : faEye} 
                    className="text-lg"
                  />
                </button>
                
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#D4A373]/5 to-transparent 
                  opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center group">
                <div className="relative">
                  <input
                    type="checkbox"
                    id="persist"
                    onChange={togglePersist}
                    checked={persist ?? true}
                    className="sr-only"
                  />
                  <label 
                    htmlFor="persist"
                    className="flex items-center cursor-pointer select-none"
                  >
                    <div className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center 
                      transition-all duration-200 ${
                      persist 
                        ? 'bg-[#3A2E2E] border-[#3A2E2E] text-[#EADBC8]' 
                        : 'bg-white border-[#D4A373]/30 hover:border-[#D4A373]'
                    }`}>
                      {persist && (
                        <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                          <path d="M0 11l2-2 5 5L18 3l2 2L7 18z"/>
                        </svg>
                      )}
                    </div>
                    <span className="text-sm text-[#3A2E2E] font-medium">
                      Keep me signed in
                    </span>
                  </label>
                </div>
              </div>
              <Link 
                to="/forgot-password" 
                className="text-sm text-[#3A2E2E] hover:text-[#D4A373] 
                  transition-colors duration-300 border-b-2 border-transparent 
                  hover:border-[#D4A373] pb-0.5 font-medium"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Sign In Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`w-full font-semibold py-4 px-6 rounded-xl shadow-lg 
                  transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#D4A373]/30 
                  font-headings text-lg relative overflow-hidden ${
                  loading 
                    ? "bg-[#3A2E2E]/70 text-[#EADBC8]/70 cursor-not-allowed" 
                    : "bg-[#3A2E2E] text-[#EADBC8] hover:bg-[#2C2C2C] hover:shadow-2xl hover:shadow-[#3A2E2E]/30 transform hover:scale-[1.02] hover:-translate-y-1"
                }`}
              >
                {!loading && (
                  <div className="absolute inset-0 bg-gradient-to-r from-[#D4A373]/20 via-transparent to-[#D4A373]/20 
                    opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                )}

                {loading ? (
                  <span className="flex items-center justify-center relative z-10">
                    <div className="w-5 h-5 border-2 border-[#EADBC8]/30 border-t-[#EADBC8] rounded-full animate-spin mr-3"></div>
                    Signing In...
                  </span>
                ) : (
                  <span className="relative z-10">Sign In</span>
                )}
              </button>
            </div>

            {/* Divider */}
            {/* <div className="flex items-center py-4">
              <div className="flex-1 h-px bg-[#D4A373]/30"></div>
              <span className="px-4 text-sm text-[#3A2E2E]/60 font-medium">or</span>
              <div className="flex-1 h-px bg-[#D4A373]/30"></div>
            </div> */}

            {/* Quick Access Links
            <div className="grid grid-cols-2 gap-4">
              <Link
                to="/guest-checkout"
                className="group flex items-center justify-center px-4 py-3 border-2 border-[#D4A373]/30 
                  rounded-xl text-[#3A2E2E] font-medium transition-all duration-300 
                  hover:border-[#D4A373] hover:bg-[#D4A373]/5 hover:shadow-lg"
              >
                <span className="text-sm">Continue as Guest</span>
              </Link>
              <Link
                to="/demo"
                className="group flex items-center justify-center px-4 py-3 border-2 border-[#D4A373]/30 
                  rounded-xl text-[#3A2E2E] font-medium transition-all duration-300 
                  hover:border-[#D4A373] hover:bg-[#D4A373]/5 hover:shadow-lg"
              >
                <span className="text-sm">View Demo</span>
              </Link>
            </div> */}

            {/* Register Link */}
            <div className="text-center pt-6 border-t border-[#D4A373]/20">
              <p className="text-[#3A2E2E]/70 font-texts">
                Don't have an account?{' '}
                <Link 
                  to="/register" 
                  className="text-[#3A2E2E] font-semibold hover:text-[#D4A373] 
                    transition-colors duration-300 border-b-2 border-transparent 
                    hover:border-[#D4A373] pb-0.5"
                >
                  Create account
                </Link>
              </p>
              <p className="text-xs text-[#3A2E2E]/50 mt-3">
                Join our premium fashion community
              </p>
            </div>
          </form>

          {/* Floating decoration */}
          <div className="absolute -top-4 -right-4 w-20 h-20 bg-[#D4A373]/10 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-[#3A2E2E]/5 rounded-full blur-2xl animate-pulse" 
            style={{animationDelay: '1s'}}></div>
        </div>
      </div>
    </div>
  );
};

export default Login;