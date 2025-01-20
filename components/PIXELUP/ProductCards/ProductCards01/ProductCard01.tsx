/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useState, useEffect } from "react";
import { slugify } from "@/app/utils/slugify";

interface ProductCardProps {
  product: any;
  addToCartHandler: (id: string, quantity: number) => void;
  isOnSale: boolean;
  stock: number;
}

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

const ProductCard: React.FC<ProductCardProps> = ({
  addToCartHandler,
  product,
  isOnSale,
  stock,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = product.mainImageUrl;
    img.onload = () => {
      setImageLoaded(true);
      setIsLoading(false);
    };
    img.onerror = () => {
      setIsLoading(false);
    };
  }, [product.mainImageUrl]);

  const getDisplayPrice = () => {
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
            <span className="text-red-600 font-semibold text-base">
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
          <span className="text-primary">
            {minPrice === maxPrice
              ? `$${minPrice.toLocaleString("es-CL")}`
              : `$${minPrice.toLocaleString("es-CL")} - $${maxPrice.toLocaleString("es-CL")}`
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
            <span className="text-red-600 font-semibold text-base">
              ${offerPrice.toLocaleString("es-CL")}
            </span>
          </div>
        );
      }

      if (normalPrice > 0) {
        return <span className="text-primary">${normalPrice.toLocaleString("es-CL")}</span>;
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
    <div className="relative flex flex-col items-center h-72 md:h-96 mt-8">
      {isOnSale && (
        <span className="mt-6 absolute top-0 right-0 bg-primary text-white text-[14px] py-1 px-2">
          En Oferta
        </span>
      )}
      <Link
        href={`/tienda/productos/${slugify(product.name)}`}
        className=""
      >
        {isLoading && (
          <div className="w-40 md:w-52 h-52 md:h-72 bg-gray-300 animate-pulse rounded-lg"></div>
        )}
        {imageLoaded && (
          <img
            src={product.mainImageUrl}
            alt={product.name}
            className="w-40 md:w-52 object-cover h-52 md:h-72"
            style={{ borderRadius: "var(--radius)" }}
            loading="lazy"
          />
        )}
        <div className="max-w-[150px] md:max-w-[200px]">
          <p className="text-primary text-base mt-4">{product.name}</p>
        </div>
        <div className="mt-2">
          <div className="mt-1 text-sm">{getDisplayPrice()}</div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;