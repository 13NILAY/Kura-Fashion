import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

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

  return (
    <div className="flex-grow w-full pt-28 pb-10 bg-[#FAF5F0]">
      <div className="w-full flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-[#4A2C2A] text-center mb-8">Welcome Back</h2>
          
          {/* Error Message */}
          {errMsg && (
            <div 
              ref={errRef} 
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6" 
              aria-live="assertive"
            >
              <div className="flex items-center">
                <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500 mr-3" />
                <p className="font-semibold">{errMsg}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username/Email Input */}
            <div>
              <label className="block text-[#4A2C2A] text-sm font-semibold mb-2" htmlFor="username">
                Username / Email
              </label>
              <input
                type="text"
                id="username"
                ref={userRef}
                autoComplete="off"
                onChange={(e) => setUser(e.target.value)}
                value={user}
                required
                className="w-full px-4 py-3 rounded-lg border border-[#8A5D3B]/30 focus:border-[#8A5D3B] focus:ring-2 focus:ring-[#8A5D3B]/20 transition-all duration-200 outline-none"
                placeholder="Enter your username or email"
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-[#4A2C2A] text-sm font-semibold mb-2" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                onChange={(e) => setPwd(e.target.value)}
                value={pwd}
                required
                className="w-full px-4 py-3 rounded-lg border border-[#8A5D3B]/30 focus:border-[#8A5D3B] focus:ring-2 focus:ring-[#8A5D3B]/20 transition-all duration-200 outline-none"
                placeholder="Enter your password"
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="persist"
                  onChange={togglePersist}
                  checked={persist ?? true}  // Default to true
                  className="h-4 w-4 rounded border-[#8A5D3B] text-[#8A5D3B] focus:ring-[#8A5D3B]/20"
                />
                <label htmlFor="persist" className="ml-2 text-sm text-[#4A2C2A]">
                  Keep me signed in
                </label>
              </div>
              <Link 
                to="/forgot-password" 
                className="text-sm text-[#8A5D3B] hover:text-[#6B4F3A] transition-colors duration-200"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-gradient-to-r from-[#8A5D3B] to-[#6B4F3A] text-white font-semibold py-3 px-4 rounded-lg shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#8A5D3B]/50 ${
                loading ? "opacity-70 cursor-not-allowed" : "hover:shadow-xl hover:-translate-y-0.5"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing In...
                </span>
              ) : (
                "Sign In"
              )}
            </button>

            {/* Register Link */}
            <div className="text-center mt-6">
              <p className="text-[#4A2C2A]">
                Don't have an account?{' '}
                <Link 
                  to="/register" 
                  className="text-[#8A5D3B] font-semibold hover:text-[#6B4F3A] transition-colors duration-200"
                >
                  Register now
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;