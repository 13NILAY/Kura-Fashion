import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import { ChromePicker } from 'react-color';

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
  const [showSuccess, setShowSuccess] = useState(false);
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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosPrivate.get("/Category/all");
        setCategories(response.data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
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

  const handleColorChange = (color, index) => {
    const newColors = [...colors];
    newColors[index].colorCode = color.hex;
    setColors(newColors);
  };

  const addColorField = () => {
    setColors([...colors, { colorCode: '#000000' }]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
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
        setShowSuccess(true);
        setTimeout(() => {
          navigate("/shop");
        }, 2000);
      }
    } catch (error) {
      console.error("Error uploading Image:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-20 px-sectionPadding max-md:px-mobileScreenPadding pt-10 font-texts">
       {/* Success Alert */}
       {showSuccess && (
        <div className="fixed top-5 right-5 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          <p className="font-bold">Success!</p>
          <p>Product added successfully.</p>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg">
            <p className="text-lg font-semibold">Processing...</p>
          </div>
        </div>
      )}
      <h1 className="text-4xl font-bold mb-6 text-center">
        Add a New Product
      </h1>
      <div className="w-full max-w-2xl mx-auto bg-[#f9f4f1] p-8 rounded-lg shadow-lg">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-lg font-semibold mb-2 text-[#5c4033]" htmlFor="FrontPicture">
              Product Image (Front):
            </label>
            <input
              id="FrontPicture"
              className="block w-full text-sm text-[#40322e] border border-[#5c4033] rounded-lg cursor-pointer bg-[#f9f4f1] focus:outline-none"
              type="file"
              accept="image/*"
              onChange={handleSingleFileChange}
            />
          </div>
          <div className="mb-6">
            <label className="block text-lg font-semibold mb-2 text-[#5c4033]" htmlFor="picture">
              Product Images (Other):
            </label>
            <input
              id="picture"
              className="block w-full text-sm text-[#40322e] border border-[#5c4033] rounded-lg cursor-pointer bg-[#f9f4f1] focus:outline-none"
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
            />
          </div>
          <div className="mb-6">
            <label className="block text-lg font-semibold mb-2 text-[#5c4033]" htmlFor="name">
              Product Title:
            </label>
            <input
              className="block w-full text-sm text-[#40322e] border border-[#5c4033] rounded-lg p-2 focus:outline-none focus:ring focus:border-blue-300"
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product title"
            />
          </div>
          <div className="mb-6">
            <label className="block text-lg font-semibold mb-2 text-[#5c4033]" htmlFor="category">
              Product Category:
            </label>
            <select
              className="block w-full text-sm text-[#40322e] border border-[#5c4033] rounded-lg p-2 focus:outline-none focus:ring focus:border-blue-300"
              id="category"
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
          </div>
          <div className="mb-6">
            <label className="block text-lg font-semibold mb-2 text-[#5c4033]" htmlFor="description">
              Product Description:
            </label>
            <textarea
              className="block w-full text-sm text-[#40322e] border border-[#5c4033] rounded-lg p-2 focus:outline-none focus:ring focus:border-blue-300"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter product description"
            />
          </div>
          <div className="mb-6">
            <label className="block text-lg font-semibold mb-2 text-[#5c4033]" htmlFor="sizes">
              Sizes:
            </label>
            {formData.sizes.map((size, index) => (
              <input
                key={index}
                className="block w-full text-sm text-[#40322e] border border-[#5c4033] rounded-lg p-2 mb-2 focus:outline-none focus:ring focus:border-blue-300"
                type="text"
                placeholder={`Size ${index + 1}`}
                value={size}
                onChange={(e) => handleArrayChange(e, index, 'sizes')}
              />
            ))}
            <button
              type="button"
              onClick={() => addArrayField('sizes')}
              className="bg-[#5c4033] text-[#fff7ec] font-bold py-2 px-4 rounded-lg shadow hover:bg-[#6a4c39]"
            >
              Add Size
            </button>
          </div>
          <div className="mb-6">
            <label className="block text-lg font-semibold mb-2 text-[#5c4033]" htmlFor="colors">
              Colors:
            </label>
            {colors.map((color, index) => (
              <div key={index} className="mb-4 flex items-center">
                <ChromePicker
                  color={color.colorCode}
                  onChangeComplete={(color) => handleColorChange(color, index)}
                />
                <div className="ml-4 w-6 h-6" style={{ backgroundColor: color.colorCode }} />
              </div>
            ))}
            <button
              type="button"
              onClick={addColorField}
              className="bg-[#5c4033] text-[#fff7ec] font-bold py-2 px-4 rounded-lg shadow hover:bg-[#6a4c39]"
            >
              Add Color
            </button>
          </div>
          <div className="mb-6">
            <label className="block text-lg font-semibold mb-2 text-[#5c4033]" htmlFor="value">
              Price (INR):
            </label>
            <input
              className="block w-full text-sm text-[#40322e] border border-[#5c4033] rounded-lg p-2 focus:outline-none focus:ring focus:border-blue-300"
              type="number"
              id="value"
              name="value"
              value={formData.value}
              onChange={handleChange}
              placeholder="Enter product price"
            />
          </div>
          <div className="text-center">
          <button 
              type="submit" 
              className="bg-[#5c4033] text-[#fff7ec] font-bold py-2 px-4 rounded-lg shadow hover:bg-[#6a4c39] disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProducts;
