"use client";
import { useState, useEffect } from "react";
import Loader from "@/components/common/Loader";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const Token = getCookie("ClientTokenAuth");

  useEffect(() => {
    // Simular una carga inicial con un delay de 1 segundo
    setTimeout(() => setLoading(false), 1000);
  }, []);

  useEffect(() => {
    const checkCookie = () => {
      const token = getCookie("ClientTokenAuth");
      if (!token) {
        router.push("/tienda"); // Redirigir al home si no hay token
      }
    };

    checkCookie();

    // Configurar un intervalo para verificar la cookie cada 45 minutos
    const intervalId = setInterval(checkCookie, 2700000); // 45 minutos

    // Limpiar el intervalo al desmontar el componente
    return () => clearInterval(intervalId);
  }, [router]);

  // Mostrar loader mientras se verifica el token
  if (loading) {
    return <Loader />;
  }

  // Si no hay token, redirigir al home
  if (!Token) {
    router.push("/tienda");
    return <Loader />; // Puedes mostrar un loader mientras se redirige
  }

  // Si hay token y no se está cargando, mostrar el contenido
  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      <div className="flex overflow-hidden">
        <div className="mx-auto w-full">{children}</div>
      </div>
    </div>
  );
}
