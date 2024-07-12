"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { getCookie } from "cookies-next";

const OptionsComponent = () => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = getCookie("AdminTokenAuth");
  const fetchOptions = async () => {
    try {
      const response = await axios.get(
        `https://pixelup-customer-backoffice-api-git-de-80bd27-pixelups-projects.vercel.app/api/v1/options?pageNumber=1&pageSize=50`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("response.data asdasd", response.data);
      setOptions(response.data.options);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // El array vacío asegura que el efecto solo se ejecute una vez, al montar el componente.

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <div>
        {/* Aquí puedes renderizar tus datos en una tabla u otro componente */}
        {options.map((option: any) => (
          <div
            key={option.id}
            className="p-2 border"
          >
            <p>{option.id}</p>
            <p>{option.code}</p>
            <p>{option.description}</p>
            <p>{option.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OptionsComponent;
