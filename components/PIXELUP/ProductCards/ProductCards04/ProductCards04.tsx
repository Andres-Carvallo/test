/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { slugify } from "@/app/utils/slugify";

interface PricingRange {
  minimumAmount: string | number;
  maximumAmount: string | number;
}

interface PriceRange {
  min: number;
  max: number;
}

interface Offer {
  amount: string | number;
}

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
      // Obtener todos los precios normales y de oferta
      const normalPrices = product.pricingRanges.map((range: PricingRange) => ({
        min: Number(range.minimumAmount) || 0,
        max: Number(range.maximumAmount) || 0
      })).filter((price: PriceRange) => price.min > 0 && price.max > 0);

      const offerPrices = product.offers?.map((offer: Offer) => Number(offer.amount) || 0)
        .filter((price: number) => price > 0) || [];

      // Si hay ofertas, mostrar ambos rangos de precios
      if (isOnSale && offerPrices.length > 0) {
        const minNormalPrice = Math.min(...normalPrices.map((p: PriceRange) => p.min));
        const maxNormalPrice = Math.max(...normalPrices.map((p: PriceRange) => p.max));
        const minOfferPrice = Math.min(...offerPrices);
        const maxOfferPrice = Math.max(...offerPrices);

        return (
          <div className="flex flex-col">
            <span className="line-through text-gray-500 text-sm">
              {minNormalPrice === maxNormalPrice
                ? `$${minNormalPrice.toLocaleString("es-CL")}`
                : `$${Math.min(minNormalPrice, maxNormalPrice).toLocaleString("es-CL")} - $${Math.max(minNormalPrice, maxNormalPrice).toLocaleString("es-CL")}`
              }
            </span>
            <span className="text-[#1B9C84] font-semibold">
              {minOfferPrice === maxOfferPrice
                ? `$${minOfferPrice.toLocaleString("es-CL")}`
                : `$${Math.min(minOfferPrice, maxOfferPrice).toLocaleString("es-CL")} - $${Math.max(minOfferPrice, maxOfferPrice).toLocaleString("es-CL")}`
              }
            </span>
          </div>
        );
      }

      // Si no hay ofertas, mostrar rango de precios normal
      if (normalPrices.length > 0) {
        const minPrice = Math.min(...normalPrices.map((p: PriceRange) => p.min));
        const maxPrice = Math.max(...normalPrices.map((p: PriceRange) => p.max));

        return (
          <span className="text-[#1B9C84]">
            {minPrice === maxPrice
              ? `$${minPrice.toLocaleString("es-CL")}`
              : `$${Math.min(minPrice, maxPrice).toLocaleString("es-CL")} - $${Math.max(minPrice, maxPrice).toLocaleString("es-CL")}`
            }
          </span>
        );
      }
    } else {
      // Para productos sin variaciones
      const normalPrice = Number(product.pricings?.[0]?.amount) || 0;
      const offerPrice = isOnSale && product.offers?.[0]?.amount 
        ? Number(product.offers[0].amount) 
        : null;

      if (offerPrice) {
        return (
          <div className="flex flex-col">
            <span className="line-through text-gray-500 text-sm">
              ${normalPrice.toLocaleString("es-CL")}
            </span>
            <span className="text-[#1B9C84] font-semibold">
              ${offerPrice.toLocaleString("es-CL")}
            </span>
          </div>
        );
      }

      if (normalPrice > 0) {
        return <span className="text-[#1B9C84]">${normalPrice.toLocaleString("es-CL")}</span>;
      }
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
      <div className="bg-[#81C4BA]/5 rounded overflow-hidden hover:shadow-xl transition-all duration-300 border border-[#81C4BA]/10 h-full flex flex-col">
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
        <div className="p-4 flex flex-col flex-grow">
          <Link href={`/tienda/productos/${slugify(product.name)}`}>
            <h3 className="text-[#877EB6] font-medium mb-2 line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <div className="flex items-center justify-between mt-auto">
            <div className="min-h-[48px] flex items-center">
              {renderPrice()}
            </div>
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
