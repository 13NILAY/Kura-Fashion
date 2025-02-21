import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";

const AddCategory = () => {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const [formData, setFormData] = useState({ categoryName: "" });
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all categories
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

  // Delete category handler
  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        setIsLoading(true);
        const response=await axiosPrivate.delete(`/Category/deleteCategory/${categoryId}`);
        console.log(response)
        setCategories(categories.filter(category => category._id !== categoryId));
      } catch (error) {
        console.error("Error deleting category:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await axiosPrivate.post("/admin/addCategory",
        JSON.stringify(formData),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );
      if (response.status === 201) {
        // Refresh categories list after adding new category
        const updatedCategories = await axiosPrivate.get("/Category/all");
        setCategories(updatedCategories.data.data);
        setFormData({ categoryName: "" }); // Clear the form
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-20 px-sectionPadding max-md:px-mobileScreenPadding pt-10 font-texts">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Category Management
      </h1>
      <div className="w-full max-w-2xl mx-auto bg-[#f9f4f1] p-8 rounded-lg shadow-lg">
        {/* Add Category Form */}
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="mb-6">
            <label className="block text-lg font-semibold mb-2 text-[#5c4033]" htmlFor="name">
              Add New Category:
            </label>
            <div className="flex gap-2">
              <input
                className="flex-1 text-sm text-[#40322e] border border-[#5c4033] rounded-lg p-2 focus:outline-none focus:ring focus:border-blue-300"
                type="text"
                id="name"
                name="categoryName"
                value={formData.categoryName}
                onChange={handleChange}
                placeholder="Enter category name"
              />
              <button 
                type="submit" 
                className="bg-[#5c4033] text-[#fff7ec] font-bold py-2 px-4 rounded-lg shadow hover:bg-[#6a4c39] disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? 'Adding...' : 'Add'}
              </button>
            </div>
          </div>
        </form>

        {/* Categories List */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-[#5c4033]">Existing Categories</h2>
          {categories.length === 0 ? (
            <p className="text-gray-600">No categories found</p>
          ) : (
            <ul className="space-y-2">
              {categories.map((category) => (
                <li 
                  key={category._id} 
                  className="flex justify-between items-center p-3 bg-white rounded-lg shadow"
                >
                  <span className="text-[#5c4033]">{category.categoryName}</span>
                  <button
                    onClick={() => handleDeleteCategory(category._id)}
                    className="text-red-600 hover:text-red-800 font-medium"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Deleting...' : 'Delete'}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddCategory;
