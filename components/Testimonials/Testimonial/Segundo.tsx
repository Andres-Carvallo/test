/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import React from "react";

export default function Segundo() {
  return (
    <div>
      <div className="max-w-[350px] h-auto sm:p-8 p-4 rounded-md shadow-[0_2px_22px_-4px_rgba(93,96,127,0.2)] bg-white relative mx-12">
        <img
          src="https://readymadeui.com/profile_3.webp"
          className="w-14 h-14 rounded-full absolute right-0 left-0 mx-auto -top-7"
        />
        <div className="mt-8 text-center">
          <p className="text-sm text-[#333] leading-relaxed">
            The service was amazing. I never had to wait that long for my food.
            The staff was friendly and attentive, and the delivery was
            impressively prompt.
          </p>
          <h4 className="text-base whitespace-nowrap font-extrabold mt-8">
            ( Mark Adair )
          </h4>
        </div>
      </div>
    </div>
  );
}
