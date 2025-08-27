import React, { useState, useEffect } from "react";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const AddBanner = () => {
  const [banner, setBanner] = useState({ title: "", description: "", image: "" });
  const axiosPrivate = useAxiosPrivate();
  const [image, setImage] = useState(null);
  const [bannerSubmitted, setBannerSubmitted] = useState(false);
  const [currentBanners, setCurrentBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  // Fetch current banners on component mount
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true);
        const response = await axiosPrivate.get("/banner/all");
        setCurrentBanners(response.data.data);
      } catch (error) {
        console.log("Error fetching banners:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  // Handle input change for name and description
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBanner({
      ...banner,
      [name]: value,
    });
  };

  // Handle file change for image
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    
    // Create preview URL
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    } else {
      setImagePreview(null);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      console.log("Please upload an image");
      return;
    }

    setSubmitting(true);
    const formData2 = new FormData();
    formData2.append("photo", image);

    try {
      // Upload image first
      const uploadFrontResponse = await axiosPrivate.post("/admin/addSingleImage", formData2, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      const frontImageUrl = uploadFrontResponse.data.fileUrl;

      if (uploadFrontResponse.status === 200) {
        const newBanner = { ...banner, image: frontImageUrl };

        // Submit the banner data to the backend
        const bannerResponse = await axiosPrivate.post(
          "/admin/addBanner",
          { banners: [newBanner] },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (bannerResponse.status === 201 && bannerResponse.data.success) {
          console.log("Banner added successfully");
          setBannerSubmitted(true);
          setCurrentBanners([...currentBanners, newBanner]);
          resetForm();
        } else {
          console.log("Error adding banner:", bannerResponse.data.message);
        }
      } else {
        console.log("Error uploading image:", uploadFrontResponse);
      }
    } catch (error) {
      console.log("Error uploading image or adding banner:", error);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle banner deletion
  const handleDelete = async (bannerId) => {
    try {
      const response = await axiosPrivate.delete(`/admin/deleteBanner/${bannerId}`, {
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (response.status === 200) {
        setCurrentBanners(currentBanners.filter((b) => b._id !== bannerId));
      } else {
        console.log("Error deleting banner:", response.data.message);
      }
    } catch (error) {
      console.log("Error deleting banner:", error);
    }
  };

  // Reset form to allow adding another banner
  const resetForm = () => {
    setBanner({ title: "", description: "", image: "" });
    setImage(null);
    setImagePreview(null);
    setBannerSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F5F2] to-[#EADBC8] py-20 px-4 sm:px-8">
      {/* Decorative background elements */}
      <div className="absolute top-20 left-10 w-40 h-40 bg-[#D4A373]/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-[#3A2E2E]/5 rounded-full blur-3xl animate-pulse" 
        style={{animationDelay: '2s'}}></div>

      <div className="container mx-auto relative">
        {/* Page Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-0.5 bg-[#D4A373]"></div>
            <span className="mx-4 text-[#3A2E2E]/60 text-sm font-medium tracking-widest uppercase">
              Admin Dashboard
            </span>
            <div className="w-16 h-0.5 bg-[#D4A373]"></div>
          </div>
          <h1 className="font-headings text-[#3A2E2E] text-4xl sm:text-5xl font-light mb-4">
            Banner
            <span className="block text-[#D4A373] font-normal">Management</span>
          </h1>
          <p className="text-lg text-[#3A2E2E]/70 max-w-2xl mx-auto">
            Create and manage promotional banners for your premium collection
          </p>
        </div>

        {/* Current Banners Section */}
        {loading ? (
          <div className="mb-16">
            <h2 className="font-headings text-[#3A2E2E] text-2xl font-semibold mb-8 text-center">
              Current Banners
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg 
                  border border-white/30 animate-pulse">
                  <div className="aspect-[4/3] bg-[#D4A373]/20 rounded-xl mb-4"></div>
                  <div className="h-6 bg-[#3A2E2E]/20 rounded-lg mb-3"></div>
                  <div className="h-4 bg-[#3A2E2E]/15 rounded-lg mb-2"></div>
                  <div className="h-4 bg-[#3A2E2E]/10 rounded-lg w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mb-16">
            <h2 className="font-headings text-[#3A2E2E] text-2xl font-semibold mb-8 text-center">
              Current Banners
            </h2>
            {currentBanners.length === 0 ? (
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-12 text-center 
                shadow-lg border border-white/30 max-w-md mx-auto">
                <AddPhotoAlternateIcon className="text-6xl text-[#D4A373]/50 mb-4" />
                <p className="text-[#3A2E2E]/70 text-lg">No banners created yet</p>
                <p className="text-[#3A2E2E]/50 text-sm mt-2">Start by adding your first banner below</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentBanners.map((banner, index) => (
                  <div key={index} className="group bg-white/60 backdrop-blur-sm rounded-2xl overflow-hidden 
                    shadow-lg hover:shadow-2xl border border-white/30 transition-all duration-500 
                    transform hover:scale-[1.02] hover:-translate-y-2">
                    
                    {/* Banner Image */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-[#F8F5F2] to-[#EADBC8]">
                      <img 
                        src={banner.image} 
                        alt={banner.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#3A2E2E]/20 via-transparent to-transparent 
                        opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                    
                    {/* Banner Content */}
                    <div className="p-6 space-y-4">
                      <h3 className="font-headings text-[#3A2E2E] text-xl font-semibold line-clamp-1">
                        {banner.title}
                      </h3>
                      <p className="text-[#3A2E2E]/70 text-sm line-clamp-3 leading-relaxed">
                        {banner.description}
                      </p>
                      
                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(banner._id)}
                        className="w-full bg-red-50 text-red-600 border border-red-200 py-3 rounded-xl 
                          font-medium transition-all duration-300 hover:bg-red-100 hover:border-red-300
                          hover:shadow-lg transform hover:scale-[1.02] flex items-center justify-center gap-2"
                      >
                        <DeleteOutlineIcon className="text-xl" />
                        Delete Banner
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Add New Banner Section */}
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="font-headings text-[#3A2E2E] text-2xl font-semibold mb-4">
              Add New Banner
            </h2>
            <div className="w-20 h-0.5 bg-[#D4A373] mx-auto"></div>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/30">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Banner Title */}
              <div className="group">
                <label className="block text-lg font-semibold mb-3 text-[#3A2E2E]" htmlFor="title">
                  Banner Title
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={banner.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 text-[#3A2E2E] bg-white/80 border-2 border-[#D4A373]/30 
                    rounded-xl focus:outline-none focus:border-[#3A2E2E] focus:bg-white
                    transition-all duration-300 placeholder-[#3A2E2E]/50"
                  placeholder="Enter compelling banner title..."
                  required
                />
              </div>

              {/* Banner Description */}
              <div className="group">
                <label className="block text-lg font-semibold mb-3 text-[#3A2E2E]" htmlFor="description">
                  Banner Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={banner.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-3 text-[#3A2E2E] bg-white/80 border-2 border-[#D4A373]/30 
                    rounded-xl focus:outline-none focus:border-[#3A2E2E] focus:bg-white
                    transition-all duration-300 placeholder-[#3A2E2E]/50 resize-none"
                  placeholder="Describe your banner content and call-to-action..."
                  required
                />
              </div>

              {/* Banner Image Upload */}
              <div className="group">
                <label className="block text-lg font-semibold mb-3 text-[#3A2E2E]" htmlFor="image">
                  Banner Image
                </label>
                
                {/* Custom File Upload Area */}
                <div className="relative">
                  <input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    required
                  />
                  
                  <div className="border-2 border-dashed border-[#D4A373]/50 rounded-xl p-8 
                    bg-white/40 hover:bg-white/60 hover:border-[#3A2E2E]/60 
                    transition-all duration-300 text-center group-hover:scale-[1.01]">
                    
                    {imagePreview ? (
                      <div className="space-y-4">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="mx-auto max-h-48 rounded-lg shadow-lg"
                        />
                        <p className="text-[#3A2E2E] font-medium">
                          Click to change image
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <CloudUploadIcon className="text-6xl text-[#D4A373] mx-auto" />
                        <div>
                          <p className="text-[#3A2E2E] text-lg font-medium mb-2">
                            Upload Banner Image
                          </p>
                          <p className="text-[#3A2E2E]/60 text-sm">
                            Drag and drop or click to select a high-quality image
                          </p>
                          <p className="text-[#3A2E2E]/50 text-xs mt-2">
                            Recommended: 1920x600px, JPG or PNG format
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
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
                      <span>Creating Banner...</span>
                    </>
                  ) : (
                    <>
                      <span className="mr-3 text-lg">Create Banner</span>
                      <CheckCircleIcon className="text-xl transition-transform duration-300 group-hover:scale-110" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Success Message & Reset Button */}
            {bannerSubmitted && (
              <div className="mt-8 text-center">
                <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
                  <CheckCircleIcon className="text-green-600 text-3xl mb-2" />
                  <p className="text-green-800 font-medium text-lg">
                    Banner created successfully!
                  </p>
                </div>
                
                <button
                  type="button"
                  onClick={resetForm}
                  className="inline-flex items-center px-8 py-3 
                    bg-[#D4A373] text-[#3A2E2E] font-semibold rounded-full 
                    transition-all duration-300 hover:bg-[#C4976B] hover:shadow-lg 
                    transform hover:scale-105"
                >
                  <span className="mr-2">Add Another Banner</span>
                  <AddPhotoAlternateIcon className="text-xl" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-[#3A2E2E]/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 text-center shadow-2xl">
            <div className="relative mb-6">
              <div className="w-16 h-16 border-4 border-[#D4A373]/30 border-t-[#3A2E2E] rounded-full animate-spin mx-auto"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-b-[#D4A373] rounded-full animate-spin mx-auto" 
                style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
            </div>
            <p className="text-[#3A2E2E] font-medium text-lg">
              Loading banner collection...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddBanner;