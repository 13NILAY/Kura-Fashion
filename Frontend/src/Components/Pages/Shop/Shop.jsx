import React, { useState, useEffect } from 'react';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import SingleProduct from '../Home/SingleProduct';
import { Search } from '@mui/icons-material'; 

const Shop = () => {
  const axiosPrivate=useAxiosPrivate();
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({ price: '' });
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch product data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosPrivate.get('/product/allProducts');
        setProducts(response.data.data); 
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  // Filter products by price and search term
  const filteredData = products.filter((product) => {
    let matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    let matchesPrice = true;
    
    if (filters.price) {
      if (filters.price === '<3999' && product.cost.value >= 3999) matchesPrice = false;
      if (filters.price === '<2500' && product.cost.value >= 2500) matchesPrice = false;
      if (filters.price === '<1000' && product.cost.value >= 1000) matchesPrice = false;
      if (filters.price === '>=4000' && product.cost.value < 4000) matchesPrice = false;
    }

    return matchesSearch && matchesPrice;
  });

  // Handle search input
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Group products by category
  const groupedProducts = filteredData.reduce((acc, product) => {
    const category = product.categoryName || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {});

  return (
    <div className="relative bg-[#f5ebe0] min-h-screen">
      {/* Search and Filters */}
      <div className="mt-20 px-4 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center py-4 space-y-4 md:space-y-0">
          {/* Filter and Label in One Line */}
          <div className="flex items-center w-full md:w-1/4 text-[#40322e] text-xl flex-shrink-0">
            <label htmlFor="price" className="mr-2 text-2xl">Filters</label>
            <select
              id="price"
              value={filters.price}
              onChange={(e) => setFilters({ ...filters, price: e.target.value })}
              className="w-full p-2 border border-[#5c4033] bg-[#f9f4f1] text-[#40322e] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5c4033]"
            >
              <option value="">All</option>
              <option value="<3999">Less than ₹3,999</option>
              <option value="<2500">Less than ₹2,500</option>
              <option value="<1000">Less than ₹1,000</option>
              <option value=">=4000">More than ₹4,000</option>
            </select>
          </div>

          {/* Search Bar with Adjusted Width and Margin */}
          <div className="flex items-center w-full md:w-1/2 md:ml-4 text-xl">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search shop..."
              className="w-full p-2 border border-[#5c4033] rounded-l-lg outline-none bg-[#f9f4f1] text-[#40322e] focus:ring-2 focus:ring-[#5c4033]"
            />
            <button onClick={() => {}} className="bg-[#5c4033] p-2 rounded-r-lg">
              <Search className="text-[#fff7ec]" />
            </button>
          </div>
        </div>
      </div>

      {/* Product Display */}
      <div className="px-4 lg:px-8 py-6">
        {Object.keys(groupedProducts).length > 0 ? (
          Object.keys(groupedProducts).map((category) => (
            <div key={category} className="mb-12">
              {/* Category Name Centered */}
              <h1 className="text-4xl font-semibold text-[#5c4033] mb-6 text-center border-b-2 border-[#5c4033] pb-2">
                {category}
              </h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {groupedProducts[category].map((product) => (
                  <SingleProduct key={product._id} product={product} />
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className="text-lg text-[#5c4033] text-center">No products found.</p>
        )}
      </div>
    </div>
  );
};

export default Shop;
