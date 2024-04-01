/* eslint-disable @next/next/no-img-element */
import React from "react";

export default function CTA01() {
  return (
    <div className="py-16">
      <div className="bg-white min-h-[475px] text-[#333] font-[sans-serif]">
        <div className="grid md:grid-cols-2 justify-center items-center max-md:text-center gap-8">
          <div className="max-w-md mx-auto p-4">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 md:!leading-[55px]">
              Try using our templates
            </h2>
            <p className="text-base">
              Upgrade to our premium plan and supercharge your experience. Dont
              miss out!
            </p>
            <div className="mt-8 space-y-6">
              <input
                name="name"
                type="text"
                className="bg-gray-100 w-full text-sm px-4 py-3 outline-[#333]"
                placeholder="Enter name"
              />
              <button
                type="button"
                className="w-full px-4 py-2 text-base tracking-wider font-semibold outline-none border border-[#333] bg-[#222] text-white hover:bg-transparent hover:text-[#333] transition-all duration-300"
              >
                Try now
              </button>
            </div>
          </div>
          <div className="md:text-right max-md:mt-12 h-full">
            <img
              src="https://readymadeui.com/team-image.webp"
              alt="Premium Benefits"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
