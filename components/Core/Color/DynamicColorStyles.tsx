"use client";
import { useColor } from "@/context/ColorContext";
import { useEffect } from "react";

const DynamicColorStyles: React.FC = () => {
  const { currentColor, getColorValues, currentRadius, radiusOptions } = useColor();

  useEffect(() => {
    const colorValues = getColorValues(currentColor);
    if (!colorValues) return;

    // Aplicar las variables CSS dinámicamente
    const root = document.documentElement;
    
    // Variables para el tema claro y oscuro
    root.style.setProperty('--dynamic-primary', colorValues.primary);
    root.style.setProperty('--dynamic-secondary', colorValues.secondary);
    root.style.setProperty('--dynamic-accent', colorValues.accent);

  }, [currentColor, getColorValues]);

  useEffect(() => {
    // Aplicar el border-radius dinámicamente
    const root = document.documentElement;
    const radiusOption = radiusOptions.find(option => option.value === currentRadius);
    
    if (radiusOption) {
      root.style.setProperty('--dynamic-radius', radiusOption.radius);
    }
  }, [currentRadius, radiusOptions]);

  return null; // Este componente no renderiza nada visual
};

export default DynamicColorStyles; 