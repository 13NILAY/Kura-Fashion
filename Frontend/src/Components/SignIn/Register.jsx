import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import axios from '../../api/axios';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = "/register";

const Register = () => {
  const userRef = useRef();
  const errRef = useRef();
  const navigate = useNavigate();

  const [user, setUser] = useState('');
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [email, setEmail] = useState('');
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [pwd, setPwd] = useState('');
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState('');
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Set focus on username input when component loads
  useEffect(() => {
    userRef.current.focus();
  }, []);

  // Validate username
  useEffect(() => {
    setValidName(USER_REGEX.test(user));
  }, [user]);

  // Validate email
  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email));
  }, [email]);

  // Validate password and match
  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwd));
    setValidMatch(pwd === matchPwd);
  }, [pwd, matchPwd]);

  // Clear error message when user changes inputs
  useEffect(() => {
    setErrMsg('');
  }, [user, pwd, matchPwd, email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Double-check validation
    if (!USER_REGEX.test(user) || !EMAIL_REGEX.test(email) || 
        !PWD_REGEX.test(pwd) || pwd !== matchPwd) {
      setErrMsg("Please fix all validation errors before submitting");
      return;
    }

    setLoading(true);
    
    try {
      const response = await axios.post(
        REGISTER_URL,
        JSON.stringify({ username: user, password: pwd, email: email }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      
      setSuccess(true);
      
      // Clear form
      setUser('');
      setEmail('');
      setPwd('');
      setMatchPwd('');
      
      // Navigate to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (err) {
      setLoading(false);
      
      if (!err?.response) {
        setErrMsg('No Server Response. Please try again later.');
      } else if (err.response?.status === 409) {
        setErrMsg('Username or email is already taken');
      } else {
        setErrMsg('Registration failed. Please try again.');
      }
      
      errRef.current.focus();
    }
  };

  return (
    <div className="flex-grow w-full pt-28 pb-10 bg-[#FAF5F0]">
      <div className="w-full flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-[#4A2C2A] text-center mb-8">Create Account</h2>
          
          {success ? (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6 animate-pulse">
              <p className="font-semibold text-center">Registration successful! Redirecting to login...</p>
            </div>
          ) : (
            <div>
              {errMsg && (
                <div ref={errRef} className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
                  <p className="font-semibold text-center" aria-live="assertive">{errMsg}</p>
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
                    onFocus={() => setUserFocus(true)}
                    onBlur={() => setUserFocus(false)}
                    className="w-full px-4 py-3 rounded-lg border border-[#8A5D3B]/30 focus:border-[#8A5D3B] focus:ring-2 focus:ring-[#8A5D3B]/20 transition-all duration-200 outline-none"
                    placeholder="Choose a username"
                    aria-invalid={validName ? "false" : "true"}
                    aria-describedby="uidnote"
                  />
                  <p id="uidnote" className={userFocus && user && !validName ? "text-sm text-red-500 mt-1" : "hidden"}>
                    <FontAwesomeIcon icon={faInfoCircle} className="mr-1" />
                    4 to 24 characters<br />
                    Must begin with a letter<br />
                    Letters, numbers, underscores, hyphens allowed
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
                    onFocus={() => setEmailFocus(true)}
                    onBlur={() => setEmailFocus(false)}
                    className="w-full px-4 py-3 rounded-lg border border-[#8A5D3B]/30 focus:border-[#8A5D3B] focus:ring-2 focus:ring-[#8A5D3B]/20 transition-all duration-200 outline-none"
                    placeholder="Enter your email"
                    aria-invalid={validEmail ? "false" : "true"}
                    aria-describedby="emailnote"
                  />
                  <p id="emailnote" className={emailFocus && email && !validEmail ? "text-sm text-red-500 mt-1" : "hidden"}>
                    <FontAwesomeIcon icon={faInfoCircle} className="mr-1" />
                    Please enter a valid email address
                  </p>
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
                      onFocus={() => setPwdFocus(true)}
                      onBlur={() => setPwdFocus(false)}
                      className="w-full px-4 py-3 rounded-lg border border-[#8A5D3B]/30 focus:border-[#8A5D3B] focus:ring-2 focus:ring-[#8A5D3B]/20 transition-all duration-200 outline-none"
                      placeholder="Choose a password"
                      aria-invalid={validPwd ? "false" : "true"}
                      aria-describedby="pwdnote"
                    />
                    <div id="pwdnote" className={pwdFocus && !validPwd ? "text-sm text-red-500 mt-1" : "hidden"}>
                      <FontAwesomeIcon icon={faInfoCircle} className="mr-1" />
                      8 to 24 characters<br />
                      Must include uppercase and lowercase letters, a number and a special character<br />
                      Allowed special characters: <span className="font-semibold">! @ # $ %</span>
                    </div>
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
                      onFocus={() => setMatchFocus(true)}
                      onBlur={() => setMatchFocus(false)}
                      className="w-full px-4 py-3 rounded-lg border border-[#8A5D3B]/30 focus:border-[#8A5D3B] focus:ring-2 focus:ring-[#8A5D3B]/20 transition-all duration-200 outline-none"
                      placeholder="Confirm your password"
                      aria-invalid={validMatch ? "false" : "true"}
                      aria-describedby="confirmnote"
                    />
                    <p id="confirmnote" className={matchFocus && !validMatch ? "text-sm text-red-500 mt-1" : "hidden"}>
                      <FontAwesomeIcon icon={faInfoCircle} className="mr-1" />
                      Passwords must match
                    </p>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!validName || !validEmail || !validPwd || !validMatch || loading}
                  className={`w-full font-semibold py-3 px-4 rounded-lg shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#8A5D3B]/50 ${
                    !validName || !validEmail || !validPwd || !validMatch || loading
                      ? "bg-[#8A5D3B]/50 text-white cursor-not-allowed"
                      : "bg-gradient-to-r from-[#8A5D3B] to-[#6B4F3A] text-white hover:-translate-y-0.5 hover:shadow-xl"
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    "Create Account"
                  )}
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
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;