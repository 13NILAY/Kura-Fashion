import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import axios from '../../api/axios';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const Register = () => {
  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState('');
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [pwd, setPwd] = useState('');
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState('');
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [email, setEmail] = useState('');
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [errMsg, setErrMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState(''); // New success message state

  useEffect(() => {
    setValidName(USER_REGEX.test(user));
  }, [user]);

  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email));
  }, [email]);

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwd));
    setValidMatch(pwd === matchPwd);
  }, [pwd, matchPwd]);

  useEffect(() => {
    setErrMsg('');
    setSuccessMsg(''); // Clear the success message on input change
  }, [user, pwd, matchPwd, email,successMsg]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const u1 = USER_REGEX.test(user);
    const e1 = EMAIL_REGEX.test(email);
    const p1 = PWD_REGEX.test(pwd);
    if (!u1 || !e1 || !p1) {
      setErrMsg("Invalid Entry");
      return;
    }
    try {
      const response = await axios.post(
        "/register",
        JSON.stringify({ username: user, password: pwd, email: email }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      console.log(JSON.stringify(response?.data));
      if (response?.data) {
        setSuccessMsg(response.data.success); // Use response data to set success message
    } else {
        setSuccessMsg("Registration successful!"); // Default message if the response doesn't contain `success`
    }
      // Clear the form and show success message
      setUser('');
      setEmail('');
      setPwd('');
      setMatchPwd('');
       // Set success message
    } catch (err) {
      console.log(err);
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else if (err.response?.status === 409) {
        setErrMsg('Username Taken');
      } else {
        setErrMsg('Registration Failed');
      }
      errRef.current.focus();
    }
  };

  return (
    <div className="flex-grow w-full pt-28 pb-10">
  <div className="w-full flex items-center justify-center px-4">
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
       <h2 className="text-3xl font-bold text-[#4A2C2A] text-center mb-8">Create Account</h2>

      {/* Messages */}
      {errMsg && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
          <p className="font-semibold text-center">{errMsg}</p>
        </div>
      )}

      {successMsg && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6">
          <p className="font-semibold text-center">{successMsg}</p>
        </div>
      )}


      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Username Input */}
        <div>
          <label className="block text-[#4A2C2A] text-sm font-semibold mb-2" htmlFor="username">
            Username
            <FontAwesomeIcon icon={faCheck} className={validName ? "text-green-500 ml-2" : "hidden"} />
            <FontAwesomeIcon icon={faTimes} className={validName || !user ? "hidden" : "text-red-500 ml-2"} />
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
            placeholder="Choose a username"
          />
          <p className={userFocus && user && !validName ? "text-sm text-red-500 mt-1" : "hidden"}>
            <FontAwesomeIcon icon={faInfoCircle} className="mr-1" />
            4 to 24 characters. Must begin with a letter.
          </p>
        </div>

        {/* Email Input */}
        <div>
          <label className="block text-[#4A2C2A] text-sm font-semibold mb-2" htmlFor="email">
            Email
            <FontAwesomeIcon icon={faCheck} className={validEmail ? "text-green-500 ml-2" : "hidden"} />
            <FontAwesomeIcon icon={faTimes} className={validEmail || !email ? "hidden" : "text-red-500 ml-2"} />
          </label>
          <input
            type="email"
            id="email"
            autoComplete="off"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
            className="w-full px-4 py-3 rounded-lg border border-[#8A5D3B]/30 focus:border-[#8A5D3B] focus:ring-2 focus:ring-[#8A5D3B]/20 transition-all duration-200 outline-none"
            placeholder="Enter your email"
          />
        </div>

        {/* Password Inputs */}
        <div className="space-y-4">
          <div>
            <label className="block text-[#4A2C2A] text-sm font-semibold mb-2" htmlFor="password">
              Password
              <FontAwesomeIcon icon={faCheck} className={validPwd ? "text-green-500 ml-2" : "hidden"} />
              <FontAwesomeIcon icon={faTimes} className={validPwd || !pwd ? "hidden" : "text-red-500 ml-2"} />
            </label>
            <input
              type="password"
              id="password"
              onChange={(e) => setPwd(e.target.value)}
              value={pwd}
              required
              className="w-full px-4 py-3 rounded-lg border border-[#8A5D3B]/30 focus:border-[#8A5D3B] focus:ring-2 focus:ring-[#8A5D3B]/20 transition-all duration-200 outline-none"
              placeholder="Choose a password"
            />
          </div>

          <div>
            <label className="block text-[#4A2C2A] text-sm font-semibold mb-2" htmlFor="confirm_pwd">
              Confirm Password
              <FontAwesomeIcon icon={faCheck} className={validMatch && matchPwd ? "text-green-500 ml-2" : "hidden"} />
              <FontAwesomeIcon icon={faTimes} className={validMatch || !matchPwd ? "hidden" : "text-red-500 ml-2"} />
            </label>
            <input
              type="password"
              id="confirm_pwd"
              onChange={(e) => setMatchPwd(e.target.value)}
              value={matchPwd}
              required
              className="w-full px-4 py-3 rounded-lg border border-[#8A5D3B]/30 focus:border-[#8A5D3B] focus:ring-2 focus:ring-[#8A5D3B]/20 transition-all duration-200 outline-none"
              placeholder="Confirm your password"
            />
          </div>
        </div>
   {/* Submit Button */}
   <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#8A5D3B] to-[#6B4F3A] text-white font-semibold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#8A5D3B]/50"
          >
            Create Account
          </button>

          {/* Login Link */}
          <div className="text-center mt-6">
            <p className="text-[#4A2C2A]">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-[#8A5D3B] font-semibold hover:text-[#6B4F3A] transition-colors duration-200"
              >
                Sign in
              </Link>
            </p>
          </div>
        </form>
    </div>
    </div>
    </div>
  );
};
export default Register;
