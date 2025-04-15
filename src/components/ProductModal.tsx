import React from 'react';
import { Product } from '../data/products';
import { useCart } from '../context/CartContext';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose }) => {
  const { addToCart } = useCart();

  if (!product || !isOpen) return null;

  // Convert price to Indian Rupees
  const priceInRupees = product.price * 83.16;
  
  // Generate random ratings and reviews for demo purposes
  const rating = (Math.random() * 1 + 4).toFixed(1);
  const reviewCount = Math.floor(Math.random() * 1000) + 100;
  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + Math.floor(Math.random() * 5) + 2);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Backdrop with blur effect */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-auto relative z-10 m-4">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          {/* Product Image */}
          <div className="bg-white rounded-xl overflow-hidden h-[300px] md:h-auto">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Product Details */}
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
              <div className="flex items-center mt-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(Number(rating)) ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-2 text-gray-600">{rating} ({reviewCount} reviews)</span>
                </div>
              </div>
            </div>

            <div className="text-2xl font-bold text-gray-900">
              ₹{priceInRupees.toFixed(2)}
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800">Description</h3>
              <p className="text-gray-600 mt-2">{product.description}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800">Delivery Information</h3>
              <p className="text-gray-600 mt-2">
                Estimated delivery: {estimatedDelivery.toLocaleDateString()}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800">Offers</h3>
              <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
                <li>Get 10% off on your first purchase</li>
                <li>Free shipping on orders above ₹5000</li>
                <li>No cost EMI available</li>
              </ul>
            </div>

            <button
              onClick={() => addToCart(product)}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 hover:scale-105 transition-all duration-200"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal; 