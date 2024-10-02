/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

type ProductCardProps = {
  key: any;
  product: any;
  addToCartHandler: (skuId: string, quantity: number) => void;
  isOnSale: any;
  stock: number | null;
};

const ProductCard: React.FC<ProductCardProps> = ({
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
    <div className="relative flex flex-col items-center  mt-8">
      
      {isOnSale && (
    <span className="mt-6 absolute top-0 right-0 bg-primary text-white text-[14px]  py-1 px-2">
      En Oferta
    </span>
  )}
      <Link href={`/tienda/productos/${product.id}`}>
        {/* <div className="absolute top-4 right-4 bg-primary text-secondary px-2 py-1 rounded-bl-lg">{productType.name}</div> */}
        <img
          src={product.mainImageUrl}
          alt={product.name}
          className="w-64 object-cover h-80"
          style={{ borderRadius: "var(--radius)" }}
        />
        <p className="text-primary  font-semibold mt-4">
          {product.name}
        </p>
        <p className="text-primary  font-bold mt-2">
          {renderPrice()}
        </p>
      </Link>
    </div>
  );
};

export default ProductCard;
