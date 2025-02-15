import React, { useEffect, useState } from 'react';
import route from '../route';
import axios from 'axios';
import Sidebar from '../sidebar/Sidebar';
import './Home.scss';
import { Link, useNavigate } from 'react-router-dom';

const Home = ({ setUsername, setRole, setLoggedIn }) => {
  const navigate = useNavigate();
  const value = localStorage.getItem('Auth');
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getDetails();
  }, []);

  const getDetails = async () => {
    try {
      if (value) {
        const res = await axios.get(`${route()}home`, { headers: { Authorization: `Bearer ${value}` } });
        if (res.status === 200) {
          setUsername(res.data.username || '');
          setRole(res.data.role || '');
          setLoggedIn(true);
          setProducts(res.data.products || []);
        } else if (res.status === 403) {
          setLoggedIn(false);
        }
      } else {
        navigate('/login');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div className='home'>
      <Sidebar setProducts={setProducts} />
      <div className='products-container'>
        {products && products.length > 0 ? (
          products.map((product) => (
            <Link to={`/product/${product._id}`} key={product._id} className='product-card'>
              <div className='product-images'>
                <img src={product.pimages?.[0] || 'placeholder.jpg'} alt={product.pname || 'No name'} className='product-image' />
              </div>
              <div className='bottom'>
                <div className='product-info'>
                  <span className='product-name'>{product.pname || 'Unknown'}</span>
                </div>
                <div className='product-info'>
                  <span className='product-price'>${(product.price ?? 0).toFixed(2)}</span>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p>No products available</p>
        )}
      </div>
    </div>
  );
};

export default Home;
