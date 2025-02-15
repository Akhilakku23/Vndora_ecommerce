import React, { useState, useEffect } from 'react';
import axios from 'axios';
import route from '../route';
import './AddProduct.scss';
import { useNavigate } from 'react-router-dom';

const AddProduct = ({ setUsername, setRole, setLoggedIn }) => {
  const navigate = useNavigate();
  const value = localStorage.getItem("Auth");
  
  const [category, setCategory] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [brand, setBrand] = useState("");
  const [productDetails, setProductDetails] = useState({
    pname: '',
    price: '',
    pimages: [],
  });
  const [isAddCategory, setAddCategory] = useState(false);
  const [sizeColorQuantities, setSizeColorQuantities] = useState([]); // For dynamically added sizes/colors and quantities

  useEffect(() => {
    getEssentials();
  }, []);

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const getEssentials = async () => {
    try {
      const { status, data } = await axios.get(`${route()}company`, { headers: { "Authorization": `Bearer ${value}` } });
      if (status === 200) {
        setUsername(data.username);
        setRole(data.role);
        setLoggedIn(true);
        if (data.categories.length > 0) setCategories(data.categories);
        if (data.company) setBrand(data.company.name);
      }
    } catch (error) {
      console.log("error");
    }
  };

  const handleNewCategoryChange = (e) => {
    setNewCategory(e.target.value);
  };

  const handleAddCategory = async () => {
    if (newCategory.trim()) {
      const { status, data } = await axios.post(`${route()}editcategory`, { newCategory }, { headers: { "Authorization": `Bearer ${value}` } });
      if (status === 201) {
        alert(data.msg);
        setAddCategory(!isAddCategory);
        getEssentials();
      } else {
        alert("error");
      }
      setNewCategory('');
    }
  };

  const handleProductDetailChange = (e) => {
    const { name, value } = e.target;
    setProductDetails({
      ...productDetails,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    let arr = [];
    Object.values(e.target.files).map(async (p) => {
      const photo = await convertToBase64(p);
      arr.push(photo);
    });
    setProductDetails({
      ...productDetails,
      pimages: arr,
    });
  };

  function convertToBase64(file) {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  }

  const handleAddSizeColor = () => {
    setSizeColorQuantities([...sizeColorQuantities, { sizeOrColor: '', quantity: 0 }]);
  };

  const handleSizeColorChange = (index, field, value) => {  
    const updatedSizeColorQuantities = [...sizeColorQuantities];
    
    if(field=="quantity"){
      updatedSizeColorQuantities[index][field] = parseInt(value,10);
    }else{
      updatedSizeColorQuantities[index][field] = value;
    }
    setSizeColorQuantities(updatedSizeColorQuantities);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const productData = {
      ...productDetails,
      brand,
      category,
      sizeColorQuantities, // Include the dynamically generated size/color and quantity data
    };

    try {
      const { status, data } = await axios.post(`${route()}addproduct`, productData, {
        headers: { "Authorization": `Bearer ${value}` },
      });
      if (status === 201) {
        alert(data.msg);
        navigate('/company');
      } else {
        alert('Adding incomplete');
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  return (
    <body>
    <div className="container">
    <div className="add-product">
      <h2>Add Product</h2>
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
                <option value="">Select a Category</option>
                {categories.map((cat, index) => (
                  <option key={index} value={cat.category}>{cat.category}</option>
                ))}
              </select>

              <div className="add-category">
                <button type="button" onClick={() => setAddCategory(!isAddCategory)}>
                  + New category
                </button>
                {isAddCategory && (
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
              <input
                type="text"
                name="pname"
                value={productDetails.pname}
                onChange={handleProductDetailChange}
                placeholder="Enter product name"
              />
            </div>

            {/* Price */}
            <div className="form-group">
              <input
                type="number"
                name="price"
                value={productDetails.price}
                onChange={handleProductDetailChange}
                placeholder="Enter price"
              />
            </div>

            {/* Brand (Company) */}
            <div className="form-group">
              <input
                type="text"
                name="brand"
                value={brand}
                disabled="true"
                placeholder="Enter brand"
              />
            </div>
            <div className="form-group">
              <input
                type="file"
                multiple
                onChange={handleImageChange}
              />
            </div>

            
          </div>
          <div className="right">
            <div className="form-group">
              <div className="addbun">
              <p className="label">Sizes/Colors and Quantities</p> 
              <button type="button" onClick={handleAddSizeColor} className="add-size-color-btn">
                + Quantities
              </button>
              </div>
              <div className="size-color-quantity">
                {sizeColorQuantities.map((item, index) => (
                  <div key={index} className="size-color-input">
                    <input
                      type="text"
                      placeholder="Size or Color"
                      value={item.sizeOrColor}
                      onChange={(e) => handleSizeColorChange(index, 'sizeOrColor', e.target.value)}
                    />
                    <input
                      type="number"
                      placeholder="Quantity"
                      value={item.quantity}
                      onChange={(e) => handleSizeColorChange(index, 'quantity', e.target.value)}
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
    </body>
  );
};

export default AddProduct;
