import React from 'react';
import ProductCard from './ProductCard';
import { useAppContext } from '../context/AppContext';

const BestSeller = () => {
    const { product } = useAppContext();   // product is your array

    return (
        <div className='mt-16'>
            <p className="text-2xl md:text-3xl font-medium mb-6">Best Sellers</p>

            {/* GRID TO SHOW PRODUCTS */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">

                {product.slice(0, 5).map((item, index) => (
                    <ProductCard key={index} product={item} />
                ))}

            </div>
        </div>
    );
};

export default BestSeller;
