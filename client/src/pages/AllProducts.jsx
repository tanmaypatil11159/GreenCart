import React, { useState, useEffect } from 'react'
import { useAppContext } from '../context/AppContext'
import ProductCard from '../components/ProductCard';

function AllProducts() {

    const { product, searchQuery } = useAppContext();
    const [filteredProducts, setFilteredProducts] = useState([]);

    // search filtering
    useEffect(() => {
        if (searchQuery && searchQuery.length > 0) {
            setFilteredProducts(
                product.filter(p =>
                    p.name.toLowerCase().includes(searchQuery.toLowerCase())
                )
            );
        } else {
            setFilteredProducts(product);
        }
    }, [product, searchQuery]);

    return (
        <div className='mt-16 flex flex-col'>
            
            <div className='flex flex-col w-full'>
                <p className='text-2xl font-medium uppercase'>All products</p>
                <div className='w-16 h-0.5 bg-primary rounded-full'></div>
            </div>

            {/* Product Grid */}
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6 mt-6'>
                {filteredProducts
                    .filter(item => item.inStock)
                    .map((item, index) => (
                        <ProductCard key={index} product={item} />
                    ))
                }
            </div>

        </div>
    )
}

export default AllProducts;
