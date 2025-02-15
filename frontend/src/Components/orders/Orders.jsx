import React, { useEffect, useState } from 'react';
import route from '../route';  // Ensure that the route function is configured correctly
import axios from 'axios';
import './Orders.scss';  // Create a similar stylesheet as Wishlist.scss
import { Link } from 'react-router-dom';

const Orders = ({ setUsername, setRole, setLoggedIn }) => {
  const value = localStorage.getItem('Auth');
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getDetails();
  }, []);

  const getDetails = async () => {
    try {
      if (value !== null) {
        const res = await axios.get(`${route()}getorders`, {
          headers: { "Authorization": `Bearer ${value}` }
        });
        if (res.status === 200) {
          setUsername(res.data.username);
          setRole(res.data.role);
          setLoggedIn(true);
          setOrders(res.data.orders); 
        } 
      }
    } catch (error) {
      console.log("error");
    }
  };

  return (
    <div className='Orders'>
      <h1 className="orders-heading">Orders</h1>
      <div className="orders-container">
        {orders && orders.length > 0 ? (
          orders.map((order) => (
            <div key={order._id} className="order-card">
              <Link to={`/product/${order.product._id}`}>
                {/* First content (order image or product details) */}
                <div className="first-content">
                  <img
                    src={order.product.pimages[0]}  // Adjust if order object has productImage or similar field
                    alt={`Order Image`}
                    className="order-image"
                  />
                </div>

                {/* Second content (order details or product name) */}
                <div className="second-content">
                  <span className='order-name'>{order.product.pname}</span>
                  <span className='order-name'>size-{order.sizeOrColor}</span>
                  <span className='order-name'>quatity-{order.quantity}</span>
                  <span className='order-name'>{order.shipped?"Shipped successfully":"Not yet shipped"}</span>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <p>No orders available</p>
        )}
      </div>
    </div>
  );
};

export default Orders;
