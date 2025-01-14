
'use client'

import React, { useState } from "react";
import "pure-react-carousel/dist/react-carousel.es.css";
import Link from "next/link"
import Marquee from "react-fast-marquee";
import Image from "next/image";





interface ProductView03Props {
    ProductView03Data: {
      home: string;
      linkhome: string;
      team: string;
      textoboton: string;
      descripcion: string;
    }
  };
  
  
  
const ProductView03:React.FC<ProductView03Props> = ({ProductView03Data})  => {

    const { home, descripcion, textoboton, linkhome, team} = ProductView03Data;
    const [image, setImage] = useState(1);

    const images =[
    'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=2030&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDN8fHxlbnwwfHx8fHw%3D'
    ];


    const [selectedSize, setSelectedSize] = useState('M');
    const [selectedColor, setSelectedColor] = useState('Amarillo');
    const [mainImage, setMainImage] = useState('https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');

    const handleSizeChange = (size: string) => {
        setSelectedSize(size);
        // Aquí puedes agregar lógica para cambiar la imagen principal según la talla
    };

    const handleColorChange = (color: string) => {
        setSelectedColor(color);
        // Aquí puedes agregar lógica para cambiar la imagen principal según el color
    };

    const handleImageClick = (imgUrl: string) => {
      setMainImage(imgUrl);
  };

  return (

<section className="py-12 sm:py-16"> 
  <div className="container mx-auto px-4">
    <nav className="flex">
      <ol role="list" className="flex items-center">
        <li className="text-left">
          <div className="-m-1">
            <a href="#" className="rounded-md p-1 text-sm font-medium text-gray-600 focus:text-gray-900 focus:shadow hover:text-gray-800"> Inicio </a>
          </div>
        </li>

        <li className="text-left">
          <div className="flex items-center">
            <span className="mx-2 text-gray-400">/</span>
            <div className="-m-1">
              <a href="#" className="rounded-md p-1 text-sm font-medium text-gray-600 focus:text-gray-900 focus:shadow hover:text-gray-800"> Productos </a>
            </div>
          </div>
        </li>

        <li className="text-left">
          <div className="flex items-center">
            <span className="mx-2 text-gray-400">/</span>
            <div className="-m-1">
              <a href="#" className="rounded-md p-1 text-sm font-medium text-gray-600 focus:text-gray-900 focus:shadow hover:text-gray-800" aria-current="page"> Poleras </a>
            </div>
          </div>
        </li>
      </ol>
    </nav>

    <div className="lg:col-gap-12 xl:col-gap-16 mt-8 grid grid-cols-1 gap-12 lg:mt-12 lg:grid-cols-5 lg:gap-16">
      <div className="lg:col-span-3 lg:row-end-1">
        <div className="lg:flex lg:items-start">
          <div className="lg:order-2 lg:ml-5">
          <div className="max-w-xl overflow-hidden rounded-lg">
                            <img className="h-[650px] w-[650px] object-cover" src={mainImage} alt="" />
                        </div>
          </div>

          <div className="mt-2 w-full lg:order-1 lg:w-32 lg:flex-shrink-0">
            <div className="flex flex-row items-start lg:flex-col">
            {images.map((image, index) => (
                                <button key={index} type="button" className="flex-0 aspect-square mb-3 h-20 overflow-hidden rounded-lg text-center"
                                        onClick={() => handleImageClick(image)}>
                                    <img className="h-full w-full object-cover" src={image} alt="" />
                                </button>
                            ))}
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 lg:row-span-2 lg:row-end-2">
        <h1 className="sm: text-2xl font-bold text-gray-900 sm:text-3xl">Polera Estampado</h1>

{/*         <div className="mt-5 flex items-center">
          <div className="flex items-center">
            <svg className="block h-4 w-4 align-middle text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" className=""></path>
            </svg>
            <svg className="block h-4 w-4 align-middle text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" className=""></path>
            </svg>
            <svg className="block h-4 w-4 align-middle text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" className=""></path>
            </svg>
            <svg className="block h-4 w-4 align-middle text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" className=""></path>
            </svg>
            <svg className="block h-4 w-4 align-middle text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" className=""></path>
            </svg>
          </div>
          <p className="ml-2 text-sm font-medium text-gray-500">1,209 Reviews</p>
        </div> */}

<h2 className="mt-8 text-base text-gray-900">Talla:</h2>
                <div className="mt-3 flex select-none flex-wrap items-center gap-1">
                    {['S', 'M', 'L'].map((size) => (
                        <label key={size}>
                            <input type="radio" name="size" value={size} className="peer sr-only"
                                   checked={selectedSize === size} onChange={() => handleSizeChange(size)} />
                            <p className={`peer-checked:bg-primary peer-checked:text-white rounded-lg border border-black px-6 py-2 font-bold ${selectedSize === size ? 'bg-primary text-white' : ''}`}>{size}</p>
                        </label>
                    ))}
                </div>

                <h2 className="mt-8 text-base text-gray-900">Color:</h2>
                <div className="mt-3 flex select-none flex-wrap items-center gap-1">
                    {['Rojo', 'Amarillo', 'Azul'].map((color) => (
                        <label key={color}>
                            <input type="radio" name="color" value={color} className="peer sr-only"
                                   checked={selectedColor === color} onChange={() => handleColorChange(color)} />
                            <p className={`peer-checked:bg-primary peer-checked:text-white rounded-lg border border-black px-6 py-2 font-bold ${selectedColor === color ? 'bg-primary text-white' : ''}`}>{color}</p>
                        </label>
                    ))}
                </div>

        <div className="mt-10 flex flex-col items-center justify-between space-y-4 border-t border-b py-4 sm:flex-row sm:space-y-0">
          <div className="flex items-end">
            <h1 className="text-3xl font-bold">$15.990</h1>
           {/*  <span className="text-base">/month</span> */}
          </div>

          <button type="button" className="inline-flex items-center justify-center rounded-md border-2 border-transparent bg-primary hover:bg-secondary hover:text-primary bg-none px-12 py-3 text-center text-base font-bold text-secondary transition-all duration-200 ease-in-out focus:shadow hover:bg-gray-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="shrink-0 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Agregar al carrito
          </button>
        </div>

        <ul className="mt-8 space-y-2">
          <li className="flex items-center text-left text-sm font-medium text-gray-600">
            <svg className="mr-2 block h-5 w-5 align-middle text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className=""></path>
            </svg>
            Envio Gratuito
          </li>

          <li className="flex items-center text-left text-sm font-medium text-gray-600">
            <svg className="mr-2 block h-5 w-5 align-middle text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" className=""></path>
            </svg>
            Pago con Webpay
          </li>
        </ul>
      </div>

      <div className="lg:col-span-3">
        <div className="border-b border-gray-300">
          <nav className="flex gap-4">
            <a href="#" title="" className="border-b-2 border-gray-900 py-4 text-sm font-medium text-gray-900 hover:border-gray-400 hover:text-gray-800"> Descripción </a>

            <a href="#" title="" className="inline-flex items-center border-b-2 border-transparent py-4 text-sm font-medium text-gray-600">
              Reseñas
              <span className="ml-2 block rounded-full bg-gray-500 px-2 py-px text-xs font-bold text-gray-100"> 1,209 </span>
            </a>
          </nav>
        </div>

        <div className="mt-8 flow-root sm:mt-12">
          <h1 className="text-3xl font-bold">Lorem ipsum</h1>
          <p className="mt-4">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia accusantium nesciunt fuga.</p>
          <h1 className="mt-8 text-3xl font-bold">Lorem ipsum dolor</h1>
          <p className="mt-4">Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio numquam enim facere.</p>
          <p className="mt-4">Amet consectetur adipisicing elit. Optio numquam enim facere. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dolore rerum nostrum eius facere, ad neque.</p>
        </div>
      </div>
    </div>
  </div>
</section>


    );
};

export default ProductView03;