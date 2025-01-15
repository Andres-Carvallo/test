/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { slugify } from "@/app/utils/slugify";

type ProductCardProps = {
  key: any;
  product: any;
  addToCartHandler: (skuId: string, quantity: number) => void;
  isOnSale: any;
  stock: number | null;
};

const ProductCard04: React.FC<ProductCardProps> = ({
  addToCartHandler,
  product,
  isOnSale,
  stock,
}) => {
  const renderPrice = () => {
    // Para productos con variaciones
    if (product.hasVariations) {
      const ranges = product.pricingRanges?.[0];
      if (!ranges) return null;

      if (isOnSale && product.offers && product.offers[0]) {
        const offer = product.offers[0];
        const minAmount = Number(ranges.minimumAmount) || 0;
        const minDiscounted = Number(offer.amount) || 0;

        if (minAmount > 0 && minDiscounted > 0) {
          return (
            <div className="flex gap-2">
              <span className="text-red-600">${minDiscounted.toLocaleString("es-CL")}</span>
              <span className="line-through text-gray-500">${minAmount.toLocaleString("es-CL")}</span>
            </div>
          );
        }
      }

      const minAmount = Number(ranges.minimumAmount) || 0;
      const maxAmount = Number(ranges.maximumAmount) || 0;

      if (minAmount > 0 && maxAmount > 0) {
        return <span>${minAmount.toLocaleString("es-CL")} - ${maxAmount.toLocaleString("es-CL")}</span>;
      }
    } 
    // Para productos sin variaciones
    else {
      const price = Number(product.pricings?.[0]?.amount) || 0;
      if (!price) return null;

      if (isOnSale && product.offers && product.offers[0]) {
        const offer = product.offers[0];
        const offerPrice = Number(offer.amount) || 0;

        if (price > 0 && offerPrice > 0) {
          return (
            <div className="flex gap-2">
              <span className="text-red-600">${offerPrice.toLocaleString("es-CL")}</span>
              <span className="line-through text-gray-500">${price.toLocaleString("es-CL")}</span>
            </div>
          );
        }
      }

      return <span>${price.toLocaleString("es-CL")}</span>;
    }

    return null;
  };
  

  const handleButtonClick = () => {
    if (product.hasVariations) {
      window.location.href = `/tienda/productos/${slugify(product.name)}`;
    } else {
      addToCartHandler(product.skuId, 1);
    }
  };

  return (
    <section className="mt-4">
    <div className="bg-[#81C4BA]/5 rounded overflow-hidden hover:shadow-xl transition-all duration-300 border border-[#81C4BA]/10">
      <div className="relative aspect-square">
        <Link href={`/tienda/productos/${slugify(product.name)}`}>
          <img
            src={product.mainImageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </Link>
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {product.productTypes && product.productTypes.length > 0 && (
            <span className="bg-[#81C4BA] px-3 py-1 rounded text-sm text-white font-medium">
              {product.productTypes[0].name}
            </span>
          )}
          {isOnSale && (
            <span className="bg-red-500 px-3 py-1 rounded text-sm text-white font-medium ">
              En Oferta
            </span>
          )}
        </div>
      </div>
      <div className="p-4">
        <Link href={`/tienda/productos/${slugify(product.name)}`}>
          <h3 className="text-[#877EB6] font-medium mb-2 line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center justify-between">
          <p className="text-[#1B9C84] font-medium">{renderPrice()}</p>
          {product.hasVariations || stock === 0 ? (
            <Link
              href={`/tienda/productos/${slugify(product.name)}`}
              className="bg-white p-2 rounded text-[#81C4BA] hover:text-[#1B9C84] hover:shadow-md transition-all"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m15.75 15.75-2.489-2.489m0 0a3.375 3.375 0 1 0-4.773-4.773 3.375 3.375 0 0 0 4.774 4.774Z"
                />
              </svg>
            </Link>
          ) : (
            <button
              onClick={handleButtonClick}
              className="bg-white p-2 rounded text-[#81C4BA] hover:text-[#1B9C84] hover:shadow-md transition-all"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
    </section>
  );
};

export default ProductCard04;
