import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import SummaryApi from '../common';
import '../assets/css/FavoriteBrands.css';
import { useNavigate } from 'react-router-dom';

const FavoriteBrands = () => {
    const [brands, setBrands] = useState([]);
    const navigate = useNavigate()




    const handleClick = async (brandId) => {
        navigate(`/brand/${brandId}`)

    }

    useEffect(() => {
        const fetchManufacturers = async () => {
            try {
                const response = await fetch(SummaryApi.get_manufacturers_love.url, {
                    method: 'GET',
                    credentials: 'include',
                });
                const data = await response.json();
                setBrands(data.data);

            } catch (error) {
                toast.error("Error fetching favorite brands.");
            }
        };
        fetchManufacturers();
    }, []);

    return (
        <div className="favorite-brands-section">
            <h2 className="section-title">
                <span className="icon">✔️</span> Style yêu thích
            </h2>
            <div className="brand-grid">
                {brands.map((brand) => (
                    <div className="brand-card" key={brand._id} onClick={() => { handleClick(brand._id) }}>
                        {/* <img src={brand.images} alt={brand.name} className="brand-image" /> */}
                        <img src={`${brand.images}`} alt={brand.name} className="product-image" />
                        <h3 className="brand-name">{brand.name}</h3>
                        {/* <p className="brand-discount">{brand.discount || "Ưu đãi đặc biệt"}</p> */}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FavoriteBrands;
