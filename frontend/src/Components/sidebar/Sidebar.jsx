import React, { useState, useEffect } from 'react';
import route from '../route';
import axios from 'axios';
import './Sidebar.scss';
import { FaSearch } from 'react-icons/fa';

const Sidebar = ({ setProducts }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sideProducts, setSideProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const value = localStorage.getItem('Auth');

  useEffect(() => {
    getDetails();
  }, []);

  const getDetails = async () => {
    try {
      if (value) {
        const { data, status } = await axios.get(`${route()}home`, {
          headers: { Authorization: `Bearer ${value}` },
        });
        if (status === 200) {
          setSideProducts(data.products || []);
          setCategories(data.categories || []);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSearchChange = (e) => {
    const searchValue = e.target.value;
    setSearchTerm(searchValue);
    filterProducts(searchValue, selectedCategory, minPrice, maxPrice);
  };

  const handleMinPriceChange = (e) => {
    const newMinPrice = e.target.value;
    setMinPrice(newMinPrice);
    filterProducts(searchTerm, selectedCategory, newMinPrice, maxPrice);
  };

  const handleMaxPriceChange = (e) => {
    const newMaxPrice = e.target.value;
    setMaxPrice(newMaxPrice);
    filterProducts(searchTerm, selectedCategory, minPrice, newMaxPrice);
  };

  const handleCategoryChange = (e) => {
    const categoryValue = e.target.value;
    setSelectedCategory(categoryValue);
    filterProducts(searchTerm, categoryValue, minPrice, maxPrice);
  };

  const filterProducts = (search, category, min, max) => {
    const filtered = sideProducts.filter(
      (i) =>
        i.pname.toLowerCase().includes(search.toLowerCase()) &&
        i.category.toLowerCase().includes(category.toLowerCase()) &&
        (min === '' || i.price >= parseInt(min, 10)) &&
        (max === '' || i.price <= parseInt(max, 10))
    );
    setProducts(filtered);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>Filters</h3>
      </div>

      {/* Search Bar */}
      <div className="group">
        <FaSearch className="icon" />
        <input
          className="input"
          type="text"
          id="search"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search Products..."
        />
      </div>

      {/* Category Filter */}
      <div className="category-filter">
        <label htmlFor="categories">Category:</label>
        <select id="categories" value={selectedCategory} onChange={handleCategoryChange}>
          <option value="">All Categories</option>
          {categories.map((cat, ind) => (
            <option key={ind} value={cat?.category || ''}>
              {cat?.category ? cat.category.toUpperCase() : 'UNKNOWN'}
            </option>
          ))}
        </select>
      </div>

      {/* Price Filter with Input Boxes */}
      <div className="price-filter">
        <label htmlFor="minPrice">Min Price:</label>
        <input
          type="number"
          id="minPrice"
          placeholder="Enter min price"
          value={minPrice}
          onChange={handleMinPriceChange}
        />

        <label htmlFor="maxPrice">Max Price:</label>
        <input
          type="number"
          id="maxPrice"
          placeholder="Enter max price"
          value={maxPrice}
          onChange={handleMaxPriceChange}
        />
      </div>
    </div>
  );
};

export default Sidebar;
