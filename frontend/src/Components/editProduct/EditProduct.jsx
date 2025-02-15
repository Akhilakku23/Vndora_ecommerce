import React, { useState,useEffect } from 'react';
import axios from 'axios';
import route from '../route';
import './EditProduct.scss';
import { useNavigate, useParams } from 'react-router-dom';

const EditProduct = ({setUsername, setRole, setLoggedIn }) => {
    const {_id}=useParams();
    const navigate=useNavigate();
    const value=localStorage.getItem("Auth")
  const [category, setCategory] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [categories, setCategories] = useState([]); 
  const [product, setProduct] = useState({});
  const [sizeColorQuantities,setsizeColorQuantities]=useState([])
  const [isAddCategory,setAddCategory]=useState(false)
  
  useEffect(() => {
    fetchProduct();
  }, []);
const handleCategoryChange = (e) => {
    setProduct({category:e.target.value});
  };
  const fetchProduct = async () => {
    try {
      const { status, data } = await axios.get(`${route()}getproduct/${_id}`, { headers: { "Authorization": `Bearer ${value}` } });
      if (status === 200) {
        setUsername(data.username)
        setRole(data.role);
        setLoggedIn(true);
        setProduct(data.product);
        
        if (data.category.length > 0) 
            setCategories(data.category);
        setsizeColorQuantities(data.product.sizeColorQuantities)
      }
    } catch (error) {
      console.log("error");
    }
  };
  const handleNewCategoryChange = (e) => {
    setNewCategory(e.target.value);
  };

  const handleAddCategory =async () => {
    if (newCategory.trim()) {
      setCategories([...categories, newCategory]);
      setCategory(newCategory);  
      const {status,data}=await axios.post(`${route()}editcategory`,{newCategory},{headers:{"Authorization":`Bearer ${value}`}});
      if (status===201) {
        alert(data.msg);
        setAddCategory(!isAddCategory);
        getEssentials();
      }else{
        alert("error")
      }
      setNewCategory('');
    }
  };
  const handleSizeQuantityChange = ( e,ind) => {
    
    const updatedSizeColorQuantities = [...sizeColorQuantities]; // Spread the existing array to preserve other elements
  updatedSizeColorQuantities[ind] = {
    ...updatedSizeColorQuantities[ind], // Spread the current object to preserve other properties
    quantity: e.target.value, // Update the specific property you want to modify (in this case, quantity)
  };
    setProduct({
      ...product,
      sizeColorQuantities: updatedSizeColorQuantities,
    });
  setsizeColorQuantities(updatedSizeColorQuantities);
  };
  const handleProductDetailChange = (e) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    let arr=[]
    Object.values(e.target.files).map(async(p)=>{
      const photo=await convertToBase64(p)
      arr.push(photo)
    });
    setProduct({
      ...product,
      pimages: arr,
    });
  };
    function convertToBase64(file) {
        return new Promise((resolve,reject)=>{
            const fileReader=new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload=()=>{
                resolve(fileReader.result)
            }
            fileReader.onerror= (error)=>{
                reject(error)
            }
        })
    }
    const handleSubmit=async(e)=>{
        try {
            e.preventDefault();
            const {status,data}=await axios.put(`${route()}editproduct/${product._id}`,{...product},{headers:{"Authorization":`Bearer ${value}`}});
            if (status==201) {
                alert(data.msg);
                navigate('/company');
            }else{
                alert("Adding incomplete")
            }
        } catch (error) {
            
        }
    }
  return (
    <div className='container'>
    <div className="edit-product">
      <h2>Edit Product</h2>
      <form className="product-form" onSubmit={handleSubmit}>
        <div className="top">
          
        {/* Category */}
        <div className="form-group">
          <label>Category</label>
          <div className="category-select">
            <select
              value={category}
              onChange={handleCategoryChange}
              disabled={categories.length === 0}
            >
              <option value={product.category}>{product.category}</option>
              {categories.map((cat, index) => (
                product.category!=cat.category&&<option key={index} value={cat.category}>{cat.category}</option>
              ))}
            </select>
            
              <div className="add-category">
                <button type="button" onClick={() => setAddCategory(!isAddCategory)}>
                  +
                </button>
                {isAddCategory  && (
                  <div className="new-category-input">
                    <input
                      type="text"
                      value={newCategory}
                      onChange={handleNewCategoryChange}
                      placeholder="Add new category"
                    />
                    <button type="button" onClick={handleAddCategory}>Add</button>
                  </div>
                )}
              </div>
          </div>
        </div>
        </div>
        <div className="mid">
          <div className="left">
            {/* Product Name */}
            <div className="form-group">
              <label>Product Name</label>
              <input
                type="text"
                name="pname"
                value={product.pname}
                onChange={handleProductDetailChange}
                placeholder="Enter product name"
              />
            </div>

            {/* Price */}
            <div className="form-group">
              <label>Price</label>
              <input
                type="number"
                name="price"
                value={product.price}
                onChange={handleProductDetailChange}
                placeholder="Enter price"
              />
            </div>

            {/* Brand (Company) */}
            <div className="form-group">
              <label>Brand (Company)</label>
              <input
                type="text"
                name="brand"
                value={product.brand}
                disabled
                placeholder="Enter brand"
              />
            </div>
            {/* Product Images */}
            <div className="form-group">
              <label>Product Images</label>
              <input
                type="file"
                multiple
                onChange={handleImageChange}
              />
            </div>
          </div>
          <div className="right">
              {/* Sizes and Quantities */}
              <div className="form-group">
                <label>Sizes or Color (Enter Quantity)</label>
                <div className="size-color-quantity">
                  {sizeColorQuantities.map((sq,ind) => (
                    <div key={ind} className="size-color-input">
                      <label>{sq.sizeOrColor}</label>
                      <input
                        type="number"
                        value={sq.quantity}
                        onChange={(e) => handleSizeQuantityChange( e,ind)}
                        placeholder="Quantity"
                      />
                    </div>
                  ))}
                </div>
              </div>
          </div>
        </div>
        <button type="submit" className="submit-btn">Submit</button>
      </form>
    </div>
    </div>
  );
};

export default EditProduct;
