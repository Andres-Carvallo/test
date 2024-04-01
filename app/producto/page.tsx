/* eslint-disable @next/next/no-img-element */
import React from "react";

const ProductPage = () => {
  return (
    <section>
      <div className="font-[sans-serif]">
        <div className="p-6 lg:max-w-6xl max-w-2xl mx-auto">
          <div className="grid items-start grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="w-full lg:sticky top-0 sm:flex gap-2">
              <div className="sm:space-y-3 w-16 max-sm:flex max-sm:mb-4 max-sm:gap-4">
                <img
                  src="https://readymadeui.com/images/product1.webp"
                  alt="Product1"
                  className="w-full cursor-pointer outline"
                />
                <img
                  src="https://readymadeui.com/images/product6.webp"
                  alt="Product2"
                  className="w-full cursor-pointer"
                />
                <img
                  src="https://readymadeui.com/images/product7.webp"
                  alt="Product3"
                  className="w-full cursor-pointer"
                />
                <img
                  src="https://readymadeui.com/images/product3.webp"
                  alt="Product4"
                  className="w-full cursor-pointer"
                />
              </div>
              <img
                src="https://readymadeui.com/images/product2.webp"
                alt="Product"
                className="w-4/5 rounded object-cover"
              />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-gray-800">
                Adjective Attire | T-shirt
              </h2>
              <div className="flex flex-wrap gap-4 mt-4">
                <p className="text-gray-800 text-xl font-bold">$12</p>
                <p className="text-gray-400 text-xl">
                  <span className="line-through ">$16</span>{" "}
                  <span className="text-sm ml-1">Tax included</span>
                </p>
              </div>
              <div className="flex space-x-2 mt-4">
                <svg
                  className="w-5 fill-gray-800"
                  viewBox="0 0 14 13"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                </svg>
                <svg
                  className="w-5 fill-gray-800"
                  viewBox="0 0 14 13"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                </svg>
                <svg
                  className="w-5 fill-gray-800"
                  viewBox="0 0 14 13"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                </svg>
                <svg
                  className="w-5 fill-gray-800"
                  viewBox="0 0 14 13"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                </svg>
                <svg
                  className="w-5 fill-[#CED5D8]"
                  viewBox="0 0 14 13"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                </svg>
              </div>
              <div className="mt-8">
                <h3 className="text-lg font-bold text-gray-800">Sizes</h3>
                <div className="flex flex-wrap gap-4 mt-4">
                  <button
                    type="button"
                    className="w-12 h-12 border-2 hover:border-gray-800 font-bold text-sm rounded-full flex items-center justify-center shrink-0"
                  >
                    SM
                  </button>
                  <button
                    type="button"
                    className="w-12 h-12 border-2 hover:border-gray-800 border-gray-800 font-bold text-sm rounded-full flex items-center justify-center shrink-0"
                  >
                    MD
                  </button>
                  <button
                    type="button"
                    className="w-12 h-12 border-2 hover:border-gray-800 font-bold text-sm rounded-full flex items-center justify-center shrink-0"
                  >
                    LG
                  </button>
                  <button
                    type="button"
                    className="w-12 h-12 border-2 hover:border-gray-800 font-bold text-sm rounded-full flex items-center justify-center shrink-0"
                  >
                    XL
                  </button>
                </div>
                <button
                  type="button"
                  className="w-full mt-4 px-4 py-3 bg-gray-800 hover:bg-gray-900 text-white font-bold rounded"
                >
                  Add to cart
                </button>
              </div>
              <div className="mt-8">
                <h3 className="text-lg font-bold text-gray-800">
                  About the item
                </h3>
                <ul className="space-y-3 list-disc mt-4 pl-4 text-sm text-gray-800">
                  <li>
                    A gray t-shirt is a wardrobe essential because it is so
                    versatile.
                  </li>
                  <li>
                    Available in a wide range of sizes, from extra small to
                    extra large, and even in tall and petite sizes.
                  </li>
                  <li>
                    This is easy to care for. They can usually be machine-washed
                    and dried on low heat.
                  </li>
                  <li>
                    You can add your own designs, paintings, or embroidery to
                    make it your own.
                  </li>
                </ul>
              </div>
              <div className="mt-8 max-w-md">
                <h3 className="text-lg font-bold text-gray-800">Reviews(10)</h3>
                <div className="space-y-3 mt-4">
                  <div className="flex items-center">
                    <p className="text-sm text-gray-800 font-bold">5.0</p>
                    <svg
                      className="w-5 fill-gray-800 ml-1"
                      viewBox="0 0 14 13"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                    </svg>
                    <div className="bg-gray-300 rounded w-full h-2 ml-3">
                      <div className="w-2/3 h-full rounded bg-gray-800" />
                    </div>
                    <p className="text-sm text-gray-800 font-bold ml-3">66%</p>
                  </div>
                  <div className="flex items-center">
                    <p className="text-sm text-gray-800 font-bold">4.0</p>
                    <svg
                      className="w-5 fill-gray-800 ml-1"
                      viewBox="0 0 14 13"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                    </svg>
                    <div className="bg-gray-300 rounded w-full h-2 ml-3">
                      <div className="w-1/3 h-full rounded bg-gray-800" />
                    </div>
                    <p className="text-sm text-gray-800 font-bold ml-3">33%</p>
                  </div>
                  <div className="flex items-center">
                    <p className="text-sm text-gray-800 font-bold">3.0</p>
                    <svg
                      className="w-5 fill-gray-800 ml-1"
                      viewBox="0 0 14 13"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                    </svg>
                    <div className="bg-gray-300 rounded w-full h-2 ml-3">
                      <div className="w-1/6 h-full rounded bg-gray-800" />
                    </div>
                    <p className="text-sm text-gray-800 font-bold ml-3">16%</p>
                  </div>
                  <div className="flex items-center">
                    <p className="text-sm text-gray-800 font-bold">2.0</p>
                    <svg
                      className="w-5 fill-gray-800 ml-1"
                      viewBox="0 0 14 13"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                    </svg>
                    <div className="bg-gray-300 rounded w-full h-2 ml-3">
                      <div className="w-1/12 h-full rounded bg-gray-800" />
                    </div>
                    <p className="text-sm text-gray-800 font-bold ml-3">8%</p>
                  </div>
                  <div className="flex items-center">
                    <p className="text-sm text-gray-800 font-bold">1.0</p>
                    <svg
                      className="w-5 fill-gray-800 ml-1"
                      viewBox="0 0 14 13"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                    </svg>
                    <div className="bg-gray-300 rounded w-full h-2 ml-3">
                      <div className="w-[6%] h-full rounded bg-gray-800" />
                    </div>
                    <p className="text-sm text-gray-800 font-bold ml-3">6%</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="w-full mt-8 px-4 py-2 bg-transparent border-2 border-gray-800 text-gray-800 font-bold rounded"
                >
                  Read all reviews
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductPage;
