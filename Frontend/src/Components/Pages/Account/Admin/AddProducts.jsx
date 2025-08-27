import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import { ChromePicker } from 'react-color';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import PaletteIcon from '@mui/icons-material/Palette';
import StraightenIcon from '@mui/icons-material/Straighten';
import CategoryIcon from '@mui/icons-material/Category';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DescriptionIcon from '@mui/icons-material/Description';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const AddProducts = () => {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const [images, setImages] = useState([]);
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [colors, setColors] = useState(() => {
    const savedColors = localStorage.getItem('productFormColors');
    return savedColors ? JSON.parse(savedColors) : [{ colorCode: '#000000' }];
  });
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const [showColorPicker, setShowColorPicker] = useState(null);
  const [formData, setFormData] = useState(() => {
    const savedForm = localStorage.getItem('productFormData');
    return savedForm ? JSON.parse(savedForm) : {
      name: "",
      description: "",
      categoryName: "",
      sizes: [""],
      currency: "INR",
      value: "",
      frontPicture: "",
      picture: "",
      colors: colors,
    };
  });

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('productFormData', JSON.stringify(formData));
  }, [formData]);

  // Save colors to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('productFormColors', JSON.stringify(colors));
  }, [colors]);

  // Clear localStorage after successful submission
  const clearStoredData = () => {
    localStorage.removeItem('productFormData');
    localStorage.removeItem('productFormColors');
  };

  // Show notification helper
  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 4000);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosPrivate.get("/Category/all");
        setCategories(response.data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        showNotification("Failed to fetch categories", "error");
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSingleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleFileChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleArrayChange = (e, index, field) => {
    const newArray = [...formData[field]];
    newArray[index] = e.target.value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayField = (field) => {
    setFormData({ ...formData, [field]: [...formData[field], ""] });
  };

  const removeArrayField = (index, field) => {
    if (formData[field].length > 1) {
      const newArray = formData[field].filter((_, i) => i !== index);
      setFormData({ ...formData, [field]: newArray });
    }
  };

  const handleColorChange = (color, index) => {
    const newColors = [...colors];
    newColors[index].colorCode = color.hex;
    setColors(newColors);
  };

  const addColorField = () => {
    setColors([...colors, { colorCode: '#000000' }]);
  };

  const removeColorField = (index) => {
    if (colors.length > 1) {
      setColors(colors.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Form validation
    if (!formData.name.trim()) {
      showNotification("Please enter a product name", "error");
      return;
    }
    if (!formData.categoryName) {
      showNotification("Please select a category", "error");
      return;
    }
    if (!formData.value) {
      showNotification("Please enter a price", "error");
      return;
    }
    if (!image) {
      showNotification("Please upload a front image", "error");
      return;
    }

    setIsLoading(true);
    try {
      const formData2 = new FormData();
      formData2.append("photo", image);
      const uploadFrontResponse = await axiosPrivate.post("/admin/addSingleImage", formData2, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      const frontImageUrl = uploadFrontResponse.data.fileUrl;

      const formData1 = new FormData();
      images.forEach((img) => {
        formData1.append("photos", img);
      });
      const uploadImagesResponse = await axiosPrivate.post("/admin/addProductImages", formData1, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      const imageUrls = uploadImagesResponse.data.fileUrls;
      
      const finalFormData = {
        ...formData,
        frontPicture: frontImageUrl,
        picture: imageUrls,
        colors: colors.map((color) => color.colorCode),
      };

      const add = await axiosPrivate.post(
        "/admin/addProduct",
        JSON.stringify(finalFormData),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );

      if (add.status === 201) {
        clearStoredData();
        showNotification("Product added successfully! Redirecting...", "success");
        setTimeout(() => {
          navigate("/shop");
        }, 2000);
      }
    } catch (error) {
      console.error("Error uploading Image:", error);
      showNotification("Failed to add product. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F5F2] to-[#EADBC8] pt-28 px-4 sm:px-8 font-texts relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-20 left-10 w-40 h-40 bg-[#D4A373]/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-[#3A2E2E]/5 rounded-full blur-3xl animate-pulse" 
        style={{animationDelay: '2s'}}></div>

      {/* Notification Toast */}
      {notification.show && (
        <div className={`fixed top-24 right-6 z-50 flex items-center p-4 rounded-xl shadow-2xl backdrop-blur-sm border transition-all duration-500 transform ${
          notification.show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        } ${
          notification.type === 'success' 
            ? 'bg-green-50/90 border-green-200 text-green-800' 
            : 'bg-red-50/90 border-red-200 text-red-800'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircleIcon className="mr-3 text-green-600" />
          ) : (
            <ErrorOutlineIcon className="mr-3 text-red-600" />
          )}
          <span className="font-medium">{notification.message}</span>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-[#3A2E2E]/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-white/30 text-center">
            <div className="relative mb-6">
              <div className="w-16 h-16 border-4 border-[#D4A373]/30 border-t-[#3A2E2E] rounded-full animate-spin mx-auto"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-b-[#D4A373] rounded-full animate-spin mx-auto" 
                style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
            </div>
            <p className="text-[#3A2E2E] font-headings text-xl font-semibold mb-2">Processing Your Product</p>
            <p className="text-[#3A2E2E]/70">Uploading images and creating listing...</p>
          </div>
        </div>
      )}

      <div className="container mx-auto max-w-4xl">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-0.5 bg-[#D4A373]"></div>
            <ShoppingBagOutlinedIcon className="mx-4 text-4xl text-[#D4A373]" />
            <div className="w-16 h-0.5 bg-[#D4A373]"></div>
          </div>
          
          <h1 className="font-headings text-[#3A2E2E] text-4xl sm:text-5xl lg:text-6xl font-light mb-4 leading-tight">
            Add New
            <span className="block text-[#D4A373] font-normal">Product</span>
          </h1>
          
          <p className="text-lg text-[#3A2E2E]/70 max-w-2xl mx-auto leading-relaxed">
            Create a premium listing for your curated fashion collection
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 sm:p-10 space-y-8">
            
            {/* Images Section */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Front Image Upload */}
              <div className="space-y-4">
                <div className="flex items-center mb-4">
                  <AddPhotoAlternateIcon className="text-[#D4A373] mr-3 text-xl" />
                  <label className="font-headings text-[#3A2E2E] text-lg font-semibold">
                    Front Image *
                  </label>
                </div>
                <div className="relative">
                  <input
                    id="FrontPicture"
                    className="hidden"
                    type="file"
                    accept="image/*"
                    onChange={handleSingleFileChange}
                  />
                  <label 
                    htmlFor="FrontPicture"
                    className="group block w-full p-8 border-2 border-dashed border-[#D4A373]/40 
                      rounded-xl cursor-pointer transition-all duration-300 
                      hover:border-[#D4A373] hover:bg-[#D4A373]/5 bg-white/40"
                  >
                    <div className="text-center">
                      <CloudUploadIcon className="text-4xl text-[#D4A373] mb-4 mx-auto group-hover:scale-110 transition-transform duration-300" />
                      <p className="text-[#3A2E2E] font-medium mb-2">
                        {image ? image.name : "Upload Front Image"}
                      </p>
                      <p className="text-[#3A2E2E]/60 text-sm">
                        PNG, JPG up to 10MB
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Additional Images Upload */}
              <div className="space-y-4">
                <div className="flex items-center mb-4">
                  <AddPhotoAlternateIcon className="text-[#D4A373] mr-3 text-xl" />
                  <label className="font-headings text-[#3A2E2E] text-lg font-semibold">
                    Additional Images
                  </label>
                </div>
                <div className="relative">
                  <input
                    id="picture"
                    className="hidden"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                  />
                  <label 
                    htmlFor="picture"
                    className="group block w-full p-8 border-2 border-dashed border-[#D4A373]/40 
                      rounded-xl cursor-pointer transition-all duration-300 
                      hover:border-[#D4A373] hover:bg-[#D4A373]/5 bg-white/40"
                  >
                    <div className="text-center">
                      <CloudUploadIcon className="text-4xl text-[#D4A373] mb-4 mx-auto group-hover:scale-110 transition-transform duration-300" />
                      <p className="text-[#3A2E2E] font-medium mb-2">
                        {images.length > 0 ? `${images.length} files selected` : "Upload Gallery Images"}
                      </p>
                      <p className="text-[#3A2E2E]/60 text-sm">
                        Multiple files supported
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Product Info Grid */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Product Name */}
              <div className="space-y-3">
                <div className="flex items-center">
                  <ShoppingBagOutlinedIcon className="text-[#D4A373] mr-3 text-xl" />
                  <label className="font-headings text-[#3A2E2E] text-lg font-semibold">
                    Product Name *
                  </label>
                </div>
                <input
                  className="w-full px-6 py-4 bg-white/70 backdrop-blur-sm border-2 border-[#D4A373]/30 
                    rounded-xl text-[#3A2E2E] placeholder-[#3A2E2E]/50 
                    focus:outline-none focus:border-[#D4A373] focus:bg-white/90 
                    transition-all duration-300 text-lg"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter product title..."
                />
              </div>

              {/* Category Selection */}
              <div className="space-y-3">
                <div className="flex items-center">
                  <CategoryIcon className="text-[#D4A373] mr-3 text-xl" />
                  <label className="font-headings text-[#3A2E2E] text-lg font-semibold">
                    Category *
                  </label>
                </div>
                <div className="relative">
                  <select
                    className="w-full px-6 py-4 bg-white/70 backdrop-blur-sm border-2 border-[#D4A373]/30 
                      rounded-xl text-[#3A2E2E] focus:outline-none focus:border-[#D4A373] 
                      focus:bg-white/90 transition-all duration-300 text-lg appearance-none"
                    name="categoryName"
                    value={formData.categoryName}
                    onChange={handleChange}
                  >
                    <option value="" disabled>Select a category</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category.categoryName}>
                        {category.categoryName}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-[#D4A373]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <div className="flex items-center">
                <DescriptionIcon className="text-[#D4A373] mr-3 text-xl" />
                <label className="font-headings text-[#3A2E2E] text-lg font-semibold">
                  Product Description
                </label>
              </div>
              <textarea
                className="w-full px-6 py-4 bg-white/70 backdrop-blur-sm border-2 border-[#D4A373]/30 
                  rounded-xl text-[#3A2E2E] placeholder-[#3A2E2E]/50 
                  focus:outline-none focus:border-[#D4A373] focus:bg-white/90 
                  transition-all duration-300 text-lg resize-none"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the elegance and craftsmanship..."
                rows="4"
              />
            </div>

            {/* Price */}
            <div className="space-y-3">
              <div className="flex items-center">
                <AttachMoneyIcon className="text-[#D4A373] mr-3 text-xl" />
                <label className="font-headings text-[#3A2E2E] text-lg font-semibold">
                  Price (INR) *
                </label>
              </div>
              <div className="relative">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[#3A2E2E] text-lg font-semibold">₹</span>
                <input
                  className="w-full pl-12 pr-6 py-4 bg-white/70 backdrop-blur-sm border-2 border-[#D4A373]/30 
                    rounded-xl text-[#3A2E2E] placeholder-[#3A2E2E]/50 
                    focus:outline-none focus:border-[#D4A373] focus:bg-white/90 
                    transition-all duration-300 text-lg"
                  type="number"
                  name="value"
                  value={formData.value}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>

            {/* Sizes Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <StraightenIcon className="text-[#D4A373] mr-3 text-xl" />
                  <label className="font-headings text-[#3A2E2E] text-lg font-semibold">
                    Available Sizes
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => addArrayField('sizes')}
                  className="flex items-center px-4 py-2 bg-[#D4A373]/20 text-[#3A2E2E] 
                    rounded-lg hover:bg-[#D4A373]/30 transition-all duration-300 
                    transform hover:scale-105"
                >
                  <AddIcon className="mr-1" />
                  Add Size
                </button>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {formData.sizes.map((size, index) => (
                  <div key={index} className="relative group">
                    <input
                      className="w-full px-4 py-3 bg-white/70 backdrop-blur-sm border-2 border-[#D4A373]/30 
                        rounded-lg text-[#3A2E2E] placeholder-[#3A2E2E]/50 text-center font-medium
                        focus:outline-none focus:border-[#D4A373] focus:bg-white/90 
                        transition-all duration-300"
                      type="text"
                      placeholder={`Size ${index + 1}`}
                      value={size}
                      onChange={(e) => handleArrayChange(e, index, 'sizes')}
                    />
                    {formData.sizes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayField(index, 'sizes')}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-400 text-white rounded-full 
                          flex items-center justify-center opacity-0 group-hover:opacity-100 
                          transition-all duration-200 hover:bg-red-500 transform hover:scale-110"
                      >
                        <RemoveIcon className="text-sm" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Colors Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <PaletteIcon className="text-[#D4A373] mr-3 text-xl" />
                  <label className="font-headings text-[#3A2E2E] text-lg font-semibold">
                    Available Colors
                  </label>
                </div>
                <button
                  type="button"
                  onClick={addColorField}
                  className="flex items-center px-4 py-2 bg-[#D4A373]/20 text-[#3A2E2E] 
                    rounded-lg hover:bg-[#D4A373]/30 transition-all duration-300 
                    transform hover:scale-105"
                >
                  <AddIcon className="mr-1" />
                  Add Color
                </button>
              </div>
              
              <div className="grid gap-6">
                {colors.map((color, index) => (
                  <div key={index} className="group bg-white/50 rounded-xl p-6 border border-[#D4A373]/20">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-6 space-y-4 lg:space-y-0">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium text-[#3A2E2E]">Color {index + 1}</h4>
                          <div className="flex items-center space-x-3">
                            <div 
                              className="w-8 h-8 rounded-full border-2 border-white shadow-lg"
                              style={{ backgroundColor: color.colorCode }}
                            ></div>
                            <span className="text-[#3A2E2E]/70 font-mono text-sm">{color.colorCode}</span>
                            {colors.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeColorField(index)}
                                className="w-8 h-8 bg-red-400 text-white rounded-full 
                                  flex items-center justify-center hover:bg-red-500 
                                  transition-all duration-200 transform hover:scale-110"
                              >
                                <RemoveIcon className="text-sm" />
                              </button>
                            )}
                          </div>
                        </div>
                        
                        <button
                          type="button"
                          onClick={() => setShowColorPicker(showColorPicker === index ? null : index)}
                          className="w-full px-4 py-3 bg-[#3A2E2E] text-[#EADBC8] rounded-lg 
                            hover:bg-[#2C2C2C] transition-all duration-300 font-medium"
                        >
                          {showColorPicker === index ? 'Close Color Picker' : 'Choose Color'}
                        </button>
                      </div>
                      
                      {showColorPicker === index && (
                        <div className="relative">
                          <div className="absolute top-0 right-0 lg:relative lg:top-auto lg:right-auto">
                            <ChromePicker
                              color={color.colorCode}
                              onChangeComplete={(color) => handleColorChange(color, index)}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sizes Section Enhanced */}
            <div className="bg-white/50 rounded-xl p-6 border border-[#D4A373]/20">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <StraightenIcon className="text-[#D4A373] mr-3 text-xl" />
                  <h3 className="font-headings text-[#3A2E2E] text-lg font-semibold">
                    Size Options
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => addArrayField('sizes')}
                  className="flex items-center px-4 py-2 bg-[#D4A373] text-[#3A2E2E] 
                    rounded-lg hover:bg-[#D4A373]/80 transition-all duration-300 
                    transform hover:scale-105 font-medium"
                >
                  <AddIcon className="mr-1" />
                  Add Size
                </button>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                {formData.sizes.map((size, index) => (
                  <div key={index} className="relative group">
                    <input
                      className="w-full px-3 py-3 bg-white/70 backdrop-blur-sm border-2 border-[#D4A373]/30 
                        rounded-lg text-[#3A2E2E] placeholder-[#3A2E2E]/50 text-center font-medium
                        focus:outline-none focus:border-[#D4A373] focus:bg-white/90 
                        transition-all duration-300"
                      type="text"
                      placeholder={`Size ${index + 1}`}
                      value={size}
                      onChange={(e) => handleArrayChange(e, index, 'sizes')}
                    />
                    {formData.sizes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayField(index, 'sizes')}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-400 text-white rounded-full 
                          flex items-center justify-center opacity-0 group-hover:opacity-100 
                          transition-all duration-200 hover:bg-red-500 transform hover:scale-110"
                      >
                        <RemoveIcon className="text-xs" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center pt-8">
              <div className="relative inline-block">
                <div className="absolute -inset-4 bg-gradient-to-r from-[#D4A373]/20 to-[#3A2E2E]/10 
                  rounded-2xl blur-xl transition-all duration-500"></div>
                
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="group relative px-12 py-4 bg-[#3A2E2E] text-[#EADBC8] 
                    font-headings font-semibold text-lg rounded-xl 
                    transition-all duration-300 hover:bg-[#2C2C2C] hover:shadow-2xl 
                    hover:shadow-[#3A2E2E]/30 transform hover:scale-105
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                    flex items-center space-x-3 min-w-[200px] justify-center"
                >
                  {isLoading ? (
                    <>
                      <div className="w-6 h-6 border-2 border-[#EADBC8]/30 border-t-[#EADBC8] rounded-full animate-spin"></div>
                      <span>Creating Product...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircleIcon className="transition-transform duration-300 group-hover:scale-110" />
                      <span>Create Premium Product</span>
                    </>
                  )}
                </button>
              </div>
              
              {/* Secondary Actions */}
              <div className="mt-6 flex justify-center space-x-4">
                <button 
                  type="button"
                  onClick={() => {
                    if (window.confirm("Are you sure you want to clear the form? All unsaved data will be lost.")) {
                      clearStoredData();
                      setFormData({
                        name: "",
                        description: "",
                        categoryName: "",
                        sizes: [""],
                        currency: "INR",
                        value: "",
                        frontPicture: "",
                        picture: "",
                        colors: [{ colorCode: '#000000' }],
                      });
                      setColors([{ colorCode: '#000000' }]);
                      setImage(null);
                      setImages([]);
                    }
                  }}
                  className="px-6 py-3 text-[#3A2E2E] border-2 border-[#D4A373]/30 
                    rounded-lg hover:bg-[#D4A373]/10 hover:border-[#D4A373] 
                    transition-all duration-300 font-medium"
                >
                  Clear Form
                </button>
                
                
              </div>
            </div>
          </form>
        </div>

        {/* Form Progress Indicator */}
        <div className="mt-8 bg-white/40 backdrop-blur-sm rounded-xl p-6 border border-white/30">
          <h4 className="font-headings text-[#3A2E2E] font-medium mb-4">Form Completion</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div className={`flex items-center space-x-2 ${formData.name ? 'text-green-600' : 'text-[#3A2E2E]/50'}`}>
              <div className={`w-3 h-3 rounded-full ${formData.name ? 'bg-green-500' : 'bg-[#D4A373]/30'}`}></div>
              <span>Name</span>
            </div>
            <div className={`flex items-center space-x-2 ${formData.categoryName ? 'text-green-600' : 'text-[#3A2E2E]/50'}`}>
              <div className={`w-3 h-3 rounded-full ${formData.categoryName ? 'bg-green-500' : 'bg-[#D4A373]/30'}`}></div>
              <span>Category</span>
            </div>
            <div className={`flex items-center space-x-2 ${formData.value ? 'text-green-600' : 'text-[#3A2E2E]/50'}`}>
              <div className={`w-3 h-3 rounded-full ${formData.value ? 'bg-green-500' : 'bg-[#D4A373]/30'}`}></div>
              <span>Price</span>
            </div>
            <div className={`flex items-center space-x-2 ${image ? 'text-green-600' : 'text-[#3A2E2E]/50'}`}>
              <div className={`w-3 h-3 rounded-full ${image ? 'bg-green-500' : 'bg-[#D4A373]/30'}`}></div>
              <span>Image</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProducts;