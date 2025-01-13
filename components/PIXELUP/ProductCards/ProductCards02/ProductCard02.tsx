/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

type ProductCardProps = {
  key: any;
  product: any;
  addToCartHandler: (skuId: string, quantity: number) => void;
  isOnSale: any;
  stock: number | null;
};

const ProductCard02: React.FC<ProductCardProps> = ({
  addToCartHandler,
  product,
  isOnSale,
  stock,
}) => {
  const renderPrice = () => {
    let priceRange = {
      min: Infinity,
      max: -Infinity,
    };
  
    // Verificar si tiene variaciones y rangos de precios
    if (product.hasVariations && product.pricingRanges) {
      priceRange.min = Math.min(
        priceRange.min,
        product.pricingRanges[0].minimumAmount
      );
      priceRange.max = Math.max(
        priceRange.max,
        product.pricingRanges[0].maximumAmount
      );
    } else if (product.pricings) {
      priceRange.min = Math.min(priceRange.min, product.pricings[0].amount);
      priceRange.max = Math.max(priceRange.max, product.pricings[0].amount);
    }
  
    // Si existe una oferta, se debe tomar como prioridad el precio de oferta
    if (product.offers && product.offers.length > 0) {
      product.offers.forEach((offer: any) => {
        priceRange.min = Math.min(priceRange.min, offer.amount);
        priceRange.max = Math.max(priceRange.max, offer.amount);
      });
    }
  
    // Asegurarse de que el precio mínimo siempre sea menor al máximo
    const finalMin = Math.min(priceRange.min, priceRange.max);
    const finalMax = Math.max(priceRange.min, priceRange.max);
  
    // Mostrar el rango o un solo precio si son iguales
    if (finalMin === finalMax) {
      return <span>${finalMin.toLocaleString("es-CL")}</span>;
    } else {
      return (
        <span>
          ${finalMin.toLocaleString("es-CL")} - ${finalMax.toLocaleString("es-CL")}
        </span>
      );
    }
  };
  

  const handleButtonClick = () => {
    if (product.hasVariations) {
      window.location.href = `/tienda/productos/${product.id}`;
    } else {
      addToCartHandler(product.skuId, 1);
    }
  };

  return (
    <div className="w-full my-4 bg-white shadow-md duration-500 lg:hover:scale-105 md:hover:shadow-xl rounded-xl relative">
      {isOnSale && (
        <span className="absolute top-2 right-2 bg-red-700 text-white text-[14px] rounded py-1 px-2">
          En Oferta
        </span>
      )}
      <div className="group block overflow-hidden rounded-xl">
        <Link href={`/tienda/productos/${product.id}`}>
          <img
            src={product.mainImageUrl}
            alt={product.name}
            className="h-60 w-full object-cover rounded-t-xl"
          />
        </Link>
        <div className="px-4 py-3 w-full">
          {product.productTypes &&
            product.productTypes.length > 0 &&
            product.productTypes
              .slice(0, 1)
              .map((productType: any, index: any) => (
                <span
                  key={index}
                  className="text-gray-400 mr-3 uppercase text-sm text-primary rounded-lg"
                >
                  {productType.name}
                </span>
              ))}

          <Link href={`/tienda/productos/${product.id}`}>
            <p className="text-[18px] font-bold text-black truncate block capitalize">
              {product.name}
            </p>
          </Link>
          <div className="flex items-center text-black">
            <span className="text-gray-600 text-[19px]">{renderPrice()}</span>
            <div className="ml-auto flex">
              {product.hasVariations || stock === 0 ? (
                <Link
                  href={`/tienda/productos/${product.id}`}
                  className="text-primary hover:text-secondary hover:bg-primary rounded-full p-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m15.75 15.75-2.489-2.489m0 0a3.375 3.375 0 1 0-4.773-4.773 3.375 3.375 0 0 0 4.774 4.774ZM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                </Link>
              ) : (
                <button
                  onClick={handleButtonClick}
                  className="text-primary hover:text-secondary hover:bg-primary rounded-full p-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard02;
