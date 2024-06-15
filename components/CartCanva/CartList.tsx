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
          className="flex flex-col   gap-5 py-6  border-b border-gray-200 group relative"
        >
          <div>
            <h6 className="font-semibold text-base  leading-7 text-black">
              {item.sku.product.name}
            </h6>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => removeItem(item.id)}
              className="w-6 h-6 top-4 right-0 flex items-center absolute justify-center text-dark hover:text-red-600 "
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

            <div className="w-full max-w-24 ">
              <img
                src={item.sku.mainImageUrl}
                alt="perfume bottle image"
                className="mx-auto "
              />
            </div>
            <div className="flex w-full justify-between ">
              <div className="col-span-1 min-w-24">
                <div className="flex flex-col  items-center gap-3">
                  <h6 className="font-medium mt-3 text-xl leading-7 text-primary transition-all duration-300 ">
                    ${item.totalPrice.toLocaleString("es-CL")}
                  </h6>
                </div>
              </div>
              <div className="flex items-center w-fit  justify-center h-full ">
                <div className="flex items-center h-full">
                  <button
                    onClick={() => decrementQuantity(item.id)}
                    className="group rounded-l-xl px-5 py-[18px] border border-gray-200 flex items-center justify-center shadow-sm shadow-transparent transition-all duration-500 hover:bg-gray-50 hover:border-gray-300 hover:shadow-gray-300 focus-within:outline-gray-300"
                  >
                    <svg
                      className="stroke-gray-900 transition-all duration-500 group-hover:stroke-black"
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      height="10"
                      viewBox="0 0 22 22"
                      fill="none"
                    >
                      <path
                        d="M16.5 11H5.5"
                        stroke=""
                        stroke-width="1.6"
                        stroke-linecap="round"
                      />
                      <path
                        d="M16.5 11H5.5"
                        stroke=""
                        stroke-opacity="0.2"
                        stroke-width="1.6"
                        stroke-linecap="round"
                      />
                      <path
                        d="M16.5 11H5.5"
                        stroke=""
                        stroke-opacity="0.2"
                        stroke-width="1.6"
                        stroke-linecap="round"
                      />
                    </svg>
                  </button>
                  {/*             <input type="text"
                      className="border-y border-gray-200 outline-none text-gray-900 font-semibold text-lg w-full max-w-[73px] min-w-[60px] placeholder:text-gray-900 py-[10px]  text-center bg-transparent"
                      placeholder="1"/> */}
                  <span className="border-y border-gray-200 outline-none text-gray-900 font-semibold text-lg w-full max-w-[73px] min-w-[60px] placeholder:text-gray-900 py-[10px]  text-center bg-transparent">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => incrementQuantity(item.id)}
                    className="group rounded-r-xl px-5 py-[18px] border border-gray-200 flex items-center justify-center shadow-sm shadow-transparent transition-all duration-500 hover:bg-gray-50 hover:border-gray-300 hover:shadow-gray-300 focus-within:outline-gray-300"
                  >
                    <svg
                      className="stroke-gray-900 transition-all duration-500 group-hover:stroke-black"
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      height="10"
                      viewBox="0 0 22 22"
                      fill="none"
                    >
                      <path
                        d="M11 5.5V16.5M16.5 11H5.5"
                        stroke=""
                        stroke-width="1.6"
                        stroke-linecap="round"
                      />
                      <path
                        d="M11 5.5V16.5M16.5 11H5.5"
                        stroke=""
                        stroke-opacity="0.2"
                        stroke-width="1.6"
                        stroke-linecap="round"
                      />
                      <path
                        d="M11 5.5V16.5M16.5 11H5.5"
                        stroke=""
                        stroke-opacity="0.2"
                        stroke-width="1.6"
                        stroke-linecap="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              {/*           <div className="flex items-center max-[500px]:justify-center md:justify-end max-md:mt-3 h-full">
              <p className="font-bold text-lg leading-8 text-gray-600 text-center transition-all duration-300 group-hover:text-indigo-600">${item.totalPrice}</p>
          </div> */}
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export default CartList;
