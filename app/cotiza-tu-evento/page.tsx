/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  GoogleReCaptchaProvider,
  useGoogleReCaptcha,
} from "react-google-recaptcha-v3";
import toast from "react-hot-toast";

function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!executeRecaptcha) {
      console.error("Execute recaptcha not yet available");
      setLoading(false);
      return;
    }

    try {
      const recaptchaToken = await executeRecaptcha("contact_form");

      const data = {
        ...formData,
        recaptchaToken,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/contacts?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("Mensaje enviado exitosamente");
      } else {
        toast.error("Error al enviar el mensaje");
      }
    } catch (error) {
      console.error("Error al enviar el mensaje", error);
      setError("Error al enviar el mensaje");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      <div className="bg-white min-h-[475px] text-[#333] font-[sans-serif] ">
        <div className="grid md:grid-cols-2 justify-center items-center max-md:text-center gap-8">
          <div className="max-w-md mx-auto p-4 ">
            <h2 className="text-3xl md:text-4xl font-extrabold my-6 md:!leading-[55px] uppercase">
              Cotiza tu evento
            </h2>
            <p className="text-base">Hablemos!</p>
            <div className="my-8 space-y-6">
              {error && (
                <div
                  className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
                  role="alert"
                >
                  <strong className="font-bold">Error:</strong>
                  <span className="block sm:inline"> {error}</span>
                </div>
              )}
              <form
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <input
                  name="name"
                  type="text"
                  className="bg-gray-100 w-full text-sm px-4 py-3 outline-[#333]"
                  placeholder="Nombre"
                  value={formData.name}
                  onChange={handleChange}
                />
                <input
                  name="email"
                  type="email"
                  className="bg-gray-100 w-full text-sm px-4 py-3 outline-[#333]"
                  placeholder="Correo Electrónico"
                  value={formData.email}
                  onChange={handleChange}
                />
                <input
                  name="phoneNumber"
                  type="text"
                  className="bg-gray-100 w-full text-sm px-4 py-3 outline-[#333]"
                  placeholder="Teléfono"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
                <input
                  name="subject"
                  type="text"
                  className="bg-gray-100 w-full text-sm px-4 py-3 outline-[#333]"
                  placeholder="Asunto"
                  value={formData.subject}
                  onChange={handleChange}
                />
                <textarea
                  name="message"
                  className="bg-gray-100 w-full text-sm px-4 py-3 outline-[#333] h-32"
                  placeholder="Mensaje"
                  value={formData.message}
                  onChange={handleChange}
                ></textarea>
                <button
                  type="submit"
                  className="w-full px-4 py-2 text-base tracking-wider font-semibold outline-none border border-[#333] bg-[#222] text-white hover:bg-transparent hover:text-[#333] transition-all duration-300"
                  disabled={loading}
                >
                  {loading ? "Cargando..." : "Enviar"}
                </button>
              </form>
            </div>
          </div>
          <div className="md:text-right max-md:mt-12 h-full ">
            <img
              src="/img/tavola.jfif"
              alt="Premium Benefits"
              className="w-full h-[800px] object-cover "
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const siteKey = process.env.RECAPTCHA_PUBLIC_SITE_KEY || "";

  return (
    <GoogleReCaptchaProvider reCaptchaKey={siteKey}>
      <ContactForm />
    </GoogleReCaptchaProvider>
  );
}
