import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Modal } from 'react-bootstrap';
import { MdDelete } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import { Tooltip } from '@mui/material';
import { Link } from 'react-router-dom';
import { IoIosAddCircle } from 'react-icons/io';
import SideNav from './SideNav';
import SmallNav from './SmallNav';

function Color() {
    const backendUrl = process.env.REACT_APP_MACHINE_TEST_1_BACKEND_URL;
    const [uid, setUid] = useState('');
    const [show, setShow] = useState(false);
    const [on, setOn] = useState(false);
    const [color, setColor] = useState('');
    const [getColors, setGetColors] = useState([]);
    const [getColorsById, setGetColorsById] = useState({ Color: '' });

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleOff = () => setOn(false);

    const postColors = async () => {
        if (!color) {
            alert("Color cannot be empty");
            return;
        }
    
        const data = { Color: color }; // Use consistent naming
        const token = localStorage.getItem('token'); // Get token from localStorage
    
        try {
            const response = await axios.post(`${backendUrl}/admin/postcolors`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,  // Include token for authentication
                    'Content-Type': 'application/json',  // Set content type
                },
            });
            setGetColors((prev) => [...prev, response.data]); // Update state with the new color
            setColor(''); // Clear input after submission
            handleClose(); // Close modal
        } catch (err) {
            console.error(err);
            alert("An error occurred while adding the color.");
        }
    };
    
    useEffect(() => {
        const fetchColors = async () => {
            const token = localStorage.getItem('token'); // Get token from localStorage
            try {
                const response = await axios.get(`${backendUrl}/admin/getcolors`, {
                    headers: {
                        Authorization: `Bearer ${token}`,  // Include token for authentication
                    },
                });
                setGetColors(response.data);
            } catch (err) {
                console.error(err);
                alert("An error occurred while fetching colors.");
            }
        };
        fetchColors();
    }, [backendUrl]);
    
    const handleOn = async (id) => {
        setOn(true);
        setUid(id);
        const token = localStorage.getItem('token'); // Get token from localStorage
    
        try {
            const response = await axios.get(`${backendUrl}/admin/getcolorsbyid/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,  // Include token for authentication
                },
            });
            setGetColorsById(response.data);
        } catch (err) {
            console.error(err);
            alert("An error occurred while fetching color details.");
        }
    };
    
    const handleUpdateChange = (e) => {
        const { name, value } = e.target;
        setGetColorsById((prevstate) => ({ ...prevstate, [name]: value }));
    };
    
    const updateColors = async () => {
        const token = localStorage.getItem('token'); // Get token from localStorage
        const data = {
            Color: getColorsById.Color // Use the correct field name
        };
        try {
            const response = await axios.put(`${backendUrl}/admin/putcolors/${uid}`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,  // Include token for authentication
                    'Content-Type': 'application/json',  // Set content type
                },
            });
            setGetColors((prev) => prev.map(item => (item._id === uid ? response.data : item))); // Update the color in state
            handleOff(); // Close modal
        } catch (err) {
            console.error(err);
            alert("An error occurred while updating the color.");
        }
    };
    
    const handleDelete = async (id) => {
        const token = localStorage.getItem('token'); // Get token from localStorage
        const windowConfirmation = window.confirm('Are you sure you want to delete this item?');
        if (windowConfirmation) {
            try {
                await axios.delete(`${backendUrl}/admin/deletecolors/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,  // Include token for authentication
                    },
                });
                setGetColors((prev) => prev.filter(item => item._id !== id)); // Remove the deleted color from state
            } catch (err) {
                console.error(err);
                alert("An error occurred while deleting the color.");
            }
        }
    };
    

    return (
        <div>
            <SmallNav />
            <SideNav />
            <div className='whole'>
                <div className="main-content">
                    <div className="pl-3 row main-row">
                        <div className="col-6 my-sm-0 my-md-5 p-3 montserrat-400" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <h2><b>Add Color</b></h2>
                            <Tooltip className='add_btn' title='Add'>
                                <Link>
                                    <IoIosAddCircle className='add_btn' onClick={handleShow} />
                                </Link>
                            </Tooltip>
                        </div>

                        {getColors.map((item, index) => (
                            <div key={index} className="col-8 my-1 p-2 montserrat-400" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#dee2e6' }}>
                                <h5 className='text-black'>{item.Color}</h5>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '20%' }}>
                                    <FiEdit style={{ color: 'black', cursor: 'pointer' }} onClick={() => handleOn(item._id)} />
                                    <MdDelete style={{ color: 'black', cursor: 'pointer' }} onClick={() => handleDelete(item._id)} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Modal for Adding Color */}
            <Modal show={show} onHide={handleClose} className='montserrat-400'>
                <Modal.Header closeButton>
                    <Modal.Title>Add Color</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input className='input-style' type="text" style={{ width: '100%' }} onChange={(e) => setColor(e.target.value)} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Close</Button>
                    <Button variant="primary" onClick={postColors}>Save</Button>
                </Modal.Footer>
            </Modal>

            {/* Modal for Editing Color */}
            <Modal show={on} onHide={handleOff} className='montserrat-400'>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Color</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input value={getColorsById.Color} name='Color' type="text" style={{ width: '100%' }} onChange={handleUpdateChange} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleOff}>Close</Button>
                    <Button variant="primary" onClick={updateColors}>Update</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Color;
