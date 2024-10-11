import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";

const AddCategory = () => {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const [formData, setFormData] = useState({ categoryName: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log(formData);
      const response = await axiosPrivate.post("/admin/addCategory",
        JSON.stringify(formData),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );
      console.log(response);
      if (response.status === 201) {

        navigate("/account/admin");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="mt-20 px-sectionPadding max-md:px-mobileScreenPadding pt-10 font-texts">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Add a New Category
      </h1>
      <div className="w-full max-w-2xl mx-auto bg-[#f9f4f1] p-8 rounded-lg shadow-lg">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-lg font-semibold mb-2 text-[#5c4033]" htmlFor="name">
              Category Name:
            </label>
            <input
              className="block w-full text-sm text-[#40322e] border border-[#5c4033] rounded-lg p-2 focus:outline-none focus:ring focus:border-blue-300"
              type="text"
              id="name"
              name="categoryName"
              value={formData.categoryName}
              onChange={handleChange}
              placeholder="Enter category name"
            />
          </div>
          <div className="text-center">
            <button type="submit" className="bg-[#5c4033] text-[#fff7ec] font-bold py-2 px-4 rounded-lg shadow hover:bg-[#6a4c39]">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategory;
