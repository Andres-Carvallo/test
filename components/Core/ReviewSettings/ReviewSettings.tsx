"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { getCookie } from "cookies-next";
import Loader from "@/components/common/Loader";

interface ReviewSettingsProps {
  // Props si las necesitas
}

const ReviewSettings: React.FC<ReviewSettingsProps> = () => {
  const [isReviewEnabled, setIsReviewEnabled] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [hasValidPlan, setHasValidPlan] = useState<boolean>(false);
  const [hasIniciaPlan, setHasIniciaPlan] = useState<boolean>(false);
  const [currentPlan, setCurrentPlan] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const token = getCookie("AdminTokenAuth");

  // Verificar el plan de suscripción
  const checkSubscriptionPlan = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/subscriptions?pageNumber=1&pageSize=50&siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Buscar suscripciones activas
      const activeSubscriptions = response.data.subscriptions.filter(
        (sub: any) => sub.statusCode === "ACTIVE" || sub.statusCode === "EXPIRED"
      );

      if (activeSubscriptions.length > 0) {
        const subscription = activeSubscriptions[0];
        const planName = subscription.name.toLowerCase();
        
        // Determinar el plan actual
        let planDisplayName = "Plan Inicia";
        if (planName.includes("pro")) {
          planDisplayName = "Plan PRO";
        } else if (planName.includes("avanzado")) {
          planDisplayName = "Plan Avanzado";
        } else if (planName.includes("inicia")) {
          planDisplayName = "Plan Inicia";
        } else {
          planDisplayName = subscription.name;
        }

        setCurrentPlan(planDisplayName);

        // Verificar si tiene plan INICIA
        const hasInicia = planName.includes("inicia");
        setHasIniciaPlan(hasInicia);

        // Verificar si tiene un plan válido (superior al "inicia")
        const hasValidPlan = planName.includes("avanzado") || planName.includes("pro");
        setHasValidPlan(hasValidPlan);

        if (hasValidPlan || hasInicia) {
          // Cargar la configuración actual para cualquier plan
          await loadReviewSettings();
          
          // Si tiene plan INICIA, automáticamente deshabilitar y guardar
          if (hasInicia) {
            setIsReviewEnabled(false);
            // Guardar automáticamente la configuración deshabilitada
            await saveReviewSettingsForIniciaPlan();
          }
        }
      } else {
        setCurrentPlan("Sin suscripción activa");
        setHasValidPlan(false);
        setHasIniciaPlan(false);
      }
    } catch (error) {
      console.error("Error verificando plan de suscripción:", error);
      setError("Error al verificar el plan de suscripción");
      setHasValidPlan(false);
      setHasIniciaPlan(false);
    } finally {
      setLoading(false);
    }
  };

  // Cargar configuración actual de reviews
  const loadReviewSettings = async () => {
    try {
      const contentBlockId = process.env.NEXT_PUBLIC_REVIEWSPRODUCTOS_CONTENTBLOCK || "REVIEWSPRODUCTOS";
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/content-blocks/${contentBlockId}?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.contentBlock?.contentText) {
        const reviewConfig = JSON.parse(response.data.contentBlock.contentText);
        setIsReviewEnabled(reviewConfig.enabled);
      } else {
        // Si no existe la configuración, usar valor por defecto (deshabilitado)
        setIsReviewEnabled(false);
      }
    } catch (error) {
      console.error("Error cargando configuración de reviews:", error);
      // Si no existe la configuración, usar valor por defecto
      setIsReviewEnabled(false);
    }
  };

  // Guardar configuración de reviews automáticamente para plan INICIA
  const saveReviewSettingsForIniciaPlan = async () => {
    try {
      const contentBlockId = process.env.NEXT_PUBLIC_REVIEWSPRODUCTOS_CONTENTBLOCK || "REVIEWSPRODUCTOS";
      const reviewConfig = {
        enabled: false, // Siempre false para plan INICIA
        updatedAt: new Date().toISOString(),
        reason: "Plan Inicia - Reviews automáticamente deshabilitados"
      };

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/content-blocks/${contentBlockId}?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
        {
          title: "reviews-productos",
          contentText: JSON.stringify(reviewConfig),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        console.log("Reviews automáticamente deshabilitados para plan INICIA");
      }
    } catch (error) {
      console.error("Error guardando configuración automática para plan INICIA:", error);
    }
  };

  // Guardar configuración de reviews
  const saveReviewSettings = async () => {
    if (!hasValidPlan) {
      setError("No tienes un plan válido para acceder a esta funcionalidad");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const contentBlockId = process.env.NEXT_PUBLIC_REVIEWSPRODUCTOS_CONTENTBLOCK || "REVIEWSPRODUCTOS";
      const reviewConfig = {
        enabled: isReviewEnabled,
        updatedAt: new Date().toISOString()
      };

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/content-blocks/${contentBlockId}?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
        {
          title: "reviews-productos",
          contentText: JSON.stringify(reviewConfig),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setSuccess(`Reviews de productos ${isReviewEnabled ? 'habilitados' : 'deshabilitados'} correctamente`);
      }
    } catch (error) {
      console.error("Error guardando configuración de reviews:", error);
      setError("Error al guardar la configuración");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    checkSubscriptionPlan();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <Loader />
      </div>
    );
  }

  if (!hasValidPlan && !hasIniciaPlan) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center">
          <div className="mb-4">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Función no disponible
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Tu plan actual ({currentPlan}) no incluye la funcionalidad de gestión de reviews de productos.
          </p>
          <p className="text-sm text-gray-500">
            Para acceder a esta función, necesitas un plan Avanzado o PRO.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Configuración de Reviews de Productos
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Plan actual: {currentPlan}
          </p>
        </div>
        <div className="flex items-center">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            hasIniciaPlan 
              ? 'bg-yellow-100 text-yellow-800' 
              : 'bg-green-100 text-green-800'
          }`}>
            {hasIniciaPlan ? 'Limitado' : 'Disponible'}
          </span>
        </div>
      </div>

      {/* Mensaje de restricción para plan Inicia */}
      {hasIniciaPlan && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Configuración de Reviews - Plan Inicia
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>La configuración de reviews de productos no está disponible para el plan Inicia.</p>
                <p className="mt-1">
                  Para habilitar/deshabilitar reviews, necesitas actualizar tu suscripción a un plan Avanzado o PRO.
                </p>
                <p className="mt-2 font-medium">
                  ✅ Los reviews han sido automáticamente deshabilitados y guardados en la configuración.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={`space-y-6 ${hasIniciaPlan ? 'opacity-50 pointer-events-none' : ''}`}>
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex-1">
            <h4 className="text-sm font-medium text-gray-900">
              Habilitar Reviews de Productos
            </h4>
            <p className="text-sm text-gray-500 mt-1">
              Permite a los clientes calificar y comentar sobre los productos comprados
            </p>
          </div>
          <div className="flex items-center">
            <button
              type="button"
              disabled={hasIniciaPlan}
              className={`${
                isReviewEnabled
                  ? 'bg-blue-600'
                  : 'bg-gray-200'
              } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                hasIniciaPlan ? 'cursor-not-allowed opacity-50' : ''
              }`}
              role="switch"
              aria-checked={isReviewEnabled}
              onClick={() => !hasIniciaPlan && setIsReviewEnabled(!isReviewEnabled)}
            >
              <span
                aria-hidden="true"
                className={`${
                  isReviewEnabled ? 'translate-x-5' : 'translate-x-0'
                } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
              />
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-green-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-800">{success}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          {hasIniciaPlan ? (
            <button
              type="button"
              disabled
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-gray-400 bg-gray-300 cursor-not-allowed"
            >
              Guardar Configuración
            </button>
          ) : (
            <button
              type="button"
              onClick={saveReviewSettings}
              disabled={saving}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Guardando...
                </>
              ) : (
                'Guardar Configuración'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewSettings; 