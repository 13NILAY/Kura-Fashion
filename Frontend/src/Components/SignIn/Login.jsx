import React from 'react';
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

const Login = () => {
  const { setAuthInfo, persist, setPersist } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [user, setUser] = useState('');
  const [pwd, setPwd] = useState('');
  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    setErrMsg('');
  }, [user, pwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosPrivate.post(
        '/login',
        JSON.stringify({ identity: user, password: pwd }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      console.log(response);
      const email = response?.data?.email;
      const accessToken = response?.data?.accessToken;
      const roles = response?.data?.roles;

      setAuthInfo({ accessToken }, email, roles);
      setUser('');
      setPwd('');
      navigate(from, { replace: true });
    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else if (err.response?.status === 400) {
        setErrMsg('Missing Username or Password');
      } else if (err.response?.status === 401) {
        setErrMsg('Unauthorized');
      } else {
        setErrMsg('Login Failed');
      }
    }
  };

  const togglePersist = () => {
    setPersist((prev) => !prev);
  };

  useEffect(() => {
    localStorage.setItem('persist', persist);
  }, [persist]);

  return (
    <div className="flex-grow w-full pt-28 pb-10">
  <div className="w-full flex items-center justify-center px-4">
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-[#4A2C2A] text-center mb-8">Welcome Back</h2>
        
        {/* Error Message */}
        {errMsg && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            <p className="font-semibold text-center">{errMsg}</p>
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
                checked={persist}
                className="h-4 w-4 rounded border-[#8A5D3B] text-[#8A5D3B] focus:ring-[#8A5D3B]/20"
              />
              <label htmlFor="persist" className="ml-2 text-sm text-[#4A2C2A]">
                Remember me
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
            className="w-full bg-gradient-to-r from-[#8A5D3B] to-[#6B4F3A] text-white font-semibold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#8A5D3B]/50"
          >
            Sign In
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
