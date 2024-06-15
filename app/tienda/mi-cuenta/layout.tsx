"use client";
import { useState, useEffect } from "react";
import Loader from "@/components/common/Loader";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/HeaderDashboard";
import { redirect } from "next/navigation";
import { getCookie } from "cookies-next";
import Sidebarprueba from "@/components/sidebarprueba";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const Token = getCookie("ClientTokenAuth");

  useEffect(() => {
    if (!Token) {
      redirect("/tienda");
    }
  }, [Token]);

  if (Token) {
    return (
      <div className="dark:bg-boxdark-2 dark:text-bodydark">
        {loading ? (
          <Loader />
        ) : (
          <div className="flex  overflow-hidden">
            <div className="mx-auto w-full">{children} </div>
          </div>
        )}
      </div>
    );
  } else {
    return null;
  }
}
