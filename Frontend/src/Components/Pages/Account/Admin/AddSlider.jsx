import React, { useState, useEffect } from "react";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";

const AddSliders = () => {
  const [slider, setSlider] = useState({ name: "", description: "", image: "" });
  const axiosPrivate = useAxiosPrivate();
  const [image, setImage] = useState(null);
  const [sliderSubmitted, setSliderSubmitted] = useState(false);
  const [currentSliders, setCurrentSliders] = useState([]);

  // Fetch current sliders on component mount
  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const response = await axiosPrivate.get("/slider/all");
        console.log(response.data.data);
        setCurrentSliders(response.data.data);
      } catch (error) {
        console.log("Error fetching sliders:", error);
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
    setImage(e.target.files[0]); // Store the image file temporarily
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      console.log("Please upload an image");
      return;
    }

    const formData2 = new FormData();
    formData2.append("photo", image);

    try {
      // Upload image first
      const uploadFrontResponse = await axiosPrivate.post("/admin/addSingleImage", formData2, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      const frontImageUrl = uploadFrontResponse.data.fileUrl;

      if (uploadFrontResponse.status === 200) {
        const newSlider = { ...slider, image: frontImageUrl };

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

        if (sliderResponse.status === 201 && sliderResponse.data.success) {
          console.log("Slider added successfully");
          setSliderSubmitted(true);
          // Update current sliders with the newly added sliders
          setCurrentSliders([...currentSliders, newSlider]);
          resetForm();
        } else {
          console.log("Error adding slider:", sliderResponse.data.message);
        }
      } else {
        console.log("Error uploading image:", uploadFrontResponse);
      }
    } catch (error) {
      console.log("Error uploading image or adding slider:", error);
    }
  };

  // Handle slider deletion
  const handleDelete = async (sliderId) => {
    try {
      const response = await axiosPrivate.delete(`/admin/deleteSlider/${sliderId}`,{
        headers: { 'Content-Type': 'application/json' },
      });
      console.log(response);
      if (response.status === 200) {
        console.log("Slider deleted successfully");
        // Remove the deleted slider from the currentSliders state
        setCurrentSliders(currentSliders.filter((s) => s._id !== sliderId));
      } else {
        console.log("Error deleting slider:", response.data.message);
      }
    } catch (error) {
      console.log("Error deleting slider:", error);
    }
  };

  // Reset form to allow adding another slider
  const resetForm = () => {
    setSlider({ name: "", description: "", image: "" });
    setImage(null);
    setSliderSubmitted(false);
  };

  return (
    <div className="mt-20 px-sectionPadding max-md:px-mobileScreenPadding pt-10 font-texts">
      <h1 className="text-4xl font-bold mb-6 text-center">Current Sliders</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {currentSliders.map((slider, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg p-4 relative">
            <img src={slider.image} alt={slider.name} className="w-full h-40 object-cover rounded-t-lg" />
            <h2 className="text-xl font-semibold mt-4">{slider.name}</h2>
            <p className="text-gray-600 mt-2">{slider.description}</p>
            <button
              onClick={() => handleDelete(slider._id)}
              className="absolute bottom-4 right-4 bg-red-600 text-white py-1 px-3 rounded-lg shadow hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      <h1 className="text-4xl font-bold mb-6 text-center">Add New Slider</h1>
      <div className="w-full max-w-2xl mx-auto bg-slate-50 p-8 rounded-lg shadow-lg">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-lg font-semibold mb-2" htmlFor="name">
              Slider Name:
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={slider.name}
              onChange={handleInputChange}
              className="block w-full text-sm text-black border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:border-blue-300"
            />

            <label className="block text-lg font-semibold mb-2 mt-4" htmlFor="description">
              Slider Description:
            </label>
            <textarea
              id="description"
              name="description"
              value={slider.description}
              onChange={handleInputChange}
              rows="4"
              className="block w-full text-sm text-black border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:border-blue-300"
            />

            <label className="block text-lg font-semibold mb-2 mt-4" htmlFor="image">
              Slider Image:
            </label>
            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
            />
          </div>

          <div className="text-center">
          <button type="submit" className=" bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow hover:bg-green-800">
              SUBMIT
            </button>
          </div>
        </form>

        {sliderSubmitted && (
          <div className="text-center mt-6">
            <button
              type="button"
              onClick={resetForm}
              className="bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow hover:bg-blue-800"
            >
              Add Another Slider
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddSliders;
