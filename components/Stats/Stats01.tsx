import React from "react";

export default function Stats01() {
  return (
    <div className="w-full py-12">
      <div className="bg-gray-100 px-4 py-10 font-[sans-serif] text-[#333]">
        <h2 className="text-3xl font-bold mb-14 text-center">
          Application Metrics
        </h2>
        <div className="grid sm:grid-cols-2 gap-6 max-w-6xl mx-auto">
          <div className="bg-white flex gap-6 max-lg:flex-col rounded-2xl md:p-8 p-6 shadow-[0_-4px_24px_-8px_rgba(0,0,0,0.2)]">
            <h3 className="text-5xl font-extrabold">
              5.4<span className="text-blue-600">M+</span>
            </h3>
            <div>
              <p className="text-base font-bold">Total Users</p>
              <p className="text-sm text-gray-500 mt-2">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis
                accumsan, nunc et tempus blandit, metus mi consectetur felis
                turpis vitae ligula.
              </p>
            </div>
          </div>
          <div className="bg-white flex gap-6 max-lg:flex-col rounded-2xl md:p-8 p-6 shadow-[0_-4px_24px_-8px_rgba(0,0,0,0.2)]">
            <h3 className="text-5xl font-extrabold">
              $80<span className="text-blue-600">K</span>
            </h3>
            <div>
              <p className="text-base font-bold">Revenue</p>
              <p className="text-sm text-gray-500 mt-2">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis
                accumsan, nunc et tempus blandit, metus mi consectetur felis
                turpis vitae ligula.
              </p>
            </div>
          </div>
          <div className="bg-white flex gap-6 max-lg:flex-col rounded-2xl md:p-8 p-6 shadow-[0_-4px_24px_-8px_rgba(0,0,0,0.2)]">
            <h3 className="text-5xl font-extrabold">
              100<span className="text-blue-600">K</span>
            </h3>
            <div>
              <p className="text-base font-bold">Engagement</p>
              <p className="text-sm text-gray-500 mt-2">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis
                accumsan, nunc et tempus blandit, metus mi consectetur felis
                turpis vitae ligula.
              </p>
            </div>
          </div>
          <div className="bg-white flex gap-6 max-lg:flex-col rounded-2xl md:p-8 p-6 shadow-[0_-4px_24px_-8px_rgba(0,0,0,0.2)]">
            <h3 className="text-5xl font-extrabold">
              99.9<span className="text-blue-600">%</span>
            </h3>
            <div>
              <p className="text-base font-bold">Server Uptime</p>
              <p className="text-sm text-gray-500 mt-2">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis
                accumsan, nunc et tempus blandit, metus mi consectetur felis
                turpis vitae ligula.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
