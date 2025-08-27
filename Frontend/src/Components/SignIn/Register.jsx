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
                Join KURA
              </span>
              <div className="w-12 h-0.5 bg-[#D4A373]"></div>
            </div>
            <h2 className="font-headings text-[#3A2E2E] text-4xl font-light mb-3">
              Create
              <span className="block text-[#D4A373] font-normal">Account</span>
            </h2>
            <p className="text-[#3A2E2E]/70 font-texts">
              Begin your premium fashion journey
            </p>
          </div>
          
          {success ? (
            <div className="relative">
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200 
                text-emerald-800 px-6 py-4 rounded-2xl mb-6 shadow-lg">
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                    <FontAwesomeIcon icon={faCheck} className="text-white text-sm" />
                  </div>
                  <div>
                    <p className="font-semibold">Registration Successful!</p>
                    <p className="text-sm opacity-80">Redirecting to login page...</p>
                  </div>
                </div>
                <div className="mt-3 w-full bg-emerald-200 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full animate-pulse" style={{width: '100%'}}></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative">
              {errMsg && (
                <div ref={errRef} className="bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-200 
                  text-red-800 px-6 py-4 rounded-2xl mb-6 shadow-lg">
                  <div className="flex items-center space-x-3">
                    <FontAwesomeIcon icon={faTimes} className="text-red-500 flex-shrink-0" />
                    <p className="font-semibold" aria-live="assertive">{errMsg}</p>
                  </div>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Username Input */}
                <div className="group">
                  <label className="flex items-center text-[#3A2E2E] text-sm font-semibold mb-3" htmlFor="username">
                    <span>Username</span>
                    <FontAwesomeIcon 
                      icon={faCheck} 
                      className={`ml-2 transition-all duration-300 ${
                        validName ? "text-emerald-500 opacity-100" : "opacity-0"
                      }`} 
                    />
                    <FontAwesomeIcon 
                      icon={faTimes} 
                      className={`ml-2 transition-all duration-300 ${
                        validName || !user ? "opacity-0" : "text-red-500 opacity-100"
                      }`} 
                    />
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
                      onFocus={() => setUserFocus(true)}
                      onBlur={() => setUserFocus(false)}
                      className="w-full px-4 py-4 rounded-xl border-2 border-[#D4A373]/30 
                        bg-white/80 backdrop-blur-sm
                        focus:border-[#3A2E2E] focus:ring-4 focus:ring-[#D4A373]/20 
                        transition-all duration-300 outline-none font-texts
                        hover:border-[#D4A373] hover:shadow-lg"
                      placeholder="Choose a unique username"
                      aria-invalid={validName ? "false" : "true"}
                      aria-describedby="uidnote"
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#D4A373]/5 to-transparent 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                  <div id="uidnote" className={`mt-3 transition-all duration-300 ${
                    userFocus && user && !validName 
                      ? "opacity-100 translate-y-0 max-h-40" 
                      : "opacity-0 -translate-y-2 pointer-events-none max-h-0 overflow-hidden"
                  }`}>
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm">
                      <div className="flex items-start space-x-2">
                        <FontAwesomeIcon icon={faInfoCircle} className="text-amber-600 mt-0.5 flex-shrink-0" />
                        <div className="text-amber-800 space-y-1">
                          <p>• 4 to 24 characters</p>
                          <p>• Must begin with a letter</p>
                          <p>• Letters, numbers, underscores, hyphens allowed</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Email Input */}
                <div className="group">
                  <label className="flex items-center text-[#3A2E2E] text-sm font-semibold mb-3" htmlFor="email">
                    <span>Email Address</span>
                    <FontAwesomeIcon 
                      icon={faCheck} 
                      className={`ml-2 transition-all duration-300 ${
                        validEmail ? "text-emerald-500 opacity-100" : "opacity-0"
                      }`} 
                    />
                    <FontAwesomeIcon 
                      icon={faTimes} 
                      className={`ml-2 transition-all duration-300 ${
                        validEmail || !email ? "opacity-0" : "text-red-500 opacity-100"
                      }`} 
                    />
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      autoComplete="off"
                      onChange={(e) => setEmail(e.target.value)}
                      value={email}
                      required
                      onFocus={() => setEmailFocus(true)}
                      onBlur={() => setEmailFocus(false)}
                      className="w-full px-4 py-4 rounded-xl border-2 border-[#D4A373]/30 
                        bg-white/80 backdrop-blur-sm
                        focus:border-[#3A2E2E] focus:ring-4 focus:ring-[#D4A373]/20 
                        transition-all duration-300 outline-none font-texts
                        hover:border-[#D4A373] hover:shadow-lg"
                      placeholder="Enter your email address"
                      aria-invalid={validEmail ? "false" : "true"}
                      aria-describedby="emailnote"
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#D4A373]/5 to-transparent 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                  <div id="emailnote" className={`mt-3 transition-all duration-300 ${
                    emailFocus && email && !validEmail 
                      ? "opacity-100 translate-y-0 max-h-40" 
                      : "opacity-0 -translate-y-2 pointer-events-none max-h-0 overflow-hidden"
                  }`}>
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <FontAwesomeIcon icon={faInfoCircle} className="text-amber-600 flex-shrink-0" />
                        <p className="text-amber-800">Please enter a valid email address</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Password Inputs */}
                <div className="space-y-6">
                  <div className="group">
                    <label className="flex items-center text-[#3A2E2E] text-sm font-semibold mb-3" htmlFor="password">
                      <span>Password</span>
                      <FontAwesomeIcon 
                        icon={faCheck} 
                        className={`ml-2 transition-all duration-300 ${
                          validPwd ? "text-emerald-500 opacity-100" : "opacity-0"
                        }`} 
                      />
                      <FontAwesomeIcon 
                        icon={faTimes} 
                        className={`ml-2 transition-all duration-300 ${
                          validPwd || !pwd ? "opacity-0" : "text-red-500 opacity-100"
                        }`} 
                      />
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        id="password"
                        onChange={(e) => setPwd(e.target.value)}
                        value={pwd}
                        required
                        onFocus={() => setPwdFocus(true)}
                        onBlur={() => setPwdFocus(false)}
                        className="w-full px-4 py-4 rounded-xl border-2 border-[#D4A373]/30 
                          bg-white/80 backdrop-blur-sm
                          focus:border-[#3A2E2E] focus:ring-4 focus:ring-[#D4A373]/20 
                          transition-all duration-300 outline-none font-texts
                          hover:border-[#D4A373] hover:shadow-lg"
                        placeholder="Create a secure password"
                        aria-invalid={validPwd ? "false" : "true"}
                        aria-describedby="pwdnote"
                      />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#D4A373]/5 to-transparent 
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                    <div id="pwdnote" className={`mt-3 transition-all duration-300 ${
                      pwdFocus && !validPwd 
                        ? "opacity-100 translate-y-0 max-h-40" 
                        : "opacity-0 -translate-y-2 pointer-events-none max-h-0 overflow-hidden"
                    }`}>
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm">
                        <div className="flex items-start space-x-2">
                          <FontAwesomeIcon icon={faInfoCircle} className="text-amber-600 mt-0.5 flex-shrink-0" />
                          <div className="text-amber-800 space-y-1">
                            <p>• 8 to 24 characters</p>
                            <p>• Must include uppercase and lowercase letters</p>
                            <p>• Must include a number and a special character</p>
                            <p>• Allowed special characters: <span className="font-semibold">! @ # $ %</span></p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="group">
                    <label className="flex items-center text-[#3A2E2E] text-sm font-semibold mb-3" htmlFor="confirm_pwd">
                      <span>Confirm Password</span>
                      <FontAwesomeIcon 
                        icon={faCheck} 
                        className={`ml-2 transition-all duration-300 ${
                          validMatch && matchPwd ? "text-emerald-500 opacity-100" : "opacity-0"
                        }`} 
                      />
                      <FontAwesomeIcon 
                        icon={faTimes} 
                        className={`ml-2 transition-all duration-300 ${
                          validMatch || !matchPwd ? "opacity-0" : "text-red-500 opacity-100"
                        }`} 
                      />
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        id="confirm_pwd"
                        onChange={(e) => setMatchPwd(e.target.value)}
                        value={matchPwd}
                        required
                        onFocus={() => setMatchFocus(true)}
                        onBlur={() => setMatchFocus(false)}
                        className="w-full px-4 py-4 rounded-xl border-2 border-[#D4A373]/30 
                          bg-white/80 backdrop-blur-sm
                          focus:border-[#3A2E2E] focus:ring-4 focus:ring-[#D4A373]/20 
                          transition-all duration-300 outline-none font-texts
                          hover:border-[#D4A373] hover:shadow-lg"
                        placeholder="Confirm your password"
                        aria-invalid={validMatch ? "false" : "true"}
                        aria-describedby="confirmnote"
                      />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#D4A373]/5 to-transparent 
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                    <div id="confirmnote" className={`mt-3 transition-all duration-300 ${
                      matchFocus && !validMatch 
                        ? "opacity-100 translate-y-0 max-h-40" 
                        : "opacity-0 -translate-y-2 pointer-events-none max-h-0 overflow-hidden"
                    }`}>
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <FontAwesomeIcon icon={faInfoCircle} className="text-amber-600 flex-shrink-0" />
                          <p className="text-amber-800">Passwords must match exactly</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={!validName || !validEmail || !validPwd || !validMatch || loading}
                    className={`w-full font-semibold py-4 px-6 rounded-xl shadow-lg 
                      transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#D4A373]/30 
                      font-headings text-lg relative overflow-hidden ${
                      !validName || !validEmail || !validPwd || !validMatch || loading
                        ? "bg-[#3A2E2E]/50 text-[#EADBC8]/70 cursor-not-allowed"
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
                        Creating Account...
                      </span>
                    ) : (
                      <span className="relative z-10">Create Account</span>
                    )}
                  </button>
                </div>

                {/* Login Link */}
                <div className="text-center pt-6 border-t border-[#D4A373]/20">
                  <p className="text-[#3A2E2E]/70 font-texts">
                    Already have an account?{' '}
                    <Link
                      to="/login"
                      className="text-[#3A2E2E] font-semibold hover:text-[#D4A373] 
                        transition-colors duration-300 border-b-2 border-transparent 
                        hover:border-[#D4A373] pb-0.5"
                    >
                      Sign in here
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