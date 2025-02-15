import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import route from '../route';
import './Products.scss';
import { Link, useParams } from 'react-router-dom';

const Products = ({ setUsername, setRole, setLoggedIn }) => {
  const {category}=useParams();
  const value=localStorage.getItem("Auth")
  const [products, setProducts] = useState([]);
  useEffect(() => {
    fetchProducts();
  },[]);
  const fetchProducts = async () => {
    try {
      const {status,data}=await axios.get(`${route()}products/${category}`,{headers:{"Authorization":`Bearer ${value}`}})
      if(status){
        setUsername(data.username);
        setRole(data.role);
        setLoggedIn(true);
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };
  return (
    <div className="productss-container">
      {products && products.length > 0 ? (
        products.map((product) => (
          <div key={product._id} className="product-card">
            {/* Product Images */}
            {product.pimages && product.pimages.length > 0 && (
                <div className="image-gallery">
                    <img
                      src={product.pimages[0]}
                      alt={`Product Image`}
                      className="product-image"
                    />
                </div>
            )}
            <div className="bottom">
              <div className="left">
                {/* Category */}
                <div className="product-info">
                  <span className='product-category'>{product.category.toUpperCase()}</span>
                </div>
                {/* Product name */}
                <div className="product-info">
                   <span className='product-name'>{product.pname}</span>
                </div>

                {/* Price */}
                <div className="product-info">
                  <span className='product-price'>${product.price.toFixed(2)}</span> 
                </div>
              </div>
              <Link to={`/editproduct/${product._id}`}>
                <button className="edit-btn">
                  Edit Product
                </button>
              </Link>
            </div>
          </div>
        ))
      ) : (
        <p>No products available</p>
      )}
    </div>
  );
};

export default Products;
