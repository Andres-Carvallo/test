import React from "react";
import Marquee from "react-fast-marquee";
const MarqueeTop = () => {
  return (
    <section>
      <div className="flex items-center max-md:flex-col bg-blue-500 text-white px-6 py-3.5 rounded font-[sans-serif]">
        <p className="text-base flex-1">
          <Marquee>
            {" "}
            Dont miss out on our amazing summer sale! Get up to 50% off on a
            wide range of products. Make the most of your summer shopping.{" "}
          </Marquee>
        </p>
        <div className="max-md:mt-4">
          <button
            type="button"
            className="bg-white text-blue-500 font-semibold py-2 px-4 rounded text-sm hover:bg-slate-100 mx-6"
          >
            Get Offer
          </button>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 cursor-pointer fill-white inline-block"
            viewBox="0 0 320.591 320.591"
          >
            <path
              d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z"
              data-original="#000000"
            />
            <path
              d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z"
              data-original="#000000"
            />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default MarqueeTop;
