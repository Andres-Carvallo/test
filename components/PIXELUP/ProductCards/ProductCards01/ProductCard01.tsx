/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

type ProductCardProps = {
  key: any;
  product: any;
  addToCartHandler: (skuId: string, quantity: number) => void;
};

const ProductCard: React.FC<ProductCardProps> = ({
  addToCartHandler,
  product,
}) => {
  const renderPrice = () => {
    if (product.hasVariations && product.pricingRanges) {
      const { minimumAmount, maximumAmount } = product.pricingRanges[0];
      return (
        <span className="">
          ${maximumAmount.toLocaleString("es-CL")} - $
          {minimumAmount.toLocaleString("es-CL")}
        </span>
      );
    }
    if (product.pricings) {
      return (
        <span className="">
          ${product.pricings[0].amount.toLocaleString("es-CL")}
        </span>
      );
    }
    return null;
  };

  const handleButtonClick = () => {
    if (product.hasVariations) {
      window.location.href = `/tienda/productos/${product.id}`;
    } else {
      addToCartHandler(product.skuId, 1);
    }
  };

  return (
    <div className="relative flex flex-col items-center">
      <Link href={`/tienda/productos/${product.id}`}>
        {/* <div className="absolute top-4 right-4 bg-primary text-secondary px-2 py-1 rounded-bl-lg">{productType.name}</div> */}
        <img
          src={product.mainImageUrl}
          alt={product.name}
          className="w-72 object-cover h-96"
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
