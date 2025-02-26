import React, { useState, useEffect } from 'react';
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate';

const AddCoupon = () => {
  const axiosPrivate =useAxiosPrivate();
  const [coupons, setCoupons] = useState([]);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discount: 0,
    minOrderValue: 0,
    maxDiscountValue: 0,
    expirationDate: '',
    isActive: true,
    applicableTo: [] // This will be an array (e.g. categories or product IDs)
  });

  // Add new states for delivery settings
  const [deliverySettings, setDeliverySettings] = useState({
    type: 'FIXED',
    minOrderForFreeDelivery: 0,
    standardDeliveryCharge: 0
  });

  // Fetch all coupons
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await axiosPrivate.get('/coupon');
        setCoupons(response.data);
      } catch (err) {
        console.error('Error fetching coupons:', err);
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

    try {
      const response = await axiosPrivate.post('/coupon', 
        JSON.stringify(newCoupon),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      console.log(response);
      setCoupons([...coupons, response.data.coupon]);
      setNewCoupon({ code: '', discount: 0, minOrderValue: 0, maxDiscountValue: 0, expirationDate: '', isActive: true, applicableTo: [] });
    } catch (err) {
      console.error('Error adding coupon:', err);
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

  return (
    <div className="mt-20 px-sectionPadding max-md:px-mobileScreenPadding pt-10 font-texts">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Manage Coupons
      </h1>

      {/* Add new coupon form */}
      <div className="w-full max-w-2xl mx-auto bg-[#f9f4f1] p-8 rounded-lg shadow-lg">
        <form onSubmit={handleAddCoupon}>
          <div className="mb-6">
            <label className="block text-lg font-semibold mb-2 text-[#5c4033]" htmlFor="code">
              Coupon Code:
            </label>
            <input
              className="block w-full text-sm text-[#40322e] border border-[#5c4033] rounded-lg p-2 focus:outline-none focus:ring focus:border-blue-300"
              type="text"
              id="code"
              name="code"
              value={newCoupon.code}
              onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
              placeholder="Enter coupon code"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-lg font-semibold mb-2 text-[#5c4033]" htmlFor="discount">
              Discount Percentage(Only Enter Number):
            </label>
            <input
              className="block w-full text-sm text-[#40322e] border border-[#5c4033] rounded-lg p-2 focus:outline-none focus:ring focus:border-blue-300"
              type="number"
              id="discount"
              name="discount"
              value={newCoupon.discount}
              onChange={(e) => setNewCoupon({ ...newCoupon, discount: e.target.value })}
              placeholder="Enter discount amount"
              required
            />
          </div>

          {/* Min Order Value */}
          <div className="mb-6">
            <label className="block text-lg font-semibold mb-2 text-[#5c4033]" htmlFor="minOrderValue">
              Minimum Order Value:
            </label>
            <input
              className="block w-full text-sm text-[#40322e] border border-[#5c4033] rounded-lg p-2 focus:outline-none focus:ring focus:border-blue-300"
              type="number"
              id="minOrderValue"
              name="minOrderValue"
              value={newCoupon.minOrderValue}
              onChange={(e) => setNewCoupon({ ...newCoupon, minOrderValue: e.target.value })}
              placeholder="Enter minimum order value"
              required
            />
          </div>

          {/* Max Discount Value */}
          <div className="mb-6">
            <label className="block text-lg font-semibold mb-2 text-[#5c4033]" htmlFor="maxDiscountValue">
              Maximum Discount Value:
            </label>
            <input
              className="block w-full text-sm text-[#40322e] border border-[#5c4033] rounded-lg p-2 focus:outline-none focus:ring focus:border-blue-300"
              type="number"
              id="maxDiscountValue"
              name="maxDiscountValue"
              value={newCoupon.maxDiscountValue}
              onChange={(e) => setNewCoupon({ ...newCoupon, maxDiscountValue: e.target.value })}
              placeholder="Enter maximum discount value"
              required
            />
          </div>

          {/* Expiration Date */}
          <div className="mb-6">
            <label className="block text-lg font-semibold mb-2 text-[#5c4033]" htmlFor="expirationDate">
              Expiration Date:
            </label>
            <input
              className="block w-full text-sm text-[#40322e] border border-[#5c4033] rounded-lg p-2 focus:outline-none focus:ring focus:border-blue-300"
              type="date"
              id="expirationDate"
              name="expirationDate"
              value={newCoupon.expirationDate}
              onChange={(e) => setNewCoupon({ ...newCoupon, expirationDate: e.target.value })}
              required
            />
          </div>

          {/* Active Status */}
          <div className="mb-6">
            <label className="block text-lg font-semibold mb-2 text-[#5c4033]" htmlFor="isActive">
              Is Active:
            </label>
            <select
              className="block w-full text-sm text-[#40322e] border border-[#5c4033] rounded-lg p-2 focus:outline-none focus:ring focus:border-blue-300"
              id="isActive"
              name="isActive"
              value={newCoupon.isActive}
              onChange={(e) => setNewCoupon({ ...newCoupon, isActive: e.target.value === 'true' })}
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          {/* Applicable To */}
          {/* <div className="mb-6">
            <label className="block text-lg font-semibold mb-2 text-[#5c4033]" htmlFor="applicableTo">
              Applicable To (Comma-separated categories or product IDs):
            </label>
            <input
              className="block w-full text-sm text-[#40322e] border border-[#5c4033] rounded-lg p-2 focus:outline-none focus:ring focus:border-blue-300"
              type="text"
              id="applicableTo"
              name="applicableTo"
              value={newCoupon.applicableTo.join(',')}
              onChange={(e) => setNewCoupon({ ...newCoupon, applicableTo: e.target.value.split(',').map(str => str.trim()) })}
              placeholder="Enter categories or product IDs"
            />
          </div> */}

          <div className="text-center">
            <button type="submit" className="bg-[#5c4033] text-[#fff7ec] font-bold py-2 px-4 rounded-lg shadow hover:bg-[#6a4c39]">
              Add Coupon
            </button>
          </div>
        </form>
      </div>

      {/* Display existing coupons */}
      <div className="mt-10 w-full max-w-2xl mx-auto bg-[#f9f4f1] p-8 rounded-lg shadow-lg">
        <h3 className="text-2xl font-bold mb-6 text-center">Existing Coupons</h3>
        {coupons.length === 0 ? (
          <p className="text-center">No coupons available.</p>
        ) : (
          <ul className="space-y-4">
            {coupons.map(coupon => (
              <li key={coupon._id} className="border p-4 rounded-lg shadow-md">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-lg font-semibold text-[#5c4033]"><strong>Code:</strong> {coupon.code}</p>
                    <p className="text-sm text-[#40322e]"><strong>Discount:</strong> ₹{coupon.discount}</p>
                    <p className="text-sm text-[#40322e]"><strong>Min Order Value:</strong> ₹{coupon.minOrderValue}</p>
                    <p className="text-sm text-[#40322e]"><strong>Max Discount Value:</strong> ₹{coupon.maxDiscountValue}</p>
                    <p className="text-sm text-[#40322e]"><strong>Expires:</strong> {new Date(coupon.expirationDate).toLocaleDateString()}</p>
                    <p className="text-sm text-[#40322e]"><strong>Is Active:</strong> {coupon.isActive ? 'Yes' : 'No'}</p>
                    {/* <p className="text-sm text-[#40322e]"><strong>Applicable To:</strong> {coupon.applicableTo.join(', ')}</p> */}
                  </div>
                  <button
                    onClick={() => handleDeleteCoupon(coupon._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg shadow hover:bg-red-600">
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Delivery Settings Section */}
      <div className="mt-10 w-full max-w-2xl mx-auto bg-[#f9f4f1] p-8 rounded-lg shadow-lg">
        <h3 className="text-2xl font-bold mb-6 text-center">Delivery Settings</h3>
        <form onSubmit={handleDeliverySettingsUpdate}>
          <div className="mb-6">
            <label className="block text-lg font-semibold mb-2 text-[#5c4033]">
              Delivery Type:
            </label>
            <select
              className="block w-full text-sm text-[#40322e] border border-[#5c4033] rounded-lg p-2 focus:outline-none focus:ring focus:border-blue-300"
              value={deliverySettings.type}
              onChange={(e) => setDeliverySettings({...deliverySettings, type: e.target.value})}
            >
              <option value="FREE_ALL">Free Delivery for All Orders</option>
              <option value="FREE_ABOVE">Free Delivery Above Minimum Order</option>
              <option value="FIXED">Fixed Delivery Charge</option>
            </select>
          </div>

          {deliverySettings.type === 'FREE_ABOVE' && (
            <div className="mb-6">
              <label className="block text-lg font-semibold mb-2 text-[#5c4033]">
                Minimum Order for Free Delivery (₹):
              </label>
              <input
                type="number"
                className="block w-full text-sm text-[#40322e] border border-[#5c4033] rounded-lg p-2 focus:outline-none focus:ring focus:border-blue-300"
                value={deliverySettings.minOrderForFreeDelivery}
                onChange={(e) => setDeliverySettings({
                  ...deliverySettings,
                  minOrderForFreeDelivery: parseFloat(e.target.value)
                })}
              />
            </div>
          )}

          {(deliverySettings.type === 'FIXED' || deliverySettings.type === 'FREE_ABOVE') && (
            <div className="mb-6">
              <label className="block text-lg font-semibold mb-2 text-[#5c4033]">
                Standard Delivery Charge (₹):
              </label>
              <input
                type="number"
                className="block w-full text-sm text-[#40322e] border border-[#5c4033] rounded-lg p-2 focus:outline-none focus:ring focus:border-blue-300"
                value={deliverySettings.standardDeliveryCharge}
                onChange={(e) => setDeliverySettings({
                  ...deliverySettings,
                  standardDeliveryCharge: parseFloat(e.target.value)
                })}
              />
            </div>
          )}

          <div className="text-center">
            <button type="submit" className="bg-[#5c4033] text-[#fff7ec] font-bold py-2 px-4 rounded-lg shadow hover:bg-[#6a4c39]">
              Update Delivery Settings
            </button>
          </div>
        </form>

        {/* Current Settings Display */}
        <div className="mt-6 p-4 bg-white rounded-lg">
          <h4 className="font-semibold mb-2">Current Settings:</h4>
          <p><strong>Delivery Type:</strong> {
            deliverySettings.type === 'FREE_ALL' ? 'Free Delivery for All Orders' :
            deliverySettings.type === 'FREE_ABOVE' ? 'Free Delivery Above Minimum Order' :
            'Fixed Delivery Charge'
          }</p>
          {deliverySettings.type === 'FREE_ABOVE' && (
            <p><strong>Minimum Order for Free Delivery:</strong> ₹{deliverySettings.minOrderForFreeDelivery}</p>
          )}
          {(deliverySettings.type === 'FIXED' || deliverySettings.type === 'FREE_ABOVE') && (
            <p><strong>Standard Delivery Charge:</strong> ₹{deliverySettings.standardDeliveryCharge}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddCoupon;
