/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useAPI } from "@/app/Context/ProductTypeContext";
import { getCookie } from "cookies-next";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "@/components/common/Loader-t";

// Interfaces para Tipos de Producto y Respuesta de la API
interface Product {
  id: string;
  skuId: string;
  name: string;
  previewImageUrl: string;
  mainImageUrl: string;
  productTypes: { id: string; name: string }[];
  price: string;
  statusCode: string;
  hasVariations: boolean;
  enabledForDelivery: boolean;
  enabledForWithdrawal: boolean;
  description: string;
  isFeatured: boolean;
  hasFeaturedBaseSku: boolean;
}

import { useRevalidation } from "@/app/Context/RevalidationContext";

export default function ProductPageBO() {
  // Estados
  const [loading, setLoading] = useState(false);
  const [filterDropdownVisible, setFilterDropdownVisible] = useState(false);
  const [actionsDropdownVisible, setActionsDropdownVisible] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(0);

  const [paginatedProducts, setPaginatedProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    new Set()
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const { triggerRevalidation } = useRevalidation();

  // Efecto para cargar los productos iniciales
  useEffect(() => {
    fetchProductos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Efecto para filtrar productos según la búsqueda y las categorías seleccionadas
  useEffect(() => {
    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedCategories.size === 0 ||
          Array.from(selectedCategories).every((category) =>
            product.productTypes.some((type) => type.name === category)
          ))
    );

    setFilteredProducts(filtered); // Actualiza los productos filtrados
    setTotalPages(Math.ceil(filtered.length / pageSize)); // Actualiza el total de páginas
    setCurrentPage(1); // Reinicia la paginación a la primera página al cambiar búsqueda o categorías
  }, [products, searchTerm, selectedCategories, pageSize]);

  // Efecto para manejar la paginación de los productos filtrados
  useEffect(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    setPaginatedProducts(filteredProducts.slice(startIndex, endIndex)); // Actualiza los productos paginados
  }, [filteredProducts, currentPage, pageSize]);

  // Manejo de Cambio de Página
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Mostrar y Ocultar Modales
  const showDeleteModal = (product: Product) => {
    setProductToDelete(product);
    setIsModalVisible(true);
  };

  const hideDeleteModal = () => {
    setIsModalVisible(false);
    setProductToDelete(null);
  };

  const confirmDeleteProduct = async () => {
    if (productToDelete) {
      await deleteProduct(productToDelete.id);
      hideDeleteModal();
    }
  };

  // Manejo de Categorías
  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) => {
      const newSelected = new Set(prev);
      if (newSelected.has(category)) {
        newSelected.delete(category);
      } else {
        newSelected.add(category);
      }
      return newSelected;
    });
  };

  // Manejo de Eventos de Clic Fuera de los Dropdowns
  const filterDropdownRef = useRef<HTMLDivElement>(null);
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      filterDropdownRef.current &&
      !filterDropdownRef.current.contains(event.target as Node)
    ) {
      setFilterDropdownVisible(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  const toggleFilterDropdown = () => {
    setFilterDropdownVisible(!filterDropdownVisible);
  };

  const toggleActionsDropdown = () => {
    setActionsDropdownVisible(!actionsDropdownVisible);
  };

  const fetchProductos = async () => {
    try {
      setLoading(true); // Inicia el loading
      const token = getCookie("AdminTokenAuth");
      const allData: Product[] = [];
      let pageNumber = 1;
      let data;

      do {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/products?pageNumber=${pageNumber}&pageSize=50&siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        data = response.data;
        allData.push(...data.products);
        pageNumber += 1;
      } while (data.products.length > 0);

      setProducts(allData);
      setFilteredProducts(allData);
      initializeCategories(allData);
    } catch (error) {
      console.error("Ocurrió un error:", error);
      toast.error("Error al cargar los productos");
    } finally {
      setLoading(false); // Termina el loading
    }
  };

  const initializeCategories = (products: Product[]) => {
    const uniqueCategories = new Set<string>();
    products.forEach((product) => {
      product.productTypes.forEach((type) => {
        uniqueCategories.add(type.name);
      });
    });
    setCategories(Array.from(uniqueCategories));
  };

  const filterProducts = () => {
    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedCategories.size === 0 ||
          Array.from(selectedCategories).every((category) =>
            product.productTypes.some((type) => type.name === category)
          ))
    );
    setFilteredProducts(filtered);
  };

  const paginateProducts = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    setPaginatedProducts(filteredProducts.slice(startIndex, endIndex));
  };

  const updateProduct = async (product: Product, updates: Partial<Product>) => {
    try {
      const token = getCookie("AdminTokenAuth");

      // Primero actualizamos el producto
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/products/${product.id}?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
        {
          ...product,
          ...updates,
          hasFeaturedBaseSku: updates.isFeatured ?? product.isFeatured,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Luego revalidamos usando fetch con el tag
      await fetch("/api/revalidate?tag=products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // También usamos el contexto de revalidación
      await triggerRevalidation();

      toast.success("Producto actualizado");
      fetchProductos();
    } catch (error) {
      console.error(
        "Error updating product:",
        error instanceof Error ? error.message : error
      );
      toast.error("Error al actualizar el producto");
    }
  };

  const toggleFeatured = (product: Product) => {
    updateProduct(product, { isFeatured: !product.isFeatured });
  };

  const toggleStatus = (product: Product) => {
    const newStatus = product.statusCode === "ACTIVE" ? "DRAFT" : "ACTIVE";
    updateProduct(product, { statusCode: newStatus });
  };

  const deleteProduct = async (id: string) => {
    try {
      const token = getCookie("AdminTokenAuth");

      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/products/${id}?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Revalidamos usando fetch con el tag
      await fetch("/api/revalidate?tag=products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // También usamos el contexto de revalidación
      await triggerRevalidation();

      toast.success("Producto eliminado");
      fetchProductos();
    } catch (error) {
      console.error(
        "Error deleting product:",
        error instanceof Error ? error.message : error
      );
      toast.error("Error al eliminar el producto");
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <section className="w-full py-10 mx-auto h-[85vh]">
      <title>Lista de Productos</title>
      <div className="dark:bg-gray-900 p-3 sm:p-5 relative">
        <div className="mx-auto w-full px-2">
          <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
              <div className="w-full md:w-1/2">
                <form className="flex items-center">
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
                      value={searchTerm}
                      onChange={handleSearch}
                    />
                  </div>
                </form>
              </div>
              <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                <div className="flex items-center space-x-3 w-full md:w-auto">
                  <button
                    id="actionsDropdownButton"
                    onClick={toggleActionsDropdown}
                    className="w-full hidden md:w-auto items-center justify-center py-2 px-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                    type="button"
                  >
                    <svg
                      className="-ml-1 mr-1.5 w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        clipRule="evenodd"
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 111.414 1.414l-4 4a1 1 01-1.414 0l-4-4a1 1 010-1.414z"
                      />
                    </svg>
                    Actions
                  </button>
                  <div
                    id="actionsDropdown"
                    className={`z-10 ${
                      actionsDropdownVisible ? "block" : "hidden"
                    } w-44 bg-white rounded absolute top-16 right-20 divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600`}
                  >
                    <ul
                      className="py-1 text-sm text-gray-700 dark:text-gray-200"
                      aria-labelledby="actionsDropdownButton"
                    >
                      <li>
                        <a
                          href="#"
                          className="block py-2 px-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                        >
                          Mass Edit
                        </a>
                      </li>
                    </ul>
                    <div className="py-1">
                      <a
                        href="#"
                        className="block py-2 px-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                      >
                        Delete all
                      </a>
                    </div>
                  </div>
                  <button
                    id="filterDropdownButton"
                    onClick={toggleFilterDropdown}
                    className="w-full md:w-auto flex items-center justify-center py-2 px-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                    type="button"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      className="h-4 w-4 mr-2 text-gray-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Filter
                    <svg
                      className="-mr-1 ml-1.5 w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        clipRule="evenodd"
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 111.414 1.414l-4 4a1 1 01-1.414 0l-4-4a1 1 010-1.414z"
                      />
                    </svg>
                  </button>
                  <div
                    id="filterDropdown"
                    ref={filterDropdownRef}
                    className={`z-10 ${
                      filterDropdownVisible ? "block" : "hidden"
                    } w-48 p-3 absolute top-16 right-0 bg-white rounded-lg shadow dark:bg-gray-700`}
                  >
                    <h6 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">
                      Choose category
                    </h6>
                    <ul
                      className="space-y-2 text-sm"
                      aria-labelledby="filterDropdownButton"
                    >
                      {categories.map((category, index) => (
                        <li
                          key={index}
                          className="flex items-center"
                        >
                          <input
                            id={category}
                            type="checkbox"
                            checked={selectedCategories.has(category)}
                            onChange={() => handleCategoryChange(category)}
                            className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                          />
                          <label
                            htmlFor={category}
                            className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                          >
                            {category}
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th
                      scope="col"
                      className="px-2 py-3 min-w-20"
                    ></th>
                    <th
                      scope="col"
                      className="px-2 py-3"
                    >
                      Nombre
                    </th>
                    <th
                      scope="col"
                      className="px-2 py-3"
                    >
                      Categorías
                    </th>
                    <th
                      scope="col"
                      className="px-2 py-3"
                    >
                      Tipo
                    </th>
                    <th
                      scope="col"
                      className="px-2 py-3"
                    >
                      Publicado
                    </th>
                    <th
                      scope="col"
                      className="px-2 py-3"
                    >
                      Destacado
                    </th>
                    <th
                      scope="col"
                      className="px-2 py-3"
                    >
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="w-full h-32"
                      >
                        <div className="flex items-center justify-center h-full mt-20 py-20">
                          <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedProducts.map((product) => (
                      <tr
                        key={product.id}
                        className="border-b dark:border-gray-700"
                      >
                        <td className="px-2 py-3 flex items-center justify-center align-middle">
                          <img
                            src={product.mainImageUrl}
                            alt="Product"
                            className="rounded-full h-9 w-9 object-cover"
                          />
                        </td>
                        <td className="px-2 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          {product.name}
                        </td>
                        <td className="px-2 py-3 w-[200px]">
                          <div className="flex justify-left flex-wrap gap-2 max-w-sm w-fit text-sm">
                            {product.productTypes.map((category) => (
                              <button
                                key={category.id}
                                className="px-2 py-1 rounded bg-gray-200/50 text-gray-700 hover:bg-gray-300"
                              >
                                {category.name}
                              </button>
                            ))}
                          </div>
                        </td>
                        <td className="px-2 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          {product.hasVariations ? (
                            <span>V</span>
                          ) : (
                            <span className="">S</span>
                          )}
                        </td>
                        <td className="px-2 py-3">
                          <label className="inline-flex relative items-center mr-5 cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={product.statusCode === "ACTIVE"}
                              onChange={() => toggleStatus(product)}
                            />
                            <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                          </label>
                        </td>
                        <td className="px-2 py-3">
                          <button
                            onClick={() => toggleFeatured(product)}
                            className="focus:outline-none"
                          >
                            {product.isFeatured ? (
                              <svg
                                className="w-6 h-6 text-yellow-400"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M9.049 2.927C9.403 2.061 10.597 2.061 10.951 2.927L12.263 6.182L15.905 6.682C16.838 6.822 17.175 7.981 16.461 8.541L13.732 10.579L14.474 14.131C14.658 15.047 13.692 15.725 12.917 15.29L10 13.528L7.083 15.29C6.308 15.725 5.342 15.047 5.526 14.131L6.268 10.579L3.539 8.541C2.825 7.981 3.162 6.822 4.095 6.682L7.737 6.182L9.049 2.927Z" />
                              </svg>
                            ) : (
                              <svg
                                className="w-6 h-6 text-gray-400"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M9.049 2.927C9.403 2.061 10.597 2.061 10.951 2.927L12.263 6.182L15.905 6.682C16.838 6.822 17.175 7.981 16.461 8.541L13.732 10.579L14.474 14.131C14.658 15.047 13.692 15.725 12.917 15.29L10 13.528L7.083 15.29C6.308 15.725 5.342 15.047 5.526 14.131L6.268 10.579L3.539 8.541C2.825 7.981 3.162 6.822 4.095 6.682L7.737 6.182L9.049 2.927Z" />
                              </svg>
                            )}
                          </button>
                        </td>
                        <td className="px-2 py-3 flex items-center space-x-2">
                          <Link
                            href={
                              product.hasVariations
                                ? `/dashboard/productos/crear/producto-variable?productVariableId=${product.id}`
                                : `/dashboard/productos/crear/producto-simple?productId=${product.id}`
                            }
                            className="px-2 py-1 rounded bg-primary text-secondary hover:bg-secondary hover:text-primary"
                          >
                            Editar
                          </Link>
                          <button
                            onClick={() => showDeleteModal(product)}
                            className="px-2 py-1 rounded bg-red-600 text-white hover:bg-red-800"
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div
              aria-label="Page navigation example"
              className="my-6 flex justify-center pt-8"
            >
              <ul className="flex items-center -space-x-px h-10 text-base">
                {/* Botón de página anterior */}
                <li>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 ${
                      currentPage === 1 ? "cursor-not-allowed" : ""
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <svg
                      className="w-3 h-3 rtl:rotate-180"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 6 10"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 1 1 5l4 4"
                      />
                    </svg>
                  </button>
                </li>

                {/* Botones de número de página */}
                {Array.from({ length: totalPages }, (_, index) => (
                  <li key={index}>
                    <button
                      onClick={() => handlePageChange(index + 1)}
                      className={`flex items-center justify-center px-4 h-10 leading-tight text-gray-500 border border-gray-300 hover:bg-gray-100 hover:text-gray-700 ${
                        currentPage === index + 1
                          ? "text-primary bg-gray-200"
                          : "text-gray-300 bg-white"
                      }`}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}

                {/* Botón de página siguiente */}
                <li>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 ${
                      currentPage === totalPages ? "cursor-not-allowed" : ""
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    <svg
                      className="w-3 h-3 rtl:rotate-180"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 6 10"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 9 4-4-4-4"
                      />
                    </svg>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* MODAL */}
      {isModalVisible && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white  rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <svg
                    className="h-6 w-6 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Eliminar producto
                  </h3>
                  <div className="mt-2">
                    <p>¿Estás seguro de que deseas eliminar este producto?</p>
                    <p className="text-sm text-red-500 uppercase mt-2">
                      Esta acción no se puede deshacer.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse justify-between">
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={hideDeleteModal}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={confirmDeleteProduct}
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
