import React from 'react';

interface ComponentPreviewProps {
  component: React.ComponentType<any>;
  name: string;
}

const ComponentPreview: React.FC<ComponentPreviewProps> = ({ component: Component, name }) => {
  // Datos de ejemplo para componentes que requieren props
  const mockProduct = {
    id: 1,
    name: "Producto Ejemplo",
    price: 9990,
    originalPrice: 12990,
    image: "https://via.placeholder.com/150x150/6366f1/ffffff?text=Producto",
    category: "Ejemplo",
    slug: "producto-ejemplo"
  };

  const mockProps = {
    product: mockProduct,
    addToCartHandler: () => console.log("Añadir al carrito"),
    isOnSale: true,
    stock: 10
  };

  return (
    <div className="w-full h-full bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
      <div className="p-2 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-xs text-gray-500 ml-1 truncate">{name}</span>
        </div>
      </div>
      <div className="p-2 transform scale-75 origin-top-left" style={{ width: '133%', height: '133%' }}>
        <Component {...mockProps} />
      </div>
    </div>
  );
};

export default ComponentPreview; 