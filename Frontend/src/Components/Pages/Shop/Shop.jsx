import React, { useState, useEffect } from 'react';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import SingleProduct from '../Home/SingleProduct';
import { Search } from '@mui/icons-material';

const Shop = () => {
  const axiosPrivate = useAxiosPrivate();
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({ price: '' });
  const [searchQuery, setSearchQuery] = useState('');

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

  const groupedProducts = filteredData.reduce((acc, product) => {
    const category = product.categoryName || 'Uncategorized';
    if (!acc[category]) acc[category] = [];
    acc[category].push(product);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5ebe0] to-[#f9f4f1]">
      <div className="container mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold text-[#40322e] mb-4 font-headings">Our Collection</h1>
          <p className="text-[#5c4033] text-lg max-w-2xl mx-auto">Discover our curated collection of handpicked fashion pieces</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg mb-12">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            {/* Filter */}
            <div className="w-full md:w-1/3">
              <label htmlFor="price" className="block text-[#40322e] text-sm font-semibold mb-2">
                Filter by Price Range
              </label>
              <select
                id="price"
                value={filters.price}
                onChange={(e) => setFilters({ ...filters, price: e.target.value })}
                className="w-full p-3 rounded-lg border-2 border-[#5c4033]/20 bg-white text-[#40322e] 
                          transition-all duration-200 focus:border-[#5c4033] focus:ring-2 focus:ring-[#5c4033]/20"
              >
                <option value="">All Prices</option>
                <option value="<3999">Less than ₹3,999</option>
                <option value="<2500">Less than ₹2,500</option>
                <option value="<1000">Less than ₹1,000</option>
                <option value=">=4000">More than ₹4,000</option>
              </select>
            </div>

            {/* Search */}
            <div className="w-full md:w-2/3">
              <label htmlFor="search" className="block text-[#40322e] text-sm font-semibold mb-2">
                Search Products
              </label>
              <div className="relative">
                <input
                  id="search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products..."
                  className="w-full p-3 pl-12 rounded-lg border-2 border-[#5c4033]/20 bg-white text-[#40322e] 
                            transition-all duration-200 focus:border-[#5c4033] focus:ring-2 focus:ring-[#5c4033]/20"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5c4033]/60" />
              </div>
            </div>
          </div>
        </div>

        {/* Product Categories */}
        {Object.keys(groupedProducts).length > 0 ? (
          Object.keys(groupedProducts).map((category) => (
            <div key={category} className="mb-16">
              <div className="relative mb-8">
                <h2 className="text-3xl font-semibold text-[#40322e] text-center">
                  {category}
                </h2>
                <div className="absolute inset-x-0 -bottom-4 h-1 bg-gradient-to-r from-transparent via-[#5c4033]/30 to-transparent" />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {groupedProducts[category].map((product) => (
                  <SingleProduct 
                    key={product._id} 
                    product={product}
                    className="hover:translate-y-[-4px]"
                  />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-[#5c4033]">No products found matching your criteria.</p>
            <button 
              onClick={() => { setSearchQuery(''); setFilters({ price: '' }); }}
              className="mt-4 px-6 py-2 bg-[#5c4033] text-white rounded-lg hover:bg-[#40322e] transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;