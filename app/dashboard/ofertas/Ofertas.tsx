/* eslint-disable @next/next/no-img-element */
import React, {
  useEffect,
  useState,
  ChangeEvent,
  useRef,
  useCallback,
  SetStateAction,
} from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { getCookie } from "cookies-next";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";
import { obtenerProductosBO } from "@/app/utils/obtenerProductosBO";

interface Product {
  id: number;
  name: string;
  previewImageUrl: string;
  productTypes: { id: number; name: string }[];
}

interface Sku {
  id: number;
  name: string;
}

interface Pagination {
  totalPages: number;
  pageSize: number;
}

interface ProductsResponse {
  products: Product[];
  pagination: Pagination;
}

function Ofertas() {
  const [productos, setProductos] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [skus, setSkus] = useState<Sku[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [productosConOFerta, setProductosConOFerta] = useState<Product[]>([]);
  const [filteredSkus, setFilteredSkus] = useState<Sku[]>([]);
  const [selectedSku, setSelectedSku] = useState<Sku | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [totalProducts, setTotalProducts] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    new Set()
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDropdownVisible, setFilterDropdownVisible] = useState(false);
  const [actionsDropdownVisible, setActionsDropdownVisible] = useState(false);
  const [productosConOfertaIds, setProductosConOfertaIds] = useState<number[]>(
    []
  );

  useEffect(() => {
    fetchProducts();
    fetchProductos();
    fetchSkus();
    fetchProductosEnOferta();
  }, []);

  useEffect(() => {
    const productosConOfertaIds = productosConOFerta.map(
      (product) => product.id
    );
    setProductosConOfertaIds(productosConOfertaIds);
  }, [productosConOFerta]);

  const filterDropdownRef = useRef(null);

  const fetchProducts = async () => {
    try {
      const token = getCookie("AdminTokenAuth");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/products?pageNumber=1&pageSize=50`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setProductos(response.data.products);
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductos = async (pageNumber = 1, pageSize = 6) => {
    try {
      const token = getCookie("AdminTokenAuth");
      const data = await obtenerProductosBO(pageNumber, pageSize, token);
      console.log("data:", data.products);
      setProducts(data.products);
      setTotalProducts(data.pagination.totalPages);
      setPageSize(data.pagination.pageSize);
      setCurrentPage(pageNumber);

      const uniqueCategories = new Set<string>();
      data.products.forEach((product: any) => {
        product.productTypes.forEach((type: any) => {
          uniqueCategories.add(type.name);
        });
      });
      setCategories(Array.from(uniqueCategories));
    } catch (error) {
      setError(error as Error);
    }
  };

  const fetchSkus = async () => {
    try {
      const token = getCookie("AdminTokenAuth");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/skus`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setSkus(response.data.skus);
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductosEnOferta = async (): Promise<boolean> => {
    try {
      const siteId = process.env.NEXT_PUBLIC_API_URL_SITEID || null;
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/products?siteId=${siteId}&pageNumber=1&pageSize=50&hasValidOffers=true`
      );
      const data = await response.json();
      setProductosConOFerta(data.products);
      return data.code === 0 && data.offer ? true : false;
    } catch (error) {
      console.error("Error al obtener el skuOffers de la variación:", error);
      return false;
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const toggleFilterDropdown = () => {
    setFilterDropdownVisible(!filterDropdownVisible);
  };

  const toggleActionsDropdown = () => {
    setActionsDropdownVisible(!actionsDropdownVisible);
  };

  const handleCategoryChange = (category: string) => {
    const newSelectedCategories = new Set(selectedCategories);
    if (newSelectedCategories.has(category)) {
      newSelectedCategories.delete(category);
    } else {
      newSelectedCategories.add(category);
    }
    setSelectedCategories(newSelectedCategories);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchProductos(page, pageSize);
  };

  const filteredProducts = products.filter(
    (product: any) =>
      !productosConOfertaIds.includes(product.id) &&
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategories.size === 0 ||
        Array.from(selectedCategories).every((category) =>
          product.productTypes.some((type: any) => type.name === category)
        ))
  );

  return (
    <section className=" mx-10 py-10">
      <Breadcrumb pageName="Ofertas" />

      <div className=" rounded-lg p-4 bg-white my-6 overflow-x-auto">
        <h2 className="text-center text-2xl font-bold mb-4 uppercase">
          Ofertas Creadas
        </h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Producto
              </th>

              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Categorías
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Editar
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {productosConOFerta.map((offerProduct: any) => (
              <tr key={offerProduct.id}>
                <td className="px-6 py-4 md:whitespace-nowrap hidden md:table-cell">
                  <div className="text-sm text-gray-900">
                    {offerProduct.name}
                  </div>
                </td>

                <td className="px-6 py-4 md:whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    <div className="flex justify-left flex-wrap gap-2 max-w-sm mx-auto text-sm">
                      {offerProduct.productTypes.map((category: any) => (
                        <button
                          key={category.id}
                          className="px-2 py-1 rounded bg-gray-200/50 text-gray-700 hover:bg-gray-300"
                        >
                          {category.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </td>
                <td className="py-4">
                  <Link href={`/dashboard/ofertas/${offerProduct.id}`}>
                    <div className="bg-primary hover:bg-secondary text-secondary text-center hover:text-primary py-2 px-4 rounded">
                      Editar Ofertas
                    </div>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <section className="border border-primary rounded-lg p-4 bg-white my-6 overflow-x-auto">
        <div className=" p-3 sm:p-5 relative">
          <h1 className="text-center text-2xl font-bold mb-4 uppercase">
            Todos los Productos
          </h1>{" "}
          <div className="mx-auto w-full px-2">
            <div className="">
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
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
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
                          d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
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
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
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
                        className="px-2 py-3 w-fit"
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
                        className="px-2 py-3 w-40"
                      >
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product: any, index: any) => (
                      <tr
                        key={index}
                        className="border-b dark:border-gray-700"
                      >
                        <td className="px-2 py-3 flex items-center justify-center align-middle w-fit ml-2">
                          <img
                            src={product.previewImageUrl}
                            alt="User"
                            className="rounded-full h-9 w-9 object-cover"
                          />
                        </td>
                        <td className="px-2 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          {product.name}
                        </td>
                        <td className="px-2 py-3">
                          <div className="flex justify-left flex-wrap gap-2 max-w-sm mx-auto text-sm">
                            {product.productTypes.map((category: any) => (
                              <button
                                key={category.id}
                                className="px-2 py-1 rounded bg-gray-200/50 text-gray-700 hover:bg-gray-300"
                              >
                                {category.name}
                              </button>
                            ))}
                          </div>
                        </td>

                        <td className="px-2 py-3 flex items-center justify-end space-x-2">
                          <Link href={`/dashboard/ofertas/${product.id}`}>
                            <div className="bg-primary hover:bg-secondary text-secondary text-center hover:text-primary py-2 px-4 rounded">
                              Crear Ofertas
                            </div>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div
                aria-label="Page navigation example"
                className="my-6 flex justify-center pt-8"
              >
                <ul className="flex items-center -space-x-px h-10 text-base">
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
                  {Array.from({ length: totalProducts }, (_, index) => (
                    <li key={index}>
                      <button
                        onClick={() => handlePageChange(index + 1)}
                        className={`flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 ${
                          currentPage === index + 1
                            ? "text-blue-600 border-blue-300 bg-blue-50"
                            : ""
                        }`}
                      >
                        {index + 1}
                      </button>
                    </li>
                  ))}
                  <li>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalProducts}
                      className={`flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 ${
                        currentPage === totalProducts
                          ? "cursor-not-allowed"
                          : ""
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
      </section>
    </section>
  );
}

export default Ofertas;
