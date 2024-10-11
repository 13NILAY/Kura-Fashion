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
    <div className="flex flex-col mx-auto w-full max-w-md font-texts my-10 p-6 bg-[#F4E1D2] shadow-md rounded-lg border border-[#8A5D3B]">
      {/* Error Message */}
      {errMsg && (
        <p className="flex justify-center items-center text-red-500 font-semibold">
          <b>{errMsg} !!!</b>
        </p>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit}>
        {/* Username Input */}
        <div className="flex flex-col justify-start w-full">
          <label className="font-headings text-[#4A2C2A] font-semibold my-2 text-lg" htmlFor="username">
            Username / Email Id:
          </label>
          <input
            type="text"
            id="username"
            autoComplete="off"
            onChange={(e) => setUser(e.target.value)}
            value={user}
            required
            className="border border-[#8A5D3B] bg-[#F9EFE6] text-[#4A2C2A] outline-none h-10 px-4 py-2 rounded-sm"
          />
        </div>

        {/* Password Input */}
        <div className="flex flex-col justify-start w-full my-4">
          <label className="font-headings text-[#4A2C2A] font-semibold my-2 text-lg" htmlFor="password">
            Password:
          </label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPwd(e.target.value)}
            value={pwd}
            required
            className="border border-[#8A5D3B] bg-[#F9EFE6] text-[#4A2C2A] outline-none h-10 px-4 py-2 rounded-sm"
          />
          <Link
            to="/forgot-password"
            className="text-[#8A5D3B] text-sm mt-2 hover:text-[#6B4F3A] font-semibold duration-200 ease-in-out"
          >
            Forgot Password?
          </Link>
        </div>

        {/* Submit Button */}
        <div className="mt-6 flex flex-col justify-center items-start">
          <button
            type="submit"
            className="bg-[#8A5D3B] text-[#F4E1D2] font-headings py-2 px-4 w-full rounded-lg shadow hover:bg-[#6B4F3A] transition duration-300"
          >
            LOG IN
          </button>

          {/* Persist Checkbox */}
          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              id="persist"
              onChange={togglePersist}
              checked={persist}
              className="h-4 w-4 border-[#8A5D3B] accent-[#6B4F3A]"
            />
            <label htmlFor="persist" className="text-sm text-[#4A2C2A] font-semibold ml-2">
              Remember me
            </label>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
