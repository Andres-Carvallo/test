"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { getCookie, setCookie } from "cookies-next";
import toast from "react-hot-toast";

const Mantenimiento: React.FC = () => {
  const [maintenanceMode, setMaintenanceMode] = useState<{
    id: string;
    contentText: string | null;
  } | null>(null);
  const [enableMaintenance, setEnableMaintenance] = useState<boolean>(false);

  const token = getCookie("AdminTokenAuth");

  useEffect(() => {
    fetchMaintenanceMode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchMaintenanceMode = async () => {
    try {
      const contentBlockId = process.env.NEXT_PUBLIC_MANTENIMIENTO_CONTENTBLOCK;
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/content-blocks/${contentBlockId}?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data.contentBlock;
      const isEnabled = data.contentText === "1";
      
      // Actualizar la cookie al cargar el estado inicial
      setCookie('maintenance_mode', isEnabled ? '1' : '0', {
        maxAge: 30 * 24 * 60 * 60, // 30 días
        path: '/',
      });

      setEnableMaintenance(isEnabled);
      setMaintenanceMode(data);
    } catch (error) {
      console.error("Error al obtener la configuración de mantenimiento:", error);
      toast.error("Error al obtener la configuración de mantenimiento.");
    }
  };

  const handleToggleChange = async (checked: boolean) => {
    try {
      const contentBlockId = process.env.NEXT_PUBLIC_MANTENIMIENTO_CONTENTBLOCK;
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/content-blocks/${contentBlockId}?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
        {
          title: "maintenance",
          contentText: checked ? "1" : "0",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Actualizar la cookie con el nuevo valor
      setCookie('maintenance_mode', checked ? '1' : '0', {
        maxAge: 30 * 24 * 60 * 60, // 30 días
        path: '/',
      });

      setEnableMaintenance(checked);
      toast.success("Configuración de mantenimiento actualizada exitosamente.");
      
      // Recargar la página después de un breve retraso
      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } catch (error) {
      console.error("Error al actualizar la configuración de mantenimiento:", error);
      toast.error("Error al actualizar la configuración de mantenimiento.");
    }
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Configuración del Modo Mantenimiento
      </h2>
      {maintenanceMode ? (
        <div className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between min-h-[2rem]">
                <label className="text-lg font-medium text-gray-700">
                  Modo Mantenimiento
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enableMaintenance}
                    onChange={(e) => handleToggleChange(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}
    </div>
  );
};

export default Mantenimiento;
