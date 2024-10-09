import React, { useEffect, useState } from "react";
import axios from "axios";
import SideNav from "./SideNav";
import { Button, Modal } from "react-bootstrap";
import { MdDelete } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import { IoIosAddCircle } from "react-icons/io";
import Tooltip from "@mui/material/Tooltip";

function Dishes() {
  const backendUrl = process.env.REACT_APP_MACHINE_TEST_1_BACKEND_URL;
  const [uid, setUid] = useState("");
  const [show, setShow] = useState(false);
  const [on, setOn] = useState(false);
  const [dishes, setDishes] = useState("");
  const [description, setDescription] = useState("");
  const [oldprice, setOldPrice] = useState("");
  const [newprice, setNewPrice] = useState("");
  const [image, setImage] = useState([]);
  const [Itemnumber, setItemnumber] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [color, setColor] = useState("");
  const [productcare, setProductcare] = useState("");
  const [features, setFeatures] = useState("");
  const [maincategory, setMaincategory] = useState('');
  const [categories, setCategories] = useState('');
  const [subcategories, setSubcategories] = useState('');
  const [getMaincategories, setGetMaincategories] = useState([]);
  const [getCategories, setGetCategories] = useState([]);
  const [getSubcategories, setGetSubcategories] = useState([]);
  const [getDishes, setGetDishes] = useState([]);
  const [getColors, setGetColors] = useState([]);
  const [imageFiles, setImageFiles] = useState({});
  const [stocks, setStocks] = useState({});
  const [selectedColors, setSelectedColors] = useState({}); // To manage selected colors for each item


  const [getDishesById, setGetDishesById] = useState({
    dishes: "",
    oldprice: "",
    newprice: "",
    description: "",
    Itemnumber: "",
    manufacturer: "",
    color: "",
    productcare: "",
    features: "",
    mainCategory: "",
    category: "",
    subcategory: ""
  });

  const handleImage = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setImage(selectedFiles);
  };

  const handleImageUpload = (event, selectedColor) => {
    const files = Array.from(event.target.files);
    setImageFiles((prev) => ({
      ...prev,
      [selectedColor]: [...prev[selectedColor], ...files],
    }));
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleOff = () => setOn(false);

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchData = async () => {
      try {
        const [mainCatResponse, catResponse, subCatResponse, dishesResponse] = await Promise.all([
          axios.get(`${backendUrl}/admin/getmaincategories`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${backendUrl}/admin/getcategories`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${backendUrl}/admin/getsubcategories`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${backendUrl}/admin/getdishes`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        setGetMaincategories(mainCatResponse.data);
        setGetCategories(catResponse.data);
        setGetSubcategories(subCatResponse.data);
        setGetDishes(dishesResponse.data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchColors = async () => {
      try {
        const response = await axios.get(`${backendUrl}/admin/getcolors`, { headers: { Authorization: `Bearer ${token}` } });
        setGetColors(response.data);
      } catch (err) {
        console.error(err);
        alert('An error occurred while fetching colors.');
      }
    };

    fetchData();
    fetchColors();
  }, [backendUrl]);


  const postDishes = async () => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    
    // Append basic details
    formData.append("dishes", dishes);
    formData.append("description", description);
    formData.append("category", categories);
    formData.append("maincategories", maincategory);
    formData.append("subcategories", subcategories);
    formData.append("oldprice", oldprice);
    formData.append("newprice", newprice);
    formData.append("Itemnumber", Itemnumber);
    formData.append("manufacturer", manufacturer);
    formData.append("productcare", productcare);
    formData.append("features", features);
  
    // Append images and stock for each color
    for (const [colorKey, files] of Object.entries(imageFiles)) {
      files.forEach((file, index) => {
        formData.append(`images_${colorKey}_${index}`, file); // Append image
        formData.append(`stock_${colorKey}`, stocks[colorKey] || 0); // Append stock for the color
      });
    }
  
    try {
      await axios.post(`${backendUrl}/admin/postdishes`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };


  const updateDishes = async () => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    
    // Append existing details for the dish
    formData.append("dishes", getDishesById.dishes);
    formData.append("description", getDishesById.description);
    formData.append("oldprice", getDishesById.oldprice);
    formData.append("newprice", getDishesById.newprice);
    formData.append("category", getDishesById.category);
    formData.append("maincategories", getDishesById.mainCategory);
    formData.append("subcategories", getDishesById.subcategory);
    formData.append("color", getDishesById.color);
    formData.append("Itemnumber", getDishesById.Itemnumber);
    formData.append("productcare", getDishesById.productcare);
    formData.append("manufacturer", getDishesById.manufacturer);
    formData.append("features", getDishesById.features);
  
    // Loop through imageFiles and stocks to append new images and stock
    for (const [colorKey, files] of Object.entries(imageFiles)) {
      files.forEach((file, index) => {
        formData.append(`images_${colorKey}_${index}`, file); // Append new image
        formData.append(`stock_${colorKey}`, stocks[colorKey] || getDishesById.stock[colorKey] || 0); // Append stock for the color
      });
    }
  
    try {
      await axios.put(`${backendUrl}/admin/putdishes/${uid}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      window.location.reload();
    } catch (err) {
      console.error('Error updating dish:', err);
    }
  };
  
  // const postDishes = async () => {
  //   const token = localStorage.getItem('token');
  //   const formData = new FormData();
  //   formData.append("dishes", dishes);
  //   formData.append("description", description);
  //   formData.append("category", categories);
  //   formData.append("maincategories", maincategory);
  //   formData.append("subcategories", subcategories);
  //   formData.append("oldprice", oldprice);
  //   formData.append("newprice", newprice);
  //   formData.append("color", color);
  //   formData.append("Itemnumber", Itemnumber);
  //   formData.append("manufacturer", manufacturer);
  //   formData.append("productcare", productcare);
  //   formData.append("features", features);

  //   for (const [colorKey, files] of Object.entries(imageFiles)) {
  //     files.forEach((file, index) => {
  //       formData.append(`images_${colorKey}_${index}`, file);
  //     });
  //   }

  //   try {
  //     await axios.post(`${backendUrl}/admin/postdishes`, formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     window.location.reload();
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  // const updateDishes = async () => {
  //   const token = localStorage.getItem('token');
  //   const formData = new FormData();
  //   formData.append("dishes", getDishesById.dishes);
  //   formData.append("description", getDishesById.description);
  //   formData.append("oldprice", getDishesById.oldprice);
  //   formData.append("newprice", getDishesById.newprice);
  //   formData.append("category", getDishesById.category);
  //   formData.append("maincategories", getDishesById.mainCategory);
  //   formData.append("subcategories", getDishesById.subcategory);
  //   formData.append("color", getDishesById.color);
  //   formData.append("Itemnumber", getDishesById.Itemnumber);
  //   formData.append("ram", getDishesById.productcare);
  //   formData.append("internalstorage", getDishesById.manufacturer);
  //   formData.append("features", getDishesById.features);

  //   if (image.length > 0) {
  //     image.forEach(file => formData.append("image", file));
  //   }

  //   try {
  //     await axios.put(`${backendUrl}/admin/putdishes/${uid}`, formData, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     window.location.reload();
  //   } catch (err) {
  //     console.error('Error updating dish:', err);
  //   }
  // };

  const handleOn = async (id) => {
    const token = localStorage.getItem('token');
    setOn(true);
    setUid(id);

    try {
      const response = await axios.get(`${backendUrl}/admin/getdishesbyid/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data;
      setGetDishesById({
        dishes: data.dishes,
        oldprice: data.oldprice,
        newprice: data.newprice,
        description: data.description,
        Itemnumber: data.Itemnumber,
        manufacturer: data.manufacturer,
        color: data.color,
        productcare: data.productcare,
        features: data.features,
        mainCategory: data.mainCategory?._id || '',
        category: data.category?._id || '',
        subcategory: data.subcategory?._id || '',
        image: data.image || [],
      });
      setMaincategory(data.mainCategory?._id || '');
      setCategories(data.category?._id || '');
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setGetDishesById((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    const windowConfirmation = window.confirm("Are you sure to Delete this item");
    if (windowConfirmation) {
      try {
        await axios.delete(`${backendUrl}/admin/deletedishes/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        window.location.reload();
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Filtering logic
  const filteredCategories = getCategories.filter(cat => 
    cat.maincategoriesData && cat.maincategoriesData._id === maincategory
  );

  const filteredSubcategories = getSubcategories.filter(subCat => 
    subCat.category && subCat.category._id === categories
  );

  const handleStockChange = (e, colorKey) => {
    setStocks((prevStocks) => ({
      ...prevStocks,
      [colorKey]: e.target.value, // Update stock for the selected color
    }));
  };

  const handleColorChange = (itemId, color) => {
    setSelectedColors((prev) => ({ ...prev, [itemId]: color }));
    if (color && !stocks[color]) {
      setStocks((prevStocks) => ({ ...prevStocks, [color]: 0 })); // Initialize stock if it's a new color
    }
  };
  
return (
    <div>
      <SideNav />
      <div className="whole">
        <div className=" main-contenet">
          <div className="pl-3 row main-row">
            <div className="col-12 my-sm-0 my-md-5 p-3 montserrat-400"
                 style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
              <h2><b>ITEMS</b></h2>
              <Tooltip className="add_btn" title="Add">
                <IoIosAddCircle className="add_btn" onClick={handleShow} />
              </Tooltip>
            </div>
            <div className="container table-responsive">
              <table className="table table-striped table-bordered">
                <thead className="thead-dark">
                  <tr>
                    <th scope="col">Images</th>
                    <th scope="col">Item Number</th>
                    <th scope="col">Name</th>
                    <th scope="col">Description</th>
                    <th scope="col">Old Price</th>
                    <th scope="col">New Price</th>
                    <th scope="col">Color</th>
                    <th scope="col">Stock</th>
                    <th scope="col">Manufacturer</th>
                    <th scope="col">Product Care</th>
                    <th scope="col">Features</th>
                    <th scope="col">Main Category</th>
                    <th scope="col">Category</th>
                    <th scope="col">Subcategory</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {getDishes.map((items, index) => (
                    <tr key={index}>
                      <td>
                        <div className="image-container">
                          {items.images && Object.keys(items.images).map((colorKey) => (
                            items.images[colorKey].map((image, imageIdx) => (
                              <img
                                key={imageIdx}
                                className="avatar"
                                src={`${backendUrl}/images/${image.image}`} // Ensure you're using the correct image property
                                alt={`Dish Image ${imageIdx + 1}`}
                              />
                            ))
                          ))}
                        </div>
                      </td>
                      <td className="text-black item-text">{items.Itemnumber}</td>
                      <td className="text-black item-text"><b>{items.dishes}</b></td>
                      <td className="text-black item-text">{items.description}</td>
                      <td className="text-black item-text">{items.oldprice}</td>
                      <td className="text-black item-text">{items.newprice}</td>
                      {/* <td className="text-black item-text">{items.Color || 'No Color'}</td>
                      <td className="text-black item-text">
                        {items.images && Object.keys(items.images).map((colorKey) => (
                          items.images[colorKey].map((image, imageIdx) => (
                            <div key={imageIdx}>{image.stock}</div> // Displaying stock
                          ))
                        ))}
                      </td> */}
                     <td className="text-black item-text">
                        <label>Color</label>
                        <select
                          className="form-control"
                          id="color"
                          name="color"
                          value={selectedColors[items._id] || ''}
                          onChange={(e) => handleColorChange(items._id, e.target.value)}
                        >
                          <option value="">Select Color</option>
                          {getColors.map((colorOption) => (
                            <option key={colorOption._id} value={colorOption.name}>
                              {colorOption.Color}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="text-black item-text">
                        {selectedColors[items._id] && (
                          <div>
                            {stocks[selectedColors[items._id]] === 0 ? (
                              <span className="text-danger">Out of Stock</span>
                            ) : stocks[selectedColors[items._id]] < 10 ? (
                              <span className="text-warning">Only Few Left</span>
                            ) : (
                              <span className="text-success">In Stock</span>
                            )}
                          </div>
                        )}
                      </td>

                      <td className="text-black item-text">{items.manufacturer}</td>
                      <td className="text-black item-text">{items.productcare}</td>
                      <td className="text-black item-text">{items.features}</td>
                      <td>{items.mainCategory?.name || 'No Main Category'}</td>
                      <td>{items.category?.name || 'No Category'}</td>
                      <td>{items.subcategory?.name || 'No Subcategory'}</td>
                      <td className="text-black item-text">
                        <Tooltip title="Edit">
                          <FiEdit onClick={() => handleOn(items._id)} className="edit-icon" />
                        </Tooltip>
                        <Tooltip title="Delete">
                          <MdDelete onClick={() => handleDelete(items._id)} className="delete-icon" />
                        </Tooltip>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* <div className="container table-responsive"> 
              <table className="table table-striped table-bordered">
                <thead className="thead-dark">
                  <tr>
                    <th scope="col">Images</th>
                    <th scope="col">Item Number</th>
                    <th scope="col">Name</th>
                    <th scope="col">Description</th>
                    <th scope="col">Old Price</th>
                    <th scope="col">New Price</th>
                    <th scope="col">Color</th>
                    <th scope="col">Stock</th>

                    <th scope="col">Manufacturer</th>
                    <th scope="col">Product Care</th>
                    <th scope="col">Features</th>
                    <th scope="col">Main Category</th>
                    <th scope="col">Category</th>
                    <th scope="col">Subcategory</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {getDishes.map((items, index) => (
                    <tr key={index}>
                      <td>
                        <div className="image-container">
                          {items.images && Object.keys(items.images).map((colorKey) => (
                            items.images[colorKey].map((image, imageIdx) => (
                              <img
                                key={imageIdx}
                                className="avatar"
                                src={`${backendUrl}/images/${image}`} // Correct path for the images
                                alt={`Dish Image ${imageIdx + 1}`} // Alt text for the image
                              />
                            ))
                          ))}
                        </div>
                      </td>
                      <td className="text-black item-text">{items.Itemnumber}</td>
                      <td className="text-black item-text"><b>{items.dishes}</b></td>
                      <td className="text-black item-text">{items.description}</td>
                      <td className="text-black item-text">{items.oldprice}</td>
                      <td className="text-black item-text">{items.newprice}</td>
                      <td className="text-black item-text">{items.Color}</td>
                      <td className="text-black item-text">{items.manufacturer}</td>
                      <td className="text-black item-text">{items.productcare}</td>
                      <td className="text-black item-text">{items.features}</td>
                      <td>{items.mainCategory?.maincategories || 'No Main Category'}</td>
                      <td>{items.category?.name || 'No Category'}</td>
                      <td>{items.subcategory?.name || 'No Subcategory'}</td>
                      <td className="text-black item-text">
                        <Tooltip title="Edit">
                          <FiEdit onClick={() => handleOn(items._id)} className="edit-icon" />
                        </Tooltip>
                        <Tooltip title="Delete">
                          <MdDelete onClick={() => handleDelete(items._id)} className="delete-icon" />
                        </Tooltip>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div> */}
          </div>
        </div>
      </div>
      
      {/* Modal for adding/editing dishes */}
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add/Edit Dishes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <form>
              <label>Item Number</label>
              <input type="text" className="form-control" value={Itemnumber} onChange={(e) => setItemnumber(e.target.value)} />
              
              <label>Product</label>
              <input type="text" className="form-control" value={dishes} onChange={(e) => setDishes(e.target.value)} />
              
              <label>Old Price</label>
              <input type="number" className="form-control" placeholder="Enter Old Price" value={oldprice} onChange={(e) => setOldPrice(e.target.value)} />
              
              <label>New Price</label>
              <input type="number" className="form-control" placeholder="Enter New Price" value={newprice} onChange={(e) => setNewPrice(e.target.value)} />
              
              <label>Description</label>
              <textarea className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} />
              
              <label>Manufacturer</label>
              <textarea type="text" className="form-control" placeholder="Enter Manufacturer" value={manufacturer} onChange={(e) => setManufacturer(e.target.value)} />
              
              <label>Product Care</label>
              <textarea type="text" className="form-control" placeholder="Enter Product Care" value={productcare} onChange={(e) => setProductcare(e.target.value)} />
              
              <label>Features</label>
              <textarea type="text" className="form-control" value={features} onChange={(e) => setFeatures(e.target.value)} />
              
              <div className="form-group">
                <label htmlFor="maincategory">Main Category</label>
                <select className="form-control" id="maincategory" name="mainCategory" value={getDishesById.mainCategory} onChange={(e) => {
                  setMaincategory(e.target.value);
                  handleUpdateChange(e);
                }}>
                  <option value="">Select Main Category</option>
                  {getMaincategories.map(mainCat => (
                    <option key={mainCat._id} value={mainCat._id}>{mainCat.maincategories}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="categories">Category</label>
                <select className="form-control" id="categories" name="category" value={getDishesById.category} onChange={(e) => {
                  setCategories(e.target.value);
                  handleUpdateChange(e);
                }}>
                  <option value="">Select Category</option>
                  {filteredCategories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="subcategories">Subcategory</label>
                <select className="form-control" id="subcategories" name="subcategory" value={getDishesById.subcategory} onChange={handleUpdateChange}>
                  <option value="">Select Subcategory</option>
                  {filteredSubcategories.map(subCat => (
                    <option key={subCat._id} value={subCat._id}>{subCat.name}</option>
                  ))}
                </select>
              </div>

            

              

              <label>Color</label>
                  <select
                    className="form-control"
                    id="color"
                    name="color"
                    value={color}
                    onChange={(e) => {
                      setColor(e.target.value);
                      if (!imageFiles[e.target.value]) {
                        setImageFiles((prev) => ({ ...prev, [e.target.value]: [] })); // Initialize an empty array for the new color
                      }
                      if (!stocks[e.target.value]) {
                        setStocks((prevStocks) => ({ ...prevStocks, [e.target.value]: 0 })); // Initialize stock for the new color
                      }
                    }}
                  >
                    <option value="">Select Color</option>
                    {getColors.map((colorOption) => (
                      <option key={colorOption._id} value={colorOption.name}>
                        {colorOption.Color}
                      </option>
                    ))}
                  </select>

                  {/* Image Upload Section */}
                  {color && (
                    <>
                      <div className="form-group">
                        <label htmlFor="image">Upload Images</label>
                        <input
                          type="file"
                          className="form-control-file"
                          id="image"
                          multiple
                          onChange={(e) => handleImageUpload(e, color)}
                        />
                      </div>

                      {/* Stock Input Section */}
                      <div className="form-group">
                        <label htmlFor="stock">Stock for {color}</label>
                        <input
                          type="number"
                          className="form-control"
                          id="stock"
                          value={stocks[color] || ""}
                          onChange={(e) => handleStockChange(e, color)}
                          placeholder="Enter stock quantity"
                        />
                      </div>
                    </>
                  )}

                  {/* Display Uploaded Images and Stocks */}
                  <div>
                    {Object.keys(imageFiles).map((colorKey) => (
                      <div key={colorKey}>
                        <h5>Uploaded Images for {colorKey}:</h5>
                        {imageFiles[colorKey].map((file, index) => (
                          <p key={index}>{file.name}</p> // Display image names
                        ))}
                        {/* Display stock for each color */}
                        <p>Stock: {stocks[colorKey] || "No stock set"}</p>
                      </div>
                    ))}
                  </div>

            </form>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Close</Button>
          <Button variant="primary" onClick={() => {
            if (uid) {
              updateDishes();
            } else {
              postDishes();
            }
            handleClose();
          }}>
            {uid ? "Update" : "Add"}
          </Button>
        </Modal.Footer>
      </Modal>


      <Modal show={on} onHide={handleOff} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Item</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form>
          {/* Row 1: Item Number and Name */}
          <div className="form-row">
            <div className="form-group col-md-6">
              <label>Item Number</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Item Number"
                name="Itemnumber"
                value={getDishesById.Itemnumber || ""}
                onChange={handleUpdateChange}
              />
            </div>
            <div className="form-group col-md-6">
              <label>Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Dish Name"
                name="dishes"
                value={getDishesById.dishes || ""}
                onChange={handleUpdateChange}
              />
            </div>
          </div>

          {/* Row 2: Description, Old Price, and New Price */}
          <div className="form-row">
            <div className="form-group col-md-6">
              <label>Description</label>
              <textarea
                className="form-control"
                placeholder="Enter Description"
                name="description"
                value={getDishesById.description || ""}
                onChange={handleUpdateChange}
              />
            </div>
            <div className="form-group col-md-3">
              <label>Old Price</label>
              <input
                type="number"
                className="form-control"
                placeholder="Enter old Price"
                name="oldprice"
                value={getDishesById.oldprice || ""}
                onChange={handleUpdateChange}
              />
            </div>
            <div className="form-group col-md-3">
              <label>New Price</label>
              <input
                type="number"
                className="form-control"
                placeholder="Enter new Price"
                name="newprice"
                value={getDishesById.newprice || ""}
                onChange={handleUpdateChange}
              />
            </div>
          </div>

          {/* Row 3: Color and Manufacturer */}
          <div className="form-row">
            <div className="form-group col-md-6">
              <label>Color</label>
              <select
                className="form-control"
                id="color"
                name="color"
                value={getDishesById.color || ""}
                onChange={handleUpdateChange}
              >
                <option value="">Select Color</option>
                {getColors.map((colorOption) => (
                  <option key={colorOption._id} value={colorOption.name}>
                    {colorOption.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group col-md-6">
              <label>Manufacturer</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Manufacturer"
                name="manufacturer"
                value={getDishesById.manufacturer || ""}
                onChange={handleUpdateChange}
              />
            </div>
          </div>

          {/* Row 4: Product Care and Features */}
          <div className="form-row">
            <div className="form-group col-md-6">
              <label>Product Care</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Product Care"
                name="productcare"
                value={getDishesById.productcare || ""}
                onChange={handleUpdateChange}
              />
            </div>
            <div className="form-group col-md-6">
              <label>Features</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Features"
                name="features"
                value={getDishesById.features || ""}
                onChange={handleUpdateChange}
              />
            </div>
          </div>

          {/* Row 5: Main Category, Category, Subcategory */}
          <div className="form-row">
            <div className="form-group col-md-4">
              <label>Main Category</label>
              <select
                className="form-control"
                name="mainCategory"
                value={getDishesById.mainCategory || ""}
                onChange={handleUpdateChange}
              >
                <option value="">Select Main Category</option>
                {getMaincategories.map((mainCat) => (
                  <option key={mainCat._id} value={mainCat._id}>
                    {mainCat.maincategories}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group col-md-4">
              <label>Category</label>
              <select
                className="form-control"
                name="category"
                value={getDishesById.category || ""}
                onChange={handleUpdateChange}
              >
                <option value="">Select Category</option>
                {filteredCategories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.categories}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group col-md-4">
              <label>Subcategory</label>
              <select
                className="form-control"
                name="subcategory"
                value={getDishesById.subcategory || ""}
                onChange={handleUpdateChange}
              >
                <option value="">Select Subcategory</option>
                {filteredSubcategories.map((subCat) => (
                  <option key={subCat._id} value={subCat._id}>
                    {subCat.subcategories}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 6: Image Upload */}
          <div className="form-group">
            <label>Upload Image</label>
            <input
              type="file"
              className="form-control"
              onChange={handleImage}
              multiple
            />
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleOff}>
          Close
        </Button>
        <Button variant="primary" onClick={updateDishes}>
          Save Changes
        </Button>
      </Modal.Footer>
      </Modal>



      
    </div>
  );
}

export default Dishes;



// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import SideNav from "./SideNav";
// import { Button, Modal } from "react-bootstrap";
// import { MdDelete } from "react-icons/md";
// import { FiEdit } from "react-icons/fi";
// import { IoIosAddCircle } from "react-icons/io";
// import Tooltip from "@mui/material/Tooltip";

// function Dishes() {
//   const backendUrl = process.env.REACT_APP_MACHINE_TEST_1_BACKEND_URL;
//   const [uid, setUid] = useState("");
//   const [show, setShow] = useState(false);
//   const [on, setOn] = useState(false);
//   const [dishes, setDishes] = useState("");
//   const [description, setDescription] = useState("");
//   const [oldprice, setOldPrice] = useState("");
//   const [newprice, setNewPrice] = useState("");
//   const [image, setImage] = useState([]);
//   const [Itemnumber, setItemnumber] = useState("");
//   const [manufacturer, setManufacturer] = useState("");
//   const [color, setColor] = useState("");
//   const [productcare, setProductcare] = useState("");
//   const [features, setFeatures] = useState("");
//   const [maincategory, setMaincategory] = useState('');
//   const [categories, setCategories] = useState('');
//   const [subcategories, setSubcategories] = useState('');
//   const [getMaincategories, setGetMaincategories] = useState([]);
//   const [getCategories, setGetCategories] = useState([]);
//   const [getSubcategories, setGetSubcategories] = useState([]);
//   const [getDishes, setGetDishes] = useState([]);
//   const [getColors, setGetColors] = useState([]);

//   const [getDishesById, setGetDishesById] = useState({
//     dishes: "",
//     oldprice: "",
//     newprice: "",
//     description: "",
//     Itemnumber: "",
//     manufacturer: "",
//     color: "",
//     productcare: "",
//     features: "",
//     mainCategory: "",
//     category: "",
//     subcategory: ""
//   });

//   const handleImage = (e) => {
//     const selectedFiles = Array.from(e.target.files);
//     setImage(selectedFiles);
//   };

//   const handleClose = () => setShow(false);
//   const handleShow = () => setShow(true);
//   const handleOff = () => setOn(false);

//   // Fetch main categories, categories, and subcategories
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [mainCatResponse, catResponse, subCatResponse, dishesResponse] = await Promise.all([
//           axios.get(`${backendUrl}/admin/getmaincategories`),
//           axios.get(`${backendUrl}/admin/getcategories`),
//           axios.get(`${backendUrl}/admin/getsubcategories`),
//           axios.get(`${backendUrl}/admin/getdishes`)
//         ]);

//         setGetMaincategories(mainCatResponse.data);
//         setGetCategories(catResponse.data);
//         setGetSubcategories(subCatResponse.data);
//         setGetDishes(dishesResponse.data);
//       } catch (err) {
//         console.log(err);
//       }
//     };

//     // Fetch colors
//     const fetchColors = async () => {
//       try {
//         const response = await axios.get(`${backendUrl}/admin/getcolors`);
//         setGetColors(response.data);  // Set the colors state with fetched data
//       } catch (err) {
//         console.error(err);
//         alert("An error occurred while fetching colors.");
//       }
//     };

//     fetchData();
//     fetchColors();  // Call the fetchColors function
//   }, [backendUrl]);

//   // Function to handle POST dishes
//   const postDishes = async () => {
//     const formData = new FormData();
//     formData.append("dishes", dishes);
//     formData.append("description", description);
//     formData.append("category", categories);
//     formData.append("maincategories", maincategory);
//     formData.append("subcategories", subcategories);
//     formData.append("oldprice", oldprice);

//     formData.append("newprice", newprice);
//     formData.append("color", color);
//     formData.append("Itemnumber", Itemnumber);
//     formData.append("manufacturer", manufacturer);
//     formData.append("productcare", productcare);
//     formData.append("features", features);

//     image.forEach(file => formData.append("image", file));

//     try {
//       await axios.post(`${backendUrl}/admin/postdishes`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });
//       window.location.reload();
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const updateDishes = async () => {
//     const formData = new FormData();
//     formData.append("dishes", getDishesById.dishes);
//     formData.append("description", getDishesById.description);
//     formData.append("oldprice", getDishesById.oldprice);
//     formData.append("newprice", getDishesById.newprice);
//     formData.append("category", getDishesById.category);
//     formData.append("maincategories", getDishesById.mainCategory);
//     formData.append("subcategories", getDishesById.subcategory);
//     formData.append("color", getDishesById.color);
//     formData.append("Itemnumber", getDishesById.Itemnumber);
//     formData.append("ram", getDishesById.productcare);
//     formData.append("internalstorage", getDishesById.manufacturer);
//     formData.append("features", getDishesById.features);

//     if (image.length > 0) {
//       image.forEach(file => formData.append("image", file));
//     }

//     try {
//       await axios.put(`${backendUrl}/admin/putdishes/${uid}`, formData);
//       window.location.reload();
//     } catch (err) {
//       console.error('Error updating dish:', err);
//     }
//   };

//   const handleOn = async (id) => {
//     setOn(true);
//     setUid(id);

//     try {
//       const response = await axios.get(`${backendUrl}/admin/getdishesbyid/${id}`);
//       const data = response.data;
//       setGetDishesById({
//         dishes: data.dishes,
//         oldprice: data.oldprice,
//         newprice: data.newprice,
//         description: data.description,
//         Itemnumber: data.Itemnumber,
//         manufacturer: data.manufacturer,
//         color:data.color,
//         productcare: data.productcare,
//         features: data.features,
//         mainCategory: data.mainCategory?._id || '',
//         category: data.category?._id || '',
//         subcategory: data.subcategory?._id || '',
//         image: data.image || [],
//       });
//       setMaincategory(data.mainCategory?._id || '');
//       setCategories(data.category?._id || '');
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const handleUpdateChange = (e) => {
//     const { name, value } = e.target;
//     setGetDishesById((prevState) => ({
//       ...prevState,
//       [name]: value,
//     }));
//   };
  

//   const handleDelete = async (id) => {
//     const windowConfirmation = window.confirm("Are you sure to Delete this item");
//     if (windowConfirmation) {
//       try {
//         await axios.delete(`${backendUrl}/admin/deletedishes/${id}`);
//         window.location.reload();
//       } catch (err) {
//         console.log(err);
//       }
//     }
//   };

//   // Filtering categories and subcategories based on main category and category
//   const filteredCategories = getCategories.filter(cat => cat.maincategoriesData._id === maincategory);
//   const filteredSubcategories = getSubcategories.filter(subCat => subCat.category._id === categories);

//   return (
//     <div>
//       <SideNav />
//       <div className="whole">
//         <div className=" main-contenet">
//           <div className="pl-3 row main-row">
//             <div className="col-12 my-sm-0 my-md-5 p-3 montserrat-400"
//                  style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
//               <h2><b>ITEMS</b></h2>
//               <Tooltip className="add_btn" title="Add">
//                 <IoIosAddCircle className="add_btn" onClick={handleShow} />
//               </Tooltip>
//             </div>
//             <div className="container table-responsive">
//               <table className="table table-striped table-bordered">
//                 <thead className="thead-dark">
//                   <tr>
//                     <th scope="col">Image</th>
//                     <th scope="col">Item Number</th>
//                     <th scope="col">Name</th>
//                     <th scope="col">Description</th>
//                     <th scope="col">Old Price</th>

//                     <th scope="col">New Price</th>
//                     <th scope="col">Color</th>
//                     <th scope="col">manufacturer</th>
//                     <th scope="col">productcare</th>
//                     <th scope="col">Features</th>
//                     <th scope="col">Main Category</th>
//                     <th scope="col">Category</th>
//                     <th scope="col">Sub Category</th>
//                     <th scope="col">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {getDishes.map((items, index) => (
//                     <tr key={index}>
//                       <td>
//                         <div className="image-container">
//                           {items.image.map((image, idx) => (
//                             <img key={idx} className="avatar" src={`${backendUrl}/images/${image}`} alt={`Image ${idx + 1}`} />
//                           ))}
//                         </div>
//                       </td>
//                       <td className="text-black item-text">{items.Itemnumber}</td>
//                       <td className="text-black item-text"><b>{items.dishes}</b></td>
//                       <td className="text-black item-text">{items.description}</td>
//                       <td className="text-black item-text">{items.oldprice}</td>

//                       <td className="text-black item-text">{items.newprice}</td>
//                       <td className="text-black item-text">{items.Color}</td>
//                       <td className="text-black item-text">{items.manufacturer}</td>
//                       <td className="text-black item-text">{items.productcare}</td>
//                       <td className="text-black item-text">{items.features}</td>
//                       <td>{items.mainCategory?.maincategories || 'No Main Category'}</td>
//                       <td>{items.category?.name || 'No Category'}</td>
//                       <td>{items.subcategory?.name || 'No Subcategory'}</td>
//                       <td className="text-black item-text">
//                         <Tooltip title="Edit">
//                           <FiEdit onClick={() => handleOn(items._id)} className="edit-icon" />
//                         </Tooltip>
//                         <Tooltip title="Delete">
//                           <MdDelete onClick={() => handleDelete(items._id)} className="delete-icon" />
//                         </Tooltip>
                        
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>
      
//       {/* Modal for adding/editing dishes */}
//       <Modal show={show} onHide={handleClose} size="lg">
//         <Modal.Header closeButton>
//           <Modal.Title>Add/Edit Dishes</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <div className="container">
//             <form> 
//               <label>Item Number</label>
//                 <input type="text" className="form-control" value={Itemnumber} onChange={(e) => setItemnumber(e.target.value)} />   
//               <label>Product</label>
//                 <input type="text" className="form-control" value={dishes} onChange={(e) => setDishes(e.target.value)} />
//               <label>oldPrice</label>
//                 <input type="number" className="form-control" placeholder="Enter Price" value={oldprice}
//                        onChange={(e) => setOldPrice(e.target.value)} />
//                 <label>NewPrice</label>
//                   <input type="number" className="form-control" placeholder="Enter Price" value={newprice}
//                   onChange={(e) => setNewPrice(e.target.value)} />
//               <label>Description</label>       
//                 <textarea className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} />
//                 <label>Color</label>
//               <select className="form-control" id="color" name="color" value={color} onChange={(e) => setColor(e.target.value)}>
//                 <option value="">Select Color</option>
//                 {getColors.map((colorOption) => (
//                   <option key={colorOption._id} value={colorOption.name}>{colorOption.Color}</option>  
//                 ))}
//               </select>  
//               <label>manufacturer</label>
//                 <input type="text" className="form-control" placeholder="Enter manufacturer" value={manufacturer}
//                        onChange={(e) => setManufacturer(e.target.value)} />    
//                 <label>productcare</label>
//                 <input type="text" className="form-control" placeholder="Enter productcare" value={productcare}
//                        onChange={(e) => setProductcare(e.target.value)} />   
      
//               <label>Features</label>                
//                 <input type="text" className="form-control" value={features} onChange={(e) => setFeatures(e.target.value)} />
             
//               <div className="form-group">
//                 <label htmlFor="maincategory">Main Category</label>
              
//                 <select className="form-control" id="maincategory" name="mainCategory"
//                         value={getDishesById.mainCategory} onChange={(e) => {
//                           setMaincategory(e.target.value);
//                           handleUpdateChange(e);
//                         }}>
//                   <option value="">Select Main Category</option>
//                   {getMaincategories.map(mainCat => (
//                     <option key={mainCat._id} value={mainCat._id}>{mainCat.maincategories}</option>
//                   ))}
//                 </select>
//               </div>
//               <div className="form-group">
//                 <label htmlFor="categories">Category</label>
//                 <select className="form-control" id="categories" name="category"
//                         value={getDishesById.category} onChange={(e) => {
//                           setCategories(e.target.value);
//                           handleUpdateChange(e);
//                         }}>
//                   <option value="">Select Category</option>
//                   {filteredCategories.map(cat => (
//                     <option key={cat._id} value={cat._id}>{cat.name}</option>
//                   ))}
//                 </select>
//               </div>
//               <div className="form-group">
//                 <label htmlFor="subcategories">Subcategory</label>
//                 <select className="form-control" id="subcategories" name="subcategory"
//                         value={getDishesById.subcategory} onChange={handleUpdateChange}>
//                   <option value="">Select Subcategory</option>
//                   {filteredSubcategories.map(subCat => (
//                     <option key={subCat._id} value={subCat._id}>{subCat.name}</option>
//                   ))}
//                 </select>
//               </div>
//               <div className="form-group">
//                 <label htmlFor="image">Upload Images</label>
//                 <input type="file" className="form-control-file" id="image" multiple onChange={handleImage} />
//               </div>
//             </form>
//           </div>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleClose}>Close</Button>
//           <Button variant="primary" onClick={() => {
//             if (uid) {
//               updateDishes();
//             } else {
//               postDishes();
//             }
//             handleClose();
//           }}>
//             {uid ? "Update" : "Add"}
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       <Modal show={on} onHide={handleOff} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
//       <Modal.Header closeButton>
//         <Modal.Title>Edit Item</Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         <form>
//           {/* Row 1: Item Number and Name */}
//           <div className="form-row">
//             <div className="form-group col-md-6">
//               <label>Item Number</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 placeholder="Enter Item Number"
//                 name="Itemnumber"
//                 value={getDishesById.Itemnumber || ""}
//                 onChange={handleUpdateChange}
//               />
//             </div>
//             <div className="form-group col-md-6">
//               <label>Name</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 placeholder="Enter Dish Name"
//                 name="dishes"
//                 value={getDishesById.dishes || ""}
//                 onChange={handleUpdateChange}
//               />
//             </div>
//           </div>

//           {/* Row 2: Description, Old Price, and New Price */}
//           <div className="form-row">
//             <div className="form-group col-md-6">
//               <label>Description</label>
//               <textarea
//                 className="form-control"
//                 placeholder="Enter Description"
//                 name="description"
//                 value={getDishesById.description || ""}
//                 onChange={handleUpdateChange}
//               />
//             </div>
//             <div className="form-group col-md-3">
//               <label>Old Price</label>
//               <input
//                 type="number"
//                 className="form-control"
//                 placeholder="Enter old Price"
//                 name="oldprice"
//                 value={getDishesById.oldprice || ""}
//                 onChange={handleUpdateChange}
//               />
//             </div>
//             <div className="form-group col-md-3">
//               <label>New Price</label>
//               <input
//                 type="number"
//                 className="form-control"
//                 placeholder="Enter new Price"
//                 name="newprice"
//                 value={getDishesById.newprice || ""}
//                 onChange={handleUpdateChange}
//               />
//             </div>
//           </div>

//           {/* Row 3: Color and Manufacturer */}
//           <div className="form-row">
//             <div className="form-group col-md-6">
//               <label>Color</label>
//               <select
//                 className="form-control"
//                 id="color"
//                 name="color"
//                 value={getDishesById.color || ""}
//                 onChange={handleUpdateChange}
//               >
//                 <option value="">Select Color</option>
//                 {getColors.map((colorOption) => (
//                   <option key={colorOption._id} value={colorOption.name}>
//                     {colorOption.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div className="form-group col-md-6">
//               <label>Manufacturer</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 placeholder="Enter Manufacturer"
//                 name="manufacturer"
//                 value={getDishesById.manufacturer || ""}
//                 onChange={handleUpdateChange}
//               />
//             </div>
//           </div>

//           {/* Row 4: Product Care and Features */}
//           <div className="form-row">
//             <div className="form-group col-md-6">
//               <label>Product Care</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 placeholder="Enter Product Care"
//                 name="productcare"
//                 value={getDishesById.productcare || ""}
//                 onChange={handleUpdateChange}
//               />
//             </div>
//             <div className="form-group col-md-6">
//               <label>Features</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 placeholder="Enter Features"
//                 name="features"
//                 value={getDishesById.features || ""}
//                 onChange={handleUpdateChange}
//               />
//             </div>
//           </div>

//           {/* Row 5: Main Category, Category, Subcategory */}
//           <div className="form-row">
//             <div className="form-group col-md-4">
//               <label>Main Category</label>
//               <select
//                 className="form-control"
//                 name="mainCategory"
//                 value={getDishesById.mainCategory || ""}
//                 onChange={handleUpdateChange}
//               >
//                 <option value="">Select Main Category</option>
//                 {getMaincategories.map((mainCat) => (
//                   <option key={mainCat._id} value={mainCat._id}>
//                     {mainCat.maincategories}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div className="form-group col-md-4">
//               <label>Category</label>
//               <select
//                 className="form-control"
//                 name="category"
//                 value={getDishesById.category || ""}
//                 onChange={handleUpdateChange}
//               >
//                 <option value="">Select Category</option>
//                 {filteredCategories.map((cat) => (
//                   <option key={cat._id} value={cat._id}>
//                     {cat.categories}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div className="form-group col-md-4">
//               <label>Subcategory</label>
//               <select
//                 className="form-control"
//                 name="subcategory"
//                 value={getDishesById.subcategory || ""}
//                 onChange={handleUpdateChange}
//               >
//                 <option value="">Select Subcategory</option>
//                 {filteredSubcategories.map((subCat) => (
//                   <option key={subCat._id} value={subCat._id}>
//                     {subCat.subcategories}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           {/* Row 6: Image Upload */}
//           <div className="form-group">
//             <label>Upload Image</label>
//             <input
//               type="file"
//               className="form-control"
//               onChange={handleImage}
//               multiple
//             />
//           </div>
//         </form>
//       </Modal.Body>
//       <Modal.Footer>
//         <Button variant="secondary" onClick={handleOff}>
//           Close
//         </Button>
//         <Button variant="primary" onClick={updateDishes}>
//           Save Changes
//         </Button>
//       </Modal.Footer>
//       </Modal>



      
//     </div>
//   );
// }

// export default Dishes;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import SideNav from "./SideNav";
// import { Button, Modal } from "react-bootstrap";
// import { MdDelete } from "react-icons/md";
// import { FiEdit } from "react-icons/fi";
// import { IoIosAddCircle } from "react-icons/io";
// import Tooltip from "@mui/material/Tooltip";

// function Dishes() {
//   const backendUrl = process.env.REACT_APP_MACHINE_TEST_1_BACKEND_URL;
//   const [uid, setUid] = useState("");
//   const [show, setShow] = useState(false);
//   const [on, setOn] = useState(false);
//   const [dishes, setDishes] = useState("");
//   const [description, setDescription] = useState("");
//   const [oldprice, setOldPrice] = useState("");
//   const [newprice, setNewPrice] = useState("");
//   const [image, setImage] = useState([]);
//   const [Itemnumber, setItemnumber] = useState("");
//   const [manufacturer, setManufacturer] = useState("");
//   const [color, setColor] = useState("");
//   const [productcare, setProductcare] = useState("");
//   const [features, setFeatures] = useState("");
//   const [maincategory, setMaincategory] = useState('');
//   const [categories, setCategories] = useState('');
//   const [subcategories, setSubcategories] = useState('');
//   const [getMaincategories, setGetMaincategories] = useState([]);
//   const [getCategories, setGetCategories] = useState([]);
//   const [getSubcategories, setGetSubcategories] = useState([]);
//   const [getDishes, setGetDishes] = useState([]);
//   const [getColors, setGetColors] = useState([]);

//   const [getDishesById, setGetDishesById] = useState({
//     dishes: "",
//     oldprice: "",
//     newprice: "",
//     description: "",
//     Itemnumber: "",
//     manufacturer: "",
//     color: "",
//     productcare: "",
//     features: "",
//     mainCategory: "",
//     category: "",
//     subcategory: ""
//   });

//   const handleImage = (e) => {
//     const selectedFiles = Array.from(e.target.files);
//     setImage(selectedFiles);
//   };

//   const handleClose = () => setShow(false);
//   const handleShow = () => setShow(true);
//   const handleOff = () => setOn(false);

//   // Fetch main categories, categories, and subcategories
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [mainCatResponse, catResponse, subCatResponse, dishesResponse] = await Promise.all([
//           axios.get(`${backendUrl}/admin/getmaincategories`),
//           axios.get(`${backendUrl}/admin/getcategories`),
//           axios.get(`${backendUrl}/admin/getsubcategories`),
//           axios.get(`${backendUrl}/admin/getdishes`)
//         ]);

//         setGetMaincategories(mainCatResponse.data);
//         setGetCategories(catResponse.data);
//         setGetSubcategories(subCatResponse.data);
//         setGetDishes(dishesResponse.data);
//       } catch (err) {
//         console.log(err);
//       }
//     };

//     // Fetch colors
//     const fetchColors = async () => {
//       try {
//         const response = await axios.get(`${backendUrl}/admin/getcolors`);
//         setGetColors(response.data);  // Set the colors state with fetched data
//       } catch (err) {
//         console.error(err);
//         alert("An error occurred while fetching colors.");
//       }
//     };

//     fetchData();
//     fetchColors();  // Call the fetchColors function
//   }, [backendUrl]);

//   // Function to handle POST dishes
//   const postDishes = async () => {
//     const formData = new FormData();
//     formData.append("dishes", dishes);
//     formData.append("description", description);
//     formData.append("category", categories);
//     formData.append("maincategories", maincategory);
//     formData.append("subcategories", subcategories);
//     formData.append("oldprice", oldprice);

//     formData.append("newprice", newprice);
//     formData.append("color", color);
//     formData.append("Itemnumber", Itemnumber);
//     formData.append("manufacturer", manufacturer);
//     formData.append("productcare", productcare);
//     formData.append("features", features);

//     image.forEach(file => formData.append("image", file));

//     try {
//       await axios.post(`${backendUrl}/admin/postdishes`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });
//       window.location.reload();
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const updateDishes = async () => {
//     const formData = new FormData();
//     formData.append("dishes", getDishesById.dishes);
//     formData.append("description", getDishesById.description);
//     formData.append("oldprice", getDishesById.oldprice);
//     formData.append("newprice", getDishesById.newprice);
//     formData.append("category", getDishesById.category);
//     formData.append("maincategories", getDishesById.mainCategory);
//     formData.append("subcategories", getDishesById.subcategory);
//     formData.append("color", getDishesById.color);
//     formData.append("Itemnumber", getDishesById.Itemnumber);
//     formData.append("ram", getDishesById.productcare);
//     formData.append("internalstorage", getDishesById.manufacturer);
//     formData.append("features", getDishesById.features);

//     if (image.length > 0) {
//       image.forEach(file => formData.append("image", file));
//     }

//     try {
//       await axios.put(`${backendUrl}/admin/putdishes/${uid}`, formData);
//       window.location.reload();
//     } catch (err) {
//       console.error('Error updating dish:', err);
//     }
//   };

//   const handleOn = async (id) => {
//     setOn(true);
//     setUid(id);

//     try {
//       const response = await axios.get(`${backendUrl}/admin/getdishesbyid/${id}`);
//       const data = response.data;
//       setGetDishesById({
//         dishes: data.dishes,
//         oldprice: data.oldprice,
//         newprice: data.newprice,
//         description: data.description,
//         Itemnumber: data.Itemnumber,
//         manufacturer: data.manufacturer,
//         color:data.color,
//         productcare: data.productcare,
//         features: data.features,
//         mainCategory: data.mainCategory?._id || '',
//         category: data.category?._id || '',
//         subcategory: data.subcategory?._id || '',
//         image: data.image || [],
//       });
//       setMaincategory(data.mainCategory?._id || '');
//       setCategories(data.category?._id || '');
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const handleUpdateChange = (e) => {
//     const { name, value } = e.target;
//     setGetDishesById((prevState) => ({
//       ...prevState,
//       [name]: value,
//     }));
//   };
  

//   const handleDelete = async (id) => {
//     const windowConfirmation = window.confirm("Are you sure to Delete this item");
//     if (windowConfirmation) {
//       try {
//         await axios.delete(`${backendUrl}/admin/deletedishes/${id}`);
//         window.location.reload();
//       } catch (err) {
//         console.log(err);
//       }
//     }
//   };

//   // Filtering categories and subcategories based on main category and category
//   const filteredCategories = getCategories.filter(cat => cat.maincategoriesData._id === maincategory);
//   const filteredSubcategories = getSubcategories.filter(subCat => subCat.category._id === categories);

//   return (
//     <div>
//       <SideNav />
//       <div className="whole">
//         <div className=" main-contenet">
//           <div className="pl-3 row main-row">
//             <div className="col-12 my-sm-0 my-md-5 p-3 montserrat-400"
//                  style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
//               <h2><b>ITEMS</b></h2>
//               <Tooltip className="add_btn" title="Add">
//                 <IoIosAddCircle className="add_btn" onClick={handleShow} />
//               </Tooltip>
//             </div>
//             <div className="container table-responsive">
//               <table className="table table-striped table-bordered">
//                 <thead className="thead-dark">
//                   <tr>
//                     <th scope="col">Image</th>
//                     <th scope="col">Item Number</th>
//                     <th scope="col">Name</th>
//                     <th scope="col">Description</th>
//                     <th scope="col">Old Price</th>

//                     <th scope="col">New Price</th>
//                     <th scope="col">Color</th>
//                     <th scope="col">manufacturer</th>
//                     <th scope="col">productcare</th>
//                     <th scope="col">Features</th>
//                     <th scope="col">Main Category</th>
//                     <th scope="col">Category</th>
//                     <th scope="col">Sub Category</th>
//                     <th scope="col">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {getDishes.map((items, index) => (
//                     <tr key={index}>
//                       <td>
//                         <div className="image-container">
//                           {items.image.map((image, idx) => (
//                             <img key={idx} className="avatar" src={`${backendUrl}/images/${image}`} alt={`Image ${idx + 1}`} />
//                           ))}
//                         </div>
//                       </td>
//                       <td className="text-black item-text">{items.Itemnumber}</td>
//                       <td className="text-black item-text"><b>{items.dishes}</b></td>
//                       <td className="text-black item-text">{items.description}</td>
//                       <td className="text-black item-text">{items.oldprice}</td>

//                       <td className="text-black item-text">{items.newprice}</td>
//                       <td className="text-black item-text">{items.Color}</td>
//                       <td className="text-black item-text">{items.manufacturer}</td>
//                       <td className="text-black item-text">{items.productcare}</td>
//                       <td className="text-black item-text">{items.features}</td>
//                       <td>{items.mainCategory?.maincategories || 'No Main Category'}</td>
//                       <td>{items.category?.name || 'No Category'}</td>
//                       <td>{items.subcategory?.name || 'No Subcategory'}</td>
//                       <td className="text-black item-text">
//                         <Tooltip title="Edit">
//                           <FiEdit onClick={() => handleOn(items._id)} className="edit-icon" />
//                         </Tooltip>
//                         <Tooltip title="Delete">
//                           <MdDelete onClick={() => handleDelete(items._id)} className="delete-icon" />
//                         </Tooltip>
                        
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>
      
//       {/* Modal for adding/editing dishes */}
//       <Modal show={show} onHide={handleClose} size="lg">
//         <Modal.Header closeButton>
//           <Modal.Title>Add/Edit Dishes</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <div className="container">
//             <form> 
//               <label>Item Number</label>
//                 <input type="text" className="form-control" value={Itemnumber} onChange={(e) => setItemnumber(e.target.value)} />   
//               <label>Product</label>
//                 <input type="text" className="form-control" value={dishes} onChange={(e) => setDishes(e.target.value)} />
//               <label>oldPrice</label>
//                 <input type="number" className="form-control" placeholder="Enter Price" value={oldprice}
//                        onChange={(e) => setOldPrice(e.target.value)} />
//                 <label>NewPrice</label>
//                   <input type="number" className="form-control" placeholder="Enter Price" value={newprice}
//                   onChange={(e) => setNewPrice(e.target.value)} />
//               <label>Description</label>       
//                 <textarea className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} />
//                 <label>Color</label>
//               <select className="form-control" id="color" name="color" value={color} onChange={(e) => setColor(e.target.value)}>
//                 <option value="">Select Color</option>
//                 {getColors.map((colorOption) => (
//                   <option key={colorOption._id} value={colorOption.name}>{colorOption.Color}</option>  
//                 ))}
//               </select>  
//               <label>manufacturer</label>
//                 <input type="text" className="form-control" placeholder="Enter manufacturer" value={manufacturer}
//                        onChange={(e) => setManufacturer(e.target.value)} />    
//                 <label>productcare</label>
//                 <input type="text" className="form-control" placeholder="Enter productcare" value={productcare}
//                        onChange={(e) => setProductcare(e.target.value)} />   
      
//               <label>Features</label>                
//                 <input type="text" className="form-control" value={features} onChange={(e) => setFeatures(e.target.value)} />
             
//               <div className="form-group">
//                 <label htmlFor="maincategory">Main Category</label>
              
//                 <select className="form-control" id="maincategory" name="mainCategory"
//                         value={getDishesById.mainCategory} onChange={(e) => {
//                           setMaincategory(e.target.value);
//                           handleUpdateChange(e);
//                         }}>
//                   <option value="">Select Main Category</option>
//                   {getMaincategories.map(mainCat => (
//                     <option key={mainCat._id} value={mainCat._id}>{mainCat.maincategories}</option>
//                   ))}
//                 </select>
//               </div>
//               <div className="form-group">
//                 <label htmlFor="categories">Category</label>
//                 <select className="form-control" id="categories" name="category"
//                         value={getDishesById.category} onChange={(e) => {
//                           setCategories(e.target.value);
//                           handleUpdateChange(e);
//                         }}>
//                   <option value="">Select Category</option>
//                   {filteredCategories.map(cat => (
//                     <option key={cat._id} value={cat._id}>{cat.name}</option>
//                   ))}
//                 </select>
//               </div>
//               <div className="form-group">
//                 <label htmlFor="subcategories">Subcategory</label>
//                 <select className="form-control" id="subcategories" name="subcategory"
//                         value={getDishesById.subcategory} onChange={handleUpdateChange}>
//                   <option value="">Select Subcategory</option>
//                   {filteredSubcategories.map(subCat => (
//                     <option key={subCat._id} value={subCat._id}>{subCat.name}</option>
//                   ))}
//                 </select>
//               </div>
//               <div className="form-group">
//                 <label htmlFor="image">Upload Images</label>
//                 <input type="file" className="form-control-file" id="image" multiple onChange={handleImage} />
//               </div>
//             </form>
//           </div>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleClose}>Close</Button>
//           <Button variant="primary" onClick={() => {
//             if (uid) {
//               updateDishes();
//             } else {
//               postDishes();
//             }
//             handleClose();
//           }}>
//             {uid ? "Update" : "Add"}
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       <Modal show={on} onHide={handleOff} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
//       <Modal.Header closeButton>
//         <Modal.Title>Edit Item</Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         <form>
//           {/* Row 1: Item Number and Name */}
//           <div className="form-row">
//             <div className="form-group col-md-6">
//               <label>Item Number</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 placeholder="Enter Item Number"
//                 name="Itemnumber"
//                 value={getDishesById.Itemnumber || ""}
//                 onChange={handleUpdateChange}
//               />
//             </div>
//             <div className="form-group col-md-6">
//               <label>Name</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 placeholder="Enter Dish Name"
//                 name="dishes"
//                 value={getDishesById.dishes || ""}
//                 onChange={handleUpdateChange}
//               />
//             </div>
//           </div>

//           {/* Row 2: Description, Old Price, and New Price */}
//           <div className="form-row">
//             <div className="form-group col-md-6">
//               <label>Description</label>
//               <textarea
//                 className="form-control"
//                 placeholder="Enter Description"
//                 name="description"
//                 value={getDishesById.description || ""}
//                 onChange={handleUpdateChange}
//               />
//             </div>
//             <div className="form-group col-md-3">
//               <label>Old Price</label>
//               <input
//                 type="number"
//                 className="form-control"
//                 placeholder="Enter old Price"
//                 name="oldprice"
//                 value={getDishesById.oldprice || ""}
//                 onChange={handleUpdateChange}
//               />
//             </div>
//             <div className="form-group col-md-3">
//               <label>New Price</label>
//               <input
//                 type="number"
//                 className="form-control"
//                 placeholder="Enter new Price"
//                 name="newprice"
//                 value={getDishesById.newprice || ""}
//                 onChange={handleUpdateChange}
//               />
//             </div>
//           </div>

//           {/* Row 3: Color and Manufacturer */}
//           <div className="form-row">
//             <div className="form-group col-md-6">
//               <label>Color</label>
//               <select
//                 className="form-control"
//                 id="color"
//                 name="color"
//                 value={getDishesById.color || ""}
//                 onChange={handleUpdateChange}
//               >
//                 <option value="">Select Color</option>
//                 {getColors.map((colorOption) => (
//                   <option key={colorOption._id} value={colorOption.name}>
//                     {colorOption.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div className="form-group col-md-6">
//               <label>Manufacturer</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 placeholder="Enter Manufacturer"
//                 name="manufacturer"
//                 value={getDishesById.manufacturer || ""}
//                 onChange={handleUpdateChange}
//               />
//             </div>
//           </div>

//           {/* Row 4: Product Care and Features */}
//           <div className="form-row">
//             <div className="form-group col-md-6">
//               <label>Product Care</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 placeholder="Enter Product Care"
//                 name="productcare"
//                 value={getDishesById.productcare || ""}
//                 onChange={handleUpdateChange}
//               />
//             </div>
//             <div className="form-group col-md-6">
//               <label>Features</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 placeholder="Enter Features"
//                 name="features"
//                 value={getDishesById.features || ""}
//                 onChange={handleUpdateChange}
//               />
//             </div>
//           </div>

//           {/* Row 5: Main Category, Category, Subcategory */}
//           <div className="form-row">
//             <div className="form-group col-md-4">
//               <label>Main Category</label>
//               <select
//                 className="form-control"
//                 name="mainCategory"
//                 value={getDishesById.mainCategory || ""}
//                 onChange={handleUpdateChange}
//               >
//                 <option value="">Select Main Category</option>
//                 {getMaincategories.map((mainCat) => (
//                   <option key={mainCat._id} value={mainCat._id}>
//                     {mainCat.maincategories}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div className="form-group col-md-4">
//               <label>Category</label>
//               <select
//                 className="form-control"
//                 name="category"
//                 value={getDishesById.category || ""}
//                 onChange={handleUpdateChange}
//               >
//                 <option value="">Select Category</option>
//                 {filteredCategories.map((cat) => (
//                   <option key={cat._id} value={cat._id}>
//                     {cat.categories}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div className="form-group col-md-4">
//               <label>Subcategory</label>
//               <select
//                 className="form-control"
//                 name="subcategory"
//                 value={getDishesById.subcategory || ""}
//                 onChange={handleUpdateChange}
//               >
//                 <option value="">Select Subcategory</option>
//                 {filteredSubcategories.map((subCat) => (
//                   <option key={subCat._id} value={subCat._id}>
//                     {subCat.subcategories}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           {/* Row 6: Image Upload */}
//           <div className="form-group">
//             <label>Upload Image</label>
//             <input
//               type="file"
//               className="form-control"
//               onChange={handleImage}
//               multiple
//             />
//           </div>
//         </form>
//       </Modal.Body>
//       <Modal.Footer>
//         <Button variant="secondary" onClick={handleOff}>
//           Close
//         </Button>
//         <Button variant="primary" onClick={updateDishes}>
//           Save Changes
//         </Button>
//       </Modal.Footer>
//       </Modal>



      
//     </div>
//   );
// }

// export default Dishes;

           
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import SideNav from "./SideNav";
// import { Button, Modal,Table } from "react-bootstrap";
// import { MdDelete } from "react-icons/md";
// import { FiEdit } from "react-icons/fi";
// import { IoIosAddCircle } from "react-icons/io";
// import Tooltip from "@mui/material/Tooltip";
// import { Link } from "react-router-dom";


// function Dishes() {
//   const backendUrl = process.env.REACT_APP_MACHINE_TEST_1_BACKEND_URL;
//   const [uid, setUid] = useState("");
//   const [show, setShow] = useState(false);
//   const [on, setOn] = useState(false);
//   const [dishes, setDishes] = useState("");
//   const [description, setDescription] = useState("");
//   const [price, setPrice] = useState("");
//   const [image, setImage] = useState([]);
//   const [Itemnumber, setItemnumber] = useState("");
//   const [ram, setRam] = useState("");
//   const [color, setColor] = useState("");
//   const [features, setFeatures] = useState("");
//   const [internalstorage, setInternalstorage] = useState("");
//   const [mainCategories, setMainCategories] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [subCategories, setSubCategories] = useState([]);
//   const [mainCategory, setMainCategory] = useState('');
//   const [category, setCategory] = useState('');
//   const [subcategory, setSubcategory] = useState('');
//   const [filteredCategories, setFilteredCategories] = useState([]);
//   const [filteredSubcategories, setFilteredSubcategories] = useState([]);
//   const [getDishes, setGetDishes] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [editProductId, setEditProductId] = useState(null);

//   const [getDishesById, setGetDishesById] = useState({
//     dishes: "",
//     price: "",
//     description:"",
//     Itemnumber: "",
//     ram: "",
//     internalstorage: "",
//     color: "",
//     features:''
//   });

//   const handleImage = (e) => {
//     const selectedFiles = Array.from(e.target.files);
//     setImage(selectedFiles);
//   };

//   const handleClose = () => setShow(false);
//   const handleShow = () => setShow(true);
//   const handleOff = () => setOn(false);

//   useEffect(() => {
//     const fetchData = async () => {
//         try {
//             const [mainResponse, catResponse, subResponse] = await Promise.all([
//                 axios.get(`${backendUrl}/admin/getmaincategories`),
//                 axios.get(`${backendUrl}/admin/getcategories`),
//                 axios.get(`${backendUrl}/admin/getsubcategories`)
//             ]);

//             setMainCategories(mainResponse.data);
//             setCategories(catResponse.data);
//             setSubCategories(subResponse.data);
//         } catch (err) {
//             console.error('Error fetching data:', err);
//         }
//     };

//     fetchData();
// }, [backendUrl]);

// useEffect(() => {
//     if (mainCategory) {
//         const filteredCats = categories.filter(cat => cat.maincategoriesData._id === mainCategory);
//         setFilteredCategories(filteredCats);
//         setCategory(''); // Reset category selection
//         setSubcategory(''); // Reset subcategory selection
//     } else {
//         setFilteredCategories([]);
//         setCategory('');
//         setSubcategory('');
//     }
// }, [mainCategory, categories]);

// useEffect(() => {
//     if (category) {
//         const filteredSubs = subCategories.filter(sub => sub.category && sub.category._id === category);
//         setFilteredSubcategories(filteredSubs);
//         setSubcategory(''); // Reset subcategory selection
//     } else {
//         setFilteredSubcategories([]);
//         setSubcategory('');
//     }
// }, [category, subCategories]);

//   // Fetch dishes from the backend on component mount
//   const fetchProducts = async () => {
//     try {
//         const response = await axios.get(`${backendUrl}/admin/getdishes`);
//         setProducts(response.data);
//     } catch (err) {
//         console.error('Error fetching products:', err);
//     }
// };

//   // Function to handle POST dishes
//   const postDishes = async () => {
//     const formData = new FormData();
//     formData.append("dishes", dishes);
//     formData.append("description", description);
//     formData.append("categories", categories);
//     formData.append("subcategory", subcategory);
//     formData.append("maincategories", mainCategories);
//     formData.append("price", price);
//     formData.append("Itemnumber", Itemnumber);
//     formData.append("color", color);
//     formData.append("internalstorage", internalstorage);
//     formData.append("ram", ram);
//     formData.append("features", features);

//     for (let i = 0; i < image.length; i++) {
//       formData.append("image", image[i]);
//     }

//     try {
//       await axios.post(`${backendUrl}/admin/postdishes`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });
//       window.location.reload();
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const updateDishes = async () => {
//     const formData = new FormData();
//     formData.append("dishes", getDishesById.dishes);
//     formData.append("description", getDishesById.description);
//     formData.append("price", getDishesById.price);
//     formData.append("categories", categories);
//     formData.append("subcategory", subcategory);
//     formData.append("Itemnumber", getDishesById.Itemnumber);
//     formData.append("internalstorage", getDishesById.internalstorage);
//     formData.append("color", getDishesById.color);
//     formData.append("features", getDishesById.features);
//     formData.append("ram", getDishesById.ram);

//     if (image) {
//       image.forEach(file => formData.append("image", file));
//     }

//     try {
//       await axios.put(`${backendUrl}/admin/putdishes/${uid}`, formData);
//       window.location.reload();
//     } catch (err) {
//       console.error('Error updating dish:', err);
//     }
//   };

//   const handleOn = async (id) => {
//     setOn(true);
//     setUid(id);

//     try {
//       const response = await axios.get(`${backendUrl}/admin/getdishesbyid/${id}`);
//       const data = response.data;
//       setGetDishesById({
//         dishes: data.dishes,
//         price: data.price,
//         description: data.description,
//         Itemnumber: data.Itemnumber,
//         internalstorage: data.internalstorage,
//         color: data.color,
//         ram: data.ram,
//         features: data.features,
//         image: data.image || [],
//       });
//       setMainCategories(data.maincategories || '');
//       setCategories(data.categories || '');
//       setSubcategory(data.subcategories || '');
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const handleUpdateChange = (e) => {
//     const { name, value } = e.target;
//     setGetDishesById((prevState) => ({
//       ...prevState,
//       [name]: value,
//     }));
//   };
//   const handleEditShow = (product) => {
//     setEditProductId(product._id);
//     setProductData({
//         Itemnumber: product.Itemnumber,
//         dishes: product.dishes,
//         price: product.price,
//         description: product.description,
//         internalstorage: product.internalstorage,
//         color: product.color,
//         ram: product.ram,
//         features: product.features,
//         mainCategory: product.mainCategory?._id || '',
//         category: product.category?._id || '',
//         subcategory: product.subcategory?._id || '',
//         images: product.image || []
//     });
//     setEditShow(true);
// };
// const handleEditClose = () => setEditShow(false);

//   const handleDelete = async (id) => {
//   const confirmDelete = window.confirm("Are you sure you want to delete this item?");
//   if (confirmDelete) {
//       try {
//           await axios.delete(`${backendUrl}/admin/deletedishes/${id}`);
//           fetchProducts(); // Refresh products list
//       } catch (err) {
//           console.error('Error deleting product:', err);
//       }
//   }
// };

//   // Filter categories based on the selected main category
//   return (
//     <div>
//       <SideNav />
//       <div className="whole">
//         <div className=" main-contenet">
//           <div className="pl-3 row main-row">
//             <div className="col-12 my-sm-0 my-md-5 p-3 montserrat-400" style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
//               <h2><b>ITEMS</b></h2>
//               <Tooltip className="add_btn" title="Add">
//                 <IoIosAddCircle className="add_btn" onClick={handleShow} />
//               </Tooltip>
//             </div>
//             <div className="container table-responsive">
//               <Table striped bordered hover>
//                 <thead>
//                     <tr>
//                         <th>Item Number</th>
//                         <th>Product</th>
//                         <th>Price</th>
//                         <th>Description</th>
//                         <th>Internal Storage</th>
//                         <th>Color</th>
//                         <th>Ram</th>
//                         <th>Features</th>
//                         <th>Main Category</th>
//                         <th>Category</th>
//                         <th>Subcategory</th>
//                         <th>Images</th>
//                         <th>Actions</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {products.map((product) => (
//                         <tr key={product._id}>
//                             <td>{product.Itemnumber}</td>
//                             <td>{product.dishes}</td>
//                             <td>{product.price}</td>
//                             <td>{product.description}</td>
//                             <td>{product.internalstorage}</td>
//                             <td>{product.color}</td>
//                             <td>{product.ram}</td>
//                             <td>{product.features}</td>
//                             <td>{product.mainCategory?.maincategories || 'No Main Category'}</td>
//                             <td>{product.category?.name || 'No Category'}</td>
//                             <td>{product.subcategory?.name || 'No Subcategory'}</td>
//                             <td>
//                                 {product.images && product.images.length > 0 && product.images.map((img, index) => (
//                                     <img key={index} src={img} alt="product" style={{ width: '50px', height: '50px', margin: '2px' }} />
//                                 ))}
//                             </td>
//                             <td>
//                                 <Button variant="outline-primary" onClick={() => handleEditShow(product)}><FiEdit /></Button>{' '}
//                                 <Button variant="outline-danger" onClick={() => handleDelete(product._id)}><MdDelete /></Button>
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//               </Table>

//               <Modal show={show} onHide={handleClose}>
//                 <Modal.Header closeButton>
//                   <Modal.Title>Add Dish</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                 <div>
//                         <label>Item Number</label>
//                          <input type="text" className="form-control" value={Itemnumber} onChange={(e) => setItemnumber(e.target.value)} />                         <label>Product</label>
//                         <input type="text" className="form-control" value={dishes} onChange={(e) => setDishes(e.target.value)} />
//                        <label>Price</label>
//                        <input type="text" className="form-control" value={price} onChange={(e) => setPrice(e.target.value)} />                         <label>Description</label>                         <textarea className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} />
//                         <label>Internal Storage</label>
//                         <input type="text" className="form-control" value={internalstorage} onChange={(e) => setInternalstorage(e.target.value)} />                        <label>Color</label>                        <input type="text" className="form-control" value={color} onChange={(e) => setColor(e.target.value)} />
//                         <label>Ram</label>
//                         <input type="text" className="form-control" value={ram} onChange={(e) => setRam(e.target.value)} />
//                         <label>Features</label>                         <input type="text" className="form-control" value={features} onChange={(e) => setFeatures(e.target.value)} />
//                         <select className="my-3 input-style" onChange={(e) => setMainCategory(e.target.value)} value={mainCategory} style={{ width: "100%", marginBottom: '1rem' }}>
//                             <option value="">Select Main Category</option>
//                             {mainCategories.map((mainCat) => (
//                                 <option key={mainCat._id} value={mainCat._id}>{mainCat.maincategories}</option>
//                             ))}                        </select>

//                         <select className="my-3 input-style" onChange={(e) => setCategory(e.target.value)} value={category} style={{ width: "100%", marginBottom: '1rem' }}>
//                             <option value="">Select Category</option>
//                             {filteredCategories.map((cat) => (
//                                 <option key={cat._id} value={cat._id}>{cat.name}</option>                            ))}
//                         </select>

//                        <select className="my-3 input-style" onChange={(e) => setSubcategory(e.target.value)} value={subcategory} style={{ width: "100%", marginBottom: '1rem' }}>
//                            <option value="">Select Subcategory</option>
//                            {filteredSubcategories.length > 0 ? (
//                                 filteredSubcategories.map((subCat) => (
//                                     <option key={subCat._id} value={subCat._id}>{subCat.name}</option>
//                                 ))
//                             ) : (
//                                 <option value="">No Subcategories Available</option>
//                             )}
//                         </select>
//                          <label>Images</label>     
//                           <input type="file" className="form-control" multiple onChange={handleImage} /> 
//                 </div>
//                 </Modal.Body>
//                 <Modal.Footer>
//                   <Button variant="secondary" onClick={handleClose}>
//                     Close
//                   </Button>
//                   <Button variant="primary" onClick={postDishes}>
//                     Save Changes
//                   </Button>
//                 </Modal.Footer>
//               </Modal>

//               <Modal show={on} onHide={handleOff}>
//                 <Modal.Header closeButton>
//                   <Modal.Title>Update Dishes</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                   <div>
//                     <label>Item Number</label>
//                     <input type="text" className="form-control" name="Itemnumber" value={getDishesById.Itemnumber || ''} onChange={handleUpdateChange} />
//                     <label>Dishes</label>
//                     <input type="text" className="form-control" name="dishes" value={getDishesById.dishes || ''} onChange={handleUpdateChange} />
//                     <label>Price</label>
//                     <input type="text" className="form-control" name="price" value={getDishesById.price || ''} onChange={handleUpdateChange} />
//                     <label>Description</label>
//                     <textarea className="form-control" name="description" value={getDishesById.description || ''} onChange={handleUpdateChange} />
//                     <label>Internal Storage</label>
//                     <input type="text" className="form-control" name="internalstorage" value={getDishesById.internalstorage || ''} onChange={handleUpdateChange} />
//                     <label>Color</label>
//                     <input type="text" className="form-control" name="color" value={getDishesById.color || ''} onChange={handleUpdateChange} />
//                     <label>Ram</label>
//                     <input type="text" className="form-control" name="ram" value={getDishesById.ram || ''} onChange={handleUpdateChange} />
//                     <label>Features</label>
//                     <input type="text" className="form-control" name="features" value={getDishesById.features || ''} onChange={handleUpdateChange} />
//                     <label>Main Category</label>
//                     <select className="my-3 input-style" onChange={(e) => setMainCategory(e.target.value)} value={mainCategory} style={{ width: "100%", marginBottom: '1rem' }}>
//                           <option value="">Select Main Category</option>
//                           {mainCategories.map((mainCat) => (
//                               <option key={mainCat._id} value={mainCat._id}>
//                                   {mainCat.name}
//                               </option>
//                           ))}
//                       </select>

//                       {/* Dropdown for selecting Category */}
//                       <select className="my-3 input-style" onChange={(e) => setCategory(e.target.value)} value={category} style={{ width: "100%", marginBottom: '1rem' }}>
//                           <option value="">Select Category</option>
//                           {filteredCategories.map((cat) => (
//                               <option key={cat._id} value={cat._id}>
//                                   {cat.name}
//                               </option>
//                           ))}
//                       </select>

//                       {/* Dropdown for selecting Subcategory */}
//                       <select className="my-3 input-style" onChange={(e) => setSubcategory(e.target.value)} value={subcategory} style={{ width: "100%", marginBottom: '1rem' }}>
//                           <option value="">Select Subcategory</option>
//                           {filteredSubcategories.map((subCat) => (
//                               <option key={subCat._id} value={subCat._id}>
//                                   {subCat.name}
//                               </option>
//                           ))}
//                       </select>

//                     <label>Images</label>
//                     <input type="file" className="form-control" multiple onChange={handleImage} />
//                   </div>
//                 </Modal.Body>
//                 <Modal.Footer>
//                   <Button variant="secondary" onClick={handleOff}>
//                     Close
//                   </Button>
//                   <Button variant="primary" onClick={updateDishes}>
//                     Save Changes
//                   </Button>
//                 </Modal.Footer>
//               </Modal>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Dishes;



// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import SideNav from "./SideNav";
// import { Button, Modal } from "react-bootstrap";
// import { MdDelete } from "react-icons/md";
// import { FiEdit } from "react-icons/fi";
// import { IoIosAddCircle } from "react-icons/io";
// import Tooltip from "@mui/material/Tooltip";
// import { Link } from "react-router-dom";

// function Dishes() {
//   const backendUrl = process.env.REACT_APP_MACHINE_TEST_1_BACKEND_URL;
//   const [uid, setUid] = useState("");
//   const [show, setShow] = useState(false);
//   const [on, setOn] = useState(false);
//   const [dishes, setDishes] = useState("");
//   const [description, setDescription] = useState("");
//   const [price, setPrice] = useState("");
//   const [image, setImage] = useState([]);
//   const [Itemnumber, setItemnumber] = useState("");
//   const [ram, setRam] = useState("");
//   const [color, setColor] = useState("");
//   const [features, setFeatures] = useState("");
//   const [internalstorage, setInternalstorage] = useState("");
//   const [maincategory, setMaincategory] = useState('');
//   const [categories, setCategories] = useState('');
//   const [getMaincategories, setGetMaincategories] = useState([]);
//   const [getCategories, setGetCategories] = useState([]);
//   const [getCategoriesById, setGetCategoriesById] = useState([]);
//   const [getDishes, setGetDishes] = useState([]);
//   const [getDishesById, setGetDishesById] = useState({
//     dishes: "",
//     price: "",
//     description:"",
//     Itemnumber: "",
//     ram: "",
//     internalstorage: "",
//     color: "",
//     features:''
//   });
 

//   // const handleImage = (e) => {
//   //   const setUpImage = Array.from(e.target.files);
//   //   setImage(setUpImage);
//   // };
//   const handleImage = (e) => {
//     const selectedFiles = Array.from(e.target.files);
//     setImage(selectedFiles); // Store multiple files
//   };

//   const handleClose = () => setShow(false);
//   const handleShow = () => setShow(true);
//   const handleOff = () => setOn(false);
//   const [file, setFile] = useState("");

//   // Fetch main categories from the backend
//   const fetchMaincategories = async () => {
//     try {
//       const response = await axios.get(`${backendUrl}/admin/getmaincategories`);
//       setGetMaincategories(response.data);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   // Fetch categories from the backend
//   const fetchCategories = async () => {
//     try {
//       const response = await axios.get(`${backendUrl}/admin/getcategories`);
//       setGetCategories(response.data);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   // Fetch dishes from the backend on component mount
//   useEffect(() => {
//     const fetch = async () => {
//       try {
//         const response = await axios.get(`${backendUrl}/admin/getdishes`);
//         const data = response.data;
//         setGetDishes(data);
//       } catch (err) {
//         console.log(err);
//       }
//     };
//     fetch();
//   }, [backendUrl]);

//   // Fetch main categories and categories on component mount
//   useEffect(() => {
//     fetchMaincategories();
//     fetchCategories();
//   }, [backendUrl]);



//   // Function to handle POST dishes
//   const postDishes = async () => {
//     const formData = new FormData();
//     formData.append("dishes", dishes);
//     formData.append("description", description);
//     formData.append("category", categories); // Ensure this is correct
//     formData.append("maincategories", maincategory);
//     formData.append("price", price);
//     formData.append("Itemnumber", Itemnumber);
//     formData.append("color", color);
//     formData.append("internalstorage", internalstorage);
//     formData.append("ram", ram);
//     formData.append("features", features);

//     // Append each file to formData
//     for (let i = 0; i < image.length; i++) {
//       formData.append("image", image[i]);
//     }

//     try {
//         await axios.post(`${backendUrl}/admin/postdishes`, formData, {
//             headers: {
//                 'Content-Type': 'multipart/form-data'
//             }
//         });
//         window.location.reload(); // Refresh page after successful post
//     } catch (err) {
//         console.log(err);
//     }
// };



// const updateDishes = async () => {
//   const formData = new FormData();
//   formData.append("dishes", getDishesById.dishes);
//   formData.append("description", getDishesById.description);
//   formData.append("price", getDishesById.price);
//   formData.append("category", categories); // Ensure 'categories' is a valid ObjectId
//   formData.append("Itemnumber", getDishesById.Itemnumber);
//   formData.append("internalstorage", getDishesById.internalstorage);
//   formData.append("color", getDishesById.color);
//   formData.append("features", getDishesById.features);
//   formData.append("ram", getDishesById.ram);

//   if (image) {
//     image.forEach(file => formData.append("image", file));
//   }

//   try {
//     await axios.put(`${backendUrl}/admin/putdishes/${uid}`, formData);
//     window.location.reload(); // Refresh after update
//   } catch (err) {
//     console.error('Error updating dish:', err);
//   }
// };

// const handleOn = async (id) => {
//   setOn(true);
//   setUid(id);

//   try {
//     const response = await axios.get(`${backendUrl}/admin/getdishesbyid/${id}`);
//     const data = response.data;
//     setGetDishesById({
//       dishes: data.dishes,
//       price: data.price,
//       description: data.description,
//       Itemnumber: data.Itemnumber,
//       internalstorage: data.internalstorage,
//       color: data.color,
//       ram: data.ram,
//       features: data.features,
//       image: data.image || [], // Initialize image array
//     });
//     setMaincategory(data.maincategories);
//     setCategories(data.categories);
//   } catch (err) {
//     console.log(err);
//   }
// };

// const handleUpdateChange = (e) => {
//   const { name, value } = e.target;
//   setGetDishesById((prevState) => ({
//     ...prevState,
//     [name]: value,
//   }));
// };



//     // Function to handle deletion of dishes
//     const handleDelete = async (id) => {
//       const windowConfirmation = window.confirm("Are you sure to Delete this item");
//       if (windowConfirmation) {
//         try {
//           await axios.delete(`${backendUrl}/admin/deletedishes/${id}`);
//           window.location.reload(); // Refresh page after successful deletion
//         } catch (err) {
//           console.log(err);
//         }
//       }
//     };
  

//   //filtering of categories by its corresponding main category
//   const filteredCategories = getCategories.filter(cat => cat.maincategoriesData._id === maincategory);


//   // JSX rendering with dynamic data
//   return (
//     <div>
//       <SideNav />
//       <div className="whole">
//         <div className=" main-contenet">
//           <div className="pl-3 row main-row">
//             <div className="col-12 my-sm-0 my-md-5 p-3 montserrat-400"
//                  style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
//               <h2><b>ITEMS</b></h2>
//               <Tooltip className="add_btn" title="Add">
//                 <IoIosAddCircle className="add_btn" onClick={handleShow} />
//               </Tooltip>
//             </div>
//             <div className="container table-responsive">
//               <table className="table table-striped table-bordered">
//                 <thead className="thead-dark">
//                   <tr>
//                     <th scope="col">Image</th>
//                     <th scope="col">Item Number</th>
//                     <th scope="col">Name</th>
//                     <th scope="col">Description</th>
//                     <th scope="col">Price</th>
//                     <th scope="col">Internal storage</th>
//                     <th scope="col">Color</th>
//                     <th scope="col">Ram</th>
//                     <th scope="col">Features</th>
//                     <th scope="col">Category</th>
//                     <th scope="col">Main Category</th>
//                     <th scope="col">Actions</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {getDishes.map((items, index) => (
//                     <tr key={index}>
//                       <td>
//                         <div className="image-container">
//                           {items.image.map((image, idx) => (
//                             <img key={idx} className="avatar" src={`${backendUrl}/images/${image}`} alt={`Image ${idx + 1}`} />
//                           ))}
//                         </div>
//                       </td>
//                       <td className="text-black item-text">{items.Itemnumber}</td>
//                       <td className="text-black item-text"><b>{items.dishes}</b></td>
//                       <td className="text-black item-text">{items.description}</td>
//                       <td className="text-black item-text">AED{items.price}</td>
//                       <td className="text-black item-text">{items.internalstorage}</td>
//                       <td className="text-black item-text">{items.color}</td>
//                       <td className="text-black item-text">{items.ram}</td>
//                       <td className="text-black item-text">{items.features}</td>
//                       <td className="text-black item-text">
//                         {items.category ? items.category.name : ''}
//                       </td>
//                       <td className="text-black item-text">
//                         {items.category && items.category.maincategoriesData ? items.category.maincategoriesData.maincategories : ''}
//                       </td>
//                       <td>
//                         <Tooltip title="Edit">
//                           <FiEdit style={{ color: "black", cursor: "pointer" }} onClick={() => handleOn(items._id)} />
//                         </Tooltip>
//                         <Tooltip title="Delete">
//                           <MdDelete style={{ color: "black", cursor: "pointer" }} onClick={() => handleDelete(items._id)} />
//                         </Tooltip>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
               
              
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Modal for adding dishes */}
//       <Modal show={show} onHide={handleClose}>
//         <Modal.Header closeButton>
//           <Modal.Title>Add PRODUCTS</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {/* Input fields for adding dishes */}
//           <input className="my-3 input-style" style={{ width: "100%" }} type="file" name="image"  multiple    onChange={handleImage} />
//           <input className="input-style" placeholder="item-number" type="text" style={{ width: "100%", marginBottom: '1rem' }} onChange={(e) => setItemnumber(e.target.value)} />
//           <input className="input-style" placeholder="products" type="text" style={{ width: "100%", marginBottom: '1rem' }} onChange={(e) => setDishes(e.target.value)} />
//           <textarea className="input-style" placeholder="description" type="text" style={{ width: "100%", marginBottom: '1rem' }} onChange={(e) => setDescription(e.target.value)}></textarea>

//           {/* Dropdown for selecting Main Category */}
//           <select className="my-3 input-style" onChange={(e) => setMaincategory(e.target.value)} value={maincategory} style={{ width: "100%", marginBottom: '1rem' }}>
//             <option value="">Select Main Category</option>
//             {getMaincategories.map((mainCat) => (
//               <option key={mainCat._id} value={mainCat._id}>
//                 {mainCat.maincategories}
//               </option>
//             ))}
//           </select>

//           {/* Dropdown for selecting Category */}

//           <select
//                 className="my-3 input-style"
//                 onChange={(e) => setCategories(e.target.value)}
//                 value={categories}
//                 style={{ width: "100%", marginBottom: '1rem' }}
//             >
//                 <option value="">Select Category</option>
//                 {filteredCategories.map((cat) => (
//                     <option key={cat._id} value={cat._id}>
//                         {cat.name}
//                     </option>
//                 ))}
//           </select>

         

//           {/* Input fields for other details */}
//           <input className="input-style" placeholder="Price" type="number" style={{ width: "100%", marginBottom: '1rem' }} onChange={(e) => setPrice(e.target.value)} />
//           <input className="input-style" placeholder="internalstorage" type="text" style={{ width: "100%", marginBottom: '1rem' }} onChange={(e) => setInternalstorage(e.target.value)} />
//           <input className="input-style" placeholder="color" type="text" style={{ width: "100%", marginBottom: '1rem' }} onChange={(e) => setColor(e.target.value)} />
//           <input className="input-style" placeholder="Ram" type="text" style={{ width: "100%", marginBottom: '1rem' }} onChange={(e) => setRam(e.target.value)}/>
//           <textarea className="input-style" placeholder="Features" type="text" style={{ width: "100%", marginBottom: '1rem' }} onChange={(e) => setFeatures(e.target.value)}></textarea>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleClose}>
//             Close
//           </Button>
//           <Button variant="primary" onClick={postDishes}>
//             Save
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       <Modal show={on} onHide={handleOff} className="montserrat-400">
//         <Modal.Header closeButton>
//           <Modal.Title>EDIT</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {/* Input fields for adding dishes */}
//           <input className="my-3 input-style" style={{ width: "100%" }} type="file" name="image" multiple onChange={handleImage} />
//           <input className="input-style" placeholder="item-number" type="text" style={{ width: "100%", marginBottom: '1rem' }} name="Itemnumber" value={getDishesById.Itemnumber} onChange={handleUpdateChange} />
//           <input className="input-style" placeholder="products" type="text" style={{ width: "100%", marginBottom: '1rem' }} name="dishes" value={getDishesById.dishes} onChange={handleUpdateChange} />
//           <textarea className="input-style" placeholder="description" type="text" style={{ width: "100%", marginBottom: '1rem' }} name="description" value={getDishesById.description} onChange={handleUpdateChange}></textarea>

//           {/* Dropdown for selecting Main Category */}
//           <select className="my-3 input-style" onChange={(e) => setMaincategory(e.target.value)} value={maincategory} style={{ width: "100%", marginBottom: '1rem' }}>
//             <option value="">Select Main Category</option>
//             {getMaincategories.map((mainCat) => (
//               <option key={mainCat._id} value={mainCat._id}>
//                 {mainCat.maincategories}
//               </option>
//             ))}
//           </select>

//           {/* Dropdown for selecting Category */}
//           <select className="my-3 input-style" onChange={(e) => setCategories(e.target.value)} value={categories} style={{ width: "100%", marginBottom: '1rem' }}>
//             <option value="">Select Category</option>
//             {filteredCategories.map((cat) => (
//               <option key={cat._id} value={cat._id}>
//                 {cat.name}
//               </option>
//             ))}
//           </select>

//           {/* Input fields for other details */}
//           <input className="input-style" placeholder="Price" type="number" style={{ width: "100%", marginBottom: '1rem' }} name="price" value={getDishesById.price} onChange={handleUpdateChange} />
//           <input className="input-style" placeholder="internalstorage" type="text" style={{ width: "100%", marginBottom: '1rem' }} name="internalstorage" value={getDishesById.internalstorage} onChange={handleUpdateChange} />
//           <input className="input-style" placeholder="color" type="text" style={{ width: "100%", marginBottom: '1rem' }} name="color" value={getDishesById.color} onChange={handleUpdateChange} />
//           <input className="input-style" placeholder="ram" type="text" style={{ width: "100%", marginBottom: '1rem' }} name="ram" value={getDishesById.ram} onChange={handleUpdateChange} />
//           <textarea className="input-style" placeholder="features" type="text" style={{ width: "100%", marginBottom: '1rem' }} name="features" value={getDishesById.features} onChange={handleUpdateChange}></textarea>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleOff}>
//             Close
//           </Button>
//           <Button variant="primary" onClick={updateDishes}>
//             Save
//           </Button>
//         </Modal.Footer>
//       </Modal>
     


//     </div>
//   );
// }

// export default Dishes;



