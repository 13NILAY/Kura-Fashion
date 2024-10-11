import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import axios from '../../api/axios';
import { Link } from 'react-router-dom';

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
  }, [user, pwd, matchPwd]);

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

      setUser('');
      setEmail('');
      setPwd('');
      setMatchPwd('');
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
    <div className='flex flex-col mx-auto w-full max-w-md font-texts my-10 p-6 bg-[#F4E1D2] shadow-md rounded-lg border border-[#8A5D3B]'>
      <p ref={errRef} className={errMsg ? "flex text-red-500 justify-center items-center" : "hidden"} aria-live='assertive'>
        <b>{errMsg} !!!</b>
      </p>

      <form onSubmit={handleSubmit}>
        {/* Username Input */}
        <div className='flex flex-col justify-start w-full my-2'>
          <label className='font-semibold text-[#4A2C2A] text-lg my-1' htmlFor='username'>
            Username :
            <FontAwesomeIcon icon={faCheck} className={validName ? "text-lime-500 ml-1" : "hidden"} />
            <FontAwesomeIcon icon={faTimes} className={validName || !user ? "hidden" : "text-red-500 ml-1"} />
          </label>
          <input
            type='text'
            id="username"
            autoComplete="off"
            onChange={(e) => setUser(e.target.value)}
            value={user}
            required
            aria-invalid={validName ? "false" : "true"}
            aria-describedby="uidnote"
            onFocus={() => setUserFocus(true)}
            onBlur={() => setUserFocus(false)}
            className='border border-[#8A5D3B] bg-[#F9EFE6] text-[#4A2C2A] outline-none h-10 px-4 py-2 rounded-sm'
          />
          <p id="uidnote" className={userFocus && user && !validName ? "text-sm font-medium text-red-500" : "hidden"}>
            <FontAwesomeIcon icon={faInfoCircle} />&nbsp;
            4 to 24 characters. Must begin with a letter. Letters, numbers, underscores, hyphens allowed.
          </p>
        </div>

        {/* Email Input */}
        <div className='flex flex-col justify-start w-full my-2'>
          <label className='font-semibold text-[#4A2C2A] text-lg my-1' htmlFor='email'>
            Email address :
            <FontAwesomeIcon icon={faCheck} className={validEmail ? "text-lime-500 ml-1" : "hidden"} />
            <FontAwesomeIcon icon={faTimes} className={validEmail || !email ? "hidden" : "text-red-500 ml-1"} />
          </label>
          <input
            type='email'
            id="email"
            autoComplete="off"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
            aria-invalid={validEmail ? "false" : "true"}
            aria-describedby="emailnote"
            onFocus={() => setEmailFocus(true)}
            onBlur={() => setEmailFocus(false)}
            className='border border-[#8A5D3B] bg-[#F9EFE6] text-[#4A2C2A] outline-none h-10 px-4 py-2 rounded-sm'
          />
          <p id="emailnote" className={emailFocus && email && !validEmail ? "text-sm font-medium text-red-500" : "hidden"}>
            <FontAwesomeIcon icon={faInfoCircle} /> Must be a valid Email ID.
          </p>
        </div>

        {/* Password Input */}
        <div className='flex flex-col justify-start w-full my-2'>
          <label className='font-semibold text-[#4A2C2A] text-lg my-1' htmlFor="password">
            Password :
            <FontAwesomeIcon icon={faCheck} className={validPwd ? "text-lime-500 ml-1" : "hidden"} />
            <FontAwesomeIcon icon={faTimes} className={validPwd || !pwd ? "hidden" : "text-red-500 ml-1"} />
          </label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPwd(e.target.value)}
            value={pwd}
            required
            aria-invalid={validPwd ? "false" : "true"}
            aria-describedby="pwdnote"
            onFocus={() => setPwdFocus(true)}
            onBlur={() => setPwdFocus(false)}
            className='border border-[#8A5D3B] bg-[#F9EFE6] text-[#4A2C2A] outline-none h-10 px-4 py-2 rounded-sm'
          />
          <p id="pwdnote" className={pwdFocus && !validPwd ? "text-sm font-medium text-red-500" : "hidden"}>
            <FontAwesomeIcon icon={faInfoCircle} /> 8 to 24 characters. Must include uppercase, lowercase letters, a number, and a special character.
          </p>
        </div>

        {/* Confirm Password Input */}
        <div className='flex flex-col justify-start w-full my-2'>
          <label className='font-semibold text-[#4A2C2A] text-lg my-1' htmlFor="confirm_pwd">
            Confirm Password :
            <FontAwesomeIcon icon={faCheck} className={validMatch && matchPwd ? "text-lime-500 ml-1" : "hidden"} />
            <FontAwesomeIcon icon={faTimes} className={validMatch || !matchPwd ? "hidden" : "text-red-500 ml-1"} />
          </label>
          <input
            type="password"
            id="confirm_pwd"
            onChange={(e) => setMatchPwd(e.target.value)}
            value={matchPwd}
            required
            aria-invalid={validMatch ? "false" : "true"}
            aria-describedby="confirmnote"
            onFocus={() => setMatchFocus(true)}
            onBlur={() => setMatchFocus(false)}
            className='border border-[#8A5D3B] bg-[#F9EFE6] text-[#4A2C2A] outline-none h-10 px-4 py-2 rounded-sm'
          />
          <p id="confirmnote" className={matchFocus && !validMatch ? "text-sm font-medium text-red-500" : "hidden"}>
            <FontAwesomeIcon icon={faInfoCircle} /> Must match the first password input field.
          </p>
        </div>

        {/* Submit Button */}
        <div className='mt-6 flex justify-center'>
          <button type="submit" className="w-full bg-[#8A5D3B] text-white font-bold py-2 px-4 rounded-lg shadow hover:bg-[#6C472D]">
            REGISTER
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
