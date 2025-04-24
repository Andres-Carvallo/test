<div
id="serviciosDestacados"
className="py-10 pb-20 overflow-x-hidden"
>
<div className="max-w-full mx-auto">
  {/* Dividimos explícitamente en dos filas */}
  <div className="flex flex-col">
    {/* Primera fila de imágenes */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-0 w-full">
      {serviciosData
        .filter((s) => s.destacado)
        .slice(0, 2)
        .map((servicio, index) => (
          <AnimateOnScroll
            key={servicio.id}
            animation={index === 0 ? "fade-in-left" : "fade-in-right"}
            className={`relative overflow-hidden cursor-pointer transition-all duration-300 ${
              servicioExpandido === servicio.id
                ? "ring-4 ring-lime-500 z-10"
                : "hover:brightness-110"
            }`}
            style={{ height: "calc((100vh - 140px) / 2)" }}
          >
            <div
              className="h-full w-full"
              onClick={() => toggleServicio(servicio.id)}
            >
              {/* Indicador de clic */}
              <div className="absolute top-4 right-4 flex items-center bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full text-white/90 text-sm z-20 transition-all duration-300 hover:bg-black/70 gap-2">
                {servicioExpandido === servicio.id
                  ? "Cerrar"
                  : "Saber más"}
                {servicioExpandido === servicio.id ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-x"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-move-right-icon lucide-move-right"
                  >
                    <path d="M18 8L22 12L18 16" />
                    <path d="M2 12H22" />
                  </svg>
                )}
              </div>
              <img
                src={servicio.imagen}
                alt={servicio.titulo}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-full p-8 text-white">
                <h3 className="text-2xl font-bold mb-2 font-lilita-one">
                  {servicio.titulo}
                </h3>
                <p className="text-white/90 line-clamp-2 text-sm">
                  {servicio.descripcion}
                </p>
              </div>
            </div>
          </AnimateOnScroll>
        ))}
    </div>

    {/* Panel de información para las primeras dos imágenes */}
    {servicioExpandido !== null && servicioExpandido <= 2 && (
      <div
        id={`panel-servicio-${servicioExpandido}`}
        className="w-full bg-white p-8 overflow-hidden transition-all duration-500 transform origin-top border-t-4 border-lime-500"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <h3 className="text-2xl font-bold text-green-700 font-lilita-one">
                {serviciosData.find((s) => s.id === servicioExpandido)
                  ?.titulo || ""}
              </h3>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setServicioExpandido(null);
              }}
              className="text-gray-700 hover:bg-lime-500 hover:text-white transition-all duration-300 bg-gray-100 p-2 rounded-full"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <p className="text-gray-700 mb-6 max-w-4xl">
            {serviciosData.find((s) => s.id === servicioExpandido)
              ?.descripcion || ""}
          </p>

          {serviciosData.find((s) => s.id === servicioExpandido)
            ?.subservicios && (
            <div className="mt-6">
              <h4 className="text-lg font-semibold text-green-600 mb-4">
                Servicios incluidos:
              </h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {serviciosData
                  .find((s) => s.id === servicioExpandido)
                  ?.subservicios?.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start"
                    >
                      <span className="text-lime-500 mr-2 text-xl">
                        •
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
              </ul>
            </div>
          )}

          <div className="mt-8 flex justify-end">
            <button className="px-6 py-3 bg-lime-600 hover:bg-lime-700 text-white rounded font-medium transition-colors shadow-md">
              Contáctanos
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Segunda fila de imágenes */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-0 w-full">
      {serviciosData
        .filter((s) => s.destacado)
        .slice(2, 4)
        .map((servicio, index) => (
          <AnimateOnScroll
            key={servicio.id}
            animation={index === 0 ? "fade-in-left" : "fade-in-right"}
            className={`relative overflow-hidden cursor-pointer transition-all duration-300 ${
              servicioExpandido === servicio.id
                ? "ring-4 ring-lime-500 z-10"
                : "hover:brightness-110"
            }`}
            style={{ height: "calc((100vh - 80px) / 2)" }}
          >
            <div
              className="h-full w-full"
              onClick={() => toggleServicio(servicio.id)}
            >
              {/* Indicador de clic */}
              <div className="absolute top-4 right-4 flex items-center bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full text-white/90 text-sm z-20 transition-all duration-300 hover:bg-black/70 gap-2">
                {servicioExpandido === servicio.id
                  ? "Cerrar"
                  : "Saber más"}
                {servicioExpandido === servicio.id ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-x"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-move-right-icon lucide-move-right"
                  >
                    <path d="M18 8L22 12L18 16" />
                    <path d="M2 12H22" />
                  </svg>
                )}
              </div>
              <img
                src={servicio.imagen}
                alt={servicio.titulo}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-full p-8 text-white">
                <h3 className="text-2xl font-bold mb-2 font-lilita-one">
                  {servicio.titulo}
                </h3>
                <p className="text-white/90 line-clamp-2 text-sm">
                  {servicio.descripcion}
                </p>
              </div>
            </div>
          </AnimateOnScroll>
        ))}
    </div>

    {/* Panel de información para las segundas dos imágenes */}
    {servicioExpandido !== null && servicioExpandido > 2 && (
      <div
        id={`panel-servicio-${servicioExpandido}`}
        className="w-full bg-white p-8 overflow-hidden transition-all duration-500 transform origin-top border-t-4 border-lime-500"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <h3 className="text-2xl font-bold text-green-700 font-lilita-one">
                {serviciosData.find((s) => s.id === servicioExpandido)
                  ?.titulo || ""}
              </h3>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setServicioExpandido(null);
              }}
              className="text-gray-700 hover:bg-lime-500 hover:text-white transition-all duration-300 bg-gray-100 p-2 rounded-full"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <p className="text-gray-700 mb-6 max-w-4xl">
            {serviciosData.find((s) => s.id === servicioExpandido)
              ?.descripcion || ""}
          </p>

          {serviciosData.find((s) => s.id === servicioExpandido)
            ?.subservicios && (
            <div className="mt-6">
              <h4 className="text-lg font-semibold text-green-600 mb-4">
                Servicios incluidos:
              </h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {serviciosData
                  .find((s) => s.id === servicioExpandido)
                  ?.subservicios?.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start"
                    >
                      <span className="text-lime-500 mr-2 text-xl">
                        •
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
              </ul>
            </div>
          )}

          <div className="mt-8 flex justify-end">
            <button className="px-6 py-3 bg-lime-600 hover:bg-lime-700 text-white rounded font-medium transition-colors shadow-md">
              Contáctanos
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
            {/* Botón para mostrar todos los servicios */}
            <div className="text-center mt-16 px-4">
              <button
                onClick={toggleCarteraCompleta}
                className="inline-block px-8 py-3 bg-lime-600 hover:bg-lime-700 text-white rounded font-semibold transition-all shadow-md hover:shadow-lg"
              >
                {mostrarCarteraCompleta
                  ? "Ocultar Servicios"
                  : "Descubre Todos los Servicios"}
              </button>
            </div>