'use client';
import React, { useState } from 'react';
import Modal from './Modal'; // Asegúrate de que la ruta sea correcta

interface Producto {
  id: number;
  nombre: string;
  imagen: string;
  fechaCompra: string;
}

const productos: Producto[] = [
  {
    id: 1,
    nombre: 'test 1',
    imagen: 'https://www.betasnow.cl/cdn/shop/files/POLERONHUFGRIFFITHHOODEDFLEECEBLUENIGHT_720x.jpg?v=1717540373',
    fechaCompra: '27 de mar.',
  },
  {
    id: 2,
    nombre: 'test 2',
    imagen: 'https://www.betasnow.cl/cdn/shop/files/POLERONHUFGRIFFITHHOODEDFLEECEBLUENIGHT_720x.jpg?v=1717540373',
    fechaCompra: '15 de may.',
  },
  {
    id: 3,
    nombre: 'test 3',
    imagen: 'https://www.betasnow.cl/cdn/shop/files/POLERONHUFGRIFFITHHOODEDFLEECEBLUENIGHT_720x.jpg?v=1717540373',
    fechaCompra: '12 de may.',
  },
  {
    id: 4,
    nombre: 'test 4',
    imagen: 'https://www.betasnow.cl/cdn/shop/files/POLERONHUFGRIFFITHHOODEDFLEECEBLUENIGHT_720x.jpg?v=1717540373',
    fechaCompra: '05 de jun.',
  },
  {
    id: 5,
    nombre: 'test 5',
    imagen: 'https://www.betasnow.cl/cdn/shop/files/POLERONHUFGRIFFITHHOODEDFLEECEBLUENIGHT_720x.jpg?v=1717540373',
    fechaCompra: '15 de may.',
  },
];

const OpinionesPendientes: React.FC = () => {
  const [calificaciones, setCalificaciones] = useState<{ [key: number]: number }>({});
  const [hover, setHover] = useState<{ [key: number]: number }>({});
  const [comentarios, setComentarios] = useState<{ [key: number]: string }>({});
  const [mostrarComentario, setMostrarComentario] = useState<{ [key: number]: boolean }>({});
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalMensaje, setModalMensaje] = useState<string>('');

  const handleMouseEnter = (productoId: number, estrella: number) => {
    setHover((prev) => ({
      ...prev,
      [productoId]: estrella,
    }));
  };

  const handleMouseLeave = (productoId: number) => {
    setHover((prev) => ({
      ...prev,
      [productoId]: 0,
    }));
  };

  const handleClick = (productoId: number, estrella: number) => {
    setCalificaciones((prev) => ({
      ...prev,
      [productoId]: estrella,
    }));
    setMostrarComentario((prev) => ({
      ...prev,
      [productoId]: true,
    }));
  };

  const handleComentarioChange = (productoId: number, comentario: string) => {
    setComentarios((prev) => ({
      ...prev,
      [productoId]: comentario,
    }));
  };

  const handleCalificar = (productoId: number) => {
    const calificacion = calificaciones[productoId];
    const comentario = comentarios[productoId] || '';
    console.log(`Producto ID: ${productoId}, Calificación: ${calificacion}, Comentario: ${comentario}`);
    setModalMensaje(`Gracias por tu calificación de ${calificacion} estrellas y tu comentario.`);
    setModalVisible(true);
    setMostrarComentario((prev) => ({
      ...prev,
      [productoId]: false,
    }));
    setComentarios((prev) => ({
      ...prev,
      [productoId]: '',
    }));
  };

  return (
    <div className='py-20 bg-gradient-to-r from-primary/90 from-10% via-primary/60 via-30% to-primary/90 to-90%'>
      <div className="shadow bg-white max-w-6xl mx-auto p-4" style={{ borderRadius: 'var(--radius)' }}>
        <div className="flex justify-between items-center mb-4">
        <button 
            onClick={() => window.history.back()} 
            className="mt-2 top-4 left-4 flex items-center px-4 py-2 bg-secondary text-primary hover:text-secondary hover:bg-primary"
            style={{ borderRadius: 'var(--radius)' }}
            >
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth="2" 
                stroke="currentColor" 
                className="w-6 h-6 mr-2"
            >
                <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M15 19l-7-7 7-7" 
                />
            </svg>
            Volver
            </button>
          <h2 className="text-lg font-semibold">Opina y ayuda a más personas</h2>
          <p className="text-m text-gray-700">1 - 5 de 5 opiniones pendientes</p>
          
        </div>
        <div className="bg-white border p-4 shadow-md" style={{ borderRadius: 'var(--radius)' }}>
          {productos.map((producto) => (
            <div key={producto.id} className="flex flex-col items-start border-b border-gray-200 py-4 last:border-0">
              <div className="flex items-center w-full justify-between">
                <div className="flex items-center">
                  <img src={producto.imagen} alt={producto.nombre} className="w-16 h-16 object-cover rounded-md mr-4" />
                  <div>
                    <h3 className="text-md font-medium">{producto.nombre}</h3>
                    <p className="text-sm text-gray-600">Comprado el {producto.fechaCompra}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="flex items-center mr-4">
                    {[...Array(5)].map((_, index) => {
                      const estrella = index + 1;
                      return (
                        <svg
                          key={index}
                          onMouseEnter={() => handleMouseEnter(producto.id, estrella)}
                          onMouseLeave={() => handleMouseLeave(producto.id)}
                          onClick={() => handleClick(producto.id, estrella)}
                          className={`w-7 h-7 cursor-pointer ${
                            (hover[producto.id] || calificaciones[producto.id]) >= estrella ? 'text-yellow-500' : 'text-gray-300'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                        </svg>
                      );
                    })}
                  </div>
                  <p className="text-sm">
                    {calificaciones[producto.id] === 1 ? '' : calificaciones[producto.id] === 5 ? '' : ''}
                  </p>
                </div>
              </div>
              {mostrarComentario[producto.id] && (
                <div className="mt-4 w-full">
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded-md mb-2"
                    placeholder="Escribe un comentario..."
                    value={comentarios[producto.id] || ''}
                    onChange={(e) => handleComentarioChange(producto.id, e.target.value)}
                  />
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
                    onClick={() => handleCalificar(producto.id)}
                  >
                    Calificar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {modalVisible && (
        <Modal mensaje={modalMensaje} onClose={() => setModalVisible(false)} />
      )}
    </div>
  );
};

export default OpinionesPendientes;
