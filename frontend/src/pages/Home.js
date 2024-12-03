// src/pages/Home.js
import React from 'react';
import Header from '../component/Header';
import Footer from '../component/Footer';
import ImageSlider from '../component/Slider';
import BestSeller from './BestSeller';
import FavoriteBrands from '../component/FavoriteBrands';
// import FeaturedCategories from '../component/FeaturedCategories';
import DiscountedProducts from './DiscountedProducts';

const Home = () => {
    return (
        <div>
            <ImageSlider />
            <BestSeller />
            <FavoriteBrands />
            <DiscountedProducts />
        </div>
    );

};



export default Home;
