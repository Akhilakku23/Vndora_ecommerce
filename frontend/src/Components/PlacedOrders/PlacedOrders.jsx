import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import route from '../route';
import './PlacedOrders.scss';
import { useNavigate } from 'react-router-dom';

const PlacedOrders = ({ setUsername, setRole, setLoggedIn }) => {
    const navigate=useNavigate();
  const value=localStorage.getItem("Auth")
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    fetchProducts();
  },[]);
  const fetchProducts = async () => {
    try {
      const {status,data}=await axios.get(`${route()}ordersplaced`,{headers:{"Authorization":`Bearer ${value}`}})
      if(status){
        setUsername(data.username);
        setRole(data.role);
        setLoggedIn(true);
        setOrders(data.orders);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };
  const confirmShipping=async(oid)=>{
    console.log(oid);
    
    const { status, data } = await axios.put(`${route()}confirmorder`, { oid }, { headers: { "Authorization": `Bearer ${value}` } });
            if (status === 201) {
                alert(data.msg);
                if(data.msg=="success")
                    alert("Shipping started")
                navigate("/company")
            }
  }
  return (
    <div className="PlacedOrders">
          {orders && orders.length > 0 ? (
            orders.map((order) => (
              <div key={order._id} className="product-card">
                {/* Product Images */}
                    <div className="image-gallery">
                        <img
                          src={order.product.pimages[0]}
                          alt={`Product Image`}
                          className="product-image"
                        />
                    </div>
                <div className="bottom">
                  <div className="left">
              
                    <div className="product-info">
                      <span className='product-category'>{order.email}</span>
                    </div>
                   
                    <div className="product-info">
                       <span className='product-name'>{order.sname}</span>
                    </div>
    
                    <div className="product-info">
                      <span className='product-price'>{order.product.pname.toUpperCase()}</span> 
                    </div>
                  </div>
                  
                    <button className="edit-btn" onClick={()=>{confirmShipping(order._id)}}>
                      Add to shipping
                    </button>
                </div>
              </div>
            ))
          ) : (
            <p>No orders placed!! </p>
          )}
        </div>
  );
}

export default PlacedOrders;
