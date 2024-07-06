"use client";
import { useState, useEffect } from "react";
import Loader from "@/components/common/Loader";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/HeaderDashboard";
import { redirect } from "next/navigation";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import Sidebarprueba from "@/components/sidebarprueba";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);

  const router = useRouter();
  const Token = getCookie("AdminTokenAuth");

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  useEffect(() => {
    const checkCookie = () => {
      const token = getCookie("AdminTokenAuth");
      if (!token) {
        router.push("/admin/login"); // Redirigir al home si no hay token
      } else {
        setLoading(false);
      }
    };

    checkCookie();

    const intervalDuration = parseInt(
      process.env.NEXT_PUBLIC_INTERVAL_DURATION || "10800000",
      10
    );

    const intervalId = setInterval(checkCookie, intervalDuration);

    // Limpiar el intervalo al desmontar el componente
    return () => clearInterval(intervalId);
  }, [router]);

  if (loading) {
    return <Loader />;
  }

  if (!Token) {
    router.push("/admin/login");
  }

  if (Token) {
    return (
      <div className="dark:bg-boxdark-2 dark:text-bodydark">
        {loading ? (
          <Loader />
        ) : (
          <div className="flex h-screen overflow-hidden">
            {/* <!-- ===== Sidebar Start ===== --> */}

            <Sidebar
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            />

            {/* <Sidebarprueba/> */}
            {/* <!-- ===== Sidebar End ===== --> */}

            {/* <!-- ===== Content Area Start ===== --> */}
            <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden z-20">
              {/* <!-- ===== Header Start ===== --> */}
              <Header
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
              />
              {/* <!-- ===== Header End ===== --> */}

              {/* <!-- ===== Main Content Start ===== --> */}

              <div className="mx-auto p-6 w-full -z-1 bg-gray-50">
                {children}{" "}
              </div>

              {/* <!-- ===== Main Content End ===== --> */}
            </div>
            {/* <!-- ===== Content Area End ===== --> */}
          </div>
        )}
      </div>
    );
  } else {
    router.push("/admin/login");
  }
}
