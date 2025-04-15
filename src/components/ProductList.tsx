import React, { useState } from 'react';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import ProductModal from './ProductModal';
import { Product } from '../data/products';

const ProductList: React.FC = () => {
  const { addToCart } = useCart();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
            Discover Our <span className="text-blue-600">Premium</span> Collection
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our handpicked selection of high-quality products designed to enhance your lifestyle
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => {
            // Convert price to Indian Rupees
            const priceInRupees = product.price * 83.16;
            // Generate random ratings and reviews for demo purposes
            const rating = (Math.random() * 1 + 4).toFixed(1);
            const reviewCount = Math.floor(Math.random() * 1000) + 100;

            return (
              <div 
                key={product.id} 
                className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl border border-transparent hover:border-blue-100 cursor-pointer"
                onClick={() => handleProductClick(product)}
              >
                {/* Product Image - Single image per card */}
                <div className="h-48 overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>
                
                {/* Product Details */}
                <div className="p-4">
                  {/* Product Name */}
                  <h3 className="text-lg font-bold text-gray-900 mb-1 transition-colors duration-300 hover:text-blue-600">{product.name}</h3>
                  
                  {/* Star Ratings */}
                  <div className="flex items-center mb-2 group">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(Number(rating)) ? 'text-yellow-400 group-hover:animate-pulse' : 'text-gray-300 group-hover:text-gray-400'} transition-colors duration-300`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="ml-2 text-sm text-gray-600 group-hover:text-gray-900 transition-colors duration-300">{rating} ({reviewCount} reviews)</span>
                  </div>
                  
                  {/* Product Description - One line only */}
                  <p className="text-gray-600 text-sm mb-3 truncate hover:text-gray-800 transition-colors duration-300">{product.description}</p>
                  
                  {/* Price and Add to Cart Button */}
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-gray-900 transition-colors duration-300 hover:text-blue-600">₹{priceInRupees.toFixed(2)}</span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent modal from opening
                        addToCart(product);
                      }}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 hover:scale-105 transition-all duration-200"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Product Detail Modal */}
      <ProductModal 
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
};

export default ProductList; 