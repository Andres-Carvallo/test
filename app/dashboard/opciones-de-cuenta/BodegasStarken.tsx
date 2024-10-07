import React, { useEffect, useState } from "react";
import axios from "axios";

interface Commune {
  id: string;
  name: string;
  regionId: string;
}

interface Region {
  id: string;
  name: string;
}

interface Bodega {
  id: string;
  name: string;
  description: string;
  commune: Commune;
  alternativeCommuneId?: string;
  statusCode: string;
}

interface BodegasStarkenProps {
  token: string;
}

const BodegasStarken = ({ token }: BodegasStarkenProps) => {
  const [bodegas, setBodegas] = useState<Bodega[]>([]);
  const [selectedBodegaId, setSelectedBodegaId] = useState<string | null>(null);
  const [selectedBodega, setSelectedBodega] = useState<Bodega | null>(null);
  const [loading, setLoading] = useState(true);
  const [regions, setRegions] = useState<Region[]>([]);
  const [communes, setCommunes] = useState<Commune[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [selectedCommune, setSelectedCommune] = useState<string>("");

  const [alternativeRegion, setAlternativeRegion] = useState<string>("");
  const [alternativeCommunes, setAlternativeCommunes] = useState<Commune[]>([]);
  const [alternativeCommuneId, setAlternativeCommuneId] = useState<string>("");

  useEffect(() => {
    const fetchBodegas = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/warehouses?pageNumber=1&pageSize=50&siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setBodegas(response.data.warehouses);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching bodegas", error);
        setLoading(false);
      }
    };

    const fetchRegions = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/countries/CL/regions?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`
        );
        setRegions(response.data.regions);
      } catch (error) {
        console.error("Error fetching regions", error);
      }
    };

    fetchBodegas();
    fetchRegions();
  }, [token]);

  const fetchCommunes = async (regionId: string, forAlternative = false) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/countries/CL/regions/${regionId}/communes?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`
      );
      if (forAlternative) {
        setAlternativeCommunes(response.data.communes);
      } else {
        setCommunes(response.data.communes);
      }
    } catch (error) {
      console.error("Error fetching communes", error);
    }
  };

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const regionId = e.target.value;
    setSelectedRegion(regionId);
    setSelectedCommune(""); // Reinicia la comuna cuando se selecciona una nueva región
    if (regionId) {
      fetchCommunes(regionId); // Fetch de las comunas para la región seleccionada
    }
  };

  const handleCommuneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCommune(e.target.value);
  };

  const handleAlternativeRegionChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const regionId = e.target.value;
    setAlternativeRegion(regionId);
    setAlternativeCommuneId(""); // Reinicia la comuna alternativa cuando se selecciona una nueva región
    if (regionId) {
      fetchCommunes(regionId, true); // Fetch de comunas para la región alternativa
    }
  };

  const handleAlternativeCommuneChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setAlternativeCommuneId(e.target.value);
  };

  const fetchBodegaDetail = async (id: string) => {
    setSelectedBodegaId(id);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/warehouses/${id}?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSelectedBodega(response.data.warehouse);
      setSelectedRegion(response.data.warehouse.commune.regionId); // Setea la región actual
      fetchCommunes(response.data.warehouse.commune.regionId); // Fetch de comunas para la región actual
    } catch (error) {
      console.error("Error fetching bodega details", error);
    }
  };

  const handleSaveClick = async () => {
    if (!selectedBodega) return;

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/warehouses/${selectedBodega.id}?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
        {
          name: selectedBodega.name,
          description: selectedBodega.description,
          statusCode: selectedBodega.statusCode,
          communeId: selectedCommune || selectedBodega.commune.id, // Se envía la comuna actual o la seleccionada
          alternativeCommuneId: alternativeCommuneId || undefined, // Si hay comuna alternativa seleccionada
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Bodega actualizada con éxito");
    } catch (error) {
      console.error("Error updating bodega", error);
      alert("Error al actualizar la bodega");
    }
  };

  if (loading) {
    return <div>Cargando bodegas...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Bodegas Starken</h1>
      <ul>
        {bodegas.map((bodega) => (
          <li
            key={bodega.id}
            className={`mb-4 border-b pb-2 cursor-pointer ${
              selectedBodegaId === bodega.id ? "bg-blue-100" : ""
            }`}
            onClick={() => fetchBodegaDetail(bodega.id)}
          >
            <h2 className="text-lg font-semibold">{bodega.name}</h2>
            <p>{bodega.description}</p>
          </li>
        ))}
      </ul>

      {selectedBodega && (
        <div className="mt-8 p-4 border-t">
          <h2 className="text-xl font-bold mb-4">Editar Bodega</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-md font-medium text-gray-700">
                Nombre
              </label>
              <input
                type="text"
                value={selectedBodega.name}
                onChange={(e) =>
                  setSelectedBodega({ ...selectedBodega, name: e.target.value })
                }
                className="block w-full rounded bg-gray-100 border-dark py-2 px-3 mt-2"
              />
            </div>

            <div>
              <label className="block text-md font-medium text-gray-700">
                Descripción
              </label>
              <input
                type="text"
                value={selectedBodega.description}
                onChange={(e) =>
                  setSelectedBodega({
                    ...selectedBodega,
                    description: e.target.value,
                  })
                }
                className="block w-full rounded bg-gray-100 border-dark py-2 px-3 mt-2"
              />
            </div>

            {/* Modificación de la comuna actual */}
            <div>
              <label className="block text-md font-medium text-gray-700">
                Región para Comuna Actual
              </label>
              <select
                value={selectedRegion}
                onChange={handleRegionChange}
                className="block w-full rounded bg-gray-100 border-dark py-2 px-3 mt-2"
              >
                <option value="">Seleccionar Región</option>
                {regions.map((region) => (
                  <option
                    key={region.id}
                    value={region.id}
                  >
                    {region.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-md font-medium text-gray-700">
                Comuna Actual
              </label>
              <select
                value={selectedCommune}
                onChange={handleCommuneChange}
                className="block w-full rounded bg-gray-100 border-dark py-2 px-3 mt-2"
                disabled={!selectedRegion} // Solo habilitar si hay una región seleccionada
              >
                <option value="">Seleccionar Comuna</option>
                {communes.map((commune) => (
                  <option
                    key={commune.id}
                    value={commune.id}
                  >
                    {commune.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Modificación de la comuna alternativa */}
            <div>
              <label className="block text-md font-medium text-gray-700">
                Región para Comuna Alternativa
              </label>
              <select
                value={alternativeRegion}
                onChange={handleAlternativeRegionChange}
                className="block w-full rounded bg-gray-100 border-dark py-2 px-3 mt-2"
              >
                <option value="">Seleccionar Región</option>
                {regions.map((region) => (
                  <option
                    key={region.id}
                    value={region.id}
                  >
                    {region.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-md font-medium text-gray-700">
                Comuna Alternativa
              </label>
              <select
                value={alternativeCommuneId}
                onChange={handleAlternativeCommuneChange}
                className="block w-full rounded bg-gray-100 border-dark py-2 px-3 mt-2"
                disabled={!alternativeRegion} // Solo habilitar si hay una región seleccionada
              >
                <option value="">Seleccionar Comuna</option>
                {alternativeCommunes.map((commune) => (
                  <option
                    key={commune.id}
                    value={commune.id}
                  >
                    {commune.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleSaveClick}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Guardar Cambios
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BodegasStarken;
