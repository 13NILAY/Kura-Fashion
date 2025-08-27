import React, { useState, useEffect } from "react";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import { AlertCircle, CheckCircle, Trash2, Upload, Image as ImageIcon, Plus, Eye } from "lucide-react";

const AddSliders = () => {
  const [slider, setSlider] = useState({ name: "", description: "", image: "" });
  const axiosPrivate = useAxiosPrivate();
  const [image, setImage] = useState(null);
  const [sliderSubmitted, setSliderSubmitted] = useState(false);
  const [currentSliders, setCurrentSliders] = useState([]);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Fetch current sliders on component mount
  useEffect(() => {
    const fetchSliders = async () => {
      try {
        setIsLoading(true);
        const response = await axiosPrivate.get("/slider/all");
        setCurrentSliders(response.data.data);
      } catch (error) {
        showAlert("Error fetching sliders", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSliders();
  }, []);

  // Handle input change for name and description
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSlider({
      ...slider,
      [name]: value,
    });
  };

  // Handle file change for image
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle drag and drop
  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        setImage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  // Extract Cloudinary public ID from URL
  const getPublicIdFromUrl = (url) => {
    try {
      const regex = /\/v\d+\/(.+)$/;
      const match = url.match(regex);
      
      if (match && match[1]) {
        let publicId = match[1];
        publicId = publicId.replace(/\.[^.]+$/, '');
        publicId = decodeURIComponent(publicId);
        return publicId;
      }
      return null;
    } catch (error) {
      console.error('Error extracting public ID:', error);
      return null;
    }
  };

  // Show alert function
  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => {
      setAlert({ show: false, message: "", type: "" });
    }, 5000);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      showAlert("Please upload an image", "error");
      return;
    }

    const formData = new FormData();
    formData.append("photo", image);

    try {
      setIsLoading(true);
      const uploadResponse = await axiosPrivate.post("/admin/addSingleImage", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      const imageUrl = uploadResponse.data.fileUrl;

      if (uploadResponse.status === 200) {
        const newSlider = { ...slider, image: imageUrl };

        const sliderResponse = await axiosPrivate.post(
          "/admin/addSlider",
          { sliders: [newSlider] },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (sliderResponse.status === 201 && sliderResponse.data.success) {
          const addedSlider = sliderResponse.data.sliders[0] || { ...newSlider, _id: Date.now().toString() };
          showAlert("Slider added successfully", "success");
          setSliderSubmitted(true);
          setCurrentSliders([...currentSliders, addedSlider]);
          resetForm();
        } else {
          showAlert(sliderResponse.data.message || "Error adding slider", "error");
        }
      } else {
        showAlert("Error uploading image", "error");
      }
    } catch (error) {
      showAlert("Error uploading image or adding slider", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle slider deletion
  const handleDelete = async (sliderId, imageUrl) => {
    if (!window.confirm("Are you sure you want to delete this slider?")) return;
    
    try {
      setIsLoading(true);
      const publicId = getPublicIdFromUrl(imageUrl);
      const response = await axiosPrivate.delete(`/admin/deleteSlider/${sliderId}`, {
        headers: { 'Content-Type': 'application/json' },
        data: { publicId }
      });
      
      if (response.status === 200) {
        showAlert("Slider deleted successfully", "success");
        setCurrentSliders(currentSliders.filter((s) => s._id !== sliderId));
      } else {
        showAlert(response.data.message || "Error deleting slider", "error");
      }
    } catch (error) {
      showAlert("Error deleting slider", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form to allow adding another slider
  const resetForm = () => {
    setSlider({ name: "", description: "", image: "" });
    setImage(null);
    setImagePreview(null);
    setSliderSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F5F2] to-[#EADBC8] relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-20 left-10 w-40 h-40 bg-[#D4A373]/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-[#3A2E2E]/5 rounded-full blur-3xl animate-pulse" 
        style={{animationDelay: '2s'}}></div>

      <div className="relative pt-24 px-4 sm:px-8 pb-16">
        {/* Premium Alert System */}
        {alert.show && (
          <div className={`fixed top-24 right-4 z-50 p-4 rounded-2xl shadow-2xl backdrop-blur-md 
            border transition-all duration-500 transform animate-slideInRight ${
            alert.type === "success" 
              ? "bg-[#D4A373]/90 text-[#3A2E2E] border-[#D4A373]/30" 
              : "bg-red-500/90 text-white border-red-400/30"
          }`}>
            <div className="flex items-center gap-3">
              {alert.type === "success" ? 
                <CheckCircle className="h-6 w-6 text-[#3A2E2E]" /> : 
                <AlertCircle className="h-6 w-6 text-white" />
              }
              <p className="font-medium">{alert.message}</p>
            </div>
          </div>
        )}

        <div className="container mx-auto max-w-7xl">
          {/* Page Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-0.5 bg-[#D4A373]"></div>
              <span className="mx-4 text-[#3A2E2E]/60 text-sm font-medium tracking-widest uppercase">
                Admin Panel
              </span>
              <div className="w-16 h-0.5 bg-[#D4A373]"></div>
            </div>
            
            <h1 className="font-headings text-[#3A2E2E] text-5xl lg:text-6xl font-light mb-6 leading-tight">
              Hero Slider
              <span className="block text-[#D4A373] font-normal">Management</span>
            </h1>
            
            <p className="text-lg text-[#3A2E2E]/70 max-w-2xl mx-auto leading-relaxed">
              Create and manage stunning hero sliders for your premium fashion collection
            </p>
          </div>

          {/* Current Sliders Section */}
          <div className="mb-20">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl font-headings text-[#3A2E2E] font-semibold">
                Current Sliders
                <span className="ml-3 text-lg text-[#3A2E2E]/60 font-normal">
                  ({currentSliders.length})
                </span>
              </h2>
            </div>
            
            {isLoading && currentSliders.length === 0 ? (
              <div className="text-center py-20">
                <div className="relative mb-8">
                  <div className="w-20 h-20 border-4 border-[#D4A373]/30 border-t-[#3A2E2E] rounded-full animate-spin mx-auto"></div>
                  <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-b-[#D4A373] rounded-full animate-spin mx-auto" 
                    style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
                </div>
                <p className="text-[#3A2E2E]/70 font-medium text-lg">Loading your premium sliders...</p>
              </div>
            ) : currentSliders.length === 0 ? (
              <div className="text-center py-20">
                <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-16 max-w-md mx-auto 
                  shadow-xl border border-white/30">
                  <ImageIcon className="w-16 h-16 text-[#D4A373] mx-auto mb-6" />
                  <h3 className="text-2xl font-headings text-[#3A2E2E] mb-4">No Sliders Yet</h3>
                  <p className="text-[#3A2E2E]/70 mb-8">Create your first stunning hero slider below</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {currentSliders.map((slider, index) => (
                  <div key={index} 
                    className="group bg-white/60 backdrop-blur-sm rounded-3xl overflow-hidden 
                      shadow-lg hover:shadow-2xl border border-white/30 
                      transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-2">
                    
                    {/* Image Container */}
                    <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-[#F8F5F2] to-[#EADBC8]">
                      <img 
                        src={slider.image} 
                        alt={slider.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/placeholder-image.jpg";
                        }}
                      />
                      
                      {/* Overlay with Actions */}
                      <div className="absolute inset-0 bg-[#3A2E2E]/0 group-hover:bg-[#3A2E2E]/20 
                        transition-all duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <button className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full 
                          flex items-center justify-center text-[#3A2E2E] 
                          hover:bg-[#3A2E2E] hover:text-[#EADBC8] 
                          transition-all duration-300 transform hover:scale-110 shadow-lg">
                          <Eye className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-8">
                      <h3 className="text-xl font-headings text-[#3A2E2E] font-semibold mb-3 line-clamp-1">
                        {slider.name}
                      </h3>
                      <p className="text-[#3A2E2E]/70 mb-6 line-clamp-3 leading-relaxed">
                        {slider.description}
                      </p>
                      
                      {/* Action Button */}
                      <div className="flex justify-end">
                        <button
                          onClick={() => handleDelete(slider._id, slider.image)}
                          className="group/btn flex items-center gap-2 px-4 py-2 text-red-600 
                            hover:text-white hover:bg-red-500 rounded-xl 
                            transition-all duration-300 border border-red-200 hover:border-red-500"
                          disabled={isLoading}
                        >
                          <Trash2 className="w-4 h-4 transition-transform duration-200 group-hover/btn:scale-110" />
                          <span className="font-medium">Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add New Slider Section */}
          <div className="relative">
            {/* Decorative background */}
            <div className="absolute -inset-8 bg-gradient-to-r from-[#D4A373]/10 to-[#3A2E2E]/5 
              rounded-3xl blur-2xl"></div>
            
            <div className="relative bg-white/70 backdrop-blur-md rounded-3xl p-8 lg:p-12 
              shadow-2xl border border-white/40">
              
              {/* Section Header */}
              <div className="text-center mb-12">
                <div className="flex items-center justify-center mb-6">
                  <Plus className="w-8 h-8 text-[#D4A373] mr-3" />
                  <h2 className="text-3xl font-headings text-[#3A2E2E] font-semibold">
                    Add New Slider
                  </h2>
                </div>
                <p className="text-[#3A2E2E]/70">
                  Create captivating hero content for your premium collection
                </p>
              </div>

              <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-8">
                {/* Slider Name */}
                <div className="space-y-3">
                  <label className="block text-lg font-headings text-[#3A2E2E] font-semibold" htmlFor="name">
                    Slider Title
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={slider.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-6 py-4 bg-white/80 border-2 border-[#D4A373]/30 
                      rounded-2xl focus:border-[#D4A373] focus:bg-white
                      transition-all duration-300 text-[#3A2E2E] placeholder-[#3A2E2E]/50
                      focus:outline-none focus:ring-4 focus:ring-[#D4A373]/20"
                    placeholder="Enter captivating slider title..."
                  />
                </div>

                {/* Slider Description */}
                <div className="space-y-3">
                  <label className="block text-lg font-headings text-[#3A2E2E] font-semibold" htmlFor="description">
                    Slider Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={slider.description}
                    onChange={handleInputChange}
                    rows="4"
                    required
                    className="w-full px-6 py-4 bg-white/80 border-2 border-[#D4A373]/30 
                      rounded-2xl focus:border-[#D4A373] focus:bg-white
                      transition-all duration-300 text-[#3A2E2E] placeholder-[#3A2E2E]/50
                      focus:outline-none focus:ring-4 focus:ring-[#D4A373]/20 resize-none"
                    placeholder="Describe your premium collection..."
                  />
                </div>

                {/* Image Upload */}
                <div className="space-y-3">
                  <label className="block text-lg font-headings text-[#3A2E2E] font-semibold">
                    Hero Image
                  </label>
                  
                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="relative mb-6 rounded-2xl overflow-hidden shadow-xl">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-64 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#3A2E2E]/20 to-transparent"></div>
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          setImage(null);
                        }}
                        className="absolute top-4 right-4 w-8 h-8 bg-red-500 text-white rounded-full 
                          flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  )}
                  
                  {/* Drop Zone */}
                  <div
                    className={`relative border-2 border-dashed rounded-2xl p-12 text-center 
                      transition-all duration-300 cursor-pointer group
                      ${isDragOver 
                        ? 'border-[#D4A373] bg-[#D4A373]/10' 
                        : 'border-[#D4A373]/40 hover:border-[#D4A373] hover:bg-[#D4A373]/5'
                      }`}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('image').click()}
                  >
                    <Upload className={`w-12 h-12 mx-auto mb-4 transition-colors duration-300
                      ${isDragOver ? 'text-[#D4A373]' : 'text-[#3A2E2E]/60 group-hover:text-[#D4A373]'}`} 
                    />
                    <p className="text-[#3A2E2E] font-medium mb-2">
                      {isDragOver ? 'Drop your image here' : 'Drag & drop or click to upload'}
                    </p>
                    <p className="text-[#3A2E2E]/60 text-sm">
                      Supports JPG, PNG, WebP (Max 10MB)
                    </p>
                    
                    <input
                      id="image"
                      name="image"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      required={!imagePreview}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="text-center pt-8">
                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="group relative inline-flex items-center px-12 py-4 
                      bg-[#3A2E2E] text-[#EADBC8] font-headings font-semibold rounded-2xl 
                      transition-all duration-300 hover:bg-[#2C2C2C] hover:shadow-2xl 
                      hover:shadow-[#3A2E2E]/30 transform hover:scale-105
                      disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                      focus:outline-none focus:ring-4 focus:ring-[#D4A373]/30"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-6 h-6 border-2 border-[#EADBC8]/30 border-t-[#EADBC8] 
                          rounded-full animate-spin mr-3"></div>
                        Processing Premium Content...
                      </>
                    ) : (
                      <>
                        <Plus className="w-5 h-5 mr-3 transition-transform duration-300 group-hover:rotate-90" />
                        Add Premium Slider
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Add Another Button */}
              {sliderSubmitted && (
                <div className="text-center mt-8 pt-8 border-t border-[#D4A373]/20">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="inline-flex items-center px-8 py-3 
                      bg-[#D4A373] text-[#3A2E2E] font-medium rounded-xl 
                      transition-all duration-300 hover:bg-[#C19B6B] 
                      transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Create Another Slider
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slideInRight {
          animation: slideInRight 0.5s ease-out;
        }
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default AddSliders;