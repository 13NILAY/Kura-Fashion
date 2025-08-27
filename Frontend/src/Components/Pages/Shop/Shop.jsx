import React, { useState, useEffect } from 'react';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import SingleProduct from '../Home/SingleProduct';
import { Search, FilterAlt } from '@mui/icons-material';

const Shop = () => {
  const axiosPrivate = useAxiosPrivate();
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({ price: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axiosPrivate.get('/product/allProducts');
        setProducts(response.data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
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

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F8F5F2] to-[#EADBC8] pt-24 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Loading Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-0.5 bg-[#D4A373]/30 animate-pulse"></div>
              <div className="mx-4 w-48 h-12 bg-[#3A2E2E]/20 rounded-lg animate-pulse"></div>
              <div className="w-16 h-0.5 bg-[#D4A373]/30 animate-pulse"></div>
            </div>
            <div className="w-96 max-w-full h-8 bg-[#3A2E2E]/15 rounded-lg mx-auto animate-pulse"></div>
          </div>

          {/* Loading Filters */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg mb-12 animate-pulse">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/3 h-20 bg-[#3A2E2E]/10 rounded-lg"></div>
              <div className="w-full md:w-2/3 h-20 bg-[#3A2E2E]/10 rounded-lg"></div>
            </div>
          </div>

          {/* Loading Products */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg animate-pulse">
                <div className="aspect-square bg-[#D4A373]/20 rounded-xl mb-6"></div>
                <div className="space-y-4">
                  <div className="h-6 bg-[#3A2E2E]/20 rounded-lg w-full"></div>
                  <div className="h-5 bg-[#3A2E2E]/15 rounded-lg w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F5F2] to-[#EADBC8] relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 left-20 w-96 h-96 bg-[#D4A373]/5 rounded-full blur-3xl animate-pulse" 
          style={{animationDuration: '4s'}}></div>
        <div className="absolute bottom-40 right-20 w-80 h-80 bg-[#3A2E2E]/3 rounded-full blur-3xl animate-pulse" 
          style={{animationDuration: '6s', animationDelay: '2s'}}></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 relative">
        {/* Header */}
        <div className="text-center mb-16">
          {/* Decorative line and subtitle */}
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-0.5 bg-[#D4A373]"></div>
            <span className="mx-4 text-[#3A2E2E]/60 text-sm font-medium tracking-widest uppercase">
              Premium Collection
            </span>
            <div className="w-16 h-0.5 bg-[#D4A373]"></div>
          </div>
          
          <h1 className="font-headings text-[#3A2E2E] text-4xl sm:text-5xl lg:text-6xl font-light mb-6 leading-tight">
            Our
            <span className="block text-[#D4A373] font-normal">Collection</span>
          </h1>
          
          <p className="text-lg text-[#3A2E2E]/70 max-w-2xl mx-auto leading-relaxed">
            Discover our curated collection of handpicked fashion pieces, crafted with precision and designed for the modern connoisseur.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 mb-12 overflow-hidden">
          {/* Mobile Filter Toggle */}
          <div className="md:hidden p-4 border-b border-white/20">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full flex items-center justify-between px-4 py-3 bg-[#3A2E2E] text-[#EADBC8] 
                rounded-xl font-medium transition-all duration-300 hover:bg-[#2C2C2C]"
            >
              <span className="flex items-center">
                <FilterAlt className="mr-2" />
                Filters & Search
              </span>
              <svg 
                className={`w-5 h-5 transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Filter Content */}
          <div className={`p-6 ${showFilters || 'hidden md:block'}`}>
            <div className="flex flex-col md:flex-row gap-6 items-center">
              {/* Price Filter */}
              <div className="w-full md:w-1/3">
                <label htmlFor="price" className="block text-[#3A2E2E] text-sm font-semibold mb-2">
                  Filter by Price Range
                </label>
                <select
                  id="price"
                  value={filters.price}
                  onChange={(e) => setFilters({ ...filters, price: e.target.value })}
                  className="w-full p-3 rounded-xl border-2 border-[#D4A373]/20 bg-white text-[#3A2E2E] 
                    transition-all duration-300 focus:border-[#D4A373] focus:ring-2 focus:ring-[#D4A373]/20
                    focus:outline-none"
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
                <label htmlFor="search" className="block text-[#3A2E2E] text-sm font-semibold mb-2">
                  Search Products
                </label>
                <div className="relative">
                  <input
                    id="search"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for products..."
                    className="w-full p-3 pl-12 rounded-xl border-2 border-[#D4A373]/20 bg-white text-[#3A2E2E] 
                      transition-all duration-300 focus:border-[#D4A373] focus:ring-2 focus:ring-[#D4A373]/20
                      focus:outline-none placeholder-[#3A2E2E]/50"
                  />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3A2E2E]/60" />
                </div>
              </div>
            </div>

            {/* Active Filters Display */}
            {(filters.price || searchQuery) && (
              <div className="mt-4 pt-4 border-t border-white/20">
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-sm text-[#3A2E2E]/70 font-medium">Active filters:</span>
                  
                  {filters.price && (
                    <span className="inline-flex items-center px-3 py-1 bg-[#D4A373]/20 text-[#3A2E2E] 
                      rounded-full text-sm font-medium">
                      Price: {filters.price === '<3999' ? 'Under ₹3,999' :
                             filters.price === '<2500' ? 'Under ₹2,500' :
                             filters.price === '<1000' ? 'Under ₹1,000' :
                             'Over ₹4,000'}
                      <button
                        onClick={() => setFilters({ ...filters, price: '' })}
                        className="ml-2 text-[#3A2E2E]/70 hover:text-[#3A2E2E]"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  
                  {searchQuery && (
                    <span className="inline-flex items-center px-3 py-1 bg-[#D4A373]/20 text-[#3A2E2E] 
                      rounded-full text-sm font-medium">
                      Search: "{searchQuery}"
                      <button
                        onClick={() => setSearchQuery('')}
                        className="ml-2 text-[#3A2E2E]/70 hover:text-[#3A2E2E]"
                      >
                        ×
                      </button>
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-8">
          <p className="text-[#3A2E2E]/70 text-lg">
            Showing <span className="font-semibold text-[#D4A373]">{filteredData.length}</span> products
            {Object.keys(groupedProducts).length > 1 && 
              ` across ${Object.keys(groupedProducts).length} categories`
            }
          </p>
        </div>

        {/* Product Categories */}
        {Object.keys(groupedProducts).length > 0 ? (
          Object.keys(groupedProducts).map((category, categoryIndex) => (
            <div key={category} className="mb-20">
              {/* Category Header */}
              <div className="text-center mb-12">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-0.5 bg-[#D4A373]"></div>
                  <span className="mx-3 text-[#3A2E2E]/60 text-xs font-medium tracking-widest uppercase">
                    Category
                  </span>
                  <div className="w-12 h-0.5 bg-[#D4A373]"></div>
                </div>
                
                <h2 className="font-headings text-[#3A2E2E] text-3xl sm:text-4xl font-light mb-2">
                  {category}
                </h2>
                
                <p className="text-sm text-[#3A2E2E]/60">
                  {groupedProducts[category].length} item{groupedProducts[category].length !== 1 ? 's' : ''} available
                </p>
              </div>
              
              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 sm:gap-8">
                {groupedProducts[category].map((product, index) => (
                  <div 
                    key={product._id}
                    className="group transform transition-all duration-500 hover:scale-[1.02]"
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animation: 'fadeInUp 0.8s ease-out forwards'
                    }}
                  >
                    <SingleProduct 
                      product={product}
                      className="h-full"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          /* No Results State */
          <div className="text-center py-20">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-12 max-w-md mx-auto 
              shadow-xl border border-white/30">
              
              {/* Empty State Icon */}
              <div className="w-20 h-20 bg-[#D4A373]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="text-4xl text-[#3A2E2E]/50" />
              </div>
              
              <h3 className="text-2xl font-headings text-[#3A2E2E] mb-4">
                No Products Found
              </h3>
              
              <p className="text-[#3A2E2E]/70 mb-8 leading-relaxed">
                We couldn't find any products matching your search criteria. 
                Try adjusting your filters or search terms.
              </p>
              
              <button 
                onClick={() => { 
                  setSearchQuery(''); 
                  setFilters({ price: '' }); 
                }}
                className="px-8 py-3 bg-[#3A2E2E] text-[#EADBC8] rounded-xl font-medium
                  transition-all duration-300 hover:bg-[#2C2C2C] hover:shadow-lg 
                  transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#D4A373]/50"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CSS Animation for fade-in effect */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
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

export default Shop;