/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useState, useEffect } from "react";
import { slugify } from "@/app/utils/slugify";
import axios from "axios";

type ProductCardProps = {
  key: any;
  product: any;
  addToCartHandler: (skuId: string, quantity: number) => void;
  isOnSale: any;
  stock: number | null;
};

interface PriceRange {
  min: number;
  max: number;
}

const ProductCard05: React.FC<ProductCardProps> = ({
  addToCartHandler,
  product,
  isOnSale,
  stock,
}) => {
  const [cuotasEnabled, setCuotasEnabled] = useState(false);
  const [numeroCuotas, setNumeroCuotas] = useState(0);

  useEffect(() => {
    const fetchCuotasConfig = async () => {
      try {
        const contentBlockId = process.env.NEXT_PUBLIC_CUOTAS_CONTENTBLOCK;
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/content-blocks/${contentBlockId}?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`
        );
        if (response.data.contentBlock?.contentText) {
          const cuotasConfig = JSON.parse(response.data.contentBlock.contentText);
          setCuotasEnabled(cuotasConfig.enabled);
          setNumeroCuotas(cuotasConfig.enabled ? parseInt(cuotasConfig.installments) : 0);
        }
      } catch (error) {
        console.error("Error al obtener configuración de cuotas:", error);
        setCuotasEnabled(false);
        setNumeroCuotas(0);
      }
    };

    fetchCuotasConfig();
  }, []);

  const renderPrice = () => {
    // Para productos con variaciones
    if (product.hasVariations) {
      // Obtener todos los precios normales y de oferta
      const normalPrices = product.pricingRanges.map((range: any) => ({
        min: Number(range.minimumAmount) || 0,
        max: Number(range.maximumAmount) || 0
      })).filter((price: PriceRange) => price.min > 0 && price.max > 0);

      const offerPrices = product.offers?.map((offer: any) => Number(offer.amount) || 0)
        .filter((price: number) => price > 0) || [];

      // Si hay ofertas, mostrar ambos rangos de precios
      if (isOnSale && offerPrices.length > 0) {
        const minNormalPrice = Math.min(...normalPrices.map((p: PriceRange) => p.min));
        const maxNormalPrice = Math.max(...normalPrices.map((p: PriceRange) => p.max));
        const minOfferPrice = Math.min(...offerPrices);
        const maxOfferPrice = Math.max(...offerPrices);
        const minPrecioPorCuota = cuotasEnabled ? Math.ceil(minOfferPrice / numeroCuotas) : 0;

        return (
          <div className="flex items-center gap-2">
            <p className="font-montserrat text-sm text-gray-400 line-through">
              {minNormalPrice === maxNormalPrice
                ? `$${minNormalPrice.toLocaleString("es-CL")}`
                : `$${Math.min(minNormalPrice, maxNormalPrice).toLocaleString("es-CL")} - $${Math.max(minNormalPrice, maxNormalPrice).toLocaleString("es-CL")}`
              }
            </p>
            <p className="font-montserrat text-sm font-semibold text-red-600">
              {minOfferPrice === maxOfferPrice
                ? `$${minOfferPrice.toLocaleString("es-CL")}`
                : `$${Math.min(minOfferPrice, maxOfferPrice).toLocaleString("es-CL")} - $${Math.max(minOfferPrice, maxOfferPrice).toLocaleString("es-CL")}`
              }
            </p>
            {cuotasEnabled && numeroCuotas > 0 && (
              <span className="text-xs text-green-500 mt-1">
                En {numeroCuotas} cuotas desde ${minPrecioPorCuota.toLocaleString("es-CL")}
              </span>
            )}
          </div>
        );
      }

      // Si no hay ofertas, mostrar rango de precios normal
      if (normalPrices.length > 0) {
        const minPrice = Math.min(...normalPrices.map((p: PriceRange) => p.min));
        const maxPrice = Math.max(...normalPrices.map((p: PriceRange) => p.max));
        const minPrecioPorCuota = cuotasEnabled ? Math.ceil(minPrice / numeroCuotas) : 0;

        return (
          <div className="flex flex-col">
            <p className="font-montserrat text-sm text-gray-500">
              {minPrice === maxPrice
                ? `$${minPrice.toLocaleString("es-CL")}`
                : `$${Math.min(minPrice, maxPrice).toLocaleString("es-CL")} - $${Math.max(minPrice, maxPrice).toLocaleString("es-CL")}`
              }
            </p>
            {cuotasEnabled && numeroCuotas > 0 && (
              <span className="text-xs text-green-500 mt-1">
                En {numeroCuotas} cuotas desde ${minPrecioPorCuota.toLocaleString("es-CL")}
              </span>
            )}
          </div>
        );
      }
    } else {
      // Para productos sin variaciones
      const normalPrice = Number(product.pricings?.[0]?.amount) || 0;
      const offerPrice = isOnSale && product.offers?.[0]?.amount 
        ? Number(product.offers[0].amount) 
        : null;
      const precioPorCuota = cuotasEnabled ? Math.ceil((offerPrice || normalPrice) / numeroCuotas) : 0;

      if (offerPrice) {
        return (
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <p className="font-montserrat text-sm text-gray-400 line-through">
                ${normalPrice.toLocaleString("es-CL")}
              </p>
              <p className="font-montserrat text-sm font-semibold text-red-600">
                ${offerPrice.toLocaleString("es-CL")}
              </p>
            </div>
            {cuotasEnabled && numeroCuotas > 0 && (
              <span className="text-xs text-green-500 mt-1">
                En {numeroCuotas} cuotas de ${precioPorCuota.toLocaleString("es-CL")}
              </span>
            )}
          </div>
        );
      }

      if (normalPrice > 0) {
        return (
          <div className="flex flex-col">
            <p className="font-montserrat text-sm text-gray-500">${normalPrice.toLocaleString("es-CL")}</p>
            {cuotasEnabled && numeroCuotas > 0 && (
              <span className="text-xs text-green-500 mt-1">
                En {numeroCuotas} cuotas de ${precioPorCuota.toLocaleString("es-CL")}
              </span>
            )}
          </div>
        );
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
    <div className="min-w-[200px] sm:min-w-[250px] mt-4">
      <div className="bg-gray-50 aspect-square relative group overflow-hidden">
        <Link href={`/tienda/productos/${slugify(product.name)}`}>
          <img
            src={product.mainImageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </Link>
        
        {/* Etiquetas de producto */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          {product.productTypes && product.productTypes.length > 0 && (
            <div className="bg-[#c6b3f1] text-white px-3 py-1 font-montserrat text-md">
              {product.productTypes[0].name}
            </div>
          )}
          {isOnSale && (
            <div className="bg-red-500 text-white px-3 py-1 font-montserrat text-md">
              En Oferta
            </div>
          )}
        </div>
        
        {/* Overlay con botón de ver detalle */}
        <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
          <Link
            href={`/tienda/productos/${slugify(product.name)}`}
            className="font-poiret cursor-pointer text-white text-lg border-b border-white hover:border-white transition-colors"
          >
            VER DETALLE
          </Link>
        </div>
      </div>
      
      <div className="p-4 flex justify-between items-center">
        <div className="text-left">
          <h3 className="font-montserrat text-sm font-medium text-gray-700 truncate max-w-[8ch]  md:max-w-[18ch]">
            {product.name}
          </h3>
          {renderPrice()}
        </div>
        
        {product.hasVariations || stock === 0 ? (
          <div
            className="bg-[#FFC4C7] p-1.5 cursor-pointer"
            data-tooltip-id="cart-tooltip"
            data-tooltip-content="Ver más"
          >
            <Link href={`/tienda/productos/${slugify(product.name)}`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </Link>
          </div>
        ) : (
          <div
            className="bg-[#FFC4C7] p-1.5 cursor-pointer"
            data-tooltip-id="cart-tooltip"
            data-tooltip-content="Agregar al carrito"
            onClick={handleButtonClick}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-shopping-cart-icon lucide-shopping-cart"
            >
              <circle cx="8" cy="21" r="1" />
              <circle cx="19" cy="21" r="1" />
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard05;