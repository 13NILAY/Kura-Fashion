import React, { useState, useEffect } from 'react';
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PercentIcon from '@mui/icons-material/Percent';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

const AddCoupon = () => {
  const axiosPrivate = useAxiosPrivate();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discount: 0,
    minOrderValue: 0,
    maxDiscountValue: 0,
    expirationDate: '',
    isActive: true,
    applicableTo: []
  });

  const [deliverySettings, setDeliverySettings] = useState({
    type: 'FIXED',
    minOrderForFreeDelivery: 0,
    standardDeliveryCharge: 0
  });

  // Fetch all coupons
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        setLoading(true);
        const response = await axiosPrivate.get('/coupon');
        setCoupons(response.data);
      } catch (err) {
        console.error('Error fetching coupons:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, []);

  // Fetch delivery settings
  useEffect(() => {
    const fetchDeliverySettings = async () => {
      try {
        const response = await axiosPrivate.get('/delivery');
        if (response.data) {
          setDeliverySettings(response.data);
        }
      } catch (err) {
        console.error('Error fetching delivery settings:', err);
      }
    };

    fetchDeliverySettings();
  }, []);

  // Handle form submission for adding a new coupon
  const handleAddCoupon = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await axiosPrivate.post('/coupon', 
        JSON.stringify(newCoupon),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      
      setCoupons([...coupons, response.data.coupon]);
      setNewCoupon({ 
        code: '', 
        discount: 0, 
        minOrderValue: 0, 
        maxDiscountValue: 0, 
        expirationDate: '', 
        isActive: true, 
        applicableTo: [] 
      });
    } catch (err) {
      console.error('Error adding coupon:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete coupon
  const handleDeleteCoupon = async (id) => {
    try {
      await axiosPrivate.delete(`/coupon/${id}`);
      setCoupons(coupons.filter(coupon => coupon._id !== id));
    } catch (err) {
      console.error('Error deleting coupon:', err);
    }
  };

  // Handle delivery settings update
  const handleDeliverySettingsUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosPrivate.post('/delivery/update', 
        JSON.stringify(deliverySettings),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      if (response.status === 201) {
        alert('Delivery settings updated successfully');
      }
    } catch (err) {
      console.error('Error updating delivery settings:', err);
      alert('Error updating delivery settings');
    }
  };

  const getDeliveryTypeLabel = (type) => {
    switch(type) {
      case 'FREE_ALL': return 'Free Delivery for All Orders';
      case 'FREE_ABOVE': return 'Free Delivery Above Minimum Order';
      case 'FIXED': return 'Fixed Delivery Charge';
      default: return type;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F5F2] to-[#EADBC8] py-20 px-4 sm:px-8">
      {/* Decorative background elements */}
      <div className="absolute top-20 left-10 w-40 h-40 bg-[#D4A373]/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-[#3A2E2E]/5 rounded-full blur-3xl animate-pulse" 
        style={{animationDelay: '2s'}}></div>

      <div className="container mx-auto relative space-y-16">
        {/* Page Header */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-0.5 bg-[#D4A373]"></div>
            <span className="mx-4 text-[#3A2E2E]/60 text-sm font-medium tracking-widest uppercase">
              Admin Dashboard
            </span>
            <div className="w-16 h-0.5 bg-[#D4A373]"></div>
          </div>
          <h1 className="font-headings text-[#3A2E2E] text-4xl sm:text-5xl font-light mb-4">
            Coupon & Delivery
            <span className="block text-[#D4A373] font-normal">Management</span>
          </h1>
          <p className="text-lg text-[#3A2E2E]/70 max-w-2xl mx-auto">
            Manage promotional offers and delivery settings for your premium store
          </p>
        </div>

        {/* Add New Coupon Section */}
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-3 mb-4">
              <LocalOfferIcon className="text-[#D4A373] text-3xl" />
              <h2 className="font-headings text-[#3A2E2E] text-2xl font-semibold">
                Create New Coupon
              </h2>
            </div>
            <div className="w-20 h-0.5 bg-[#D4A373] mx-auto"></div>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/30">
            <form onSubmit={handleAddCoupon} className="space-y-6">
              {/* Coupon Code */}
              <div className="group">
                <label className="block text-lg font-semibold mb-3 text-[#3A2E2E]" htmlFor="code">
                  Coupon Code
                </label>
                <input
                  className="w-full px-4 py-3 text-[#3A2E2E] bg-white/80 border-2 border-[#D4A373]/30 
                    rounded-xl focus:outline-none focus:border-[#3A2E2E] focus:bg-white
                    transition-all duration-300 placeholder-[#3A2E2E]/50 uppercase"
                  type="text"
                  id="code"
                  name="code"
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                  placeholder="e.g., KURA20, PREMIUM50"
                  required
                />
              </div>

              {/* Two Column Layout for Numbers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Discount Percentage */}
                <div className="group">
                  <label className="block text-lg font-semibold mb-3 text-[#3A2E2E]" htmlFor="discount">
                    Discount Percentage
                  </label>
                  <div className="relative">
                    <input
                      className="w-full pl-12 pr-4 py-3 text-[#3A2E2E] bg-white/80 border-2 border-[#D4A373]/30 
                        rounded-xl focus:outline-none focus:border-[#3A2E2E] focus:bg-white
                        transition-all duration-300 placeholder-[#3A2E2E]/50"
                      type="number"
                      id="discount"
                      name="discount"
                      value={newCoupon.discount}
                      onChange={(e) => setNewCoupon({ ...newCoupon, discount: e.target.value })}
                      placeholder="Enter discount %"
                      required
                    />
                    <PercentIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4A373]" />
                  </div>
                </div>

                {/* Min Order Value */}
                <div className="group">
                  <label className="block text-lg font-semibold mb-3 text-[#3A2E2E]" htmlFor="minOrderValue">
                    Minimum Order Value
                  </label>
                  <div className="relative">
                    <input
                      className="w-full pl-12 pr-4 py-3 text-[#3A2E2E] bg-white/80 border-2 border-[#D4A373]/30 
                        rounded-xl focus:outline-none focus:border-[#3A2E2E] focus:bg-white
                        transition-all duration-300 placeholder-[#3A2E2E]/50"
                      type="number"
                      id="minOrderValue"
                      name="minOrderValue"
                      value={newCoupon.minOrderValue}
                      onChange={(e) => setNewCoupon({ ...newCoupon, minOrderValue: e.target.value })}
                      placeholder="Minimum order ₹"
                      required
                    />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4A373] font-semibold">₹</span>
                  </div>
                </div>

                {/* Max Discount Value */}
                <div className="group">
                  <label className="block text-lg font-semibold mb-3 text-[#3A2E2E]" htmlFor="maxDiscountValue">
                    Maximum Discount Value
                  </label>
                  <div className="relative">
                    <input
                      className="w-full pl-12 pr-4 py-3 text-[#3A2E2E] bg-white/80 border-2 border-[#D4A373]/30 
                        rounded-xl focus:outline-none focus:border-[#3A2E2E] focus:bg-white
                        transition-all duration-300 placeholder-[#3A2E2E]/50"
                      type="number"
                      id="maxDiscountValue"
                      name="maxDiscountValue"
                      value={newCoupon.maxDiscountValue}
                      onChange={(e) => setNewCoupon({ ...newCoupon, maxDiscountValue: e.target.value })}
                      placeholder="Max discount ₹"
                      required
                    />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4A373] font-semibold">₹</span>
                  </div>
                </div>

                {/* Expiration Date */}
                <div className="group">
                  <label className="block text-lg font-semibold mb-3 text-[#3A2E2E]" htmlFor="expirationDate">
                    Expiration Date
                  </label>
                  <input
                    className="w-full px-4 py-3 text-[#3A2E2E] bg-white/80 border-2 border-[#D4A373]/30 
                      rounded-xl focus:outline-none focus:border-[#3A2E2E] focus:bg-white
                      transition-all duration-300"
                    type="date"
                    id="expirationDate"
                    name="expirationDate"
                    value={newCoupon.expirationDate}
                    onChange={(e) => setNewCoupon({ ...newCoupon, expirationDate: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Active Status */}
              <div className="group">
                <label className="block text-lg font-semibold mb-3 text-[#3A2E2E]" htmlFor="isActive">
                  Coupon Status
                </label>
                <select
                  className="w-full px-4 py-3 text-[#3A2E2E] bg-white/80 border-2 border-[#D4A373]/30 
                    rounded-xl focus:outline-none focus:border-[#3A2E2E] focus:bg-white
                    transition-all duration-300"
                  id="isActive"
                  name="isActive"
                  value={newCoupon.isActive}
                  onChange={(e) => setNewCoupon({ ...newCoupon, isActive: e.target.value === 'true' })}
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>

              {/* Submit Button */}
              <div className="text-center pt-6">
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="group relative inline-flex items-center px-12 py-4 
                    bg-[#3A2E2E] text-[#EADBC8] font-semibold font-headings rounded-full 
                    transition-all duration-300 hover:bg-[#2C2C2C] hover:shadow-2xl 
                    hover:shadow-[#3A2E2E]/30 transform hover:scale-105 
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-[#EADBC8]/30 border-t-[#EADBC8] 
                        rounded-full animate-spin mr-3"></div>
                      <span>Creating Coupon...</span>
                    </>
                  ) : (
                    <>
                      <LocalOfferIcon className="mr-3 text-xl" />
                      <span className="text-lg">Create Coupon</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Existing Coupons Section */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="font-headings text-[#3A2E2E] text-2xl font-semibold mb-4">
              Active Coupons
            </h2>
            <div className="w-20 h-0.5 bg-[#D4A373] mx-auto"></div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg 
                  border border-white/30 animate-pulse">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-8 bg-[#D4A373]/20 rounded-lg w-32"></div>
                    <div className="h-6 bg-[#3A2E2E]/20 rounded-full w-16"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 bg-[#3A2E2E]/15 rounded w-full"></div>
                    <div className="h-4 bg-[#3A2E2E]/15 rounded w-3/4"></div>
                    <div className="h-4 bg-[#3A2E2E]/15 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : coupons.length === 0 ? (
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-12 text-center 
              shadow-lg border border-white/30 max-w-md mx-auto">
              <LocalOfferIcon className="text-6xl text-[#D4A373]/50 mb-4" />
              <p className="text-[#3A2E2E]/70 text-lg">No coupons created yet</p>
              <p className="text-[#3A2E2E]/50 text-sm mt-2">Create your first promotional coupon above</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {coupons.map(coupon => (
                <div key={coupon._id} className="group bg-white/60 backdrop-blur-sm rounded-2xl p-6 
                  shadow-lg hover:shadow-2xl border border-white/30 transition-all duration-500 
                  transform hover:scale-[1.02] hover:-translate-y-1">
                  
                  {/* Coupon Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-[#D4A373]/20 rounded-full flex items-center justify-center">
                        <LocalOfferIcon className="text-[#3A2E2E] text-xl" />
                      </div>
                      <div>
                        <h3 className="font-headings text-[#3A2E2E] text-xl font-bold">
                          {coupon.code}
                        </h3>
                        <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                          coupon.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {coupon.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Discount Badge */}
                    <div className="bg-[#3A2E2E] text-[#EADBC8] px-4 py-2 rounded-full font-bold text-lg">
                      {coupon.discount}% OFF
                    </div>
                  </div>

                  {/* Coupon Details */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center py-2 border-b border-[#D4A373]/20">
                      <span className="text-[#3A2E2E]/70 font-medium">Min Order Value:</span>
                      <span className="text-[#3A2E2E] font-semibold">₹{coupon.minOrderValue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-[#D4A373]/20">
                      <span className="text-[#3A2E2E]/70 font-medium">Max Discount:</span>
                      <span className="text-[#3A2E2E] font-semibold">₹{coupon.maxDiscountValue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-[#3A2E2E]/70 font-medium">Expires:</span>
                      <span className="text-[#3A2E2E] font-semibold">
                        {new Date(coupon.expirationDate).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteCoupon(coupon._id)}
                    className="w-full bg-red-50 text-red-600 border border-red-200 py-3 rounded-xl 
                      font-medium transition-all duration-300 hover:bg-red-100 hover:border-red-300
                      hover:shadow-lg transform hover:scale-[1.02] flex items-center justify-center gap-2"
                  >
                    <DeleteOutlineIcon className="text-xl" />
                    Delete Coupon
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Delivery Settings Section */}
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-3 mb-4">
              <DeliveryDiningIcon className="text-[#D4A373] text-3xl" />
              <h2 className="font-headings text-[#3A2E2E] text-2xl font-semibold">
                Delivery Settings
              </h2>
            </div>
            <div className="w-20 h-0.5 bg-[#D4A373] mx-auto"></div>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/30">
            <form onSubmit={handleDeliverySettingsUpdate} className="space-y-6">
              {/* Delivery Type */}
              <div className="group">
                <label className="block text-lg font-semibold mb-3 text-[#3A2E2E]">
                  Delivery Type
                </label>
                <select
                  className="w-full px-4 py-3 text-[#3A2E2E] bg-white/80 border-2 border-[#D4A373]/30 
                    rounded-xl focus:outline-none focus:border-[#3A2E2E] focus:bg-white
                    transition-all duration-300"
                  value={deliverySettings.type}
                  onChange={(e) => setDeliverySettings({...deliverySettings, type: e.target.value})}
                >
                  <option value="FREE_ALL">Free Delivery for All Orders</option>
                  <option value="FREE_ABOVE">Free Delivery Above Minimum Order</option>
                  <option value="FIXED">Fixed Delivery Charge</option>
                </select>
              </div>

              {/* Conditional Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {deliverySettings.type === 'FREE_ABOVE' && (
                  <div className="group">
                    <label className="block text-lg font-semibold mb-3 text-[#3A2E2E]">
                      Min Order for Free Delivery
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        className="w-full pl-12 pr-4 py-3 text-[#3A2E2E] bg-white/80 border-2 border-[#D4A373]/30 
                          rounded-xl focus:outline-none focus:border-[#3A2E2E] focus:bg-white
                          transition-all duration-300"
                        value={deliverySettings.minOrderForFreeDelivery}
                        onChange={(e) => setDeliverySettings({
                          ...deliverySettings,
                          minOrderForFreeDelivery: parseFloat(e.target.value)
                        })}
                        placeholder="Enter amount"
                      />
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4A373] font-semibold">₹</span>
                    </div>
                  </div>
                )}

                {(deliverySettings.type === 'FIXED' || deliverySettings.type === 'FREE_ABOVE') && (
                  <div className="group">
                    <label className="block text-lg font-semibold mb-3 text-[#3A2E2E]">
                      Standard Delivery Charge
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        className="w-full pl-12 pr-4 py-3 text-[#3A2E2E] bg-white/80 border-2 border-[#D4A373]/30 
                          rounded-xl focus:outline-none focus:border-[#3A2E2E] focus:bg-white
                          transition-all duration-300"
                        value={deliverySettings.standardDeliveryCharge}
                        onChange={(e) => setDeliverySettings({
                          ...deliverySettings,
                          standardDeliveryCharge: parseFloat(e.target.value)
                        })}
                        placeholder="Enter charge"
                      />
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4A373] font-semibold">₹</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Update Button */}
              <div className="text-center pt-6">
                <button 
                  type="submit" 
                  className="group relative inline-flex items-center px-12 py-4 
                    bg-[#D4A373] text-[#3A2E2E] font-semibold font-headings rounded-full 
                    transition-all duration-300 hover:bg-[#C4976B] hover:shadow-2xl 
                    hover:shadow-[#D4A373]/30 transform hover:scale-105"
                >
                  <LocalShippingIcon className="mr-3 text-xl" />
                  <span className="text-lg">Update Delivery Settings</span>
                </button>
              </div>
            </form>

            {/* Current Settings Display */}
            <div className="mt-8 bg-[#3A2E2E]/5 rounded-xl p-6 border border-[#D4A373]/20">
              <h4 className="font-headings text-[#3A2E2E] text-lg font-semibold mb-4 flex items-center">
                <CheckCircleIcon className="mr-2 text-[#D4A373]" />
                Current Configuration
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2">
                  <span className="text-[#3A2E2E]/70 font-medium">Delivery Type:</span>
                  <span className="text-[#3A2E2E] font-semibold">
                    {getDeliveryTypeLabel(deliverySettings.type)}
                  </span>
                </div>
                {deliverySettings.type === 'FREE_ABOVE' && (
                  <div className="flex justify-between items-center py-2">
                    <span className="text-[#3A2E2E]/70 font-medium">Free Delivery Threshold:</span>
                    <span className="text-[#3A2E2E] font-semibold">
                      ₹{deliverySettings.minOrderForFreeDelivery?.toLocaleString()}
                    </span>
                  </div>
                )}
                {(deliverySettings.type === 'FIXED' || deliverySettings.type === 'FREE_ABOVE') && (
                  <div className="flex justify-between items-center py-2">
                    <span className="text-[#3A2E2E]/70 font-medium">Standard Charge:</span>
                    <span className="text-[#3A2E2E] font-semibold">
                      ₹{deliverySettings.standardDeliveryCharge?.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCoupon;