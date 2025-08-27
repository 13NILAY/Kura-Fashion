import React, { useEffect, useState } from 'react';
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate';
import useAuth from '../../../../hooks/useAuth';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import DirectionsIcon from '@mui/icons-material/Directions';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import PublicIcon from '@mui/icons-material/Public';
import PinDropOutlinedIcon from '@mui/icons-material/PinDropOutlined';

const Address = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
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

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const result = await axiosPrivate.get(`/users/${auth.email}`);
        setFormData(result.data);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
    if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';
    if (!formData.mobileno.trim()) newErrors.mobileno = 'Phone number is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.pinCode || formData.pinCode <= 0) newErrors.pinCode = 'Valid PIN code is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setIsSubmitting(true);
      const response = await axiosPrivate.put(`/users/${auth.email}`,
        JSON.stringify({ formData }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );
      navigate(from, { replace: true });
    } catch (err) {
      console.log(err);
      setErrors({ submit: 'Failed to save address. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="mt-20 px-4 sm:px-8 py-16 bg-gradient-to-br from-[#F8F5F2] to-[#EADBC8] min-h-screen">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/30">
            <div className="text-center mb-8">
              <div className="w-16 h-16 border-4 border-[#D4A373]/30 border-t-[#3A2E2E] rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-[#3A2E2E] font-medium">Loading your information...</p>
            </div>
            
            {/* Loading form skeleton */}
            <div className="space-y-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-6 bg-[#3A2E2E]/20 rounded-lg w-32 animate-pulse"></div>
                  <div className="h-12 bg-[#3A2E2E]/10 rounded-xl w-full animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-20 px-4 sm:px-8 py-16 bg-gradient-to-br from-[#F8F5F2] to-[#EADBC8] min-h-screen relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-[#D4A373]/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-[#3A2E2E]/5 rounded-full blur-3xl animate-pulse" 
        style={{animationDelay: '2s'}}></div>
      
      <div className="container mx-auto max-w-4xl relative">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-0.5 bg-[#D4A373]"></div>
            <span className="mx-4 text-[#3A2E2E]/60 text-sm font-medium tracking-widest uppercase">
              Your Details
            </span>
            <div className="w-16 h-0.5 bg-[#D4A373]"></div>
          </div>
          
          <h1 className="font-headings text-[#3A2E2E] text-4xl sm:text-5xl font-light mb-4 leading-tight">
            Address
            <span className="block text-[#D4A373] font-normal">Information</span>
          </h1>
          
          <p className="text-[#3A2E2E]/70 text-lg max-w-2xl mx-auto">
            Please provide your address details for seamless delivery of your premium collection.
          </p>
        </div>

        {/* Main Form Container */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 sm:p-12 shadow-xl border border-white/30 relative">
          {/* Decorative accent */}
          <div className="absolute top-0 left-8 w-24 h-1 bg-gradient-to-r from-[#D4A373] to-[#3A2E2E] rounded-full"></div>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-[#D4A373]/20 rounded-full flex items-center justify-center">
                  <PersonOutlineIcon className="text-[#3A2E2E]" />
                </div>
                <h3 className="font-headings text-[#3A2E2E] text-2xl font-semibold">Personal Information</h3>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[#3A2E2E] font-medium text-base flex items-center space-x-2" htmlFor="FirstName">
                    <span>First Name</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="FirstName"
                    className={`w-full p-4 rounded-xl border-2 transition-all duration-300 
                      bg-white/50 backdrop-blur-sm text-[#3A2E2E] font-medium
                      placeholder-[#3A2E2E]/50 focus:outline-none focus:ring-2 focus:ring-[#D4A373]/50
                      ${errors.first_name 
                        ? 'border-red-300 focus:border-red-400' 
                        : 'border-[#D4A373]/30 focus:border-[#D4A373] hover:border-[#D4A373]/50'
                      }`}
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder="Enter your first name"
                  />
                  {errors.first_name && (
                    <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-[#3A2E2E] font-medium text-base flex items-center space-x-2" htmlFor="LastName">
                    <span>Last Name</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="LastName"
                    className={`w-full p-4 rounded-xl border-2 transition-all duration-300 
                      bg-white/50 backdrop-blur-sm text-[#3A2E2E] font-medium
                      placeholder-[#3A2E2E]/50 focus:outline-none focus:ring-2 focus:ring-[#D4A373]/50
                      ${errors.last_name 
                        ? 'border-red-300 focus:border-red-400' 
                        : 'border-[#D4A373]/30 focus:border-[#D4A373] hover:border-[#D4A373]/50'
                      }`}
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder="Enter your last name"
                  />
                  {errors.last_name && (
                    <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>
                  )}
                </div>
              </div>

              {/* Phone Number */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[#3A2E2E] font-medium text-base flex items-center space-x-2" htmlFor="PhoneNumber">
                    <PhoneOutlinedIcon className="text-lg" />
                    <span>Phone Number</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="PhoneNumber"
                    className={`w-full p-4 rounded-xl border-2 transition-all duration-300 
                      bg-white/50 backdrop-blur-sm text-[#3A2E2E] font-medium
                      placeholder-[#3A2E2E]/50 focus:outline-none focus:ring-2 focus:ring-[#D4A373]/50
                      ${errors.mobileno 
                        ? 'border-red-300 focus:border-red-400' 
                        : 'border-[#D4A373]/30 focus:border-[#D4A373] hover:border-[#D4A373]/50'
                      }`}
                    type="tel"
                    name="mobileno"
                    value={formData.mobileno}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                  />
                  {errors.mobileno && (
                    <p className="text-red-500 text-sm mt-1">{errors.mobileno}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-[#3A2E2E] font-medium text-base" htmlFor="AddressOf">
                    Address Label
                  </label>
                  <input
                    id="AddressOf"
                    className="w-full p-4 rounded-xl border-2 border-[#D4A373]/30 
                      focus:border-[#D4A373] hover:border-[#D4A373]/50 transition-all duration-300 
                      bg-white/50 backdrop-blur-sm text-[#3A2E2E] font-medium
                      placeholder-[#3A2E2E]/50 focus:outline-none focus:ring-2 focus:ring-[#D4A373]/50"
                    type="text"
                    name="addressOf"
                    value={formData.addressOf}
                    onChange={handleChange}
                    placeholder="e.g., Home, Office, Other"
                  />
                </div>
              </div>
            </div>

            {/* Address Information Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-[#D4A373]/20 rounded-full flex items-center justify-center">
                  <LocationOnOutlinedIcon className="text-[#3A2E2E]" />
                </div>
                <h3 className="font-headings text-[#3A2E2E] text-2xl font-semibold">Address Details</h3>
              </div>

              {/* Flat Number and Building */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[#3A2E2E] font-medium text-base flex items-center space-x-2" htmlFor="FlatNumber">
                    <HomeOutlinedIcon className="text-lg" />
                    <span>Flat/House Number</span>
                  </label>
                  <input
                    id="FlatNumber"
                    className="w-full p-4 rounded-xl border-2 border-[#D4A373]/30 
                      focus:border-[#D4A373] hover:border-[#D4A373]/50 transition-all duration-300 
                      bg-white/50 backdrop-blur-sm text-[#3A2E2E] font-medium
                      placeholder-[#3A2E2E]/50 focus:outline-none focus:ring-2 focus:ring-[#D4A373]/50"
                    type="text"
                    name="flatNumber"
                    value={formData.flatNumber}
                    onChange={handleChange}
                    placeholder="Enter flat/house number"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[#3A2E2E] font-medium text-base flex items-center space-x-2" htmlFor="BuildingName">
                    <BusinessOutlinedIcon className="text-lg" />
                    <span>Building Name/Number</span>
                  </label>
                  <input
                    id="BuildingName"
                    className="w-full p-4 rounded-xl border-2 border-[#D4A373]/30 
                      focus:border-[#D4A373] hover:border-[#D4A373]/50 transition-all duration-300 
                      bg-white/50 backdrop-blur-sm text-[#3A2E2E] font-medium
                      placeholder-[#3A2E2E]/50 focus:outline-none focus:ring-2 focus:ring-[#D4A373]/50"
                    type="text"
                    name="building"
                    value={formData.building}
                    onChange={handleChange}
                    placeholder="Enter building name/number"
                  />
                </div>
              </div>

              {/* Street */}
              <div className="space-y-2">
                <label className="text-[#3A2E2E] font-medium text-base flex items-center space-x-2" htmlFor="Street">
                  {/* <RoadIcon className="text-lg" /> */}
                  <span>Street Address</span>
                </label>
                <input
                  id="Street"
                  className="w-full p-4 rounded-xl border-2 border-[#D4A373]/30 
                    focus:border-[#D4A373] hover:border-[#D4A373]/50 transition-all duration-300 
                    bg-white/50 backdrop-blur-sm text-[#3A2E2E] font-medium
                    placeholder-[#3A2E2E]/50 focus:outline-none focus:ring-2 focus:ring-[#D4A373]/50"
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  placeholder="Enter street address"
                />
              </div>

              {/* City, State, PIN Code */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[#3A2E2E] font-medium text-base flex items-center space-x-2" htmlFor="City">
                    <LocationCityIcon className="text-lg" />
                    <span>City</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="City"
                    className={`w-full p-4 rounded-xl border-2 transition-all duration-300 
                      bg-white/50 backdrop-blur-sm text-[#3A2E2E] font-medium
                      placeholder-[#3A2E2E]/50 focus:outline-none focus:ring-2 focus:ring-[#D4A373]/50
                      ${errors.city 
                        ? 'border-red-300 focus:border-red-400' 
                        : 'border-[#D4A373]/30 focus:border-[#D4A373] hover:border-[#D4A373]/50'
                      }`}
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter your city"
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-[#3A2E2E] font-medium text-base flex items-center space-x-2" htmlFor="State">
                    <PublicIcon className="text-lg" />
                    <span>State</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="State"
                    className={`w-full p-4 rounded-xl border-2 transition-all duration-300 
                      bg-white/50 backdrop-blur-sm text-[#3A2E2E] font-medium
                      placeholder-[#3A2E2E]/50 focus:outline-none focus:ring-2 focus:ring-[#D4A373]/50
                      ${errors.state 
                        ? 'border-red-300 focus:border-red-400' 
                        : 'border-[#D4A373]/30 focus:border-[#D4A373] hover:border-[#D4A373]/50'
                      }`}
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Enter your state"
                  />
                  {errors.state && (
                    <p className="text-red-500 text-sm mt-1">{errors.state}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-[#3A2E2E] font-medium text-base flex items-center space-x-2" htmlFor="PinCode">
                    <PinDropOutlinedIcon className="text-lg" />
                    <span>PIN Code</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="PinCode"
                    className={`w-full p-4 rounded-xl border-2 transition-all duration-300 
                      bg-white/50 backdrop-blur-sm text-[#3A2E2E] font-medium
                      placeholder-[#3A2E2E]/50 focus:outline-none focus:ring-2 focus:ring-[#D4A373]/50
                      ${errors.pinCode 
                        ? 'border-red-300 focus:border-red-400' 
                        : 'border-[#D4A373]/30 focus:border-[#D4A373] hover:border-[#D4A373]/50'
                      }`}
                    type="number"
                    name="pinCode"
                    value={formData.pinCode}
                    onChange={handleChange}
                    placeholder="Enter PIN code"
                  />
                  {errors.pinCode && (
                    <p className="text-red-500 text-sm mt-1">{errors.pinCode}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Error Message */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-center">
                {errors.submit}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-8">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="flex-1 group relative bg-[#3A2E2E] text-[#EADBC8] font-semibold 
                  py-4 px-8 rounded-xl transition-all duration-300 
                  hover:bg-[#2C2C2C] hover:shadow-xl hover:shadow-[#3A2E2E]/30 
                  transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed
                  focus:outline-none focus:ring-2 focus:ring-[#D4A373]/50"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-3">
                    <div className="w-5 h-5 border-2 border-[#EADBC8]/30 border-t-[#EADBC8] rounded-full animate-spin"></div>
                    <span>Saving Address...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-3">
                    <span>Save Address</span>
                    <LocationOnOutlinedIcon className="transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                )}
              </button>

              <Link 
                to={from}
                className="flex-1 sm:flex-initial bg-white/80 backdrop-blur-sm text-[#3A2E2E] 
                  font-semibold py-4 px-8 rounded-xl border-2 border-[#D4A373]/30 
                  hover:border-[#D4A373] hover:bg-white transition-all duration-300 
                  transform hover:scale-[1.02] text-center flex items-center justify-center space-x-2
                  focus:outline-none focus:ring-2 focus:ring-[#D4A373]/50"
              >
                <span>Back to {from === '/' ? 'Home' : 'Previous Page'}</span>
              </Link>
            </div>

            {/* Help Text */}
            <div className="text-center pt-6 border-t border-[#D4A373]/20">
              <p className="text-[#3A2E2E]/60 text-sm leading-relaxed">
                Your address information is securely stored and will only be used for delivery purposes. 
                <Link to="/privacy" className="text-[#D4A373] hover:text-[#3A2E2E] transition-colors duration-300 ml-1">
                  Learn more about our privacy policy.
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Security Badge */}
        <div className="text-center mt-8">
          <div className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-sm 
            px-4 py-2 rounded-full border border-[#D4A373]/30">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-[#3A2E2E]/70 text-sm font-medium">Secure & Encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Address;