import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import "../assets/css/AddProduct.css";
import SummaryApi from '../common';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        category: '',
        discount: '',
        manufacturer: '',
        stock: 0,
        rating: 0,
        isFeatured: false,
        variants: [],  // To store size/stock combinations
    });
    const [imageFile, setImageFile] = useState(null);
    const [categories, setCategories] = useState([]);
    const [manufacturers, setManufacturers] = useState([]);
    const [discounts, setDiscounts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const categoryResponse = await fetch(SummaryApi.category_list.url, {
                    method: 'get',
                    credentials: 'include',
                });
                const manufacturerResponse = await fetch(SummaryApi.all_manufacturers.url, {
                    method: 'get',
                    credentials: 'include',
                });
                const discountResponse = await fetch(SummaryApi.all_discount.url, {
                    method: 'get',
                    credentials: 'include',
                });

                const categories = await categoryResponse.json();
                const manufacturer = await manufacturerResponse.json();
                const discount = await discountResponse.json();

                setCategories(categories.data);
                setManufacturers(manufacturer.data);
                setDiscounts(discount.data);
            } catch (error) {
                toast.error("Failed to load data");
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleVariantChange = (e, index, type) => {
        const updatedVariants = [...formData.variants];
        updatedVariants[index] = {
            ...updatedVariants[index],
            [type]: e.target.value,
        };
        setFormData({ ...formData, variants: updatedVariants });
    };

    const handleAddVariant = () => {
        setFormData({ ...formData, variants: [...formData.variants, { size: '', stock: 0 }] });
    };

    const handleRemoveVariant = (index) => {
        const updatedVariants = formData.variants.filter((_, i) => i !== index);
        setFormData({ ...formData, variants: updatedVariants });
    };

    // Khi thêm biến thể, đảm bảo stock là số
    const handleAddProduct = async () => {
        // Đảm bảo variants có stock là số
        const validVariants = formData.variants.map(variant => ({
            ...variant,
            stock: Number(variant.stock),  // Chuyển stock thành số
        }));

        const productData = new FormData();
        productData.append('name', formData.name);
        productData.append('price', formData.price);
        productData.append('description', formData.description);
        productData.append('category', formData.category);
        productData.append('discount', formData.discount);
        productData.append('manufacturer', formData.manufacturer);
        productData.append('rating', formData.rating);
        productData.append('isFeatured', formData.isFeatured);
        productData.append('variants', JSON.stringify(validVariants));  // Đảm bảo variants là mảng hợp lệ

        if (imageFile) {
            productData.append('image', imageFile);
        }

        try {
            const response = await fetch(SummaryApi.add_product.url, {
                method: 'POST',
                credentials: 'include',
                body: productData,
            });

            if (response.ok) {
                toast.success("Thêm sản phẩm thành công");
                setFormData({
                    name: '',
                    price: '',
                    description: '',
                    category: '',
                    discount: '',
                    manufacturer: '',
                    stock: 0,
                    rating: 0,
                    isFeatured: false,
                    variants: [],
                });
                setImageFile(null);
                navigate('/admin-panel/all-products');
            } else {
                toast.error("Lỗi khi thêm sản phẩm.");
            }
        } catch (error) {
            toast.error("Lỗi khi thêm sản phẩm.");
        }
    };

    return (
        <div className="add-product-container">
            <h2>Add Product</h2>
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Product Name" />
            <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Price" />
            <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" />
            <select name="category" value={formData.category} onChange={handleChange}>
                <option value="">Select Category</option>
                {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
            </select>
            <select name="discount" value={formData.discount} onChange={handleChange}>
                <option value="">Select Discount</option>
                {discounts.map(disc => <option key={disc._id} value={disc._id}>{disc.code} - {disc.discountPercent}%</option>)}
            </select>
            <select name="manufacturer" value={formData.manufacturer} onChange={handleChange}>
                <option value="">Select Manufacturer</option>
                {manufacturers.map(man => <option key={man._id} value={man._id}>{man.name}</option>)}
            </select>

            {/* Variants Section */}
            <h3>Product Variants (Size)</h3>
            {formData.variants.map((variant, index) => (
                <div key={index} className="variant-row">
                    <select value={variant.size} onChange={(e) => handleVariantChange(e, index, 'size')}>
                        <option value="">Select Size</option>
                        <option value="S">S</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                        <option value="XL">XL</option>
                    </select>
                    <input
                        type="number"
                        value={variant.stock}
                        onChange={(e) => handleVariantChange(e, index, 'stock')}
                        placeholder="Stock Quantity"
                    />
                    <button type="button" onClick={() => handleRemoveVariant(index)}>Remove</button>
                </div>
            ))}
            <button type="button" onClick={handleAddVariant}>Add Variant</button>

            <input type="file" name="image" onChange={handleImageChange} />

            {/* Submit Button */}
            <button onClick={handleAddProduct}>Add Product</button>
        </div>
    );
};

export default AddProduct;
