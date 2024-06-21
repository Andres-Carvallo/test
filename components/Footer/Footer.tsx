/* eslint-disable @next/next/no-img-element */
import React from "react";

export default function Footer() {
  return (
    <div>
      <footer className="bg-dark py-12 px-16 font-[sans-serif]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h2 className="text-white text-lg font-bold mb-4">Quick Links</h2>
            <ul className="space-y-3">
              <li>
                <a
                  href="javascript:void(0)"
                  className="text-white hover:text-white text-base transition-all"
                >
                  Newsroom
                </a>
              </li>
              <li>
                <a
                  href="javascript:void(0)"
                  className="text-white hover:text-white text-base transition-all"
                >
                  Tailwind CSS
                </a>
              </li>
              <li>
                <a
                  href="javascript:void(0)"
                  className="text-white hover:text-white text-base transition-all"
                >
                  Careers
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-white text-lg font-bold mb-4">Follow Us</h2>
            <ul className="space-y-3">
              <li>
                <a
                  href="javascript:void(0)"
                  className="text-white hover:text-white text-base transition-all"
                >
                  Github
                </a>
              </li>
              <li>
                <a
                  href="javascript:void(0)"
                  className="text-white hover:text-white text-base transition-all"
                >
                  linkedin
                </a>
              </li>
              <li>
                <a
                  href="javascript:void(0)"
                  className="text-white hover:text-white text-base transition-all"
                >
                  Twitter
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-white text-lg font-bold mb-4">Company</h2>
            <ul className="space-y-3">
              <li>
                <a
                  href="javascript:void(0)"
                  className="text-white hover:text-white text-base transition-all"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="javascript:void(0)"
                  className="text-white hover:text-white text-base transition-all"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="javascript:void(0)"
                  className="text-white hover:text-white text-base transition-all"
                >
                  Terms & Conditions
                </a>
              </li>
            </ul>
          </div>
          <div className="flex items-center lg:justify-center">
            <p className="text-white text-sm sm:order-1">
              Diseñado por
              <img
                src="/img/pixelup.png"
                alt=""
                className="w-24"
              />
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
