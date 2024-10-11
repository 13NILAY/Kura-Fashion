import React, { useState } from 'react'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

const AccDetails = () => {
  //ACCOUNT DETAILS
  const [name, setName] = useState([]);
  const [email, setEmail] = useState();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  //PASSWORD CHECKING STATES
  const [emptyPass, setEmptyPass] = useState(false);
  const [Verification, setVerification] = useState(true);
  const [passVisibilty, setPassVisibility] = useState(false);

  //FUNCTIONS FOR PASSWORD VERIFICATION
  const setPassword = (e) => {
    setNewPassword(e.target.value);
  };
  const confirmPassword = (e) => {
    setConfirmPass(e.target.value);
  };
  const checkPassword = () => {
    if (newPassword === '') {
      setEmptyPass(true);
    } else if (newPassword === confirmPass) {
      setVerification(true);
    } else {
      setVerification(false);
      setNewPassword("");
      setConfirmPass("");
    }
  };

  return (
    <div className="mt-20 px-8 py-12 max-md:px-6 font-sans text-primaryText bg-[#f5ebe0] rounded-lg shadow-lg">
      {/* PERSONAL DETAILS */}
      <div className="w-full mb-10 bg-[#fff7ec] p-8 rounded-lg shadow-md">
        <p className="text-lg font-semibold text-[#5c4033] border-b-2 pb-2">Personal Details</p>
        {/* NAME */}
        <div className="flex justify-between items-center max-sm:w-full max-sm:flex-col my-5">
          <div className="flex flex-col justify-center items-start w-full max-sm:my-2">
            <label className="text-xl font-medium text-[#5c4033] mb-1">First Name:</label>
            <input
              className="border border-[#5c4033] outline-none font-medium p-3 text-lg rounded-md w-5/6 max-sm:w-full bg-[#f9f4f1] text-[#40322e] placeholder-[#7a6a5a]"
              type="text"
              placeholder="Enter your first name"
            />
          </div>
          <div className="flex flex-col justify-center items-start w-full max-sm:my-2">
            <label className="text-xl font-medium text-[#5c4033] mb-1">Last Name:</label>
            <input
              className="border border-[#5c4033] outline-none font-medium p-3 text-lg rounded-md w-5/6 max-sm:w-full bg-[#f9f4f1] text-[#40322e] placeholder-[#7a6a5a]"
              type="text"
              placeholder="Enter your last name"
            />
          </div>
        </div>
        {/* EMAIL ADDRESS */}
        <div className="flex flex-col justify-center items-start w-1/2 max-sm:w-full my-5">
          <label className="text-xl font-medium text-[#5c4033] mb-1">E-mail address:</label>
          <input
            className="border border-[#5c4033] outline-none font-medium p-3 text-lg rounded-md w-full bg-[#f9f4f1] text-[#40322e] placeholder-[#7a6a5a]"
            type="text"
            placeholder="Enter your email"
          />
        </div>
        {/* PHONE NUMBER */}
        <div className="flex flex-col justify-center items-start w-1/2 max-sm:w-full my-5">
          <label className="text-xl font-medium text-[#5c4033] mb-1">Phone Number:</label>
          <input
            className="border border-[#5c4033] outline-none font-medium p-3 text-lg rounded-md w-full bg-[#f9f4f1] text-[#40322e] placeholder-[#7a6a5a]"
            type="text"
            placeholder="Enter your phone number"
          />
        </div>
      </div>

      {/* CHANGE PASSWORD */}
      <div className="w-full my-10 bg-[#fff7ec] p-8 rounded-lg shadow-md">
        <p className="text-lg font-semibold text-[#5c4033] border-b-2 pb-2">Change Password</p>
        {/* PASSWORD BOX */}
        <div className="flex flex-col justify-center items-start my-5">
          <label className="text-xl font-medium text-[#5c4033] w-full mb-1">
            New Password: <span className="text-sm text-gray-600">(Leave blank for unchanged)</span>
          </label>
          <div className="border border-[#5c4033] text-lg rounded-md flex items-center w-1/2 max-sm:w-full bg-[#f9f4f1]">
            <input
              className="outline-none font-medium p-3 w-full bg-transparent text-[#40322e] placeholder-[#7a6a5a]"
              type={passVisibilty ? 'text' : 'password'}
              onChange={setPassword}
              value={newPassword}
              placeholder="Enter your new password"
            />
            <div className={passVisibilty ? 'mx-2 cursor-pointer text-[#5c4033]' : 'mx-2 cursor-pointer'}
              onClick={() => setPassVisibility((prev) => !prev)}>
              {passVisibilty ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
            </div>
          </div>
          {emptyPass && (
            <div className="text-sm text-red-500 mt-1">
              <p>Password should not be empty</p>
            </div>
          )}
        </div>

        {/* CONFIRM PASSWORD BOX */}
        <div className="flex flex-col justify-center items-start my-5">
          <label className="text-xl font-medium text-[#5c4033] mb-1">Confirm New Password:</label>
          <div className="border border-[#5c4033] text-lg w-1/2 max-sm:w-full rounded-md flex items-center bg-[#f9f4f1]">
            <input
              className="outline-none font-medium p-3 w-full bg-transparent text-[#40322e] placeholder-[#7a6a5a]"
              type="password"
              onChange={confirmPassword}
              value={confirmPass}
              placeholder="Confirm your new password"
            />
          </div>
          {!Verification && (
            <div className="text-sm text-red-500 mt-1">
              <p>Password and Confirm Password should match</p>
            </div>
          )}
        </div>

        <div className="my-5 font-semibold border border-[#5c4033] rounded-md w-1/4 max-md:w-2/5 max-sm:w-full text-lg text-center p-2 bg-[#5c4033] text-[#fff7ec] cursor-pointer">
          <button
            onClick={checkPassword}
            className="text-[#fff7ec] font-bold py-2 px-4 rounded-lg w-full">
            SAVE CHANGES
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccDetails;
