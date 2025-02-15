import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import route from '../route';
import axios from 'axios';
import './Cart.scss';
import { FiMinus, FiPlus } from 'react-icons/fi';

const Cart = ({ setUsername, setRole, setLoggedIn }) => {
  const navigate = useNavigate();
  const value = localStorage.getItem('Auth');
  const [cartItems, setCartItems] = useState([]);
  const [quantities, setQuantities] = useState([]);
  const [priceTotal, setPriceTotal] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [newAddress, setNewAddress] = useState({
    houseName: '',
    pincode: '',
    postOffice: '',
    place: '',
  });
  const [showAddressForm, setShowAddressForm] = useState(false); // state to toggle form visibility

  // Fetch cart data on component mount
  useEffect(() => {
    getCart();
  }, []);

  const getCart = async () => {
    const { status, data } = await axios.get(`${route()}getcart`, { headers: { "Authorization": `Bearer ${value}` } });
    if (status === 200) {
      setUsername(data.username);
      setRole(data.role);
      setLoggedIn(true);
      setCartItems(data.cart);
      setQuantities(data.cart.map(item => item.quantity));
      setPriceTotal(data.cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0));
      setAddresses(data.addresses.addresses);
    }
  };

  const handleRemove = (id) => {
    localStorage.removeItem(id);
    const newItems = cartItems.filter((item) => item.id !== id);
    setCartItems(newItems);
    updateTotal(newItems, quantities);
  };

  const handleQuantityChange = async (index, id, type) => {
    const { status, data } = await axios.post(`${route()}editquantity`, { id, quantity: quantities[index], type }, { headers: { "Authorization": `Bearer ${value}` } });
    if (status === 201) {
      getCart();
    }
  };

  const updateTotal = (items, qty) => {
    let totalAmount = 0;
    items.forEach((item, index) => {
      const cost = item.product.price - (item.product.price * item.discountPercentage) / 100;
      totalAmount += cost * qty[index];
    });
    setPriceTotal(totalAmount + 5); // Add delivery charge
  };

  const handleCart = async () => {
    if (selectedAddress) {
      try {
        const { status, data } = await axios.post(
          `${route()}placeorder`,
          { selectedAddress },
          { headers: { "Authorization": `Bearer ${value}` } }
        );

        if (status === 201 && data.msg1 === "success") {
          navigate('/purchasecompleted');
        } else {
          alert("Order placement failed. Please try again.");
        }
      } catch (error) {
        console.error("Error placing order:", error);
        alert("An error occurred while placing the order. Please try again.");
      }
    } else {
      alert("Please select an address.");
    }
  };

  const handleAddressChange = (e) => {
    setNewAddress({ ...newAddress, [e.target.name]: e.target.value });
  };

  const handleAddAddress = async () => {
    try {
      const { status, data } = await axios.post(`${route()}addaddress`, newAddress, { headers: { "Authorization": `Bearer ${value}` } });
      if (status === 201) {
        setAddresses([...addresses, data.address]);
        setNewAddress({
          houseName: '',
          pincode: '',
          postOffice: '',
          place: '',
        });
        setShowAddressForm(false); // Hide form after adding
      } else {
        alert("Failed to add address. Please try again.");
      }
    } catch (error) {
      console.error("Error adding address:", error);
      alert("An error occurred while adding the address. Please try again.");
    }
  };

  return (
    <div className="cartt-container">
      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <h2>Cart empty..</h2>
          <Link to={'/'}>Go to products</Link>
        </div>
      ) : (
        <div className="cart">
          <div id="carts" className="cart-items">
            {cartItems.map((item, index) => (
              <div key={index} className="cart-item">
                <table>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Title</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <div className="image">
                          <Link to={`/product/${item.product._id}`}>
                            <img
                              src={item.product.pimages[0]}
                              alt={item.product.pname}
                              title="View product"
                            />
                          </Link>
                        </div>
                      </td>
                      <td><div className="content"><h4>{item.product.pname}</h4></div></td>
                      <td><div className="content"><h3>${item.product.price}</h3></div></td>
                      <td>
                        <div className="content">
                          <div className="quantity">
                            <span className="decrease" onClick={() => handleQuantityChange(index, item._id, 'decrease')}><FiMinus size={24} /></span>
                            <span className="quantity-text">{quantities[index]}</span>
                            <span className="increase" onClick={() => handleQuantityChange(index, item._id, 'increase')}><FiPlus size={24} /></span>
                          </div>
                        </div>
                      </td>
                      <td><div className="content"><h5>${item.product.price * quantities[index]}</h5></div></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <div className="summary-details">
              <h2>Payment Details</h2>
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Quantity</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item, index) => (
                    <tr key={index}>
                      <td>{item.product.pname}</td>
                      <td>{quantities[index]}</td>
                      <td>${item.product.price * quantities[index]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="payment-details">
              <div className="details">
                <p className="discount">Discount: 20%</p>
                <p>Delivery Charge: $5</p>
                <p className="total-price">Total Price: ${priceTotal.toFixed(2)}</p>
                <p className="total-amount">Total Amount: ${((priceTotal - (priceTotal * 0.2)) + 5).toFixed(2)}</p>
              </div>

              {/* Address Select Dropdown */}
              <div className="address-select">
                <select
                  value={selectedAddress}
                  onChange={(e) => setSelectedAddress(e.target.value)}
                >
                  <option value="">Select Address</option>
                  {addresses.map((address, index) => (
                    <option key={index} value={address._id}>
                      {address.houseName}, {address.pincode}, {address.postOffice}, {address.place}
                    </option>
                  ))}
                </select>
              </div>

              {/* Add New Address Form */}
              <div className="address-toggle-button">
                <button onClick={() => setShowAddressForm(!showAddressForm)}>
                  {showAddressForm ? "Cancel" : "Add New Address"}
                </button>
              </div>

              {showAddressForm && (
                <div className="new-address-form">
                  <h3>Add New Address</h3>
                  <input
                    type="text"
                    name="houseName"
                    value={newAddress.houseName}
                    onChange={handleAddressChange}
                    placeholder="House Name"
                  />
                  <input
                    type="text"
                    name="pincode"
                    value={newAddress.pincode}
                    onChange={handleAddressChange}
                    placeholder="Pincode"
                  />
                  <input
                    type="text"
                    name="postOffice"
                    value={newAddress.postOffice}
                    onChange={handleAddressChange}
                    placeholder="Post Office"
                  />
                  <input
                    type="text"
                    name="place"
                    value={newAddress.place}
                    onChange={handleAddressChange}
                    placeholder="Place"
                  />
                  <button onClick={handleAddAddress}>Add Address</button>
                </div>
              )}

              <div className="payment-button">
                <button onClick={handleCart}>Place Order</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
