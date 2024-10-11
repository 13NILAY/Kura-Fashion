import React, { useEffect, useState } from 'react';
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate';
import useAuth from '../../../../hooks/useAuth';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Address = () => {
  const navigate = useNavigate();
  const {auth}=useAuth();
  const axiosPrivate=useAxiosPrivate();
  console.log(auth);
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    mobileno: '',
    addressOf: "",
    flatNumber: "",
    building: "",
    street: "",
    city: "",
    state: "",
    pinCode: 0
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await axiosPrivate.get(`/users/${auth.email}`);
        console.log(result);
        setFormData(result.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axiosPrivate.put(`/users/${auth.email}`,
        JSON.stringify({ formData }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );
      console.log(response);
    } catch (err) {
      console.log(err);
    }
    navigate(from, { replace: true });
  };

  return (
    <div className='mt-20 px-8 py-12 max-md:px-6 font-sans text-primaryText bg-[#fff7ec] rounded-lg shadow-md'>
      <div className='w-full mb-10 bg-[#fff7ec] p-8 rounded-lg shadow-md'>
        <p className='text-lg font-semibold text-[#5c4033] border-b-2 pb-2'>Address Details</p>
        
        <form onSubmit={handleSubmit}>
          {/* NAME */}
          <div className='flex justify-between items-center max-sm:w-full max-sm:flex-col my-5'>
            <div className='flex flex-col justify-center items-start w-full max-sm:my-2'>
              <label className='text-xl font-medium text-[#5c4033] mb-1' htmlFor='FirstName'>
                First Name:
              </label>
              <input
                id="FirstName"
                className='border border-[#5c4033] outline-none font-medium p-3 text-lg rounded-md w-5/6 max-sm:w-full bg-[#f9f4f1] text-[#40322e] placeholder-[#7a6a5a]'
                type='text'
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="Enter your first name"
              />
            </div>
            <div className='flex flex-col justify-center items-start w-full max-sm:my-2'>
              <label className='text-xl font-medium text-[#5c4033] mb-1' htmlFor='LastName'>
                Last Name:
              </label>
              <input
                id="LastName"
                className='border border-[#5c4033] outline-none font-medium p-3 text-lg rounded-md w-5/6 max-sm:w-full bg-[#f9f4f1] text-[#40322e] placeholder-[#7a6a5a]'
                type='text'
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Enter your last name"
              />
            </div>
          </div>

          {/* PHONE NUMBER */}
          <div className='flex flex-col justify-center items-start w-1/2 max-sm:w-full my-5'>
            <label className='text-xl font-medium text-[#5c4033] mb-1' htmlFor='PhoneNumber'>
              Phone Number:
            </label>
            <input
              id="PhoneNumber"
              className='border border-[#5c4033] outline-none font-medium p-3 text-lg rounded-md w-full bg-[#f9f4f1] text-[#40322e] placeholder-[#7a6a5a]'
              type='number'
              name="mobileno"
              value={formData.mobileno}
              onChange={handleChange}
              placeholder="Enter your phone number"
            />
          </div>

          {/* ADDRESS OF */}
          <div className='flex flex-col justify-center items-start w-1/2 max-sm:w-full my-5'>
            <label className='text-xl font-medium text-[#5c4033] mb-1' htmlFor='AddressOf'>
              Address of:
            </label>
            <input
              id='AddressOf'
              className='border border-[#5c4033] outline-none font-medium p-3 text-lg rounded-md w-full bg-[#f9f4f1] text-[#40322e] placeholder-[#7a6a5a]'
              type='text'
              name="addressOf"
              value={formData.addressOf}
              onChange={handleChange}
              placeholder="Enter the address of"
            />
          </div>

          {/* FLAT NUMBER AND BUILDING */}
          <div className='flex justify-between items-center max-sm:w-full max-sm:flex-col my-5'>
            <div className='flex flex-col justify-center items-start w-full max-sm:my-2'>
              <label className='text-xl font-medium text-[#5c4033] mb-1' htmlFor='FlatNumber'>
                Flat Number:
              </label>
              <input
                id='FlatNumber'
                className='border border-[#5c4033] outline-none font-medium p-3 text-lg rounded-md w-5/6 max-sm:w-full bg-[#f9f4f1] text-[#40322e] placeholder-[#7a6a5a]'
                type='text'
                name="flatNumber"
                value={formData.flatNumber}
                onChange={handleChange}
                placeholder="Enter your flat number"
              />
            </div>
            <div className='flex flex-col justify-center items-start w-full max-sm:my-2'>
              <label className='text-xl font-medium text-[#5c4033] mb-1' htmlFor='BuildingName'>
                Building Name/Number:
              </label>
              <input
                id='BuildingName'
                className='border border-[#5c4033] outline-none font-medium p-3 text-lg rounded-md w-5/6 max-sm:w-full bg-[#f9f4f1] text-[#40322e] placeholder-[#7a6a5a]'
                type='text'
                name="building"
                value={formData.building}
                onChange={handleChange}
                placeholder="Enter your building name/number"
              />
            </div>
          </div>

          {/* STREET */}
          <div className='flex flex-col justify-center items-start w-1/2 max-sm:w-full my-5'>
            <label className='text-xl font-medium text-[#5c4033] mb-1' htmlFor='Street'>
              Street:
            </label>
            <input
              id='Street'
              className='border border-[#5c4033] outline-none font-medium p-3 text-lg rounded-md w-full bg-[#f9f4f1] text-[#40322e] placeholder-[#7a6a5a]'
              type='text'
              name="street"
              value={formData.street}
              onChange={handleChange}
              placeholder="Enter your street"
            />
          </div>

          {/* STATE, CITY, PIN CODE */}
          <div className='flex justify-between items-center max-sm:w-full max-sm:flex-col my-5'>
            <div className='flex flex-col justify-center items-start w-full max-sm:my-2'>
              <label className='text-xl font-medium text-[#5c4033] mb-1' htmlFor='State'>
                State:
              </label>
              <input
                id='State'
                className='border border-[#5c4033] outline-none font-medium p-3 text-lg rounded-md w-5/6 max-sm:w-full bg-[#f9f4f1] text-[#40322e] placeholder-[#7a6a5a]'
                type='text'
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Enter your state"
              />
            </div>
            <div className='flex flex-col justify-center items-start w-full max-sm:my-2'>
              <label className='text-xl font-medium text-[#5c4033] mb-1' htmlFor='City'>
                City:
              </label>
              <input
                id='City'
                className='border border-[#5c4033] outline-none font-medium p-3 text-lg rounded-md w-5/6 max-sm:w-full bg-[#f9f4f1] text-[#40322e] placeholder-[#7a6a5a]'
                type='text'
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter your city"
              />
            </div>
            <div className='flex flex-col justify-center items-start w-full max-sm:my-2'>
              <label className='text-xl font-medium text-[#5c4033] mb-1' htmlFor='PinCode'>
                PIN Code:
              </label>
              <input
                id='PinCode'
                className='border border-[#5c4033] outline-none font-medium p-3 text-lg rounded-md w-5/6 max-sm:w-full bg-[#f9f4f1] text-[#40322e] placeholder-[#7a6a5a]'
                type='number'
                name='pinCode'
                value={formData.pinCode}
                onChange={handleChange}
                placeholder="Enter your PIN code"
              />
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className='text-center'>
            <button type="submit" className="bg-[#5c4033] text-[#fff7ec] font-bold py-3 px-6 rounded-lg shadow hover:bg-[#6a4c39]">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Address;
