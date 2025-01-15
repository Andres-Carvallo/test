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

const ProductCard03: React.FC<ProductCardProps> = ({
  addToCartHandler,
  product,
  isOnSale,
  stock,
}) => {
  const renderPrice = () => {
    // Para productos sin variaciones
    if (!product.hasVariations) {
      const price = Number(product.pricings?.[0]?.amount) || 0;
      if (!price) return null;

      // Si tiene oferta, mostrar precio original y descuento
      if (isOnSale && product.offers && product.offers[0]) {
        const offerPrice = Number(product.offers[0].amount) || 0;
        
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

    // Para productos con variaciones
    if (product.hasVariations && product.pricingRanges[0]) {
      const ranges = product.pricingRanges[0];
      
      // Si tiene oferta, mostrar el rango con descuento
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

      // Mostrar rango de precios normal
      const minAmount = Number(ranges.minimumAmount) || 0;
      const maxAmount = Number(ranges.maximumAmount) || 0;

      if (minAmount > 0 && maxAmount > 0) {
        return (
          <span>
            ${minAmount.toLocaleString("es-CL")} - ${maxAmount.toLocaleString("es-CL")}
          </span>
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
    <div className="relative flex flex-col items-center mt-8 ">
      {isOnSale && (
        <span
          className={`mt-6 absolute top-0 -right-2 bg-white text-black text-[14px] py-1 px-2`}
        >
          En Oferta
        </span>
      )}
      <Link href={`/tienda/productosv2/${slugify(product.name)}`}>
        {/* <div className="absolute top-4 right-4 bg-primary text-secondary px-2 py-1 rounded-bl-lg">{productType.name}</div> */}
        <img
          src={product.mainImageUrl}
          alt={product.name}
          className="w-96 object-cover "
          style={{ borderRadius: "var(--radius)" }}
        />
        <p className={`font-semibold mt-4 `}>{product.name}</p>
        <p className={`font-bold mt-2 `}>{renderPrice()}</p>
        <button
          type="button"
          className={`mt-4 uppercase w-full inline-flex items-center justify-center rounded-md border-2 border-transparent bg-primary md:hover:scale-105 duration-300 px-12 py-3 text-center text-base font-bold text-white transition-all ease-in-out focus:shadow`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="shrink-0 mr-3 h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          Ver Detalle
        </button>
      </Link>
    </div>
  );
};

export default ProductCard03;