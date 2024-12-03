import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import UpdateProductModal from '../component/UpdateProductModal';
import { Link } from 'react-router-dom';
import '../assets/css/AllProduct.css';
import SummaryApi from '../common';
import Pagination from '../component/Pagination'; // Import the Pagination component
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { MdModeEdit, MdDelete, MdOutlineCheckBox, MdOutlineCheckBoxOutlineBlank } from "react-icons/md";
import moment from 'moment';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [currentPage, setCurrentPage] = useState(1); // Track the current page
    const [totalPages, setTotalPages] = useState(1); // Track the total number of pages
    const productsPerPage = 6;
    // Fetch products with pagination
    const fetchProducts = async (page = 1) => {
        try {
            const response = await fetch(`${SummaryApi.all_product.url}?page=${page}&limit=${productsPerPage}`); // Pass page and limit
            const data = await response.json();
            if (data.success) {
                setProducts(data.products);
                setTotalPages(data.totalPages); // Set the total pages from the response
            } else {
                toast.error("Failed to fetch products.");
            }
        } catch (error) {
            toast.error("Error fetching products.");
        }
    };

    useEffect(() => {
        fetchProducts(currentPage); // Fetch products on initial load and when page changes
    }, [currentPage]);

    // Open the update modal
    const handleEditProduct = (product) => {
        setSelectedProduct(product);
        setIsUpdateModalOpen(true);
    };

    // Delete a product
    const handleDeleteProduct = async (productId) => {
        try {
            const response = await fetch(SummaryApi.delete_product(productId).url, {
                method: 'DELETE',
                credentials: 'include'
            });
            const delete_product = await response.json();
            if (delete_product.success) {
                toast.success("Product deleted successfully");
                fetchProducts(currentPage); // Refresh the current page
            } else {
                toast.error("Error deleting product.");
            }
        } catch (error) {
            toast.error("Error deleting product.");
        }
    };

    // Handle page change
    const handlePageChange = (page) => {
        setCurrentPage(page); // Update the current page and trigger fetch
    };

    return (
        <div className="product-list-container">
            <h2>Product List</h2>
            <Link to="add-product" className="add-button_admin">
                Add Product
            </Link>
            {/* <div className="product-list">
                {products.map((product) => (
                    <div key={product._id} className="product-item">
                        <h3>{product.name}</h3>
                        <p>Price: ${product.price}</p>
                        <p>Description: {product.description}</p>
                        <p>Category: {product.category?.name}</p>
                        <p>Discount: {product.discount ? `${product.discount.discountPercent}%` : "No Discount"}</p>
                        <p>Manufacturer: {product.manufacturer?.name}</p>
                        <p>Stock: {product.stock}</p>
                        {product.images && (
                            <div className="product-image">
                                <label>Image:</label>
                                <img
                                    src={`${product.images}`} // Ensure correct image path
                                    alt={`${product.name}`}
                                    className="product-img"
                                />
                            </div>
                        )}
                        <div className="product-actions">
                            <button onClick={() => handleEditProduct(product)}>Edit</button>
                            <button onClick={() => handleDeleteProduct(product._id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div> */}
            <Box sx={{ margin: '20px' }}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: '700' }} align="center"></TableCell>
                                <TableCell sx={{ fontWeight: '700' }} align="center">Product Name</TableCell>
                                <TableCell sx={{ fontWeight: '700' }} align="center">Description</TableCell>
                                <TableCell sx={{ fontWeight: '700' }} align="center">Product Category</TableCell>
                                <TableCell sx={{ fontWeight: '700' }} align="center">Manufacturer</TableCell>
                                <TableCell sx={{ fontWeight: '700' }} align="center">Price</TableCell>
                                {/* <TableCell sx={{ fontWeight: '700' }} align="center">Stock</TableCell> */}
                                <TableCell sx={{ fontWeight: '700' }} align="center">Created Date</TableCell>
                                <TableCell sx={{ fontWeight: '700' }} align="center">Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                products && products.length > 0 && products.map((product, index) => (
                                    <TableRow key={product._id}>
                                        <TableCell align='center'>
                                            <img src={product.images} className="product-image" alt="product" />
                                        </TableCell>
                                        <TableCell align="center">
                                            <p>{product.name}</p>
                                        </TableCell>
                                        <TableCell align="center">
                                            <p className="product-description">{product.description}</p>
                                        </TableCell>
                                        <TableCell align="center">
                                            <p>{product.category.name}</p>
                                        </TableCell>
                                        <TableCell align="center">
                                            <p>{product.manufacturer.name}</p>
                                        </TableCell>

                                        <TableCell align="center">
                                            <p>{product.price}</p>
                                        </TableCell>
                                        {/* <TableCell align="center">
                                            <p>{product.stock}</p>
                                        </TableCell> */}
                                        <TableCell align="center">
                                            <p>{moment(product.createdAt).format('LL')}</p>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Box sx={{
                                                display: 'flex',
                                                columnGap: '5px',
                                                justifyContent: 'center',
                                                alignItems: 'center'
                                            }}>
                                                <MdModeEdit className='edit-admin_button' onClick={() => handleEditProduct(product)} />
                                                <MdDelete className='remove-admin_button' onClick={() => handleDeleteProduct(product._id)} />
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            {/* Pagination component */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />

            {/* Update Product Modal */}
            {isUpdateModalOpen && selectedProduct && (
                <UpdateProductModal
                    product={selectedProduct}
                    onClose={() => setIsUpdateModalOpen(false)}
                    onUpdate={() => {
                        fetchProducts(currentPage); // Refresh after update
                        setIsUpdateModalOpen(false);
                    }}
                />
            )}
        </div>
    );
};

export default ProductList;
