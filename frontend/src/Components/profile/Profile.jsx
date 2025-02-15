import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaUserCircle,FaEllipsisH,FaEdit, FaTimes  } from "react-icons/fa";
import axios from "axios";
import route from "../route";
import './Profile.scss';

const Profile = ({setUsername,setRole,setLoggedIn}) => {
  const value=localStorage.getItem('Auth');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingAddresses, setIsEditingAddresses] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [profile, setProfile] = useState({});
  const [phoneError, setPhoneError] = useState(""); // For phone number validation
  const [isProfileValid, setIsProfileValid] = useState(true); // To track overall profile validation
  const [countCart,setCountCart]=useState(0);
  const [countWishlist,setCountWishlist]=useState(0);
  const [countOrders,setCountOrders]=useState(0);
  const [showPopover, setShowPopover] = useState(null);
  const [position,setPosition]=useState(0)
  useEffect(()=>{
    getEssentials();
  },[])
  const getEssentials=async()=>{
    try {
      
      const {status,data}=await axios.get(`${route()}profile`,{headers:{"Authorization":`Bearer ${value}`}});
      if (status==200) {
        setUsername(data.username);
        setRole(data.role);
        setLoggedIn(true);
        if(data.profile)
          setProfile({...data.profile});
        if(data.address)
          setAddresses(data.address.addresses);
        setCountCart(data.cart);
        setCountWishlist(data.wishlist);
        setCountOrders(data.orders)
      }
    }
     catch (error) {
      console.log("error");
    }
  }
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "phone") {
      // Validate phone number (example: 10 digits only)
      const phonePattern = /^[0-9]{10}$/;
      if (!phonePattern.test(value)) {
        setPhoneError("Phone number must be 10 digits.");
        setIsProfileValid(false);
      } else {
        setPhoneError("");
        setIsProfileValid(true);
      }
    }
  };

  const handlePopoverToggle = (index) => {
    setShowPopover(showPopover === index ? null : index);
  };
  const handleSubmitProfile=async()=>{
    if(isEditingProfile){
      const {status,data}=await axios.post(`${route()}edituser`,profile,{headers:{"Authorization":`Bearer ${value}`}});
      if (status===201) {
        alert(data.msg);
      }else{
        alert("error");
      }
      setIsEditingProfile(!isEditingProfile);
      getEssentials();
    }
    else{
      setIsEditingProfile(!isEditingProfile);
    }
  }
  const handleAddressChange = (index, e) => {
    const { name, value } = e.target;
    const updatedAddresses = [...addresses];
    updatedAddresses[index] = {
      ...updatedAddresses[index],
      [name]: value,
    };
    setAddresses(updatedAddresses);
  };

  const handleAddAddress = () => {
    setAddresses([
      ...addresses,
      { houseNumber: "", houseName: "", place: "", pincode: "", postOffice: "" },
    ]);
    setPosition(addresses.length);
    setIsEditingAddresses(!isEditingAddresses);
  };
  const handleEditAddress=(ind)=>{
    setPosition(ind);
    setIsEditingAddresses(!isEditingAddresses);
  }
  const handleSubmitAddress=async()=>{
    if(isEditingAddresses){
      const {status,data}=await axios.post(`${route()}editaddress`,addresses,{headers:{"Authorization":`Bearer ${value}`}});
      if (status===201) {
        alert(data.msg)
      }else{
        alert("error")
      }
      setPosition(0);
      setIsEditingAddresses(!isEditingAddresses);
      getEssentials();
    }
    else{
      setIsEditingAddresses(!isEditingAddresses);
    }
  }
  const handleCancelAddress=()=>{
    if(addresses[position].houseName=='')
      addresses.pop();
    setPosition(0);
    setIsEditingAddresses(!isEditingAddresses);
    getEssentials();
  }
  
  return (
    <div className="profile-container">
      {/* Profile Section */}
      {/* Profile Section */}
      <div className="profile-header">
        <h1>Your Details</h1>
        <div className="profile-pic">
          <FaUserCircle size={40} /> <p>Hi {profile.fname},</p>
        </div>
        <div className="profile-info">
          <div className="input-container">
            <div className="input-wrapper">
              <input
                type="text"
                name="fname"
                id="fname"
                value={profile.fname}
                onChange={handleProfileChange}
                disabled={!isEditingProfile}
                placeholder=" "
                className="input"
              />
              <label htmlFor="fname" className="input-label">First Name</label>
            </div>

            <div className="input-wrapper">
              <input
                type="text"
                name="lname"
                id="lname"
                value={profile.lname}
                onChange={handleProfileChange}
                disabled={!isEditingProfile}
                placeholder=" "
                className="input"
              />
              <label htmlFor="lname" className="input-label">Last Name</label>
            </div>

            <div className="input-wrapper">
              <input
                type="text"
                name="phone"
                id="phone"
                value={profile.phone}
                onChange={handleProfileChange}
                disabled={!isEditingProfile}
                placeholder=" "
                className="input"
              />
              <label htmlFor="phone" className="input-label">Phone Number</label>
              {phoneError && <p className="error-text">{phoneError}</p>}
            </div>
          </div>

          <div className="gender">
            <label>Gender:</label>
            <label>
              <input
                type="radio"
                name="gender"
                value="male"
                checked={profile.gender === "male"}
                onChange={handleProfileChange}
                disabled={!isEditingProfile}
              />
              Male
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="female"
                checked={profile.gender === "female"}
                onChange={handleProfileChange}
                disabled={!isEditingProfile}
              />
              Female
            </label>
          </div>
          <button
            onClick={handleSubmitProfile}
            disabled={!isProfileValid} // Disable button if profile is invalid
          >
            {isEditingProfile ? "Save Profile" : "Edit Profile"}
          </button>
        </div>
      </div>

      {/* Addresses Section */}
      <div className="address-section">
        <div className="navHeader">
          <div className="head">
            <Link to={'/mywishlist'}>Your Wishlist
            <div className="count">{countWishlist}</div></Link>
          </div>
          <div className="border"></div>
          <div className="head">
          <Link to={'/myorders'}>Your Orders
          <div className="count">{countOrders}</div></Link>
          </div>
          <div className="border"></div>
          <div className="head">
            <Link to={'/cart'}>Your Cart
            <div className="count">{countCart}</div></Link>
          </div>
        </div>
        <div className="title">
        <h3>Addresses</h3>
        <button onClick={handleAddAddress} className="add-button" title="Add New Address">
          <svg className="add-icon" viewBox="0 0 24 24" height="30px" width="30px" xmlns="http://www.w3.org/2000/svg">
            <path strokeWidth="1.5" d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"></path>
            <path strokeWidth="1.5" d="M8 12H16"></path>
            <path strokeWidth="1.5" d="M12 16V8"></path>
          </svg>
        </button>
        </div>
        {isEditingAddresses && (
          <div className="address-container">
            <input
              type="text"
              name="houseName"
              placeholder="House Name"
              value={addresses[position].houseName}
              onChange={(e) => handleAddressChange(position, e)}
              disabled={!isEditingAddresses}
              className="hname"
            />
            <input
              type="text"
              name="place"
              placeholder="Place"
              value={addresses[position].place}
              onChange={(e) => handleAddressChange(position, e)}
              disabled={!isEditingAddresses}
              className="address-input"
            />
            <input
              type="text"
              name="pincode"
              placeholder="Pincode"
              value={addresses[position].pincode}
              onChange={(e) => handleAddressChange(position, e)}
              disabled={!isEditingAddresses}
              className="address-input"
            />
            <input
              type="text"
              name="postOffice"
              placeholder="Post Office"
              value={addresses[position].postOffice}
              onChange={(e) => handleAddressChange(position, e)}
              disabled={!isEditingAddresses}
              className="address-input"
            />
            <input
              type="text"
              name="landmark"
              placeholder="Landmark"
              value={addresses[position].landmark}
              onChange={(e) => handleAddressChange(position, e)}
              className="address-input"
            />
            <div className="adrbut">
              <button
                onClick={handleSubmitAddress}
                className="address-button"
                disabled={!isEditingAddresses}  // Disable submit button if not in editing mode
              >
                <FaEdit /> Save Address
              </button>
              <button
                onClick={handleCancelAddress}
                className="address-button"
              >
                <FaTimes /> Cancel
              </button>
            </div>
          </div>
        )}
      <div className="address-details">
        {addresses.map((address, index) => (
            address.houseName&&(
          <div key={index} className="address-detail" >
              <>
              <div className="address-header">
              <h2>{address.houseName}</h2>
              <FaEllipsisH
                className="three-dot-icon"
                onClick={() => handlePopoverToggle(index)}
              />
              {showPopover === index && (
                <div className="popover">
                  <button onClick={() => handleEditAddress(index)}>Edit</button>
                  <button onClick={() => setShowPopover(null)}>Cancel</button>
                </div>
              )}
            </div>
            <p>
            <span>{address.postOffice} P.O</span><span>{address.place},</span><span>{address.pincode} (PIN),</span><span>{address.landmark}</span>
            </p>
              </>
              </div>
            )
        ))}
      </div>
      </div>
    </div>
  );
};

export default Profile;
