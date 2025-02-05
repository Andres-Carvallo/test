/* eslint-disable @next/next/no-img-element */
const MaintenancePage = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center">
      <div className="text-center text-white p-8 max-w-lg">
        <img
          src="https://pixelup.cl/pixelup-white.png"
          alt="Ícono de mantenimiento"
          className="w-40 h-40 mx-auto"
        />
        <h1 className="text-4xl font-bold mb-4">Sitio en Mantenimiento</h1>
        <p className="text-lg mb-6">
          Estamos realizando mejoras en nuestro sitio. Volveremos pronto.
        </p>

        {/*         <div className="mb-4 animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto"></div>
         */}
        {/*         <p className="text-lg mb-6">
          Para mas información contacta a <span className="font-bold text-green-500">hola@pixelup.cl</span>
        </p> */}
      </div>
    </div>
  );
};

export default MaintenancePage;
