/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useEffect } from "react";
import { getCookie } from "cookies-next";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  GoogleReCaptchaProvider,
  useGoogleReCaptcha,
} from "react-google-recaptcha-v3";

function RegisterForm() {
  const router = useRouter();
  const [regions, setRegions] = useState([]);
  const [communes, setCommunes] = useState<{ id: any }[]>([]);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedCommune, setSelectedCommune] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [emailExists, setEmailExists] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleRepeatPasswordVisibility = () => {
    setShowRepeatPassword(!showRepeatPassword);
  };

  const fetchRegions = async () => {
    try {
      const Pais = "CL";
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/countries/${Pais}/regions`
      );
      setRegions(response.data.regions);
    } catch (error) {
      console.error("Error fetching regions:", error);
    }
  };

  const fetchCommunes = async (regionId: any) => {
    try {
      const token = getCookie("AdminTokenAuth");
      const Pais = "CL";
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/countries/${Pais}/regions/${regionId}/communes`
      );
      setCommunes(response.data.communes);
    } catch (error) {
      console.error("Error fetching communes:", error);
    }
  };

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const regionId = e.target.value;
    setSelectedRegion(regionId);
    setSelectedCommune("");
    if (regionId) {
      fetchCommunes(regionId);
    } else {
      setCommunes([]);
    }
  };

  const handleCommuneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const communeId = e.target.value;
    setSelectedCommune(communeId);
  };

  useEffect(() => {
    fetchRegions();
  }, []);

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePhone = (phone: string) => {
    const regex = /^[0-9]{9}$/;
    return regex.test(phone);
  };

  const validateForm = () => {
    const validationErrors = [];
    if (password.length < 8) {
      validationErrors.push("La contraseña debe tener al menos 8 caracteres.");
    }
    if (password !== repeatPassword) {
      validationErrors.push("Las contraseñas no coinciden.");
    }
    if (!validateEmail(email)) {
      validationErrors.push("El correo no es válido.");
    }
    if (!validatePhone(phone)) {
      validationErrors.push("El número de celular no es válido.");
    }
    setErrors(validationErrors);
    return validationErrors.length === 0;
  };

  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!executeRecaptcha) {
      console.error("Execute recaptcha not yet available");
      return;
    }

    const recaptchaToken = await executeRecaptcha("register");

    const formData = {
      firstname: firstname,
      lastname: lastname,
      email: email,
      password: password,
      confirmPassword: repeatPassword,
      phoneNumber: phone,
      communeId: selectedCommune,
      addressLine1: address,
      recaptchaToken: recaptchaToken,
    };

    const SiteId = process.env.NEXT_PUBLIC_API_URL_SITEID || "";
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/customers?siteId=${SiteId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.code === 3) {
          setEmailExists(true);
        } else {
          setPassword("");
          setRepeatPassword("");
          setEmail("");
          setAddress("");
          setFirstname("");
          setLastname("");
          setPhone("");
          router.push("/tienda");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-gradient-to-r from-primary/90 from-10% via-primary/60 via-30% to-primary/90 to-90%">
      <div className="relative z-10 mx-auto min-w-[400px] w-[90%] max-w-[800px] px-6 lg:px-8 py-20">
        <div
          className="bg-white shadow-xl"
          style={{ borderRadius: "var(--radius)" }}
        >
          <form
            onSubmit={handleSubmit}
            className="lg:p-11 p-7 mx-auto"
          >
            <div className="mb-11">
              <h1 className="text-gray-900 text-center font-manrope text-3xl font-bold leading-10 mb-2">
                Crear cuenta
              </h1>
              <p className="text-gray-500 text-center text-base font-medium leading-6">
                Let’s get started with your 30 days free trial
              </p>
            </div>
            <div className="flex space-x-4 mb-6">
              <div className="w-1/2">
                <label className="block text-gray-700">Nombre*</label>
                <input
                  type="text"
                  id="firstname"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  className="shadow w-full h-12 text-gray-900 placeholder:text-gray-400 text-lg font-normal leading-7 border-gray-300 border focus:outline-none px-4"
                  placeholder="Nombre"
                  style={{ borderRadius: "var(--radius)" }}
                />
              </div>
              <div className="w-1/2">
                <label className="block text-gray-700">Apellido*</label>
                <input
                  type="text"
                  id="lastname"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  className="shadow w-full h-12 text-gray-900 placeholder:text-gray-400 text-lg font-normal leading-7 border-gray-300 border focus:outline-none px-4"
                  placeholder="Apellido"
                  style={{ borderRadius: "var(--radius)" }}
                />
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-gray-700">Contraseña*</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="shadow w-full h-12 text-gray-900 placeholder:text-gray-400 text-lg font-normal leading-7 border-gray-300 border focus:outline-none px-4 pr-10"
                  placeholder="Contraseña"
                  style={{ borderRadius: "var(--radius)" }}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-600"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.315c1.429-5.386 7.433-8.779 12.82-7.35m3.316 3.316c2.343 2.343 2.343 6.14 0 8.485-2.344 2.344-6.141 2.344-8.485 0-2.344-2.344-2.344-6.141 0-8.485m-3.315 3.316c2.344-2.343 6.141-2.343 8.485 0"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.182 11.818l-8.485 8.485m3.316-3.316c-1.42 1.429-3.717 1.427-5.146-.001-1.429-1.428-1.429-3.725-.001-5.146l8.485-8.485m3.316-3.316c5.386 1.429 8.779 7.433 7.35 12.82m-7.35-12.82c-5.386 1.429-8.779 7.433-7.35 12.82"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-gray-700">Repetir contraseña*</label>
              <div className="relative">
                <input
                  type={showRepeatPassword ? "text" : "password"}
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                  className="shadow w-full h-12 text-gray-900 placeholder:text-gray-400 text-lg font-normal leading-7 border-gray-300 border focus:outline-none px-4 pr-10"
                  placeholder="Repetir contraseña"
                  style={{ borderRadius: "var(--radius)" }}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-600"
                  onClick={toggleRepeatPasswordVisibility}
                >
                  {showRepeatPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.315c1.429-5.386 7.433-8.779 12.82-7.35m3.316 3.316c2.343 2.343 2.343 6.14 0 8.485-2.344 2.344-6.141 2.344-8.485 0-2.344-2.344-2.344-6.141 0-8.485m-3.315 3.316c2.344-2.343 6.141-2.343 8.485 0"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.182 11.818l-8.485 8.485m3.316-3.316c-1.42 1.429-3.717 1.427-5.146-.001-1.429-1.428-1.429-3.725-.001-5.146l8.485-8.485m3.316-3.316c5.386 1.429 8.779 7.433 7.35 12.82m-7.35-12.82c-5.386 1.429-8.779 7.433-7.35 12.82"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-gray-700">Correo*</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="shadow w-full h-12 text-gray-900 placeholder:text-gray-400 text-lg font-normal leading-7 border-gray-300 border focus:outline-none px-4"
                placeholder="Correo"
                style={{ borderRadius: "var(--radius)" }}
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700">Teléfono*</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="shadow w-full h-12 text-gray-900 placeholder:text-gray-400 text-lg font-normal leading-7 border-gray-300 border focus:outline-none px-4"
                placeholder="Teléfono"
                style={{ borderRadius: "var(--radius)" }}
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700">Dirección*</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="shadow w-full h-12 text-gray-900 placeholder:text-gray-400 text-lg font-normal leading-7 border-gray-300 border focus:outline-none px-4"
                placeholder="Dirección"
                style={{ borderRadius: "var(--radius)" }}
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700">Región*</label>
              <select
                value={selectedRegion}
                onChange={handleRegionChange}
                className="shadow w-full h-12 text-gray-900 placeholder:text-gray-400 text-lg font-normal leading-7 border-gray-300 border focus:outline-none px-4"
                style={{ borderRadius: "var(--radius)" }}
              >
                <option value="">Selecciona una región</option>
                {regions.map((region: any) => (
                  <option
                    key={region.id}
                    value={region.id}
                  >
                    {region.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-6">
              <label className="block text-gray-700">Comuna*</label>
              <select
                value={selectedCommune}
                onChange={handleCommuneChange}
                className="shadow w-full h-12 text-gray-900 placeholder:text-gray-400 text-lg font-normal leading-7 border-gray-300 border focus:outline-none px-4"
                style={{ borderRadius: "var(--radius)" }}
              >
                <option value="">Selecciona una comuna</option>
                {communes.map((commune: any) => (
                  <option
                    key={commune.id}
                    value={commune.id}
                  >
                    {commune.name}
                  </option>
                ))}
              </select>
            </div>
            {errors.length > 0 && (
              <div className="mb-6">
                <ul className="text-red-500 list-disc list-inside">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
            <button
              type="submit"
              className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded"
            >
              Crear cuenta
            </button>
          </form>
        </div>
      </div>
      {emailExists && (
        <div className="fixed inset-0 flex items-center justify-center z-20 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Correo ya existe</h2>
            <p className="mb-4">
              El correo que has ingresado ya está registrado. Por favor, intenta
              con otro correo.
            </p>
            <button
              onClick={() => setEmailExists(false)}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";
  return (
    <GoogleReCaptchaProvider reCaptchaKey={siteKey}>
      <RegisterForm />
    </GoogleReCaptchaProvider>
  );
}
