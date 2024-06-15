/* eslint-disable @next/next/no-img-element */
import React from "react";
import Link from "next/link";

export default function page() {
  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <img
        src="/img/bg-login.png"
        alt="gradient background image"
        className="w-full h-full object-cover absolute top-0 left-0"
      />
      <div className="relative z-10 mx-auto max-w-lg px-6 lg:px-8 py-20">
        <h1 className="text-gray-900 text-center font-manrope text-6xl font-bold leading-10 mb-4">
          PixelUP
        </h1>
        <div className="rounded-2xl bg-white shadow-xl mt-12">
          <form action="" className="lg:p-11 p-7 mx-auto">
            <div className="mb-11">
              <h1 className="text-gray-900 text-center font-manrope text-3xl font-bold leading-10 mb-2">
                Inicia sesión
              </h1>
              <p className="text-gray-500 text-center text-base font-medium leading-6">
                Let’s get started with your 30 days free trail
              </p>
            </div>
            <input
              type="text"
              className="w-full h-12 text-gray-900 placeholder:text-gray-400 text-lg font-normal leading-7 rounded-full border-gray-300 border shadow-sm focus:outline-none px-4 mb-6"
              placeholder="Username"
            />
            <input
              type="password"
              className="w-full h-12 text-gray-900 placeholder:text-gray-400 text-lg font-normal leading-7 rounded-full border-gray-300 border shadow-sm focus:outline-none px-4 mb-1"
              placeholder="Password"
            />
            <a href="javascript:;" className="flex justify-end mb-6">
              <span className="text-primary text-right text-base font-normal leading-6">
              ¿Olvidaste tu contraseña? 
              </span>
            </a>
            <button className="w-full h-12 text-secondary hover:text-primary text-center text-base font-semibold leading-6 rounded-full hover:bg-secondary transition-all duration-700 bg-primary shadow-sm mb-11">
              Login
            </button>
            <a href="javascript:;" className="flex justify-center text-gray-900 text-base font-medium leading-6">
            ¿Aún no tienes cuenta?
              <Link
                    href="/registration"
                    className="text-primary font-semibold pl-3"
                  >
                    Registrate
              </Link>
            </a>
          </form>
        </div>
      </div>
    </div>
  );
}
