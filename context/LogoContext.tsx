import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { getCookie } from 'cookies-next';

interface LogoContextType {
  logoUrl: string;
  setLogoUrl: (url: string) => void;
  refreshLogo: () => Promise<void>;
}

const LogoContext = createContext<LogoContextType | undefined>(undefined);

export const useLogo = () => {
  const context = useContext(LogoContext);
  if (context === undefined) {
    throw new Error('useLogo debe ser usado dentro de un LogoProvider');
  }
  return context;
};

interface LogoProviderProps {
  children: ReactNode;
}

export const LogoProvider: React.FC<LogoProviderProps> = ({ children }) => {
  const [logoUrl, setLogoUrl] = useState<string>('/logo-w.png');

  const fetchLogo = async () => {
    try {
      const token = getCookie('AdminTokenAuth');
      const bannerId = `${process.env.NEXT_PUBLIC_LOGOEDIT_ID}`;
      const bannerImageId = `${process.env.NEXT_PUBLIC_LOGOEDIT_IMGID}`;

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/banners/${bannerId}/images/${bannerImageId}?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.bannerImage && response.data.bannerImage.mainImage) {
        setLogoUrl(response.data.bannerImage.mainImage.url);
      }
    } catch (error) {
      console.error('Error al obtener el logo:', error);
    }
  };

  useEffect(() => {
    fetchLogo();
  }, []);

  const refreshLogo = async () => {
    await fetchLogo();
  };

  return (
    <LogoContext.Provider value={{ logoUrl, setLogoUrl, refreshLogo }}>
      {children}
    </LogoContext.Provider>
  );
};

export default LogoContext; 