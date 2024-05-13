/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import React from "react";

function CartList({
  cartItems,
  decrementQuantity,
  incrementQuantity,
  removeItem,
}: any) {
  return (
    <>
      {cartItems.map((item: any) => (
        <div
          key={item.id}
          className="flex items-start justify-between gap-4 py-8 mb-2 border border-dotted border-gray-300 p-4"
        >
          <div className="flex max-sm:flex-col gap-6">
            <div className="h-40 ">
              <img
                src={item.sku.previewImageUrl}
                className="w-full h-full object-contain shrink-0 rounded-xl"
              />
            </div>
            <div>
              <p className="text-md font-bold text-[#333]">
                {item.sku.product.name}
              </p>
              <p className="text-gray-400 text-xs mt-1">{item.quantity} Item</p>
              <h4 className="text-2xl font-bold text-[#333] mt-4 mb-2">
                $ {item.totalPrice}
              </h4>
              {/* Botones de incrementar y disminuir cantidad */}
              <div className="flex gap-2">
                <button
                  onClick={() => decrementQuantity(item.id)}
                  className="bg-gray-200 px-2 py-1 rounded"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.25 12a.75.75 0 0 1 .75-.75h14a.75.75 0 0 1 0 1.5H5a.75.75 0 0 1-.75-.75Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => incrementQuantity(item.id)}
                  className="bg-gray-200 px-2 py-1 rounded"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          {/* Botón para eliminar producto del carrito */}
          <button
            onClick={() => removeItem(item.id)}
            className="w-6 h-6 flex items-center justify-center text-dark hover:text-red-600 "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path
                fillRule="evenodd"
                d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      ))}
    </>
  );
}

export default CartList;
