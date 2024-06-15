/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import { useParams } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import dynamic from "next/dynamic";

type Offer = {
  id: string;
  unitPrice: number;
  startDate: Date;
  endDate: Date;
};
function DetalleOferta() {
  const { id } = useParams();
  const [sku, setSku] = useState<any[]>([]);
  const [currentAttributes, setCurrentAttributes] = useState<
    Record<string, any[]>
  >({});
  const [currentPrices, setCurrentPrices] = useState<
    Record<string, number | null>
  >({});
  const [variationsWithOffers, setVariationsWithOffers] = useState<
    Record<string, boolean>
  >({});
  const [selectedVariation, setSelectedVariation] = useState<any>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [offerToDelete, setOfferToDelete] = useState(null);

  const handleVariationSelect = async (variation: any) => {
    setSelectedVariation(variation);

    await fetchOffersForVariation(id as string, variation.id);
  };
  const handleDeleteOffer = (offerId: any) => {
    setOfferToDelete(offerId);
    setShowModal(true);
  };

  const handleModalConfirm = () => {
    // Eliminar la oferta seleccionada
    // Luego de eliminar la oferta, cerrar el modal
    setShowModal(false);
  };

  const handleModalCancel = () => {
    setShowModal(false);
  };
  useEffect(() => {
    const fetchVariations = async () => {
      try {
        const token = getCookie("AdminTokenAuth");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/products/${id}/skus?statusCode=ACTIVE`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const responseVariations = await response.json();

        if (responseVariations.code === 0) {
          const filteredVariations = responseVariations.skus.filter(
            (variation: any) => !variation.isBaseSku
          );
          const attributesByVariation: Record<string, any[]> = {};
          const pricesByVariation: Record<string, number | null> = {};
          const offersByVariation: Record<string, boolean> = {};

          const fetchTasks = filteredVariations.map(async (variation: any) => {
            const [attributes, price, hasOffer] = await Promise.all([
              fetchAttributesForVariation(id as string, variation.id),
              fetchPriceForVariation(id as string, variation.id),
              fetchHasOfferForVariation(id as string, variation.id),
            ]);
            attributesByVariation[variation.id] = attributes;
            pricesByVariation[variation.id] = price;
            offersByVariation[variation.id] = hasOffer;
          });

          await Promise.all(fetchTasks);
          setCurrentAttributes(attributesByVariation);
          setCurrentPrices(pricesByVariation);
          setVariationsWithOffers(offersByVariation);

          setSku(filteredVariations);
        } else {
          console.error(
            "Error fetching variations:",
            responseVariations.message
          );
        }
      } catch (error) {
        console.error("Error fetching variations:", error);
      }
    };

    fetchVariations();
  }, [id]);

  const fetchOffersForVariation = async (productId: string, skuId: string) => {
    try {
      const token = getCookie("AdminTokenAuth");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/products/${productId}/skus/${skuId}/offers`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (data.code === 0) {
        setOffers(data.skuOffers);
        console.log("Ofertas:", data.skuOffers);
      } else {
        console.error(
          "Error al obtener las ofertas de la variación:",
          data.message
        );
        setOffers([]);
      }
    } catch (error) {
      console.error("Error al obtener las ofertas de la variación:", error);
      setOffers([]);
    }
  };

  const fetchHasOfferForVariation = async (
    productId: string,
    skuId: string
  ): Promise<boolean> => {
    try {
      const token = getCookie("AdminTokenAuth");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/products/${productId}/skus/${skuId}/offers`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      return data.skuOffers && data.skuOffers.length > 0;
    } catch (error) {
      console.error("Error al obtener el skuOffers de la variación:", error);
      return false;
    }
  };

  const fetchPriceForVariation = async (productId: string, skuId: string) => {
    try {
      const token = getCookie("AdminTokenAuth");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/products/${productId}/skus/${skuId}/pricings`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (data.code === 0) {
        return data.skuPricings.length > 0
          ? data.skuPricings[0].unitPrice
          : null;
      } else {
        console.error(
          "Error al obtener el precio de la variación:",
          data.message
        );
        return null;
      }
    } catch (error) {
      console.error("Error al obtener el precio de la variación:", error);
      return null;
    }
  };

  const fetchAttributesForVariation = async (
    productId: string,
    skuId: string
  ) => {
    try {
      const token = getCookie("AdminTokenAuth");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/products/${productId}/skus/${skuId}/attributes`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const responseData = await response.json();
      if (responseData.code === 0) {
        return responseData.skuAttributes.map((skuAttribute: any) => ({
          value: skuAttribute.value,
          label: skuAttribute.attribute.name,
        }));
      } else {
        console.error(
          "Error al obtener los atributos de la variación:",
          responseData.message
        );
        return [];
      }
    } catch (error) {
      console.error("Error al obtener los atributos de la variación:", error);
      return [];
    }
  };
  const formatDateToChileanTime = (isoDateString: string) => {
    const date = new Date(isoDateString);

    // Ajustar la hora a la zona horaria de Chile (GMT-4)
    const timezoneOffset = -4 * 60; // -4 horas en minutos
    const adjustedDate = new Date(date.getTime() + timezoneOffset * 60 * 1000);

    const day = adjustedDate.getDate().toString().padStart(2, "0");
    const month = (adjustedDate.getMonth() + 1).toString().padStart(2, "0"); // Los meses son 0-indexados
    const year = adjustedDate.getFullYear();
    const hours = adjustedDate.getHours().toString().padStart(2, "0");
    const minutes = adjustedDate.getMinutes().toString().padStart(2, "0");

    return `${day}-${month}-${year}`;
  };

  const offer: Offer = {
    id: "123",
    unitPrice: 10.99,
    startDate: new Date(),
    endDate: new Date(),
  };

  return (
    <section>
      <Breadcrumb pageName="Administrar Oferta" />
      <div className="bg-white border dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden max-w-[1500px] mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-center p-4">
          <div className="w-full md:w-2/3 flex flex-col items-center">
            <div className="flex flex-col items-center justify-center text-center text-4xl mt-2 mb-4">
              Prueba
            </div>
            <form className="flex items-center w-full max-w-md mx-auto">
              <label
                htmlFor="simple-search"
                className="sr-only"
              >
                Search
              </label>
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5 text-gray-500 dark:text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  id="simple-search"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Search"
                  required
                />
              </div>
            </form>
          </div>
        </div>

        <div className="overflow-x-auto max-w-[1500px] mx-auto">
          <table className="min-w-full text-sm text-gray-500 dark:text-gray-400 text-center border-collapse">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th className="px-2 py-2">Imagen</th>
                <th className="px-2 py-2">Precio</th>
                <th className="px-2 py-2">Atributos</th>
                <th className="px-2 py-2">Oferta</th>
                <th className="px-2 py-2">Crear/Editar</th>
              </tr>
            </thead>
            <tbody>
              {sku.map((item) => (
                <tr
                  key={item.id}
                  className="dark:border-gray-700"
                >
                  <td className="px-2 py-2 border border-gray-300">
                    <img
                      className="w-14 h-14 object-cover mx-auto"
                      alt={item.name}
                      src={item.mainImageUrl}
                    />
                  </td>
                  <td className="px-2 py-2 border border-gray-300">
                    {currentPrices[item.id]?.toLocaleString("es-CL")
                      ? `$${currentPrices[item.id]?.toLocaleString("es-CL")}`
                      : "N/A"}
                  </td>
                  <td className="px-2 py-2 border border-gray-300 text-center">
                    <div className="current-attributes">
                      {currentAttributes[item.id]?.length ? (
                        currentAttributes[item.id].map(
                          (attribute, attrIndex) => (
                            <div
                              key={attrIndex}
                              className="mt-1 flex flex-wrap justify-center uppercase"
                            >
                              <div className="bg-primary text-secondary px-1 py-0.5 rounded text-xs">
                                {attribute.label}:{" "}
                                <span className="font-bold">
                                  {attribute.value}
                                </span>
                              </div>
                            </div>
                          )
                        )
                      ) : (
                        <span>No hay atributos disponibles</span>
                      )}
                    </div>
                  </td>
                  <td className="px-2 py-2 border border-gray-300">
                    {variationsWithOffers[item.id] ? "Sí" : "No"}
                  </td>
                  <td className="px-2 py-2 border border-gray-300">
                    <div className="flex flex-wrap justify-center gap-4">
                      {variationsWithOffers[item.id] ? (
                        <button
                          onClick={() => handleVariationSelect(item)}
                          className="bg-primary text-white px-1 py-0.5 rounded hover:underline"
                        >
                          Editar
                        </button>
                      ) : null}
                      <button className="bg-green-700 text-white px-1 py-0.5 rounded hover:underline">
                        Crear Oferta
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="w-full">
          {selectedVariation && (
            <div>
              <h2>Ofertas de la variación {selectedVariation.name}</h2>
              <div className="flex flex-wrap justify-center">
                {offers.length ? (
                  offers.map((offer) => (
                    <div
                      key={offer.id}
                      className="offer-card w-fit p-2  m-2 bg-primary text-white rounded-lg shadow-lg relative"
                    >
                      <button
                        className="absolute top-0 right-1 m-1 text-lg hover:text-gray-500 transition duration-300 ease-in-out"
                        onClick={() => handleDeleteOffer(offer.id)}
                      >
                        ×
                      </button>
                      <div className="offer-info">
                        <h3>${offer.unitPrice.toLocaleString("es-CL")}</h3>

                        <p className="text-sm">
                          {formatDateToChileanTime(
                            offer.startDate.toISOString()
                          )}{" "}
                          -{" "}
                          {formatDateToChileanTime(offer.endDate.toISOString())}
                        </p>
                        {/* mostrar más información de la oferta si es necesario */}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="offer-card">
                    <div className="offer-info">
                      <h3>No hay ofertas disponibles</h3>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Modal de confirmación */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">
              ¿Está seguro de eliminar la oferta?
            </h2>
            <p className="mb-4">
              Una vez eliminada, no podrá recuperar la oferta.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleModalConfirm}
              >
                Aceptar
              </button>
              <button
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleModalCancel}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default DetalleOferta;
