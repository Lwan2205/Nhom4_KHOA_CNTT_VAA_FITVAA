import React, { useState, useEffect } from 'react';
import '../assets/css/UpdateProductModal.css';
import SummaryApi from '../common';
import { FormControl, InputLabel, MenuItem, Select, TextareaAutosize, TextField } from '@mui/material';
import TextLabel from '@mui/material/FormLabel';

const UpdateProductModal = ({ product, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({
        name: product.name,
        price: product.price,
        description: product.description,
        category: product.category?._id,
        discount: product.discount?._id,
        manufacturer: product.manufacturer?._id,
        stock: product.stock,
        images: '', // Bỏ giá trị URL, sẽ thay bằng file upload
        rating: product.rating,
        isFeatured: product.isFeatured,
        variants: product.variants || [], // Dữ liệu variants
    });

    const [selectedFile, setSelectedFile] = useState(null); // Lưu file ảnh khi người dùng chọn

    const [categories, setCategories] = useState([]);
    const [manufacturers, setManufacturers] = useState([]);
    const [discounts, setDiscounts] = useState([]);

    // Fetch categories, manufacturers, and discounts
    useEffect(() => {
        const fetchData = async () => {
            const categoryResponse = await fetch(SummaryApi.category_list.url, { method: 'get', credentials: 'include' });
            const manufacturerResponse = await fetch(SummaryApi.all_manufacturers.url, { method: 'get', credentials: 'include' });
            const discountResponse = await fetch(SummaryApi.all_discount.url, { method: 'get', credentials: 'include' });
            const categories = await categoryResponse.json();
            const manufacturer = await manufacturerResponse.json();
            const discount = await discountResponse.json();

            setCategories(categories.data);
            setManufacturers(manufacturer.data);
            setDiscounts(discount.data);
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    // Xử lý thay đổi cho variant cụ thể
    const handleVariantChange = (e, index) => {
        const { name, value } = e.target;
        const updatedVariants = [...formData.variants];
        updatedVariants[index] = {
            ...updatedVariants[index],
            [name]: value, // Cập nhật giá trị cho variant
        };
        setFormData({ ...formData, variants: updatedVariants });
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]); // Lưu file vào state
    };

    const handleUpdateProduct = async () => {
        try {
            const form = new FormData(); // Tạo FormData để gửi dữ liệu kèm ảnh

            // Add các trường khác vào form
            for (const key in formData) {
                if (key !== 'variants') {  // Chỉ thêm các trường khác, không phải variants
                    form.append(key, formData[key]);
                }
            }

            // Thêm variants dưới dạng chuỗi JSON
            form.append('variants', JSON.stringify(formData.variants));

            // Thêm ảnh vào form nếu có
            if (selectedFile) {
                form.append('image', selectedFile); // Key 'image' phải trùng với backend
            }

            const response = await fetch(SummaryApi.update_product(product._id).url, {
                method: 'PUT',
                credentials: 'include',
                body: form, // Gửi FormData
            });

            const updateProduct = await response.json();
            if (updateProduct.success) {
                onUpdate();
            } else {
                console.error("Error updating product.");
            }
        } catch (error) {
            console.error("Error updating product.");
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2 style={{ marginTop: '200px' }}>Update Product</h2>

                {/* Product Name */}
                <FormControl fullWidth>
                    <TextField
                        sx={{ marginBottom: '20px', border: 'none' }}
                        type="text"
                        placeholder="Product Name"
                        name="name"
                        label="Name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </FormControl>

                {/* Price */}
                <FormControl fullWidth>
                    <TextField
                        sx={{ marginBottom: '20px', border: 'none' }}
                        type="number"
                        name="price"
                        label="Price"
                        value={formData.price}
                        onChange={handleChange}
                    />
                </FormControl>

                {/* Description */}
                <FormControl sx={{ marginBottom: '20px', border: 'none' }} fullWidth>
                    <TextareaAutosize
                        sx={{ marginBottom: '20px', border: 'none' }}
                        name="description"
                        placeholder="Description"
                        value={formData.description}
                        onChange={handleChange}
                    />
                </FormControl>

                {/* Category */}
                <FormControl fullWidth sx={{ marginBottom: '20px' }}>
                    <InputLabel>Current Category</InputLabel>
                    <Select
                        value={formData.category}
                        name="category"
                        label="Current Category"
                        onChange={handleChange}
                    >
                        {categories.map(category => (
                            <MenuItem key={category._id} value={category._id}>{category.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Discount */}
                <FormControl fullWidth sx={{ marginBottom: '20px' }}>
                    <InputLabel>Current Discount</InputLabel>
                    <Select
                        value={formData.discount}
                        name="discount"
                        label="Current Discount"
                        onChange={handleChange}
                    >
                        {discounts.map(disc => (
                            <MenuItem key={disc._id} value={disc._id}>{disc.code} - {disc.discountPercent}%</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Manufacturer */}
                <FormControl fullWidth sx={{ marginBottom: '20px' }}>
                    <InputLabel>Current Manufacturer</InputLabel>
                    <Select
                        name="manufacturer"
                        value={formData.manufacturer}
                        label="Current Manufacturer"
                        onChange={handleChange}
                    >
                        {manufacturers.map(man => (
                            <MenuItem key={man._id} value={man._id}>{man.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Stock */}
                <FormControl fullWidth>
                    <TextField
                        sx={{ marginBottom: '20px', border: 'none' }}
                        type="number"
                        name="stock"
                        label="Stock"
                        value={formData.stock}
                        onChange={handleChange}
                    />
                </FormControl>

                {/* Variants */}
                <div>
                    <h3>Variants</h3>
                    {formData.variants.map((variant, index) => (
                        <div key={index}>
                            <FormControl fullWidth sx={{ marginBottom: '10px' }}>
                                <TextField
                                    label="Size"
                                    name="size"
                                    value={variant.size}
                                    onChange={(e) => handleVariantChange(e, index)}
                                />
                            </FormControl>
                            <FormControl fullWidth sx={{ marginBottom: '10px' }}>
                                <TextField
                                    label="Stock"
                                    name="stock"
                                    value={variant.stock}
                                    onChange={(e) => handleVariantChange(e, index)}
                                />
                            </FormControl>
                        </div>
                    ))}
                </div>

                {/* Upload Image */}
                <div className="field-group">
                    <label>Upload Image:</label>
                    <input
                        type="file"
                        name="image"
                        onChange={handleFileChange}
                    />
                </div>

                {/* Rating */}
                <FormControl fullWidth>
                    <TextField
                        sx={{ marginBottom: '20px', border: 'none' }}
                        type="number"
                        name="rating"
                        label="Rating"
                        value={formData.rating}
                        onChange={handleChange}
                    />
                </FormControl>

                {/* Featured */}
                <label>
                    <input
                        type="checkbox"
                        name="isFeatured"
                        checked={formData.isFeatured}
                        onChange={handleChange}
                    />
                    Featured
                </label>

                {/* Actions */}
                <div className="modal-actions">
                    <button onClick={handleUpdateProduct}>Update</button>
                    <button onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default UpdateProductModal;
