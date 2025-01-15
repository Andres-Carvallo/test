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
      const ranges = product.pricingRanges[0];
      if (!ranges) return null;

      if (isOnSale && product.offers && product.offers[0]) {
        const offer = product.offers[0];
        const minAmount = Number(ranges.minimumAmount) || 0;
        const minDiscounted = Number(offer.amount) || 0;

        if (minAmount > 0 && minDiscounted > 0) {
          return (
            <div className="flex gap-2">
              <span className="text-red-600">
                ${minDiscounted.toLocaleString("es-CL")}
              </span>
              <span className="line-through text-gray-500">
                ${minAmount.toLocaleString("es-CL")}
              </span>
            </div>
          );
        }
      }

      const minAmount = Number(ranges.minimumAmount) || 0;
      const maxAmount = Number(ranges.maximumAmount) || 0;

      if (minAmount > 0 && maxAmount > 0) {
        return (
          <span>
            ${maxAmount.toLocaleString("es-CL")} - $
            {minAmount.toLocaleString("es-CL")}
          </span>
        );
      }

      return null;
    } else {
      const price = Number(product.pricings?.[0]?.amount) || 0;
      if (!price) return null;

      if (isOnSale && product.offers && product.offers[0]) {
        const offer = product.offers[0];
        const offerPrice = Number(offer.amount) || 0;

        if (price > 0 && offerPrice > 0) {
          return (
            <div className="flex gap-2">
              <span className="text-red-600">
                ${offerPrice.toLocaleString("es-CL")}
              </span>
              <span className="line-through text-gray-500">
                ${price.toLocaleString("es-CL")}
              </span>
            </div>
          );
        }
      }

      return <span>${price.toLocaleString("es-CL")}</span>;
    }
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