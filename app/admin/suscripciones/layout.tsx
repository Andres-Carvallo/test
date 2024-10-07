"use client";
import { useEffect, useState } from "react";
import { getCookie, deleteCookie } from "cookies-next";
import { useRouter, usePathname } from "next/navigation";
import { obtenerUsuarioPorID } from "@/app/utils/obtenerUsuarioID";
import { jwtDecode } from "jwt-decode";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    deleteCookie("AdminTokenAuth");
    window.location.href = "/";
  };

  const checkCookie = async () => {
    const token = getCookie("AdminTokenAuth")?.toString();

    if (!token) {
      router.push("/admin/login");
    } else {
      try {
        const decodedToken: { sub: string } = jwtDecode(token);
        const userId = decodedToken.sub;
        const userData = await obtenerUsuarioPorID(userId, token);

        if (userData.user) {
          setLoading(false); // El usuario es válido, dejamos de mostrar el Loader
        } else {
          throw new Error("User data not found");
        }
      } catch (error) {
        console.error("Error al obtener el usuario o token inválido: ", error);
        handleLogout();
      }
    }
  };

  useEffect(() => {
    checkCookie(); // Verificar cookie al cargar el componente

    const intervalDuration = parseInt(
      process.env.NEXT_PUBLIC_INTERVAL_DURATION || "6000000",
      10
    );

    const intervalId = setInterval(checkCookie, intervalDuration);

    // Limpiar el intervalo al desmontar el componente
    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    checkCookie(); // Verificar cookie en cada cambio de ruta
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <>
      <div>{children}</div>
    </>
  );
}
