import { useState, useEffect } from "react";
import axios from "axios";
import { getCookie } from "cookies-next";

interface SubscriptionPlan {
  hasAdvancedOrProPlan: boolean;
  currentPlan: string;
  loading: boolean;
  error: string | null;
}

export const useSubscriptionPlan = (): SubscriptionPlan => {
  const [hasAdvancedOrProPlan, setHasAdvancedOrProPlan] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkSubscriptionPlan = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = getCookie("AdminTokenAuth");
        
        // Usar Promise.race para timeout de 5 segundos
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Timeout")), 5000)
        );

        const fetchPromise = axios.get(
          `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/subscriptions?pageNumber=1&pageSize=50&siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const response = await Promise.race([fetchPromise, timeoutPromise]) as any;

        // Buscar suscripciones activas
        const activeSubscriptions = response.data.subscriptions.filter(
          (sub: any) => sub.statusCode === "ACTIVE" || sub.statusCode === "EXPIRED"
        );

        // Verificar si tiene plan Avanzado o PRO
        const advancedOrProSubscription = activeSubscriptions.find((sub: any) =>
          sub.name.toLowerCase().includes("avanzado") || sub.name.toLowerCase().includes("pro")
        );

        // Determinar el plan actual
        let planName = "Sin suscripción activa";
        if (activeSubscriptions.length > 0) {
          const subscription = activeSubscriptions[0]; // Tomar la primera suscripción activa
          if (subscription.name.toLowerCase().includes("pro")) {
            planName = "Plan PRO";
          } else if (subscription.name.toLowerCase().includes("avanzado")) {
            planName = "Plan Avanzado";
          } else if (subscription.name.toLowerCase().includes("inicia")) {
            planName = "Plan Inicia";
          } else {
            planName = subscription.name;
          }
        }

        setHasAdvancedOrProPlan(!!advancedOrProSubscription);
        setCurrentPlan(planName);
      } catch (error) {
        console.error("Error verificando plan de suscripción:", error);
        setError("Error al verificar plan");
        setHasAdvancedOrProPlan(false);
        setCurrentPlan("Error al verificar plan");
      } finally {
        setLoading(false);
      }
    };

    checkSubscriptionPlan();
  }, []);

  return {
    hasAdvancedOrProPlan,
    currentPlan,
    loading,
    error,
  };
}; 