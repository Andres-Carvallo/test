/* eslint-disable @next/next/no-img-element */
import Breadcrumb from "@/components/Core/Breadcrumbs/Breadcrumb";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | PixelUP",
  description: "Dashboard Pixelup",
};
const inicioDashboard = () => {
  const features = [
    {
      icono: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
</svg>
`,
      title: "Administra tus contenidos",
      description:
        "Edita los contenidos de tu sitio de manera simple y rápida en la sección Content Block.",
    },
    {
      icono: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
</svg>
`,
      title: "Información de visitas",
      description:
        "Encuentra información de tus visitantes, tipo de dispositivos que usan y tiempo promedio de navegación, etc.",
    },
    {
      icono: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605" />
</svg>
`,
      title: "Información de ventas",
      description:
        "Encuentra información de tus ventas y clientes para gestionar tu negocio de manera eficiente.",
    },
    {
      icono: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
</svg>
`,
      title: "Gestiona tu tienda",
      description:
        "Nuestra plataforma es simple e intuitiva y te permite crear y editar productos, categorías y colecciones.",
    },
    {
      icono: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
</svg>`,
      title: "Zonas de envío",
      description: "Define las zonas de envío y sus respectivas tarifas.",
    },
    {
      icono: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z" />
</svg>`,
      title: "Descuentos y promociones",
      description:
        "Programa descuentos, promociones y genera cupones para tus clientes.",
    },
/*     {
      title: "PixelCoins y Referidos",
      description:
        "Encuentra toda la información de tus PixelCoins y Referidos.",
    }, */
    /*     {
      title: "Compra con PixelCoins",
      description: "Compra o canjea con tus PixelCoins diferentes servicios que te ayudarán a impulsar el desarrollo de tu negocio.",
    }, */
  ];

  return (
    <div className=" p-8  max-w-6xl mx-auto mt-2 mb-10">
      <div className="text-center mb-2">
        {/* <div className="mx-auto mb-4 h-24 w-auto bg-gray-300"></div> */}
        <img
    src="https://www.pixelup.cl/images/logo/2.png"  // Reemplaza esto con la ruta a tu imagen
    alt="Pixel Up Logo"  // Puedes cambiar el texto alternativo
    className="mx-auto  h-32 w-auto"
  />
        <h1 className="text-3xl font-bold text-gray-800">
          ¡Bienvenido a Pixel Up!
        </h1>
      </div>
      <p className="text-gray-700 text-lg mb-8 text-center">
        En este administrador tendrás acceso a toda la tecnología y beneficios
        de nuestro Ecosistema Digital.
      </p>

{/*         <div className="lg:hover:scale-105 duration-100 lg:hover:shadow-xl bg-white p-4 rounded-lg shadow text-center">
          <h3 className="text-lg font-medium">Sesiones</h3>
          <p className="text-gray-600 mb-2 text-xs">
          {feature.title}
          </p>
          <p className="text-2xl font-bold">
          {feature.description}
          </p>
        </div> */}

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {features.map((feature, index) => (
    <div
      key={index}
      className={`lg:hover:scale-105 min-h-72 duration-100 lg:hover:shadow-xl bg-white p-4 rounded-lg shadow flex flex-col justify-center items-center text-center`}
    >
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-200 mb-4">
        <div dangerouslySetInnerHTML={{ __html: feature.icono }} className="text-gray-600 w-6 h-6"></div>
      </div>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h2>
      <p className="text-gray-600 text-base">
        {feature.description}
      </p>
    </div>
  ))}
</div>

{/*       <div className="space-y-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`bg-gray-300 p-6 rounded-lg shadow-md flex flex-col md:flex-row items-center ${
              index % 2 === 0 ? "md:flex-row-reverse" : ""
            }`}
          >
            <div className="w-full md:w-1/2 h-64 bg-gray-500"></div>
            <div className="w-full md:w-1/2 p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                {feature.title}
              </h2>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          </div>
        ))}
      </div> */}
      <p className="text-gray-700 text-lg mt-8 text-center">
        Si tienes cualquier duda, necesitas ayuda o tienes un nuevo
        requerimiento para tu empresa escríbenos al correo
        <a
          href="mailto:hola@pixelup.cl"
          className="text-blue-500"
        >
          {" "}
          hola@pixelup.cl{" "}
        </a>
        o
        <a
          href="mailto:soporte@pixelup.cl"
          className="text-blue-500"
        >
          {" "}
          soporte@pixelup.cl
        </a>
        .
      </p>
      <p className="text-gray-700 text-lg mt-4 text-center">
        Esperamos que nuestro Ecosistema Digital se transforme en una gran
        herramienta para tu negocio.
      </p>
      <p className="text-gray-700 text-lg mt-2 text-center">Equipo Pixel Up Chile.</p>
    </div>
  );
};

export default inicioDashboard;
