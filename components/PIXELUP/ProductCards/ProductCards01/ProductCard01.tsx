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

  const renderPrice = () => {
    let priceRange = {
      min: Infinity,
      max: -Infinity,
    };

    // Si el producto no tiene variaciones y tiene ofertas, mostrar solo el precio de la oferta
    if (!product.hasVariations && product.offers && product.offers.length > 0) {
      const offerPrice = product.offers[0].amount;
      return <span>${offerPrice.toLocaleString("es-CL")}</span>;
    }

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
          ${finalMin.toLocaleString("es-CL")} - $
          {finalMax.toLocaleString("es-CL")}
        </span>
      );
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
        <p className="text-primary font-extrabold mt-2">{renderPrice()}</p>
      </Link>
    </div>
  );
};

export default ProductCard;
