// src/components/Signup.js
import React, { useState } from 'react';
import {useNavigate,Link} from 'react-router-dom';
import axios from 'axios';
import route from '../route';
import './Signup.scss'; // Importing the SCSS file for styling

const Signup = () => {
  const navigate=useNavigate();
  const email=localStorage.getItem('email');
    const [user,setUser]=useState({
      email:email,
      username:"",
      password:"",
      cpassword:"",
      role:"",
    })
    
      const [checkPassword, setCheckPassword] = useState(false);
      const [checkCPassword, setCheckCPassword] = useState(false);
  const handleChange=(e)=>{
    setUser((pre)=>({...pre,[e.target.name]:e.target.value}))
  }
  const handlePassword=(e)=>{
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
  if (regex.test(e.target.value)) {
    setUser((pre)=>({...pre,[e.target.name]:e.target.value}));
    if (e.target.name=="password") {
      setCheckPassword(true);
    }else if(e.target.name=="cpassword"){
      setCheckCPassword(true)
    }
  } else {
    if (e.target.name=="password") {
      setCheckPassword(false);
    }else if(e.target.name=="cpassword"){
      setCheckCPassword(false)
    }
  }
  }
  const handleSubmit = async(e) => {
    e.preventDefault();
    if(checkCPassword&&checkPassword){
      try {
        const {data,status}=await axios.post(`${route()}signup`,user,{headers:{"Content-Type":"application/json"}})
      
      if(status===201){
        localStorage.removeItem('email');
        alert(data.msg);
        navigate('/login')
      }
      else{
        alert(data.msg)
      }
      } catch (error) {
        alert("Credentials provided is wrong")
      }
    }else{
      alert("Enter strong password")
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
      <div className="hader">
        <h1>Sign Up</h1>
        <p>Sign up now to become a member.</p>
      </div>

        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Enter Name" id="username" name="username" onChange={handleChange} />
          <input type="password" placeholder="Choose A Password" id="password" className={checkPassword? "strong":"weak"} name="password" onChange={handlePassword} />
          <input type="password" placeholder="Re-Enter Password" id="cpassword" className={checkCPassword? "strong":"weak"}  name="cpassword" onChange={handlePassword} />
            <select  id="role" name="role" onChange={handleChange}>
              <option value="">Select your role</option>
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
            </select>
            
          <button type="submit" className="signup-btn">Sign Up</button>
        </form>
        <div className="extra-links">
          <p className="login-link">
            Already have an account? <Link to={"/login"}>Login </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
