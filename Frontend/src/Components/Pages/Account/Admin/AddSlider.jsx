import React, { useState, useEffect } from "react";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import { AlertCircle, CheckCircle, Trash2 } from "lucide-react";

const AddSliders = () => {
  const [slider, setSlider] = useState({ name: "", description: "", image: "" });
  const axiosPrivate = useAxiosPrivate();
  const [image, setImage] = useState(null);
  const [sliderSubmitted, setSliderSubmitted] = useState(false);
  const [currentSliders, setCurrentSliders] = useState([]);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

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

  // Extract Cloudinary public ID from URL
  // const getPublicIdFromUrl = (url) => {
  //   if (!url) return null;
  //   try {
  //     // For URLs like: https://res.cloudinary.com/yourcloud/image/upload/v1234567890/folder/image.jpg
  //     const parts = url.split('/');
  //     const fileNameWithExtension = parts[parts.length - 1];
  //     // Get filename without extension
  //     const fileName = fileNameWithExtension.split('.')[0];
  //     // If the image is in a folder, we need to include the folder path
  //     const uploadIndex = parts.indexOf('upload');
  //     if (uploadIndex !== -1 && uploadIndex < parts.length - 2) {
  //       const folderAndFile = parts.slice(uploadIndex + 2).join('/');
  //       return folderAndFile.split('.')[0];  // Remove extension
  //     }
  //     return fileName;
  //   } catch (error) {
  //     console.error("Error extracting public ID:", error);
  //     return null;
  //   }
  // };
  const getPublicIdFromUrl = (url) => {
    try {
      // Extract the public ID from URL
      // URL format: https://res.cloudinary.com/cloud-name/image/upload/v1234567890/folder/public-id.jpg
      const regex = /\/v\d+\/(.+)$/;
      const match = url.match(regex);
      
      if (match && match[1]) {
        // Get everything after the version number
        let publicId = match[1];
        // Remove file extension
        publicId = publicId.replace(/\.[^.]+$/, '');
        // Decode URL encoded characters
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
      // Upload image first
      const uploadResponse = await axiosPrivate.post("/admin/addSingleImage", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      const imageUrl = uploadResponse.data.fileUrl;
      // console.log(uploadResponse);
      if (uploadResponse.status === 200) {
        const newSlider = { ...slider, image: imageUrl };

        // Submit the slider data to the backend
        const sliderResponse = await axiosPrivate.post(
          "/admin/addSlider",
          { sliders: [newSlider] },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        // console.log(sliderResponse)
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
      // console.log(sliderId, imageUrl);
    if (!window.confirm("Are you sure you want to delete this slider?")) return;
    
    try {
      setIsLoading(true);
      const publicId = getPublicIdFromUrl(imageUrl);
      // console.log(publicId);
      const response = await axiosPrivate.delete(`/admin/deleteSlider/${sliderId}`, {
        headers: { 'Content-Type': 'application/json' },
        data: { publicId } // Send the publicId in the request body
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
    <div className="mt-20 px-sectionPadding max-md:px-mobileScreenPadding pt-10 font-texts">
      {alert.show && (
        <div className={`fixed top-24 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-2 ${
          alert.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}>
          {alert.type === "success" ? 
            <CheckCircle className="h-5 w-5" /> : 
            <AlertCircle className="h-5 w-5" />
          }
          <p className="font-medium">{alert.message}</p>
        </div>
      )}

      <h1 className="text-4xl font-bold mb-8 text-center">Current Sliders</h1>
      
      {isLoading && currentSliders.length === 0 ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading sliders...</p>
        </div>
      ) : currentSliders.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg shadow">
          <p className="text-xl text-gray-600">No sliders found. Add your first slider below!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {currentSliders.map((slider, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
              <div className="relative pt-[56.25%] w-full"> {/* 16:9 aspect ratio container */}
                <img 
                  src={slider.image} 
                  alt={slider.name} 
                  className="absolute top-0 left-0 w-full h-full object-contain bg-gray-100"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/placeholder-image.jpg";
                  }}
                />
              </div>
              <div className="p-5 flex-grow flex flex-col">
                <h2 className="text-xl font-bold text-gray-800 mb-2">{slider.name}</h2>
                <p className="text-gray-600 flex-grow">{slider.description}</p>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => handleDelete(slider._id, slider.image)}
                    className="text-red-600 hover:text-red-800 transition-colors flex items-center gap-1 py-1 px-3 rounded-lg"
                    disabled={isLoading}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-gradient-to-b from-transparent to-slate-100 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Add New Slider</h1>
        <div className="w-full max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
          <form onSubmit={handleSubmit}>
            <div className="mb-8">
              <label className="block text-lg font-semibold mb-2" htmlFor="name">
                Slider Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={slider.name}
                onChange={handleInputChange}
                required
                className="block w-full text-base text-black border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                placeholder="Enter slider title"
              />

              <label className="block text-lg font-semibold mb-2 mt-6" htmlFor="description">
                Slider Description
              </label>
              <textarea
                id="description"
                name="description"
                value={slider.description}
                onChange={handleInputChange}
                rows="4"
                required
                className="block w-full text-base text-black border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                placeholder="Enter slider description"
              />

              <label className="block text-lg font-semibold mb-2 mt-6" htmlFor="image">
                Slider Image
              </label>
              <div className="mt-2 flex flex-col items-center">
                {imagePreview && (
                  <div className="mb-4 w-full max-h-64 overflow-hidden rounded-lg shadow">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full object-contain bg-gray-100"
                      style={{ maxHeight: "256px" }}
                    />
                  </div>
                )}
                <input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  required={!imagePreview}
                  className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 focus:outline-none"
                />
              </div>
            </div>

            <div className="text-center">
              <button 
                type="submit" 
                className="bg-green-700 text-white font-bold py-3 px-8 rounded-lg shadow hover:bg-green-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : "Add Slider"}
              </button>
            </div>
          </form>

          {sliderSubmitted && (
            <div className="text-center mt-6">
              <button
                type="button"
                onClick={resetForm}
                className="bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow hover:bg-blue-800 transition-colors"
              >
                Add Another Slider
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddSliders;