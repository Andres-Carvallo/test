"use client";

import React, { Suspense } from "react";
import { HomeConfig } from "@/app/utils/homeConfig";
import Banner from "@/components/PIXELUP/Skeleton/Banner";
import { useDynamicComponents } from "@/hooks/useDynamicComponents";

interface ClientHomeComponentsProps {
  config: HomeConfig;
}

export default function ClientHomeComponents({
  config,
}: ClientHomeComponentsProps) {
  const { renderComponent, getComponentById } = useDynamicComponents({
    page: 'home',
    type: 'front'
  });

  const renderComponentWithProps = (componentId: string) => {
    const component = getComponentById(componentId);
    const props = component?.props || {};
    
    return (
      <Suspense
        key={componentId}
        fallback={<Banner />}
      >
        {renderComponent(componentId, props)}
      </Suspense>
    );
  };

  // Renderizar componentes en el orden especificado
  return (
    <>
      {config.order.map((componentId) => {
        if (config.visibleComponents.includes(componentId)) {
          return renderComponentWithProps(componentId);
        }
        return null;
      })}
    </>
  );
}
