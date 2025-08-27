
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CategoryIcon from '@mui/icons-material/Category';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const AddCategory = () => {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const [formData, setFormData] = useState({ categoryName: "" });
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  // Show notification helper
  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000);
  };

  // Fetch all categories
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

  // Delete category handler with enhanced UX
  const handleDeleteCategory = async (categoryId, categoryName) => {
    if (window.confirm(`Are you sure you want to delete "${categoryName}" category?`)) {
      try {
        setIsDeleting(categoryId);
        const response = await axiosPrivate.delete(`/Category/deleteCategory/${categoryId}`);
        setCategories(categories.filter(category => category._id !== categoryId));
        showNotification(`"${categoryName}" category deleted successfully`, "success");
      } catch (error) {
        console.error("Error deleting category:", error);
        showNotification("Failed to delete category", "error");
      } finally {
        setIsDeleting(null);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.categoryName.trim()) {
      showNotification("Please enter a category name", "error");
      return;
    }

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
        showNotification(`"${formData.categoryName}" category added successfully`, "success");
      }
    } catch (err) {
      console.log(err);
      showNotification("Failed to add category", "error");
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

      <div className="container mx-auto max-w-4xl">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-0.5 bg-[#D4A373]"></div>
            <CategoryIcon className="mx-4 text-4xl text-[#D4A373]" />
            <div className="w-16 h-0.5 bg-[#D4A373]"></div>
          </div>
          
          <h1 className="font-headings text-[#3A2E2E] text-4xl sm:text-5xl lg:text-6xl font-light mb-4 leading-tight">
            Category
            <span className="block text-[#D4A373] font-normal">Management</span>
          </h1>
          
          <p className="text-lg text-[#3A2E2E]/70 max-w-2xl mx-auto leading-relaxed">
            Organize your premium collection with sophisticated category management
          </p>
        </div>

        {/* Main Content Card */}
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
          {/* Add Category Section */}
          <div className="p-8 sm:p-10 border-b border-[#D4A373]/20">
            <div className="flex items-center mb-8">
              <AddCircleOutlineIcon className="text-[#D4A373] mr-3 text-2xl" />
              <h2 className="font-headings text-[#3A2E2E] text-2xl font-semibold">
                Add New Category
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[#3A2E2E] font-medium mb-3 text-lg" htmlFor="name">
                  Category Name
                </label>
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <input
                      className="w-full px-6 py-4 bg-white/70 backdrop-blur-sm border-2 border-[#D4A373]/30 
                        rounded-xl text-[#3A2E2E] placeholder-[#3A2E2E]/50 
                        focus:outline-none focus:border-[#D4A373] focus:bg-white/90 
                        transition-all duration-300 text-lg"
                      type="text"
                      id="name"
                      name="categoryName"
                      value={formData.categoryName}
                      onChange={handleChange}
                      placeholder="Enter elegant category name..."
                      disabled={isLoading}
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#D4A373]/5 to-[#3A2E2E]/5 
                      pointer-events-none opacity-0 focus-within:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={isLoading || !formData.categoryName.trim()}
                    className="group px-8 py-4 bg-[#3A2E2E] text-[#EADBC8] font-semibold rounded-xl 
                      transition-all duration-300 hover:bg-[#2C2C2C] hover:shadow-xl 
                      hover:shadow-[#3A2E2E]/30 transform hover:scale-105
                      disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                      flex items-center space-x-2 min-w-[120px] justify-center"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-[#EADBC8]/30 border-t-[#EADBC8] rounded-full animate-spin"></div>
                        <span>Adding...</span>
                      </>
                    ) : (
                      <>
                        <AddCircleOutlineIcon className="transition-transform duration-300 group-hover:rotate-90" />
                        <span>Add</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Categories List Section */}
          <div className="p-8 sm:p-10">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <CategoryIcon className="text-[#D4A373] mr-3 text-2xl" />
                <h2 className="font-headings text-[#3A2E2E] text-2xl font-semibold">
                  Existing Categories
                </h2>
              </div>
              <div className="text-sm text-[#3A2E2E]/60 bg-[#D4A373]/10 px-3 py-1 rounded-full">
                {categories.length} {categories.length === 1 ? 'Category' : 'Categories'}
              </div>
            </div>

            {categories.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-[#D4A373]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CategoryIcon className="text-4xl text-[#D4A373]/50" />
                </div>
                <h3 className="text-xl font-headings text-[#3A2E2E] mb-2">No Categories Found</h3>
                <p className="text-[#3A2E2E]/60">Start by adding your first category above</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {categories.map((category, index) => (
                  <div 
                    key={category._id} 
                    className="group bg-white/70 backdrop-blur-sm rounded-xl p-6 
                      border border-[#D4A373]/20 hover:border-[#D4A373]/40
                      transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animation: 'fadeInUp 0.6s ease-out forwards'
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-[#D4A373]/20 rounded-full flex items-center justify-center">
                          <CategoryIcon className="text-[#3A2E2E] text-xl" />
                        </div>
                        <div>
                          <h3 className="font-headings text-[#3A2E2E] text-lg font-medium">
                            {category.categoryName}
                          </h3>
                          <p className="text-[#3A2E2E]/60 text-sm">
                            Category ID: {category._id.slice(-6)}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteCategory(category._id, category.categoryName)}
                        disabled={isDeleting === category._id}
                        className="group/delete p-3 text-red-400 hover:text-red-600 hover:bg-red-50 
                          rounded-xl transition-all duration-300 
                          disabled:opacity-50 disabled:cursor-not-allowed
                          flex items-center space-x-2"
                      >
                        {isDeleting === category._id ? (
                          <div className="w-5 h-5 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin"></div>
                        ) : (
                          <DeleteOutlineIcon className="transition-transform duration-200 group-hover/delete:scale-110" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CSS Animation for fade-in effect */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default AddCategory;